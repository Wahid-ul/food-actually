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
import { sendPhoneOtp, verifyPhoneOtp } from '../utils/auth';

export default function Login() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    try {
      setLoading(true);
      setError('');
      await sendPhoneOtp(phoneNumber);
      setOtpSent(true);
      alert('OTP sent to your mobile number.');
    } catch (err) {
      setError(err.message || 'Unable to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      await verifyPhoneOtp(otp);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
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
          <TextField
            label="Mobile Number"
            fullWidth
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="+91 98765 43210"
          />

          <Button variant="outlined" onClick={handleSendOtp} disabled={loading || !phoneNumber}>
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

          <Button variant="contained" size="large" onClick={handleLogin} disabled={loading || !otpSent || !otp}>
            Verify & Login
          </Button>

          <Button onClick={() => navigate('/register')}>
            Create new account
          </Button>

          <div id="recaptcha-container" />
        </Stack>
      </Paper>
    </Container>
  );
}