/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable prefer-rest-params */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-global-assign */
import React, { createContext, useState, useContext, useEffect, ReactElement } from 'react';
import { useRouter } from 'next/router';
import Error from 'next/error';

interface AuthContextInterface {
  isAuthenticated: boolean;
  user?: { email: string; username: string; role: string };
  authenticate;
  updateUser;
  loading: boolean;
  signout;
}

const AuthContext = createContext<AuthContextInterface>({} as AuthContextInterface);

const refreshToken = () => {
  return fetch(`${process.env.NEXT_PUBLIC_AUTH_API}/refresh-token`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
};

export const AuthProvider = ({ children }): ReactElement<any, any> => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    async function loadUserFromCookies() {
      const accessToken = localStorage.getItem('accessToken');

      const originalFetch = fetch;
      // @ts-ignore
      fetch = function () {
        // @ts-ignore
        const self = this;
        // @ts-ignore
        const args = arguments;
        return originalFetch.apply(self, args).then(async function (data) {
          if (data.status === 401) {
            const response = await refreshToken();
            // if status is 401 or 400 from token api return empty response to close recursion
            if (response.status === 401 || response.status === 400) {
              localStorage.removeItem('accessToken');
              return {};
            }
            const res = await response.json();
            const accessToken = res.accessToken;

            localStorage.setItem('accessToken', accessToken);

            args[1].headers.authorization = 'Bearer ' + accessToken; // swap old fetch authorization token for new
            // @ts-ignore
            return fetch(...args); // recall old fetch
          } else {
            return data;
          }
        });
      };

      if (accessToken) {
        fetch(`${process.env.NEXT_PUBLIC_AUTH_API}/user/me`, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            authorization: 'Bearer ' + accessToken,
          },
        })
          .then(response => {
            if (!response.ok) {
              console.error(response);
            }
            return response;
          })
          .then(response => response.json())
          .then(data => {
            setUser(data);
            setLoading(false);
          })
          .catch(err => err);
      } else {
        setLoading(false);
      }
    }
    loadUserFromCookies();
  }, []);

  const authenticate = (data, next) => {
    console.log('%cAuthProvider.js line:81 data', 'color: #007acc;', data);
    localStorage.setItem('accessToken', data.accessToken);
    setUser(data.user);
    next();
  };

  const updateUser = (data, next) => {
    if (typeof window !== 'undefined') {
      if (user) {
        setUser(data);
        next();
      }
    }
  };

  const signout = async () => {
    await router.push('/');

    setUser(null);
    localStorage.removeItem('accessToken');
    return fetch(`${process.env.NEXT_PUBLIC_AUTH_API}/signout`, {
      method: 'GET',
      credentials: 'include',
    }).catch(err => console.log(err));
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        authenticate,
        updateUser,
        loading,
        signout,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): {
  isAuthenticated: boolean;
  user?: { email: string; username: string; role: string };
  authenticate;
  updateUser;
  loading: boolean;
  signout;
} {
  return useContext(AuthContext);
}

export const ProtectRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  const AllowPathsList = [
    '/',
    '/announcements',
    '/signup',
    '/signin',
    '/contact',
    '/auth/account/activate/[token]',
    '/auth/password/forgot',
    '/auth/password/reset/[token]',
    '/announcements/[slug]',
  ];

  if (loading) return <></>;

  if (!isAuthenticated && AllowPathsList.indexOf(router.pathname) === -1) {
    return <Error statusCode={403} title="Access denied" />;
  }
  return children;
};
