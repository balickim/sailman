import fetch from "isomorphic-fetch";

export const create = (blog, token) => {
  return fetch(`${process.env.NEXT_PUBLIC_API}/blog`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: blog,
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.error(err));
};

export const listBlogsWithCategoriesAndTags = () => {
  return fetch(`${process.env.NEXT_PUBLIC_API}/blogs-categories-tags`, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.error(err));
};
