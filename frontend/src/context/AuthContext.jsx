import { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, logoutUser } from '../api';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (credentials) => {
        // eslint-disable-next-line no-useless-catch
        try {
            const response = await loginUser(credentials);

            setToken(response.access_token);
            setUser(response.user);

            localStorage.setItem('token', response.access_token);
            localStorage.setItem('user', JSON.stringify(response.user));

            return response;
        } catch (error) {
            throw error;
        }
    };

    const register = async (userData) => {
        // eslint-disable-next-line no-useless-catch
        try {
            const response = await registerUser(userData);
            setToken(response.access_token);
            setUser(response.user);

            localStorage.setItem('token', response.access_token);
            localStorage.setItem('user', JSON.stringify(response.user));

            return response;
        } catch (error) {
            throw error;
        }
    };

    const logout = async () => {
        // eslint-disable-next-line no-useless-catch
        try {
            if (token) {
                await logoutUser(token);
            }

            setToken(null);
            setUser(null);
            localStorage.removeItem('token');
            localStorage.removeItem('user');

        } catch (error) {
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            loading,
            login, 
            register,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    )
}