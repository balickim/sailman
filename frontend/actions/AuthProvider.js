import React, { createContext, useState, useContext, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    async function loadUserFromCookies() {
      const token = Cookies.get("token");
      if (token) {
        fetch(`${process.env.NEXT_PUBLIC_API}/user/profile`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            setUser(data);
          })
          .catch((err) => console.error(err));
      }
      setLoading(false);
    }
    loadUserFromCookies();
  }, []);

  const signin = (user) => {
    console.log("%cAuthProvider.js line:36 user", "color: #007acc;", user);
    return fetch(`${process.env.NEXT_PUBLIC_API}/signin`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .then((response) => {
        return response.json();
      })
      .catch((err) => console.error(err));
  };

  const authenticate = (data, next) => {
    Cookies.set("token", data.token, { expires: 1 });
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
    Cookies.remove("token");
    setUser(null);
    router.push("/");

    return fetch(`${process.env.NEXT_PUBLIC_API}/signout`, {
      method: "GET",
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
        signin,
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
    "/blogs",
    "/signup",
    "/signin",
    "/contact",
    "/auth/account/activate/[token]",
    "/auth/password/forgot",
    "/auth/password/reset/[token]",
  ];

  if (
    loading ||
    (!isAuthenticated && AllowPathsList.indexOf(router.pathname) === -1)
  ) {
    return <p>Access denied</p>;
  }
  return children;
};
