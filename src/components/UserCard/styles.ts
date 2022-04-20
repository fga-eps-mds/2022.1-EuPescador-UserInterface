import styled from "styled-components/native";
import { RFValue } from "react-native-responsive-fontsize";
import { MaterialIcons } from '@expo/vector-icons';

export const View = styled.View`
  align-items: center;
  width: ${RFValue(156, 640)}px;
  height: ${RFValue(180, 640)}px;
  border-radius: ${RFValue(8, 640)}px;
  background-color: ${({ theme }) => theme.colors.background};
  margin-bottom: 24px;
`;

export const Text = styled.Text`
  color: black;
  font-family: ${({ theme }) => theme.fonts.bold};
  font-size: ${RFValue(12, 640)}px;
`;

export const Button = styled.TouchableOpacity`
  width: ${RFValue(156, 640)}px;
  height: ${RFValue(39, 640)}px;
  border-radius: ${RFValue(5, 640)}px;
  background-color: ${({ theme }) => theme.colors.secondary_dark};
  align-items: center;
`;

