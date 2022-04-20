import React, { useEffect, useState } from 'react';
import {useIsFocused} from '@react-navigation/native'; 
import { View, Text } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { GetAllUsers } from '../../services/userServices/getAllUsers';
import { UserCard } from '../UserCard';
import { UserContainer } from './styles';

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

    const screamIsFocus = useIsFocused();

    const loadList = async () => {
        const res = await GetAllUsers();

        setUserList(res);
        console.log("ABRIU");
    }

    useEffect(() => {
        loadList();
      }, [screamIsFocus]);

    return (
        <UserContainer>
            {userList.length ? (
                <FlatList
                    data={userList}
                    renderItem= {({item}) => (
                        <UserCard data={item} token={token && ''}/>
                    )}
                >
                </FlatList>
            ) :
             (<Text>
                Banana
            </Text>)}
            
        </UserContainer>
    )
}