import fetch from "isomorphic-fetch";

export const send = (data) => {
  return fetch(`${process.env.NEXT_PUBLIC_API}/contact`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      handleResponse(response);
      return response.json();
    })
    .catch((err) => console.error(err));
};
