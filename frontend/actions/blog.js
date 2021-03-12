import fetch from "isomorphic-fetch";
import queryString from "query-string";
import { isAuth } from "./auth";

export const create = (blog, token) => {
  let createBlogEndpoint;

  if (isAuth() && isAuth().role === 1) {
    createBlogEndpoint = `${process.env.NEXT_PUBLIC_API}/blog`;
  } else if (isAuth() && isAuth().role === 0) {
    createBlogEndpoint = `${process.env.NEXT_PUBLIC_API}/user/blog`;
  }

  return fetch(`${createBlogEndpoint}`, {
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

export const listBlogsWithCategoriesAndTags = (skip, limit) => {
  const data = {
    limit,
    skip,
  };

  return fetch(`${process.env.NEXT_PUBLIC_API}/blogs-categories-tags`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.error(err));
};

export const singleBlog = (slug) => {
  return fetch(`${process.env.NEXT_PUBLIC_API}/blog/${slug}`, {
    method: "GET",
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const listRelated = (blog) => {
  return fetch(`${process.env.NEXT_PUBLIC_API}/blogs/related`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(blog),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const list = (username) => {
  let listBlogEndpoint;

  if (username) {
    listBlogEndpoint = `${process.env.NEXT_PUBLIC_API}/${username}/blogs`;
  } else {
    listBlogEndpoint = `${process.env.NEXT_PUBLIC_API}/blogs`;
  }

  return fetch(`${listBlogEndpoint}`, {
    method: "GET",
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const remove = (slug, token) => {
  let removeBlogEndpoint;

  if (isAuth() && isAuth().role === 1) {
    removeBlogEndpoint = `${process.env.NEXT_PUBLIC_API}/blog/${slug}`;
  } else if (isAuth() && isAuth().role === 0) {
    removeBlogEndpoint = `${process.env.NEXT_PUBLIC_API}/user/blog/${slug}`;
  }

  return fetch(`${removeBlogEndpoint}`, {
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

export const update = (blog, token, slug) => {
  let updateBlogEndpoint;

  if (isAuth() && isAuth().role === 1) {
    updateBlogEndpoint = `${process.env.NEXT_PUBLIC_API}/blog/${slug}`;
  } else if (isAuth() && isAuth().role === 0) {
    updateBlogEndpoint = `${process.env.NEXT_PUBLIC_API}/user/blog/${slug}`;
  }

  return fetch(`${updateBlogEndpoint}`, {
    method: "PUT",
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

export const listSearch = (params) => {
  console.log("search params ", params);
  let query = queryString.stringify(params);
  console.log("search query ", query);

  return fetch(`${process.env.NEXT_PUBLIC_API}/blogs/search?${query}`, {
    method: "GET",
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};
