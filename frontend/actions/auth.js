import fetch from "isomorphic-fetch";

export const signup = (user) => {
  console.log(
    "%cauth.js line:4 process.env.API_DEV",
    "color: #007acc;",
    process.env.NEXT_PUBLIC_API_DEV
  );
  return fetch(`${process.env.NEXT_PUBLIC_API_DEV}/signup`, {
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
