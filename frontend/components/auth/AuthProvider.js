import React, { createContext, useState, useContext, useEffect } from "react";

import { useRouter } from "next/router";

const AuthContext = createContext({});

const refreshToken = () => {
  return fetch(`${process.env.NEXT_PUBLIC_API}/refresh-token`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    async function loadUserFromCookies() {
      let accessToken = localStorage.getItem("accessToken");

      const originalFetch = fetch;
      fetch = function () {
        let self = this;
        let args = arguments;
        return originalFetch.apply(self, args).then(async function (data) {
          if (data.status === 401) {
            let response = await refreshToken();
            // if status is 401 from token api return empty response to close recursion
            if (response.status === 401) {
              return {};
            }
            let res = await response.json();
            let accessToken = res.accessToken;

            localStorage.setItem("accessToken", accessToken);
            console.log("Access token refreshed!");

            args[1].headers.authorization = "Bearer " + accessToken; // swap old fetch authorization token for new
            return fetch(...args); // recall old fetch
          } else {
            return data;
          }
        });
      };

      if (accessToken) {
        fetch(`${process.env.NEXT_PUBLIC_API}/user/me`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            authorization: "Bearer " + accessToken,
          },
        })
          .then((response) => {
            if (!response.ok) {
              throw Error(response.statusText);
            }
            return response;
          })
          .then((response) => response.json())
          .then((data) => {
            setUser(data);
          })
          .catch((err) => err);
      }

      setLoading(false);
    }
    loadUserFromCookies();
  }, []);

  const authenticate = (data, next) => {
    localStorage.setItem("accessToken", data.accessToken);
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

  const signout = () => {
    setUser(null);
    localStorage.removeItem("accessToken");
    router.push("/");

    return fetch(`${process.env.NEXT_PUBLIC_API}/signout`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => {
        console.log("signout success");
      })
      .catch((err) => console.log(err));
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export const ProtectRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  const AllowPathsList = [
    "/",
    "/announcements",
    "/signup",
    "/signin",
    "/contact",
    "/auth/account/activate/[token]",
    "/auth/password/forgot",
    "/auth/password/reset/[token]",
    "/announcements/[slug]",
  ];

  if (
    loading ||
    (!isAuthenticated && AllowPathsList.indexOf(router.pathname) === -1)
  ) {
    return <p>Access denied</p>;
  }
  return children;
};
