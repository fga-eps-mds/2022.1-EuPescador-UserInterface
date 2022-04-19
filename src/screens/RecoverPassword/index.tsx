import React, { useEffect, useState } from 'react';
import { CommonActions } from '@react-navigation/native';
import { ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import {
    Container,
    ErrorMessage,
    Input,
    InputBox,
    InputContainer,
    InputView,
    LoginButtonView,
    HomeLogoContainer,
    HomeAppImage,
    HomeAppTitle,
    HomeAppTitleBlue,
  } from './styles';
import { useAuth } from '../../contexts/authContext';
import { DefaultButton } from '../../components/Button';
import { UserEmail } from '../../services/userServices/userEmail';
import { SendMail } from '../../services/userServices/sendMail';

export default function RecoverPassword({ navigation }: any) {
  const [userEmailPhone, setUserEmailPhone] = useState<string>('');
  const [isEmailPhoneValid, setIsEmailPhoneValid] = useState(true);
  const [isEmailPhoneValidMessage, setIsEmailPhoneValidMessage] = useState(
    'Usuário não encontrado',
  );
  const [userPassword, setUserPassword] = useState<string>('');
  const { validEmail, authenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const [users, setUsers] = useState<any[]>([]);

  const recoverPassword = async () => {
    let emails = [];
    emails = await UserEmail();
    let response = false;
    response = emails.data.filter(item => item.email === userEmailPhone).length > 0;
    if(response){
      await SendMail();
      Alert.alert("Email enviado!","Confira a sua caixa de e-mail para recuperar sua senha")
    }else{
      Alert.alert("Email inválido!","Não encontramos nenhum usuário com esse e-mail");
    }
   
  };

  return (
    <Container>
      <HomeLogoContainer>
        <HomeAppImage source={require('../../assets/logo.png')} />
        <HomeAppTitle>
          Eu<HomeAppTitleBlue>Pescador</HomeAppTitleBlue>
        </HomeAppTitle>
      </HomeLogoContainer>
      {isLoading ? 
        <ActivityIndicator size="large" color="#0000ff" />     
      : <InputContainer>
          <InputView>
            <Input
              placeholder="E-mail"
              value={userEmailPhone}
              onChangeText={setUserEmailPhone}
            />
          </InputView>
          {isEmailPhoneValid ? (
            <InputBox />
          ) : (
            <ErrorMessage>{isEmailPhoneValidMessage}</ErrorMessage>
          )}
          <LoginButtonView>
            <DefaultButton text="Enviar" buttonFunction={recoverPassword} />
          </LoginButtonView>
        </InputContainer>}
    </Container>
  );
}
