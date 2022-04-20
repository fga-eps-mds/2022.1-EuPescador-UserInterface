import React, { useEffect, useState } from "react";
import { View, Text, Button } from "react-native";
import {
  ButtonStyle,
  DeleteButton,
  DeleteButtonText,
  DeleteIcon,
  UserCardView,
} from "./styles";

export interface UserInfo {
  data: {
    id: number;
    name: string;
    email: string;
    phone: string;
    estate: string;
    city: string;
  };
  handleClick(id : number) : void;
}

export const UserCard = ({data, handleClick}: UserInfo) => {

  return (
    // <UserCardView>
    //   <UserCardView>{data.name}</UserCardView>
    //   {/* <ButtonStyle>
    //     <DeleteButton onPress={deleteFunc}>
    //       <DeleteButtonText>Deletar</DeleteButtonText>
    //       <DeleteIcon name="delete" />
    //     </DeleteButton>
    //   </ButtonStyle> */}
    // </UserCardView>
    <View>
        <Text>{data.name}</Text>
        <Button onPress={() => {
          handleClick(data.id)
        }}  title="Deletar"/>
    </View>
  );
};
