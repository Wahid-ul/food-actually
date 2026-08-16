import { RecaptchaVerifier, signInWithPhoneNumber, signOut } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';

export const normalizePhoneNumber = (phoneNumber) => {
  const digits = (phoneNumber || '').replace(/\D/g, '');

  if (!digits) {
    return '';
  }

  if (digits.startsWith('0')) {
    return `+91${digits.substring(1)}`;
  }

  if (digits.startsWith('91')) {
    return `+${digits}`;
  }

  return `+${digits}`;
};

export const setCurrentUser = (user) => {
  const currentUser = {
    uid: user.uid,
    name: user.name || user.phoneNumber || 'User',
    phoneNumber: user.phoneNumber,
  };

  localStorage.setItem('currentUser', JSON.stringify(currentUser));
  localStorage.setItem('userName', currentUser.name);

  return currentUser;
};

export const getCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem('currentUser'));
  } catch (error) {
    return null;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.warn('Sign-out fallback:', error);
  }

  localStorage.removeItem('currentUser');
  localStorage.removeItem('userName');

  if (window.recaptchaVerifier) {
    window.recaptchaVerifier.clear();
    window.recaptchaVerifier = null;
  }

  if (window.confirmationResult) {
    window.confirmationResult = null;
  }
};

export const sendPhoneOtp = async (phoneNumber) => {
  const normalizedPhone = normalizePhoneNumber(phoneNumber);

  if (!normalizedPhone) {
    throw new Error('Please enter a valid mobile number.');
  }

  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: 'invisible',
      callback: () => {},
      'expired-callback': () => {},
    });
  }

  const confirmation = await signInWithPhoneNumber(
    auth,
    normalizedPhone,
    window.recaptchaVerifier
  );

  window.confirmationResult = confirmation;

  return normalizedPhone;
};

export const verifyPhoneOtp = async (otp, profile = {}) => {
  if (!window.confirmationResult) {
    throw new Error('Please request an OTP before verifying.');
  }

  const result = await window.confirmationResult.confirm(otp);
  const user = result.user;
  const currentUser = setCurrentUser({
    uid: user.uid,
    name: profile.name || 'User',
    phoneNumber: user.phoneNumber,
  });

  await setDoc(
    doc(db, 'users', user.uid),
    {
      uid: user.uid,
      name: currentUser.name,
      phoneNumber: currentUser.phoneNumber,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );

  return currentUser;
};

export const registerPhoneUser = async ({ name, phoneNumber }) => {
  const trimmedName = (name || '').trim();

  if (!trimmedName) {
    throw new Error('Please enter your name.');
  }

  const normalizedPhone = normalizePhoneNumber(phoneNumber);

  if (!normalizedPhone) {
    throw new Error('Please enter your mobile number.');
  }

  await sendPhoneOtp(normalizedPhone);
  return { name: trimmedName, phoneNumber: normalizedPhone };
};