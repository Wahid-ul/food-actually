import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';

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
    console.warn('Sign-out error:', error);
  }

  localStorage.removeItem('currentUser');
  localStorage.removeItem('userName');
};

export const loginWithEmail = async (email, password) => {
  if (!email || !password) {
    throw new Error('Email and password are required.');
  }

  const result = await signInWithEmailAndPassword(auth, email, password);
  const user = result.user;
  const currentUser = setCurrentUser({
    uid: user.uid,
    name: user.displayName || 'User',
    email: user.email,
  });

  return currentUser;
};

export const registerWithEmail = async ({ name, email, password }) => {
  const trimmedName = (name || '').trim();

  if (!trimmedName) {
    throw new Error('Please enter your name.');
  }

  if (!email) {
    throw new Error('Please enter your email.');
  }

  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters.');
  }

  const result = await createUserWithEmailAndPassword(auth, email, password);
  const user = result.user;
  const currentUser = setCurrentUser({
    uid: user.uid,
    name: trimmedName,
    email: user.email,
  });

  await setDoc(
    doc(db, 'users', user.uid),
    {
      uid: user.uid,
      name: trimmedName,
      email: user.email,
      createdAt: serverTimestamp(),
    },
    { merge: true }
  );

  return currentUser;
};