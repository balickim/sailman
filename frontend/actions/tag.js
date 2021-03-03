import fetch from "isomorphic-fetch";

export const create = (tag, token) => {
  return fetch(`${process.env.NEXT_PUBLIC_API}/tag`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(tag),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.error(err));
};

export const getTags = () => {
  return fetch(`${process.env.NEXT_PUBLIC_API}/tags`, {
    method: "GET",
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.error(err));
};

export const singleTag = (slug) => {
  return fetch(`${process.env.NEXT_PUBLIC_API}/tag/${slug}`, {
    method: "GET",
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.error(err));
};

export const removeTag = (slug, token) => {
  return fetch(`${process.env.NEXT_PUBLIC_API}/tag/${slug}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.error(err));
};
