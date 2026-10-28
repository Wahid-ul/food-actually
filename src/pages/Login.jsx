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
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff, EmailOutlined, LockOutlined } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { loginWithEmail } from '../utils/auth';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await loginWithEmail(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleLogin();
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 10, mb: 6 }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 4,
            border: '1.5px solid #e8e1d8',
            background: '#fff',
            boxShadow: '0 8px 32px rgba(18,40,74,0.08)',
          }}
        >
          {/* Brand */}
          <Typography
            align="center"
            sx={{ fontFamily: 'Manrope', fontSize: 22, fontWeight: 800, color: '#12284a', mb: 0.5 }}
          >
            FOOD,{' '}
            <span style={{ color: '#e58d9c' }}>Actually</span>
          </Typography>

          <Typography align="center" sx={{ fontSize: 13, color: '#667181', mb: 3 }}>
            Sign in to your account
          </Typography>

          <Stack spacing={2.5}>
            <TextField
              label="Email address"
              type="email"
              fullWidth
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              onKeyDown={handleKeyDown}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlined sx={{ color: '#a0a8b4', fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
            />

            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              onKeyDown={handleKeyDown}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlined sx={{ color: '#a0a8b4', fontSize: 20 }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword((v) => !v)} edge="end" size="small">
                      {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
            />

            {error && <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>}

            <Button
              variant="contained"
              fullWidth
              onClick={handleLogin}
              disabled={loading}
              sx={{
                background: '#12284a',
                color: '#fff',
                fontWeight: 700,
                fontSize: 14,
                borderRadius: 2.5,
                padding: '12px',
                textTransform: 'none',
                boxShadow: '4px 4px 0 #e58d9c',
                '&:hover': { background: '#1a3a6b' },
                '&:disabled': { background: '#a0a8b4' },
              }}
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </Button>

            <Typography align="center" sx={{ fontSize: 13, color: '#667181' }}>
              Don't have an account?{' '}
              <Link
                onClick={() => navigate('/register')}
                sx={{ cursor: 'pointer', color: '#e58d9c', fontWeight: 700, textDecoration: 'none' }}
              >
                Create one
              </Link>
            </Typography>
          </Stack>
        </Paper>
      </motion.div>
    </Container>
  );
}
