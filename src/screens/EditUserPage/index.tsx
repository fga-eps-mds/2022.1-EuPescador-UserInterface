import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert } from "react-native";
import {
  CityStateView,
  InputScroll,
  ComunityInputIcon,
  Container,
  ErrorMessage,
  HalfInputView,
  Input,
  InputBox,
  InputContainer,
  InputMask,
  InputView,
  MaterialInputIcon,
  RegisterButtonView,
} from "./styles";
import { DefaultButton } from "../../components/Button";
import { editUser } from "../../services/adminServices/editUser";

export function EditUserPage({ navigation, route}: any) {
  const [userName, setUserName] = useState<string | undefined>();
  const [isNameValid, setIsNameValid] = useState(true);
  const [userEmail, setUserEmail] = useState<string | undefined>();
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isEmailValidMessage, setIsEmailValidMessage] = useState("");
  const [userPhone, setUserPhone] = useState<string | undefined>();
  const [isPhoneValid, setIsPhoneValid] = useState(true);
  const [isPhoneValidMessage, setIsPhoneValidMessage] = useState("");
  const [userState, setUserState] = useState<string | undefined>();
  const [isStateValid, setIsStateValid] = useState(true);
  const [userCity, setUserCity] = useState<string | undefined>();
  const [isCityValid, setIsCityValid] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    //Add Loading Animation when making request
    setIsLoading(true);
    if(isNameValid && isEmailValid && isPhoneValid && isStateValid && isCityValid) {
        const res = await editUser(userName, userEmail, userPhone, userState, userCity);
        if(res.status == 200) {
            setIsLoading(false);
            Alert.alert("Alterações salvas", "O usuário foi editado com sucesso");
            navigation.goBack();
        } else {
            //Inserir um alert de erro
            //Muxar mensagem de erro via backend User
            setIsLoading(false);
            console.log("Erro","Erro ao editar o usuário");
        }
    } else {
        setIsLoading(false);
        Alert.alert("Existem campos com informações não válidas.");
    }
  }

  const handleName = (name : string) => {
      setUserName(name);
      validateName(name);
  }

  const validateName = (name : string) => {
    if(name.length > 0 && name) {
        const aux = name.trim();
        if(aux.length > 0) {
            setIsNameValid(true);
        } else {
            setIsNameValid(false);
        }
    } else {
        setIsNameValid(false);
    }
  }
  const handleState = (state : string) => {
      setUserState(state);
      validateState(state);
  }

  const validateState = (state : string) => {
    if(state.length > 0 && state) {
        const aux = state.trim();
        if(aux.length > 0) {
            setIsStateValid(true);
        } else {
            setIsStateValid(false);
        }
    } else {
        setIsStateValid(false);
    }
  }
  const handleCity = (city : string) => {
      setUserCity(city);
      validateCity(city);
  }

  const validateCity = (city : string) => {
    if(city.length > 0 && city) {
        const aux = city.trim();
        if(aux.length > 0) {
            setIsCityValid(true);
        } else {
            setIsCityValid(false);
        }
    } else {
        setIsCityValid(false);
    }
  }

  const validateEmail = (email: string) => {
    if (email) {
      const emailRegex =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

      if (email.length > 254) {
        setIsEmailValidMessage("Email muito extenso!");
        setIsEmailValid(false);
      } else if (!emailRegex.test(email)) {
        setIsEmailValidMessage("Formato de email inválido!");
        setIsEmailValid(false);
      } else if (email.split("@")[0].length > 64) {
        setIsEmailValidMessage("Email muito extenso!");
        setIsEmailValid(false);
      } else setIsEmailValid(true);
    }
  };

  const validatePhone = (phone: string) => {
    if (phone.length < 15) {
      setIsPhoneValidMessage("Tamanho de telefone inválido!"),
        setIsPhoneValid(false);
    } else {
      setIsPhoneValid(true);
    }
  };

  const handleEmailInput = (email: string) => {
    setUserEmail(email);
    validateEmail(email);
  };

  const handlePhone = (phone: string) => {
    setUserPhone(phone);
    validatePhone(phone);
  };

  useEffect(() => {
      setUserName(route.params.name);
      handleEmailInput(route.params.email);
      handlePhone(route.params.phone);
      setUserState(route.params.state);
      setUserCity(route.params.city);
  },[]);

  return (
    <Container>
        {isLoading ? (<ActivityIndicator size="large" color="#0000ff" />) : null}
        <InputScroll>
          <InputContainer>
            <InputView>
              <MaterialInputIcon name="person-outline" />
              <Input
                placeholder="Nome"
                value={userName}
                onChangeText={handleName}
              />
            </InputView>
            <InputBox />
            <InputView>
              <MaterialInputIcon name="mail-outline" />
              <Input
                placeholder="Email"
                value={userEmail}
                onChangeText={handleEmailInput}
              />
            </InputView>
            {isEmailValid ? (
              <InputBox />
            ) : (
              <ErrorMessage>{isEmailValidMessage}</ErrorMessage>
            )}
            <InputView>
              <ComunityInputIcon name="phone-outline" />
              <InputMask
                type="cel-phone"
                options={{
                  maskType: "BRL",
                  withDDD: true,
                  dddMask: "(99) ",
                }}
                value={userPhone}
                onChangeText={handlePhone}
                placeholder="Telefone"
              />
            </InputView>
            {isPhoneValid ? (
              <InputBox />
            ) : (
              <ErrorMessage>{isPhoneValidMessage}</ErrorMessage>
            )}
            <CityStateView>
              <HalfInputView>
                <ComunityInputIcon name="compass-outline" />
                <Input
                  placeholder="Estado"
                  value={userState}
                  onChangeText={handleState}
                />
              </HalfInputView>
              <HalfInputView>
                <ComunityInputIcon name="city" />
                <Input
                  placeholder="Cidade"
                  value={userCity}
                  onChangeText={handleCity}
                />
              </HalfInputView>
            </CityStateView>
            <RegisterButtonView>
              <DefaultButton text="Salvar Alterações" buttonFunction={handleClick} />
            </RegisterButtonView>
          </InputContainer>
        </InputScroll>
    </Container>
  );
}
