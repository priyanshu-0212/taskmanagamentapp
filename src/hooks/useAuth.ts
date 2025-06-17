import { useState, useEffect } from 'react';
import { User, AuthState } from '../types';
import { getAuthState, setAuthState, clearAuthState, generateMockJWT } from '../utils/auth';
import { mockUsers } from '../utils/mockData';

export const useAuth = () => {
  const [authState, setAuthStateLocal] = useState<AuthState>(getAuthState);

  useEffect(() => {
    const state = getAuthState();
    setAuthStateLocal(state);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication - in real app, this would be an API call
    const user = mockUsers.find(u => u.email === email);
    
    if (user && password === 'password') {
      const token = generateMockJWT(user);
      setAuthState(user, token);
      setAuthStateLocal({
        user,
        token,
        isAuthenticated: true,
      });
      return true;
    }
    
    return false;
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    // Mock registration - in real app, this would be an API call
    const existingUser = mockUsers.find(u => u.email === email);
    
    if (existingUser) {
      return false; // User already exists
    }

    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      role: 'member',
      createdAt: new Date(),
    };

    mockUsers.push(newUser);
    const token = generateMockJWT(newUser);
    setAuthState(newUser, token);
    setAuthStateLocal({
      user: newUser,
      token,
      isAuthenticated: true,
    });
    
    return true;
  };

  const logout = () => {
    clearAuthState();
    setAuthStateLocal({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  };

  return {
    ...authState,
    login,
    register,
    logout,
  };
};