import React, {createContext, useState} from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({isLoggedIn: false, user_token: null});

    const login = (user_token) => {
        setAuth({isLoggedIn: true, user_token: user_token});
    };

    const logout = () => {
        setAuth({isLoggedIn: false, user_token: null});
    };

    return (
        <AuthContext.Provider value={{ auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
