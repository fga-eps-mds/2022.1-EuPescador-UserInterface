import React, { useEffect, useState } from "react";
import { View, Text, Button } from "react-native";
import {
  ButtonStyle,
  DeleteButton,
  DeleteButtonText,
  DeleteIcon,
  UserCardView,
} from "./styles";
import {deleteUser} from "../../services/adminServices/deleteuser";

export interface UserInfo {
  data: {
    id: number;
    name: string;
    email: string;
    phone: string;
    estate: string;
    city: string;
  };
}

export const UserCard = ({data}: UserInfo) => {

  const deleteFunc = async () => {
    const res = await deleteUser( data.id.toString());
    if(res == 200) {
        console.log("exclui");
    } else {
        console.log("deu merda");
    }
    
  };

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
        <Text>{data.id}</Text>
        <Button onPress={deleteFunc}  title="Deletar"/>
    </View>
  );
};
