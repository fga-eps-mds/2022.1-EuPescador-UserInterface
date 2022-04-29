import React from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  Container,
  Name,
  ItemButton,
  HeaderContainer,
  TextButton,
} from './styles';

export interface UserInfo {
  data: {
    id: number;
    name: string;
    email: string;
    phone: string;
    estate: string;
    city: string;
  };
  handleClick(id: number): void;
}

export const UserCard = ({ data, handleClick }: UserInfo) => {
  const navigation = useNavigation();

  const goToEditionUser = () => {
    navigation.navigate('EditUserPage', data);
  };

  return (
    <Container>
      <HeaderContainer>
        <Name>{data.name}</Name>
        <Name>{data.email}</Name>
      </HeaderContainer>
      <ItemButton>
        <TextButton
          onPress={() => {
            handleClick(data.id);
          }}
        >
          Deletar Usuário
        </TextButton>
        <TextButton onPress={goToEditionUser}>Editar Informações</TextButton>
      </ItemButton>
    </Container>
  );
};
