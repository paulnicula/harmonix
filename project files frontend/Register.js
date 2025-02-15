import React, { useState } from 'react';
import { Container, TextField, Button, Typography } from '@mui/material';
import axios from './axiosConfig';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            await axios.post('/api/userauth/register/', { username, email, password });
            navigate('/login');
        } catch (error) {
            console.error('Registration failed:', error);
            setError('Registration failed. Please check your input and try again.');
        }
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Register</Typography>
            {error && (
                <Typography variant="body2" color="error" align="center" style={{ marginBottom: '10px' }}>
                    {error}
                </Typography>
            )}
            <form onSubmit={(e) => { e.preventDefault(); handleRegister(); }}>
                <TextField
                    label="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                />
                <TextField
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                />
                <TextField
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                />
                <Button type="submit" variant="contained" color="primary" fullWidth>Register</Button>
            </form>
            <Typography variant="body2" color="textSecondary" align="center" style={{ marginTop: '20px' }}>
                Already have an account? <Link to="/login">Login</Link>
            </Typography>
        </Container>
    );
};

export default Register;
