const USERS_KEY = 'iceberg_users';
const SESSION_KEY = 'iceberg_session';

const DEFAULT_USER = {
  id: 1,
  name: 'Admin User',
  email: 'admin@iceberg.io',
  company: 'Iceberg Marketing',
  password: 'admin123',
};

export function ensureAuthSeed() {
  const existing = loadUsers();
  if (existing.length === 0) {
    localStorage.setItem(USERS_KEY, JSON.stringify([DEFAULT_USER]));
  }
}

export function loadUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  } catch {
    return [];
  }
}

export function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function loadSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
  } catch {
    return null;
  }
}

export function saveSession(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export function sanitizeUser(user) {
  if (!user) return null;
  const { password, ...safeUser } = user;
  return safeUser;
}

export function authenticateUser(email, password) {
  const users = loadUsers();
  const found = users.find((user) => user.email.toLowerCase() === email.toLowerCase() && user.password === password);
  return sanitizeUser(found);
}

export function registerUser({ name, email, company, password }) {
  const users = loadUsers();
  const exists = users.some((user) => user.email.toLowerCase() === email.toLowerCase());
  if (exists) {
    return { error: 'An account with this email already exists.' };
  }

  const newUser = {
    id: Date.now(),
    name,
    email,
    company,
    password,
  };

  const nextUsers = [...users, newUser];
  saveUsers(nextUsers);
  return { user: sanitizeUser(newUser) };
}
