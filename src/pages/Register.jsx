import { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  Alert,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { registerPhoneUser, verifyPhoneOtp } from '../utils/auth';

export default function Register() {
  const [form, setForm] = useState({ name: '', phoneNumber: '' });
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    try {
      setLoading(true);
      setError('');
      await registerPhoneUser(form);
      setOtpSent(true);
      alert('OTP sent to your mobile number.');
    } catch (err) {
      setError(err.message || 'Unable to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError('');
      await verifyPhoneOtp(otp, { name: form.name });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'OTP verification failed.');
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
            label="Name"
            fullWidth
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <TextField
            label="Mobile Number"
            fullWidth
            value={form.phoneNumber}
            onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
            placeholder="+91 98765 43210"
          />

          <Button variant="outlined" onClick={handleSendOtp} disabled={loading || !form.name || !form.phoneNumber}>
            {loading ? 'Sending...' : 'Send OTP'}
          </Button>

          {otpSent && (
            <TextField
              label="OTP"
              fullWidth
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="123456"
            />
          )}

          {error && <Alert severity="error">{error}</Alert>}

          <Button variant="contained" size="large" onClick={handleSubmit} disabled={loading || !otpSent || !otp}>
            Verify & Register
          </Button>

          <Button onClick={() => navigate('/login')}>Back to login</Button>

          <div id="recaptcha-container" />
        </Stack>
      </Paper>
    </Container>
  );
}