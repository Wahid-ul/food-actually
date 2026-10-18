import { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  Alert,
  Link,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { registerWithEmail } from '../utils/auth';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await registerWithEmail({
        name: form.name,
        email: form.email,
        password: form.password,
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
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
          <TextField
            label="Full Name"
            fullWidth
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <TextField
            label="Email"
            fullWidth
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="you@example.com"
          />
          <TextField
            label="Password"
            fullWidth
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="At least 6 characters"
          />
          <TextField
            label="Confirm Password"
            fullWidth
            type="password"
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            placeholder="Confirm your password"
          />

          <Button
            variant="contained"
            onClick={handleRegister}
            disabled={loading || !form.name || !form.email || !form.password || !form.confirmPassword}
            sx={{
              background: 'linear-gradient(135deg, #e58d9c 0%, #e58d9c 100%)',
              color: 'white',
              fontWeight: 600,
            }}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </Button>

          {error && <Alert severity="error">{error}</Alert>}

          <Typography align="center">
            Already have an account?{' '}
            <Link href="/login" sx={{ cursor: 'pointer', color: '#e58d9c', fontWeight: 600 }}>
              Login
            </Link>
          </Typography>
        </Stack>
      </Paper>
    </Container>
  );
}