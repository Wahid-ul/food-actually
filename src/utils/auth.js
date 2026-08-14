export const registerUser = (user) => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  users.push({ ...user, points: 0, purchases: 0 });
  localStorage.setItem('users', JSON.stringify(users));
};

export const loginUser = (email, password) => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find(
    (u) => u.email === email && u.password === password
  );

  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    return true;
  }
  return false;
};

export const getCurrentUser = () =>
  JSON.parse(localStorage.getItem('currentUser'));

export const logout = () => localStorage.removeItem('currentUser');

export const updateCurrentUser = (updatedUser) => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const newUsers = users.map((u) =>
    u.email === updatedUser.email ? updatedUser : u
  );

  localStorage.setItem('users', JSON.stringify(newUsers));
  localStorage.setItem('currentUser', JSON.stringify(updatedUser));
};