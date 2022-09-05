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
import {UsersManager} from "../../components/UsersManager";

import { LogsMap } from '../LogsMap';

export const WikiFishlogs = ({ navigation, route }: any) => {

  const [token, setToken] = useState('');
  const [wiki, setWiki] = useState(true);
  const [fishlogTab, setFishLogTab] = useState<boolean>(false);
  const [mapTab, setMapTab] = useState<boolean>(false);
  const [isLogged, setIsLogged] = useState<boolean>();
  const [isAdmin, setIsAdmin] = useState<boolean>();
  const [showModal, setShowModal] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState<boolean>();
  const [origin, setOrigin] = useState<any>('');
  
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
          //Adicionar parada do mapa
          title={wiki ? 'Biblioteca' : fishlogTab ? 'Registros' : mapTab ? 'Mapa' : ''}
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
                  setMapTab(false);
                }}
              >
                <TitleText wiki={wiki} fishLogTab={!fishlogTab} mapTab={!mapTab}>Biblioteca de Peixes</TitleText>
                {wiki && !fishlogTab  && !mapTab ? <TitleHighlight /> : null}
              </TouchableTitle>

              <TouchableTitle
                onPress={() => {
                  setWiki(false);
                  setFishLogTab(true);
                  setMapTab(false);
                }}
              >
                <TitleText wiki={!wiki} fishLogTab={fishlogTab} mapTab={!mapTab}>Registros</TitleText>
                {(!wiki && fishlogTab && !mapTab)  ? <TitleHighlight /> : null}
              </TouchableTitle>
              <TouchableTitle
                onPress={() => {
                  setWiki(false);
                  setFishLogTab(false);
                  setMapTab(true);
                  getPosition();
                }}
              >
                <TitleText wiki={!wiki} fishLogTab={!fishlogTab} mapTab={mapTab}>Mapa</TitleText>
                {(!wiki && !fishlogTab && mapTab)  ? <TitleHighlight /> : null}
              
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
          />) : fishlogTab ? 
          (<FishLogs token={token} 
            navigation={navigation}
            isAdmin={isAdmin ? isAdmin : false}
            filterQuery={(route.params && route.params.logFilterQuery) ? route.params.logFilterQuery : null}
          />)  : mapTab ? (
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
            ) : (<UsersManager />) 
        }
      </PageContainer>
    </>
  );
};