import fetch from "isomorphic-fetch";
import { handleResponse } from "./auth";

export const create = (category) => {
  return fetch(`${process.env.NEXT_PUBLIC_API}/category`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(category),
  })
    .then((response) => {
      handleResponse(response);
      return response.json();
    })
    .catch((err) => console.error(err));
};

export const getCategories = () => {
  return fetch(`${process.env.NEXT_PUBLIC_API}/categories`, {
    method: "GET",
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.error(err));
};

export const singleCategory = (slug) => {
  return fetch(`${process.env.NEXT_PUBLIC_API}/category/${slug}`, {
    method: "GET",
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.error(err));
};

export const removeCategory = (slug) => {
  return fetch(`${process.env.NEXT_PUBLIC_API}/category/${slug}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    credentials: "include",
  })
    .then((response) => {
      handleResponse(response);
      return response.json();
    })
    .catch((err) => console.error(err));
};
