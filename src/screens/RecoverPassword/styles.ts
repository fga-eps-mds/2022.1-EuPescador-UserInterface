import { RFValue } from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

export const Container = styled.ScrollView`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
  padding-top: ${RFValue(40, 640)}px;
`;

export const HomeLogoContainer = styled.View`
  align-items: center;
  justify-content: center;
  margin-bottom: ${RFValue(25, 640)}px;
`;

export const HomeAppImage = styled.Image`
  width: ${RFValue(184, 640)}px;
  height: ${RFValue(150, 640)}px;
  margin-bottom: ${RFValue(16, 640)}px;
`;

export const HomeAppTitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: ${RFValue(15, 640)}px;
  line-height: ${RFValue(22, 640)}px;
  color: ${({ theme }) => theme.colors.on_background};
`;

export const HomeTitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.medium};
  font-size: ${RFValue(22, 640)}px;
  margin: 20px 0;
  color: ${({ theme }) => theme.colors.on_background};
`;

export const HomeAppTitleBlue = styled(HomeAppTitle)`
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
`;

export const InputContainer = styled.View`
  flex-direction: column;
  align-items: center;
`;

export const InputView = styled.View`
  width: 80%;
  flex-direction: column;
`;

export const InputTitle = styled.Text`
  margin: 12px 0;
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: ${RFValue(15, 640)}px;
  line-height: ${RFValue(22, 640)}px;
  color: ${({ theme }) => theme.colors.on_background};
`;

export const InputBox = styled.View`
  margin-bottom: ${RFValue(5, 640)}px;
`;

export const Input = styled.TextInput`
  height: ${RFValue(39, 640)}px;
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: ${RFValue(12, 640)}px;
  margin: 11px 0;
  padding: 0 10px;
  border: ${RFValue(1, 640)}px;
  border-radius: ${RFValue(5, 640)}px;
`;

export const ErrorMessage = styled.Text`
  color: ${({ theme }) => theme.colors.on_error};
  font-size: ${RFValue(12, 640)}px;
  font-family: ${({ theme }) => theme.fonts.regular};
  margin: ${RFValue(2, 640)}px 0 ${RFValue(8, 640)}px ${RFValue(7, 640)}px;
`;

export const RecoverButtonView = styled.View`
  align-items: center;
  margin: 10px 0 20px;
`;



