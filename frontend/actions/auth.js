import fetch from "isomorphic-fetch";
import Router from "next/router";

export const handleResponse = (response) => {
  if (response.status === 401) {
    signout(() => {
      Router.push({
        pathname: "/signin",
        query: {
          message: "Session expired. Please sign in.",
        },
      });
    });
  } else {
    return;
  }
};

export const preSignup = (user) => {
  return fetch(`${process.env.NEXT_PUBLIC_API}/pre-signup`, {
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

export const signup = (user) => {
  return fetch(`${process.env.NEXT_PUBLIC_API}/signup`, {
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

export const forgotPassword = (email) => {
  return fetch(`${process.env.NEXT_PUBLIC_API}/forgot-password`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(email),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.error(err));
};

export const resetPassword = (resetInfo) => {
  return fetch(`${process.env.NEXT_PUBLIC_API}/reset-password`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(resetInfo),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.error(err));
};

export const loginWithGoogle = (user) => {
  return fetch(`${process.env.NEXT_PUBLIC_API}/google-login`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(user),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.error(err));
};
