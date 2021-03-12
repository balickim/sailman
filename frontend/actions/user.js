import fetch from "isomorphic-fetch";
import queryString from "query-string";

export const userPublicProfile = (username) => {
  return fetch(`${process.env.NEXT_PUBLIC_API}/user/${username}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.error(err));
};

export const getProfile = (token) => {
  return fetch(`${process.env.NEXT_PUBLIC_API}/user/profile`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.error(err));
};

export const update = (token, user) => {
  return fetch(`${process.env.NEXT_PUBLIC_API}/user/update`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: user,
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.error(err));
};
