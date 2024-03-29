export const send = data => {
  return fetch(`${process.env.NEXT_PUBLIC_API}/contact`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.error(err));
};

export const sendFeedback = data => {
  return fetch(`${process.env.NEXT_PUBLIC_API}/feedback`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      authorization: 'Bearer ' + localStorage.getItem('accessToken'),
    },
    body: JSON.stringify(data),
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.error(err));
};
