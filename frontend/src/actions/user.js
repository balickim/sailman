export const userPublicProfile = username => {
  return fetch(`${process.env.NEXT_PUBLIC_API}/user/${username}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.error(err));
};

export const getProfile = () => {
  return fetch(`${process.env.NEXT_PUBLIC_API}/user/profile`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      authorization: 'Bearer ' + localStorage.getItem('accessToken'),
    },
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.error(err));
};

export const update = user => {
  return fetch(`${process.env.NEXT_PUBLIC_API}/user/update`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      authorization: 'Bearer ' + localStorage.getItem('accessToken'),
    },
    body: user,
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.error(err));
};
