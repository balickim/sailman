export const create = tag => {
  return fetch(`${process.env.NEXT_PUBLIC_AUTH_API}/tag`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      authorization: 'Bearer ' + localStorage.getItem('accessToken'),
    },
    body: JSON.stringify(tag),
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.error(err));
};

export const getTags = () => {
  return fetch(`${process.env.NEXT_PUBLIC_AUTH_API}/tags`, {
    method: 'GET',
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.error(err));
};

export const singleTag = slug => {
  return fetch(`${process.env.NEXT_PUBLIC_AUTH_API}/tag/${slug}`, {
    method: 'GET',
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.error(err));
};

export const removeTag = slug => {
  return fetch(`${process.env.NEXT_PUBLIC_AUTH_API}/tag/${slug}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      authorization: 'Bearer ' + localStorage.getItem('accessToken'),
    },
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.error(err));
};
