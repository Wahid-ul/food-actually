import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Modal,
  Card,
  CardContent,
  Typography,
  Button,
  Divider,
  CircularProgress,
} from '@mui/material';
import {
  Close,
  CreditCard,
  AccountBalance,
  Wallet,
  CheckCircle,
  Error,
} from '@mui/icons-material';
import { QRCodeSVG } from 'qrcode.react';

const PaymentModal = ({ open, onClose, amount = 199, userName = 'User', onPaymentSuccess }) => {
  const [step, setStep] = useState('methods'); // methods, qr, processing, success, error
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Payment methods
  const paymentMethods = [
    { id: 'upi', label: 'UPI', icon: Wallet, description: 'Google Pay, PhonePe, BHIM' },
    { id: 'card', label: 'Credit/Debit Card', icon: CreditCard, description: 'Visa, Mastercard' },
    { id: 'netbanking', label: 'Net Banking', icon: AccountBalance, description: 'All major banks' },
    { id: 'wallet', label: 'Wallet', icon: Wallet, description: 'Razorpay Wallet' },
  ];

  // Generate Order ID (simulated - in real app, this comes from backend)
  const generateOrderId = () => {
    return `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  // Handle method selection and show QR code
  const handleMethodSelect = (method) => {
    setSelectedMethod(method);
    const newOrderId = generateOrderId();
    setOrderId(newOrderId);
    setStep('qr');
  };

  // Initialize Razorpay Payment
  const handlePayment = () => {
    setStep('processing');

    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      // Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_1DP5mmOlF5G5ag', // Replace with your key
        amount: amount * 100, // Convert to paise
        currency: 'INR',
        name: 'Food, Actually',
        description: 'Paneer Salad with a Twist',
        order_id: orderId,
        prefill: {
          name: userName,
          email: 'user@example.com',
          contact: '9000000000',
        },
        notes: {
          address: 'Food ordering app',
        },
        theme: {
          color: '#e58d9c',
        },
        method: selectedMethod,
        handler: handlePaymentSuccess,
        modal: {
          ondismiss: handlePaymentCancel,
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    };
    script.onerror = () => {
      setStep('error');
      setErrorMessage('Failed to load payment gateway. Please try again.');
    };
    document.body.appendChild(script);
  };

  // Handle successful payment
  const handlePaymentSuccess = (response) => {
    console.log('Payment Success:', response);
    setStep('success');
    
    // Callback to parent component
    if (onPaymentSuccess) {
      setTimeout(() => {
        onPaymentSuccess({
          paymentId: response.razorpay_payment_id,
          orderId: orderId,
          amount: amount,
          method: selectedMethod,
        });
      }, 2000);
    }
  };

  // Handle payment cancellation
  const handlePaymentCancel = () => {
    setStep('error');
    setErrorMessage('Payment cancelled. Please try again.');
  };

  // Reset and close modal
  const handleClose = () => {
    setStep('methods');
    setSelectedMethod(null);
    setOrderId(null);
    setErrorMessage('');
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card
          sx={{
            maxWidth: 500,
            borderRadius: '28px',
            background: '#fffaf3',
            border: '1.5px solid #12284a',
            boxShadow: '7px 7px 0 #e7b5bc',
            position: 'relative',
          }}
        >
          {/* Close Button */}
          <Button
            onClick={handleClose}
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              minWidth: 'auto',
              padding: 0,
              color: '#12284a',
            }}
          >
            <Close />
          </Button>

          <CardContent sx={{ padding: '32px 24px' }}>
            {/* STEP 1: Payment Methods */}
            {step === 'methods' && (
              <Box>
                <Typography
                  sx={{
                    fontFamily: 'Manrope',
                    fontSize: '24px',
                    fontWeight: 800,
                    color: '#12284a',
                    marginBottom: '24px',
                    textAlign: 'center',
                  }}
                >
                  Select Payment Method
                </Typography>

                <Typography
                  sx={{
                    fontSize: '14px',
                    color: '#6a7280',
                    textAlign: 'center',
                    marginBottom: '24px',
                  }}
                >
                  Amount: <strong>₹{amount}</strong>
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {paymentMethods.map((method) => {
                    const IconComponent = method.icon;
                    return (
                      <motion.div
                        key={method.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          onClick={() => handleMethodSelect(method.id)}
                          sx={{
                            width: '100%',
                            padding: '16px',
                            border: '2px solid #e58d9c',
                            borderRadius: '16px',
                            background: '#fff',
                            textAlign: 'left',
                            textTransform: 'none',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              background: '#fffaf3',
                              borderColor: '#12284a',
                            },
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                            <IconComponent sx={{ color: '#e58d9c', fontSize: 28 }} />
                            <Box>
                              <Typography
                                sx={{
                                  fontSize: '15px',
                                  fontWeight: 700,
                                  color: '#12284a',
                                }}
                              >
                                {method.label}
                              </Typography>
                              <Typography
                                sx={{
                                  fontSize: '12px',
                                  color: '#6a7280',
                                }}
                              >
                                {method.description}
                              </Typography>
                            </Box>
                          </Box>
                        </Button>
                      </motion.div>
                    );
                  })}
                </Box>
              </Box>
            )}

            {/* STEP 2: QR Code Display */}
            {step === 'qr' && (
              <Box sx={{ textAlign: 'center' }}>
                <Typography
                  sx={{
                    fontFamily: 'Manrope',
                    fontSize: '24px',
                    fontWeight: 800,
                    color: '#12284a',
                    marginBottom: '16px',
                  }}
                >
                  Scan to Pay
                </Typography>

                <Typography
                  sx={{
                    fontSize: '14px',
                    color: '#6a7280',
                    marginBottom: '24px',
                  }}
                >
                  Payment Method: <strong>{selectedMethod?.toUpperCase()}</strong>
                </Typography>

                <Box
                  sx={{
                    background: '#fff',
                    padding: '24px',
                    borderRadius: '16px',
                    border: '2px solid #e58d9c',
                    marginBottom: '24px',
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <QRCodeSVG value={orderId || 'ORDER_ID'} size={200} level="H" />
                </Box>

                <Typography
                  sx={{
                    fontSize: '12px',
                    color: '#6a7280',
                    marginBottom: '24px',
                    wordBreak: 'break-all',
                  }}
                >
                  Order ID: <strong>{orderId}</strong>
                </Typography>

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    onClick={() => setStep('methods')}
                    sx={{
                      flex: 1,
                      background: '#f3f4f6',
                      color: '#12284a',
                      borderRadius: '16px',
                      fontWeight: 700,
                      textTransform: 'none',
                    }}
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handlePayment}
                    variant="contained"
                    sx={{
                      flex: 1,
                      background: '#12284a',
                      color: '#fff',
                      borderRadius: '16px',
                      fontWeight: 700,
                      textTransform: 'none',
                      '&:hover': {
                        background: '#e58d9c',
                      },
                    }}
                  >
                    Proceed to Payment
                  </Button>
                </Box>
              </Box>
            )}

            {/* STEP 3: Processing */}
            {step === 'processing' && (
              <Box sx={{ textAlign: 'center', padding: '24px 0' }}>
                <CircularProgress sx={{ color: '#e58d9c', marginBottom: '16px' }} />
                <Typography
                  sx={{
                    fontFamily: 'Manrope',
                    fontSize: '18px',
                    fontWeight: 800,
                    color: '#12284a',
                    marginTop: '16px',
                  }}
                >
                  Processing Payment...
                </Typography>
                <Typography sx={{ fontSize: '14px', color: '#6a7280', marginTop: '8px' }}>
                  Please complete the payment on the next screen
                </Typography>
              </Box>
            )}

            {/* STEP 4: Success */}
            {step === 'success' && (
              <Box sx={{ textAlign: 'center', padding: '24px 0' }}>
                <CheckCircle sx={{ fontSize: 64, color: '#6f9362', marginBottom: '16px' }} />
                <Typography
                  sx={{
                    fontFamily: 'Manrope',
                    fontSize: '24px',
                    fontWeight: 800,
                    color: '#12284a',
                    marginTop: '16px',
                  }}
                >
                  Payment Successful!
                </Typography>
                <Typography sx={{ fontSize: '14px', color: '#6a7280', marginTop: '8px', marginBottom: '24px' }}>
                  Your order has been placed successfully
                </Typography>
                <Button
                  onClick={handleClose}
                  variant="contained"
                  sx={{
                    width: '100%',
                    background: '#6f9362',
                    color: '#fff',
                    borderRadius: '16px',
                    fontWeight: 700,
                    textTransform: 'none',
                  }}
                >
                  Done
                </Button>
              </Box>
            )}

            {/* STEP 5: Error */}
            {step === 'error' && (
              <Box sx={{ textAlign: 'center', padding: '24px 0' }}>
                <Error sx={{ fontSize: 64, color: '#e74c3c', marginBottom: '16px' }} />
                <Typography
                  sx={{
                    fontFamily: 'Manrope',
                    fontSize: '24px',
                    fontWeight: 800,
                    color: '#12284a',
                    marginTop: '16px',
                  }}
                >
                  Payment Failed
                </Typography>
                <Typography sx={{ fontSize: '14px', color: '#6a7280', marginTop: '8px', marginBottom: '24px' }}>
                  {errorMessage}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    onClick={() => setStep('methods')}
                    variant="contained"
                    sx={{
                      flex: 1,
                      background: '#12284a',
                      color: '#fff',
                      borderRadius: '16px',
                      fontWeight: 700,
                      textTransform: 'none',
                    }}
                  >
                    Try Again
                  </Button>
                  <Button
                    onClick={handleClose}
                    sx={{
                      flex: 1,
                      background: '#f3f4f6',
                      color: '#12284a',
                      borderRadius: '16px',
                      fontWeight: 700,
                      textTransform: 'none',
                    }}
                  >
                    Cancel
                  </Button>
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </Modal>
  );
};

export default PaymentModal;
