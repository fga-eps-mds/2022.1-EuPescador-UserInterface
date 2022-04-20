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

export default function RecoverPassword({ navigation }: any) {
  const [userEmailPhone, setUserEmailPhone] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const [isEmailPhoneValid, setIsEmailPhoneValid] = useState(true);
  const [isEmailPhoneValidMessage, setIsEmailPhoneValidMessage] = useState(
    'Usuário não encontrado'
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingMail, setIsSendingMail] = useState(false);
  const [tokenValidated, setTokenValidated] = useState(false);

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
    } else {
      Alert.alert(
        'Email inválido!',
        'Não encontramos nenhum usuário com esse e-mail'
      );
    }
  };

  const verifyToken = async () => {

  }

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
          }
          {isEmailPhoneValid ? (
            <InputBox />
          ) : (
            <ErrorMessage>{isEmailPhoneValidMessage}</ErrorMessage>
          )}
          <LoginButtonView>
            <DefaultButton
              text="Enviar token"
              buttonFunction={sendToken}
              loading={isSendingMail}
            />
          </LoginButtonView>
        </InputContainer>
      )}
    </Container>
  );
}
