import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
//import Header from './Header';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { setAuth } = useAuth();

    const handleLogin = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch('/api/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();
            if (response.ok) {
                const authData = {
                    isAuthenticated: true, user: data.name, role: data.role, id: data.id
                }
                setAuth(authData);
                localStorage.setItem('token', data.token);
                navigate('/Home'); // Ensure this is the correct route you have in your <Routes> setup
            } else {
                console.error('Failed to login:', data.error);
            }
        } catch (error) {
            console.error('There was an error logging in:', error);
        }
    };

    return (
        <>
            {/* <Header /> */}
            <div className="auth-container">
                <h2>Login to Movie Theatre</h2>
                <form onSubmit={handleLogin}>
                    <input
                        type="text"
                        placeholder="Username"
                        className="auth-input"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="auth-input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit" className="auth-button">Login</button>
                </form>
                <div className="additional-info">
                    Don't have an account? <a href="/signup">Sign Up</a>
                </div>
            </div>
        </>
    );
}

export default Login;
