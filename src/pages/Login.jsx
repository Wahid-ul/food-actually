import { useState } from 'react';
import {
  Container, Paper, Typography, TextField, Button, Stack
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../utils/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    if (loginUser(email, password)) {
      navigate('/dashboard');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Paper
        component={motion.div}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        sx={{ p: 4, borderRadius: 4 }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Food, Actually Login
        </Typography>

        <Stack spacing={3}>
          <TextField label="Email" fullWidth onChange={(e) => setEmail(e.target.value)} />
          <TextField label="Password" type="password" fullWidth
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button variant="contained" size="large" onClick={handleLogin}>
            Login
          </Button>

          <Button onClick={() => navigate('/register')}>
            Create new account
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}