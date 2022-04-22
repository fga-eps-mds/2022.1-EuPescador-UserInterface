import React, { useEffect, useState } from 'react';
import {useIsFocused} from '@react-navigation/native'; 
import { ScrollView } from 'react-native';
import { Text } from 'react-native';
import { GetAllUsers } from '../../services/userServices/getAllUsers';
import { UserCard } from '../UserCard';
import { UserContainer, UserFlatList } from './styles';
import {deleteUser} from "../../services/adminServices/deleteuser";
import { ActivityIndicator, Alert } from "react-native";

export interface UserInfo {
    id: number,
    name: string;
    email: string;
    phone: string;
    estate: string;
    city: string;
}

export const UsersManager = ({ navigation, route }: any) => {

    const [userList, setUserList] = useState<UserInfo[]>([]);
    const [isSuperAdmin, setIsSuperAdmin] = useState<boolean>(false);
    const [token, setToken] = useState<string>();
    const [isLoading, setIsLoading] = useState(true);

    const screamIsFocus = useIsFocused();

    const loadList = async () => {
        const res = await GetAllUsers();
        setUserList(res);
    }

    const deleteFunc = async (id: number) => {
        
        const res = await deleteUser( id.toString());
        if(res == 200) {
            const response = await GetAllUsers();
            setUserList(response);
            Alert.alert("Usuário excluído", "O usuário foi excluído com sucesso");
        } else {
            Alert.alert("Erro ao excluir usário. Tente novamente mais tarde");
        }    
    };

    useEffect(() => {
        setIsLoading(true);
        loadList();
        setIsLoading(false);
      }, [screamIsFocus]);

    return (
        <UserContainer>
            {isLoading ? (<ActivityIndicator size="large" color="#0000ff" />) 
            :
            userList.length ? (
                <ScrollView nestedScrollEnabled={true}>
                    <UserFlatList
                        data={userList}
                        renderItem= {({item}) => (
                            <UserCard data={item} handleClick={deleteFunc}/>
                        )}
                    >
                    </UserFlatList>
                </ScrollView>
            ) :
             (<Text>
                Não existem usuários cadastrados
            </Text>)
            }
        </UserContainer>
    )
}