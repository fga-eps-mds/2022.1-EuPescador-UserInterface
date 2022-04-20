import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { GetAllUsers } from '../../services/userServices/getAllUsers';
import { UserContainer } from './styles';

export interface AllUsers {
    name: string;
    email: string;
    phone: string;
    estate: string;
    city: string;
}

export const UsersManager = ({ navigation, route }: any) => {

    const [userList, setUserList] = useState<AllUsers[]>([]);

    const loadList = async () => {
        const res = await GetAllUsers();
        setUserList(res);
        console.log(res);
    }

    useEffect(() => {
        loadList();
      }, []);

    return (
        <UserContainer>
            {userList.length ? (
                <Text>
                    {userList.length}
                </Text>
            ) :
             (<Text>
                Banana
            </Text>)}
            
        </UserContainer>
    )
}