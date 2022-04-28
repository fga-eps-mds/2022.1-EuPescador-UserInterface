import React, { useState } from 'react';
import { ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  Container,
  ErrorMessage,
  Input,
  InputBox,
  InputContainer,
  InputTitle,
  InputView,
  RecoverButtonView,
  HomeLogoContainer,
  HomeTitle,
  HomeAppImage,
  HomeAppTitle,
  HomeAppTitleBlue,
} from './styles';
import { DefaultButton } from '../../components/Button';
import { UserEmail } from '../../services/userServices/userEmail';
import { SendMail } from '../../services/userServices/sendMail';
import {
  UpdateUser,
  VerifyToken,
} from '../../services/userServices/updatePassword';


export default function RecoverPassword() {
  const [userEmailPhone, setUserEmailPhone] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string | undefined>('');
  const [confirmNewPassword, setConfirmNewPassword] = useState<string | undefined>('');
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
      await SendMail(userEmailPhone);
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
    try {
      if (token) {
        const response = await VerifyToken(token);

        setUserId(response.data.token.user_id)
        setTokenValidated(true);

        Alert.alert(
          'Token válido!',
          'Token validado com sucesso. Agora, escolha sua nova senha.'
        );
      }
    } catch (error) {
      let status_code = error.message.match(/\d/g);
      status_code = status_code.join('');

      if (status_code === '404') {
        Alert.alert(
          'Token inválido!',
          'Não conseguimos encontrar o seu token.'
        );
      } else {
        Alert.alert(
          'Falha no sistema!',
          'Não conseguimos processar seu token. Gere outro token e tente novamente.'
        );
      }
    }
  };

  const updatePassword = async () => {
    if (newPassword) {
      if (newPassword === confirmNewPassword) {
        
        await UpdateUser(userId, newPassword!);
        Alert.alert('Senha alterada.', 'Sua senha foi alterada com sucesso!', [
          { text: 'OK', onPress: () => navigation.navigate('Login' as never) },
        ]);
        setTokenValidated(false);
      } else {
        Alert.alert('Senha inválida.', 'As senhas não são equivalentes!');
      }
    } else {
      Alert.alert('Senha inválida.', 'Digite uma senha que não seja nula!');
    }
  };

  return (
    <Container>
      <HomeLogoContainer>
        <HomeAppImage source={require('../../assets/logo.png')} />
        <HomeAppTitle>
          Eu<HomeAppTitleBlue>Pescador</HomeAppTitleBlue>
        </HomeAppTitle>
        <HomeTitle>Recuperação de senha</HomeTitle>
      </HomeLogoContainer>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <InputContainer>
          {tokenValidated ? (
            <>
              <InputView>
                <Input
                  placeholder="Nova senha"
                  secureTextEntry
                  value={newPassword}
                  onChangeText={setNewPassword}
                />
              </InputView>

              <InputView>
                <Input
                  secureTextEntry
                  placeholder="Confirmar nova senha"
                  value={confirmNewPassword}
                  onChangeText={setConfirmNewPassword}
                />
              </InputView>

              <RecoverButtonView>
                <DefaultButton
                  text="Atualizar senha"
                  buttonFunction={updatePassword}
                  loading={isSendingMail}
                />
              </RecoverButtonView>
            </>
          ) : (
            <>
              <InputView>
                <InputTitle>Já possui um token? Valide-o abaixo:</InputTitle>
                <Input
                  placeholder="Token"
                  value={token}
                  onChangeText={setToken}
                />
              </InputView>

              <RecoverButtonView>
                <DefaultButton
                  text="Validar token"
                  buttonFunction={verifyToken}
                  loading={isSendingMail}
                />
              </RecoverButtonView>

              <InputView>
                <InputTitle>
                  Não possui um token? Digite seu email para enviarmos um para
                  você:
                </InputTitle>
                <Input
                  placeholder="E-mail"
                  value={userEmailPhone}
                  onChangeText={setUserEmailPhone}
                />
              </InputView>
              <RecoverButtonView>
                <DefaultButton
                  text="Enviar token"
                  buttonFunction={sendToken}
                  loading={isSendingMail}
                />
              </RecoverButtonView>
            </>
          )}
        </InputContainer>
      )}
    </Container>
  );
}
