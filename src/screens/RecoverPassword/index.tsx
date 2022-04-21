import React, { useState } from 'react';
import { ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import {
  Container,
  ErrorMessage,
  Input,
  InputBox,
  InputContainer,
  InputTitle,
  InputView,
  LoginButtonView,
  HomeLogoContainer,
  HomeAppImage,
  HomeAppTitle,
  HomeAppTitleBlue,
} from './styles';
import { DefaultButton } from '../../components/Button';
import { UserEmail } from '../../services/userServices/userEmail';
import { SendMail } from '../../services/userServices/sendMail';
import { UpdateUser } from '../../services/userServices/updatePassword';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';

export default function RecoverPassword() {
  
  const [userEmailPhone, setUserEmailPhone] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const [isEmailPhoneValid, setIsEmailPhoneValid] = useState(true);
  const [isEmailPhoneValidMessage, setIsEmailPhoneValidMessage] = useState(
    'Usuário não encontrado'
  );
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [isPasswordValidMessage, setIsPasswordValidMessage] = useState('');
  const [newPassword, setNewPassword] = useState<string | undefined>();
  const [confirmPassword, setConfirmPassword] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingMail, setIsSendingMail] = useState(false);
  const [tokenValidated, setTokenValidated] = useState(false);
  const [tokenSending, setTokenSending] = useState(false);
  const navigation = useNavigation();

  const sendToken = async () => {
    let emails = [];
    emails = await UserEmail();
    let response = false;
    response =
      emails.data.filter((item) => item.email === userEmailPhone).length > 0;
    if (response) {
      setIsSendingMail(true);
      await SendMail();
      setIsSendingMail(false);
      Alert.alert(
        'Token enviado!',
        'Confira a sua caixa de e-mail para obter o token e prosseguir na recuperação da sua senha.'
      );
      setTokenSending(true);
    } else {
      Alert.alert(
        'Email inválido!',
        'Não encontramos nenhum usuário com esse e-mail'
      );
    }
  };

  const verifyToken = async () => {

  }

  const updatePassword = async () => {
    
    if(userEmailPhone && isPasswordValid){
      await UpdateUser(userEmailPhone, newPassword!);
      Alert.alert(
        'Senha alterada!',
        'Sua senha foi alterada com sucesso!'
      );
      navigation.navigate('Login' as never);

    }else{
      Alert.alert(
        'Senha inválida!',
        'Digite uma senha que não seja nula!'
      );
    }
  }

  const validatePassword = (password: string) => {
    if (password !== newPassword) {
      setIsPasswordValidMessage('Digite a mesma senha!');
      setIsPasswordValid(false);
    } else {
      setIsPasswordValid(true);
    }
  };
  const handlePassword = (password: string) => {
    setConfirmPassword(password);
    validatePassword(password);
  };

  return (
    <Container>
      <HomeLogoContainer>
        <HomeAppImage source={require('../../assets/logo.png')} />
        <HomeAppTitle>
          Eu<HomeAppTitleBlue>Pescador</HomeAppTitleBlue>
        </HomeAppTitle>
      </HomeLogoContainer>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <InputContainer>
          {tokenValidated ? null :
          <>
            {tokenSending ? (
              <>
              
              <InputView>
                <Input
                  placeholder="Nova Senha"
                  secureTextEntry
                  value={newPassword}
                  onChangeText={setNewPassword}
                />
              </InputView>

              <InputView>
                <Input
                  secureTextEntry
                  placeholder="Confirmar nova senha"
                  value={confirmPassword}
                  onChangeText={handlePassword}
                />
              </InputView>
              {isPasswordValid ? (
                <InputBox />
              ) : (
                <ErrorMessage>{isPasswordValidMessage}</ErrorMessage>
              )}

              <LoginButtonView>
                <DefaultButton
                  text="Atualizar senha"
                  buttonFunction={updatePassword}
                  loading={isSendingMail}
                />
              </LoginButtonView>
            </>
            ):(
            <>
              <InputTitle>Já possui um token? Valide-o abaixo:</InputTitle>
              <InputView>
                <Input
                  placeholder="Token"
                  value={token}
                  onChangeText={setToken}
                />
              </InputView>
    
              <InputTitle>
                Não possui um token? Digite seu email para enviarmos um para você:
              </InputTitle>
              <InputView>
                <Input
                  placeholder="E-mail"
                  value={userEmailPhone}
                  onChangeText={setUserEmailPhone}
                />
              </InputView>
            </>
            )}
          </>
          }
          {isEmailPhoneValid ? (
            <InputBox />
          ) : (
            <ErrorMessage>{isEmailPhoneValidMessage}</ErrorMessage>
          )}
          {tokenSending ? null :
          <LoginButtonView>
            <DefaultButton
              text="Enviar token"
              buttonFunction={sendToken}
              loading={isSendingMail}
            />
          </LoginButtonView>
          }
        </InputContainer>
      )}
    </Container>
  );
}
