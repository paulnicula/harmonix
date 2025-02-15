import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from './axiosConfig';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? { isAuthenticated: true, user: JSON.parse(savedUser) } : { isAuthenticated: false, user: null };
    });

    const login = async (username, password) => {
        try {
            const response = await axios.post('/api/userauth/login/', { username, password });

            localStorage.setItem('user', JSON.stringify(response.data));

            setAuthState({ isAuthenticated: true, user: response.data });
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await axios.post('/api/userauth/logout/');
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            localStorage.removeItem('user');
            setAuthState({ isAuthenticated: false, user: null });
            window.location.href = '/login';
        }
    };

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setAuthState({ isAuthenticated: true, user: JSON.parse(savedUser) });
        }
    }, []);

    return (
        <AuthContext.Provider value={{ authState, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
