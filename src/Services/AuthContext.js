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

const extractUserFromToken = (token) => {
    const user = {};
    user.email = token.email;
    user.firstName = token.given_name;
    user.lastName = token.family_name;
    return user;
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
        return extractUserFromToken(jwtDecode(IdToken));
    } catch (error) {
        throw new Error(error.response.data.message || 'Error during sign in');
    }
};

const signOut = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('idToken');
    localStorage.removeItem('refreshToken');
};

const checkAuth = () => {
    const idToken = localStorage.getItem('idToken');
    if (idToken) {
        try {
            const decodedToken = jwtDecode(idToken);
            if (decodedToken.exp * 1000 > Date.now()) {
                return decodedToken;
            } else {
                signOut();
            }
        } catch (error) {
            signOut();
        }
    }
    return null;
};

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const session = checkAuth();
        if (session) {
            setIsAuthenticated(true);
        }
    }, []);

    const handleSignUp = useCallback(async (email, password, firstName, lastName) => {
        await signUp(email, password, firstName, lastName);
    }, []);

    const handleConfirmSignUp = useCallback(async (email, confirmationCode) => {
        await confirmSignUp(email, confirmationCode);
    }, []);

    const handleSignIn = useCallback(async (username, password) => {
        const user = await signIn(username, password);
        setIsAuthenticated(true);
        setUser(user);
    }, []);

    const handleSignOut = useCallback(() => {
        signOut();
        setIsAuthenticated(false);
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, signUp: handleSignUp, confirmSignUp: handleConfirmSignUp, signIn: handleSignIn, signOut: handleSignOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
