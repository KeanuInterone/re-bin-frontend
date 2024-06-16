import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const { accessToken } = useAuth();
    const [user, setUser] = useState(null);

    const fetchUser = useCallback(async () => {
        if (!accessToken) {
            throw new Error('Access token is required to fetch user data.');
        }

        try {
            const response = await axios.post(
                'https://bqwhv7pr7f.execute-api.ap-southeast-4.amazonaws.com/v1/rebin-user',
                {
                    access_token: accessToken,
                    function_name: 'get_user',
                },
            );
            setUser(response.data);
            //console.log('User:', response.data)
        } catch (error) {
            console.error('Error fetching user:', error);
            throw new Error('Error fetching user data.');
        }
    }, [accessToken]);

    const scannedItem = useCallback(async () => {
        if (!accessToken) {
            throw new Error('Access token is required to fetch user data.');
        }

        try {
            const response = await axios.post(
                'https://bqwhv7pr7f.execute-api.ap-southeast-4.amazonaws.com/v1/rebin-user',
                {
                    access_token: accessToken,
                    function_name: 'add_scan'
                },
            );
            setUser(response.data);
        } catch (error) {
            console.error('Error fetching user:', error);
            throw new Error('Error fetching user data.');
        }
    }, [accessToken]);

    return (
        <UserContext.Provider value={{
            user,
            fetchUser,
            scannedItem
        }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);