import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { TopBar } from '../../components/TopBar';
import { Wiki } from '../../components/Wiki';
import { FishLogs } from '../../components/FishLogs';
import {
  PageContainer,
  TitleContainer,
  TouchableTitle,
  TitleText,
  TitleHighlight,
  InstructionButton,
  InstructionButtonIcon,
  TitleButtonsContainer,
} from './styles';
import { useAuth } from '../../contexts/authContext';
import { InstructionModal } from '../../components/InstructionsModal';
import {UsersManager} from "../../components/UsersManager";


export const WikiFishlogs = ({ navigation, route }: any) => {

  const [token, setToken] = useState('');
  const [wiki, setWiki] = useState(true);
  const [fishlogTab, setFishLogTab] = useState<boolean>(false);
  const [isLogged, setIsLogged] = useState<boolean>();
  const [isAdmin, setIsAdmin] = useState<boolean>();
  const [showModal, setShowModal] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState<boolean>();
  const { signOut } = useAuth();

  const getData = async () => {
    const userAdmin = await AsyncStorage.getItem("@eupescador/userAdmin");
    const userSuperAdmin = await AsyncStorage.getItem('@eupescador/userSuperAdmin');
    const token = await AsyncStorage.getItem('@eupescador/token');
    if (token) {
      setToken(token);
      setIsLogged(true);
    } else {
      setIsLogged(false);
    }
    if (userAdmin === "true")
      setIsAdmin(true);
    else
      setIsAdmin(false);
    if (userSuperAdmin === "true")
      setIsSuperAdmin(true);
    else
      setIsSuperAdmin(false);

  };

  const handleSignOut = () => {
    Alert.alert('Sair da conta', 'Tem certeza que deseja sair da conta?', [
      {
        text: 'Não',
        onPress: () => { },
        style: 'cancel',
      },
      {
        text: 'Sim',
        onPress: () => {
          signOut();
          const resetAction = CommonActions.reset({
            index: 0,
            routes: [{ name: 'Home' }],
          });
          navigation.dispatch(resetAction);
        },
      },
    ]);
  };

  const getFirstAcess = async () => {
    const hasAcessTheApp = await AsyncStorage.getItem('hasAcessTheApp');
    if (hasAcessTheApp === 'false') {
      setShowModal(true);
      await AsyncStorage.setItem('hasAcessTheApp', 'true');
    }
  }

  useEffect(() => {
    getData();
    getFirstAcess();
  }, []);

  return (
    <>
      <InstructionModal
        modalVisible={showModal}
        dismissModal={() => setShowModal(false)}
      />
      <PageContainer>
        <TopBar
          title={wiki ? 'Biblioteca' : fishlogTab ? 'Registros' : 'Usuários'}
          icon={isLogged ? 'logout' : 'login'}
          iconText={isLogged ? 'Sair' : 'Entrar'}
          buttonFunction={
            isLogged
              ? () => {
                handleSignOut();
              }
              : () => navigation.navigate('Login')
          }
        />
        {isLogged ? (
          <TitleContainer>
            <TitleButtonsContainer>
              <TouchableTitle
                onPress={() => {
                  setWiki(true);
                  setFishLogTab(false);
                }}
              >
                <TitleText wiki={wiki} fishLogTab={!fishlogTab}>Biblioteca de Peixes</TitleText>
                {wiki && !fishlogTab  ? <TitleHighlight /> : null}
              </TouchableTitle>
              <TouchableTitle
                onPress={() => {
                  setWiki(false);
                  setFishLogTab(true);
                }}
              >
                <TitleText wiki={!wiki} fishLogTab={fishlogTab}>Registros</TitleText>
                {(!wiki && fishlogTab)  ? <TitleHighlight /> : null}
              </TouchableTitle>
              {isSuperAdmin ? (
              <TouchableTitle
                onPress={() => {
                  setWiki(false);
                  setFishLogTab(false);
                }}
              >
                <TitleText wiki={!wiki} fishLogTab={!fishlogTab}>Usuários</TitleText>
                {(!wiki && !fishlogTab)  ? <TitleHighlight /> : null}
              </TouchableTitle>) : null}
            </TitleButtonsContainer>
            <InstructionButton onPress={() => { setShowModal(true) }}>
              <InstructionButtonIcon name="info" />
            </InstructionButton>
          </TitleContainer>
        ) : null}
        {wiki ?
          (<Wiki
            navigation={navigation}
            filterQuery={(route.params && route.params.wikiFilterQuery) ? route.params.wikiFilterQuery : null}
          />) : fishlogTab ? 
          (<FishLogs token={token} 
            navigation={navigation}
            isAdmin={isAdmin ? isAdmin : false}
            filterQuery={(route.params && route.params.logFilterQuery) ? route.params.logFilterQuery : null}
          />)  : (<UsersManager></UsersManager>) 
        }
      </PageContainer>
    </>
  );
};
