import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userService } from '../services/userServices/userService';
import { UserLogin } from '../services/userServices/login';
import { UserEmail } from '../services/userServices/userEmail';
import { createFishLog } from '../services/fishLogService/createFishLog';
import NetInfo from '@react-native-community/netinfo';
import { storage } from '../../App';

interface IAuthProvider {
  children: React.ReactNode;
}

interface IAuthContext {
  userId: string;
  authenticated: boolean | undefined;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<IAuthContext>({} as IAuthContext);

export const AuthProvider: React.FC<IAuthProvider> = ({ children }) => {
  const [authenticated, setAuthenticated] = useState<boolean | undefined>();
  const [userId, setUserId] = useState('');

  const con = NetInfo.useNetInfo();

  async function getValues() {
    const token = await storage.getString('@eupescador/token');
    const _userId = await storage.getString('@eupescador/userId');
    const userAdmin = await storage.getString('@eupescador/userAdmin');
    const userSuperAdmin = await storage.getString('@eupescador/userSuperAdmin');

    return { token, _userId, userAdmin, userSuperAdmin };
  }
  const handleAutenticate = async () => {
    const values = await getValues();
    if (values.token && values._userId) {
      userService.defaults.headers.authorization = `Bearer ${values.token}`;
      setAuthenticated(true);
      setUserId(values._userId);
    } else {
      setAuthenticated(false);
    }
  };
  useEffect(() => {
    handleAutenticate();
  }, []);

  async function signIn(email: string, password: string) {
    try {
      const result = await UserLogin(email, password);
      await storage.set('@eupescador/token', result.data.token);
      await storage.set('@eupescador/userId', JSON.stringify(result.data.id));
      await storage.set(
        '@eupescador/userAdmin',
        JSON.stringify(result.data.admin),
      );
      await storage.set(
        '@eupescador/userSuperAdmin',
        JSON.stringify(result.data.superAdmin),
      );
      const hasAcessTheApp = await storage.getString('hasAcessTheApp');
      if (!!hasAcessTheApp == false) {
        await storage.set('hasAcessTheApp', 'false');
      }
      userService.defaults.headers.Authorization = `Bearer ${result.data.token}`;
      setAuthenticated(true);
      setUserId(result.data.id);
      return result;
    } catch (error) {
      console.log(error)
      return error;
    }
  }

  async function signOut() {
    setAuthenticated(false);
    setUserId('');
    await storage.delete('@eupescador/token');
    await storage.delete('@eupescador/userId');
    await storage.delete('@eupescador/userAdmin');
    await storage.delete('@eupescador/userSuperAdmin');
    await storage.delete('drafts');
    userService.defaults.headers.Authorization = undefined;
  }

  useEffect(() => {
    async function getFishCache() {
      let conection = await NetInfo.fetch();
      const response = await storage.getString('@eupescador/newfish');
      if (response) {
        let fish = [];
        fish = JSON.parse(response);
        if (conection.isConnected) {

          for (let i = 0; i < fish.length; i++) {
            await createFishLog(
              fish[i].fishPhoto,
              fish[i].name,
              fish[i].largeGroup,
              fish[i].group,
              fish[i].species,
              fish[i].weight,
              fish[i].length,
              fish[i].coordenates.latitude,
              fish[i].coordenates.longitude,
              fish[i].visible
            );
          }
          await storage.delete('@eupescador/newfish');
        };
      }
    };

    getFishCache();

  },[con.isConnected]);

  return (
    <AuthContext.Provider
      value={{
        userId,
        signIn,
        signOut,
        authenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
