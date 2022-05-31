import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        isAuthenticated: false,
        user: null
    });

    useEffect(() => {
        const verifyToken = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    // Replace '/api/verifyToken' with your actual endpoint
                    const response = await fetch('/api/verifyToken', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    const data = await response.json();
                    if (response.ok) {
                        setAuth({ isAuthenticated: true, user: data.user.name, role: data.user.role, id: data.user.id }); // Assuming 'name' is part of your response
                    } else {
                        // Handle error, token might be invalid or expired
                        localStorage.removeItem('token');
                        setAuth({ isAuthenticated: false, user: null, role: data.user.role, id: data.user.id });
                    }
                } catch (error) {
                    console.error('Error verifying token:', error);
                    // Possible network error or server might be down
                }
            }
        };

        verifyToken();
    }, []);

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
