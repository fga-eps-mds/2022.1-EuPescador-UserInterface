import React from 'react';
import { Button, ButtonText } from './styles';
import { ActivityIndicator } from 'react-native';

interface Props {
  text: string;
  type?: 'primary' | 'secondary';
  buttonFunction: VoidFunction;
  loading?: boolean;
}

export function DefaultButton({
  text,
  type = 'primary',
  buttonFunction,
  loading,
}: Props) {
  return (
    <Button onPress={buttonFunction} type={type}>
      {loading ? (
        <ActivityIndicator size="small" color="#fff" />
      ) : (
        <ButtonText>{text}</ButtonText>
      )}
    </Button>
  );
}
