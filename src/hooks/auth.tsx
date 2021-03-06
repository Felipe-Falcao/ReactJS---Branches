import React, { createContext, useCallback, useContext, useState } from 'react';
import signInMockApi from '../services/signIn'
import api from '../services/api';

interface User {
  id: string;
  name: string;
  avatar_url: string;
  email: string;
}

interface AuthState {
  token: string;
  user: User;
}

interface SignInCredentials {
  idUser: string;
  password: string;
}

interface AuthContextData {
  user: User;
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void;
  updateUser(user: User): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>(() => {
    const token = localStorage.getItem('@AdminCabelex:token');
    const user = localStorage.getItem('@AdminCabelex:user');

    if (token && user) {
      api.defaults.headers.authorization = `Bearer ${token}`;

      return { token, user: JSON.parse(user) };
    }

    return {} as AuthState;
  });

  const signIn = useCallback(async ({ idUser, password }) => {
    const response = await signInMockApi({
      idUser,
      password,
    });

    const { token, user } = response.data;

    localStorage.setItem('@AdminCabelex:token', token);
    localStorage.setItem('@AdminCabelex:user', JSON.stringify(user));

    api.defaults.headers.authorization = `Bearer ${token}`;

    setData({ token, user });
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem('@AdminCabelex:token');
    localStorage.removeItem('@AdminCabelex:user');

    setData({} as AuthState);
  }, []);

  const updateUser = useCallback(
    (user: User) => {
      localStorage.setItem('@AdminCabelex:user', JSON.stringify(user));

      setData({
        token: data.token,
        user,
      });
    },
    [setData, data.token],
  );

  return (
    <AuthContext.Provider
      value={{ user: data.user, signIn, signOut, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  return context;
}

export { AuthProvider, useAuth };
