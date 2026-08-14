import { useState } from 'react';
import {
  Container, Paper, Typography, TextField, Button, Stack
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../utils/auth';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = () => {
    registerUser(form);
    navigate('/login');
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Paper
        component={motion.div}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        sx={{ p: 4, borderRadius: 4 }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Create Account
        </Typography>

        <Stack spacing={3}>
          <TextField label="Name" fullWidth
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <TextField label="Email" fullWidth
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <TextField label="Password" type="password" fullWidth
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <Button variant="contained" size="large" onClick={handleSubmit}>
            Register
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}