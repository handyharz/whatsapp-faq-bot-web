/**
 * Client-side authentication utilities
 */

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:3001';

export interface User {
  clientId?: string;
  adminId?: string;
  email: string;
  role: 'client' | 'admin';
  businessName?: string;
}

/**
 * Login as client
 */
export async function loginClient(email: string, password: string): Promise<{ user: User; accessToken: string; refreshToken: string }> {
  const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Include cookies
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Login failed');
  }

  const data = await response.json();
  return data;
}

/**
 * Login as admin
 */
export async function loginAdmin(email: string, password: string): Promise<{ user: User; accessToken: string; refreshToken: string }> {
  const response = await fetch(`${BACKEND_URL}/api/auth/admin/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Include cookies
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Login failed');
  }

  const data = await response.json();
  return data;
}

/**
 * Logout
 */
export async function logout(): Promise<void> {
  await fetch(`${BACKEND_URL}/api/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });
}

/**
 * Get current user
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/auth/me`, {
      credentials: 'include',
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.user;
  } catch (error) {
    return null;
  }
}

/**
 * Refresh access token
 */
export async function refreshToken(): Promise<string> {
  const response = await fetch(`${BACKEND_URL}/api/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Token refresh failed');
  }

  const data = await response.json();
  return data.accessToken;
}
