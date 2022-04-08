import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { TopBar } from '../../components/TopBar';
import { Wiki } from '../../components/Wiki';
import { FishLogs } from '../../components/FishLogs';
import * as Location from 'expo-location';
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
import { LogsMap } from '../LogsMap';

export const WikiFishlogs = ({ navigation, route }: any) => {

  const [token, setToken] = useState('');
  const [wiki, setWiki] = useState(true);
  const [register, setRegister] = useState(false);
  const [isLogged, setIsLogged] = useState<boolean>();
  const [isAdmin, setIsAdmin] = useState<boolean>();
  const [showModal, setShowModal] = useState(false);
  const [origin, setOrigin] = useState<any>('');
  
  const { signOut } = useAuth();

  const getData = async () => {
    const userAdmin = await AsyncStorage.getItem("@eupescador/userAdmin");
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

  const getPosition = async ()=>{
    let loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
    setOrigin({
      latitude: loc.coords.latitude,
      longitude:loc.coords.longitude,
      latitudeDelta:0.0922,
      longitudeDelta:0.0922,
    });
 
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
          title={
         
            wiki ? 'Biblioteca' 
            :(register ? 'Registros' : 'Mapa') 
          
          }
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
                  setRegister(false);
                }}
              >
                <TitleText wiki={wiki} register={!register}>Biblioteca de Peixes</TitleText>
                {wiki ? <TitleHighlight /> : null}
              </TouchableTitle>

              <TouchableTitle
                onPress={() => {
                  setWiki(false);
                  setRegister(true);
                }}
              >
                <TitleText wiki={!wiki} register={register} >Registros</TitleText>
                {wiki ? null : (register ?<TitleHighlight /> : null )}
              </TouchableTitle>

              <TouchableTitle
                onPress={() => {
                  setWiki(false);
                  setRegister(false);
                  getPosition();
                }}
              >
                <TitleText wiki={!wiki} register={!register}>Mapa</TitleText>
                {wiki ? null : (!register ? <TitleHighlight/> : null )}
              
              </TouchableTitle>


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
          />) :
          (register ?
            (<FishLogs 
              token={token} 
              navigation={navigation}
              isAdmin={isAdmin ? isAdmin : false}
              filterQuery={(route.params && route.params.logFilterQuery) ? route.params.logFilterQuery : null}
            />):
            
            <LogsMap
              latitude = {origin.latitude}
              longitude = {origin.longitude}
              latitudeDelta = {origin.latitudeDelta}
              longitudeDelta= {origin.longitudeDelta}
              token={token} 
              navigation={navigation}
              isAdmin={isAdmin ? isAdmin : false}
              filterQuery={(route.params && route.params.logFilterQuery) ? route.params.logFilterQuery : null}
            />
            )
          
        }
      </PageContainer>
    </>
  );
};
