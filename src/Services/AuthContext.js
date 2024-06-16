import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

const config = {
    region: 'ap-southeast-4',
    userPoolId: 'ap-southeast-4_J4uGzCf4k',
    clientId: '5ct4ju8rqh4se18bdo3211srb5',
};

const getCognitoUrl = () => {
    return `https://cognito-idp.${config.region}.amazonaws.com/`;
};

export const signUp = async (email, password, firstName, lastName) => {
    const url = getCognitoUrl('signup');
    const data = {
        ClientId: config.clientId,
        Username: email,
        Password: password,
        UserAttributes: [
            { Name: 'email', Value: email },
            { Name: 'given_name', Value: firstName },
            { Name: 'family_name', Value: lastName },
            { Name: 'name', Value: `${firstName} ${lastName}` },
        ],
    };

    try {
        const response = await axios.post(url, data, {
            headers: {
                'Content-Type': 'application/x-amz-json-1.1',
                'X-Amz-Target': 'AWSCognitoIdentityProviderService.SignUp',
            },
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message || 'Error during sign up');
    }
};

export const confirmSignUp = async (email, confirmationCode) => {
    const url = getCognitoUrl();
    const data = {
        ClientId: config.clientId,
        Username: email,
        ConfirmationCode: confirmationCode,
    };

    try {
        const response = await axios.post(url, data, {
            headers: {
                'Content-Type': 'application/x-amz-json-1.1',
                'X-Amz-Target': 'AWSCognitoIdentityProviderService.ConfirmSignUp',
            },
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message || 'Error during confirmation');
    }
};

const signIn = async (username, password) => {
    const url = getCognitoUrl();
    const data = {
        AuthFlow: 'USER_PASSWORD_AUTH',
        ClientId: config.clientId,
        AuthParameters: {
            USERNAME: username,
            PASSWORD: password,
        },
    };

    try {
        const response = await axios.post(url, data, {
            headers: {
                'Content-Type': 'application/x-amz-json-1.1',
                'X-Amz-Target': 'AWSCognitoIdentityProviderService.InitiateAuth',
            },
        });
        const { AccessToken, IdToken, RefreshToken } = response.data.AuthenticationResult;
        localStorage.setItem('accessToken', AccessToken);
        localStorage.setItem('idToken', IdToken);
        localStorage.setItem('refreshToken', RefreshToken);
        return true;
    } catch (error) {
        throw new Error(error.response.data.message || 'Error during sign in');
    }
};

const signOut = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('idToken');
    localStorage.removeItem('refreshToken');
};

const hasValidAuthToken = () => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
        try {
            const decodedToken = jwtDecode(accessToken);
            if (decodedToken.exp * 1000 > Date.now()) {
                return true;
            } else {
                signOut();
            }
        } catch (error) {
            signOut();
        }
    }
    return false;
};

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [accessToken, setAccessToken] = useState(null);

    useEffect(() => {
        if (hasValidAuthToken()) {
            setIsAuthenticated(true);
            setAccessToken(localStorage.getItem('accessToken'));
        }
    }, []);

    const handleSignUp = useCallback(async (email, password, firstName, lastName) => {
        await signUp(email, password, firstName, lastName);
    }, []);

    const handleConfirmSignUp = useCallback(async (email, confirmationCode) => {
        await confirmSignUp(email, confirmationCode);
    }, []);

    const handleSignIn = useCallback(async (username, password) => {
        if (await signIn(username, password)) {
            setIsAuthenticated(true);
            setAccessToken(localStorage.getItem('accessToken'));
            //console.log('Access token:', localStorage.getItem('accessToken'));
        }
    }, []);

    const handleSignOut = useCallback(() => {
        signOut();
        setIsAuthenticated(false);
    }, []);

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            accessToken,
            signUp: handleSignUp,
            confirmSignUp: handleConfirmSignUp,
            signIn: handleSignIn,
            signOut: handleSignOut
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
