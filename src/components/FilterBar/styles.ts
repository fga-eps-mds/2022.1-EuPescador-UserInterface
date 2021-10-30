import { RFValue } from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';
import { MaterialIcons } from '@expo/vector-icons';

export const Box = styled.View`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.primary_light};
  flex-direction: row;
  justify-content: center;
`;
export const IconContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-right: ${RFValue(16)}px;
`;

export const HeaderIcon = styled(MaterialIcons)`
  font-size: ${RFValue(30)}px;
`;
export const IconText = styled.Text`
  font-size: ${RFValue(12)}px;
  font-family: ${({ theme }) => theme.fonts.bold};
`;

export const HeaderText = styled.Text`
  margin-right: ${RFValue(64)}px;
  font-family: ${({ theme }) => theme.fonts.medium};
  font-size: ${RFValue(18)}px;
`;
