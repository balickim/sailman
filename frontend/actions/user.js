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
