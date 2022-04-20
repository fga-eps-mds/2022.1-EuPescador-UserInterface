import styled from "styled-components/native";
import { RFValue } from "react-native-responsive-fontsize";
import { MaterialIcons } from '@expo/vector-icons';

export const UserContainer = styled.View`
  align-items: center;
  justify-content: space-beetween;
  width: ${RFValue(156, 640)}px;
  height: ${RFValue(180, 640)}px;
  elevation: 4;
  border-radius: ${RFValue(16, 640)}px;
  background-color: ${({ theme }) => theme.colors.background};
  margin-bottom: 14px;
`;

export const NameView = styled.Text`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: ${RFValue(14, 640)}px;
  line-height: 16px;
  color: ${({ theme }) => theme.colors.on_background};
  padding-top: ${RFValue(8, 640)}px;
`;

export const EmailView = styled.Text`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: ${RFValue(10, 640)}px;
  line-height: 13px;
  color: ${({ theme }) => theme.colors.on_background};
  padding-top: ${RFValue(4, 640)}px;
`;

export const PhoneView = styled.Text`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: ${RFValue(10, 640)}px;
  line-height: 13px;
  color: ${({ theme }) => theme.colors.on_background};
  padding-top: ${RFValue(4, 640)}px;
`;

export const CityView = styled.Text`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: ${RFValue(8, 640)}px;
  line-height: 10px;
  color: ${({ theme }) => theme.colors.on_background};
  padding-top: ${RFValue(4, 640)}px;
`;

export const StateView = styled.Text`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: ${RFValue(6, 640)}px;
  line-height: 10px;
  color: ${({ theme }) => theme.colors.on_background};
  padding-top: ${RFValue(4, 640)}px;
`;
