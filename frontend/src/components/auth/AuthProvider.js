import React, { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import Error from 'next/error';

const AuthContext = createContext({});

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

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    async function loadUserFromCookies() {
      let accessToken = localStorage.getItem('accessToken');

      const originalFetch = fetch;
      fetch = function () {
        let self = this;
        let args = arguments;
        return originalFetch.apply(self, args).then(async function (data) {
          if (data.status === 401) {
            let response = await refreshToken();
            // if status is 401 or 400 from token api return empty response to close recursion
            if (response.status === 401 || response.status === 400) {
              localStorage.removeItem('accessToken');
              return {};
            }
            let res = await response.json();
            let accessToken = res.accessToken;

            localStorage.setItem('accessToken', accessToken);

            args[1].headers.authorization = 'Bearer ' + accessToken; // swap old fetch authorization token for new
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
              throw Error(response.statusText);
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
    if (process.browser) {
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

export const useAuth = () => useContext(AuthContext);

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
