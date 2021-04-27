import queryString from "query-string";

export const create = (announcement) => {
  return fetch(`${process.env.NEXT_PUBLIC_API}/announcement`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      authorization: "Bearer " + localStorage.getItem("accessToken"),
    },
    body: announcement,
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.error(err));
};

export const listAnnouncementsWithCategoriesAndTags = (skip, limit) => {
  const data = {
    limit,
    skip,
  };

  return fetch(`${process.env.NEXT_PUBLIC_API}/announcements-categories-tags`, {
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

export const singleAnnouncement = (slug) => {
  return fetch(`${process.env.NEXT_PUBLIC_API}/announcement/${slug}`, {
    method: "GET",
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const listRelated = (announcement) => {
  return fetch(`${process.env.NEXT_PUBLIC_API}/announcements/related`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(announcement),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const list = (username) => {
  let listAnnouncementEndpoint;

  if (username) {
    listAnnouncementEndpoint = `${process.env.NEXT_PUBLIC_API}/${username}/announcements`;
  } else {
    listAnnouncementEndpoint = `${process.env.NEXT_PUBLIC_API}/announcements`;
  }

  return fetch(`${listAnnouncementEndpoint}`, {
    method: "GET",
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const remove = (slug, user) => {
  let removeAnnouncementEndpoint;

  if ((user && user.role === "admin") || user.role === "moderator") {
    removeAnnouncementEndpoint = `${process.env.NEXT_PUBLIC_API}/announcement/${slug}`;
  } else if (user && user.role === "user") {
    removeAnnouncementEndpoint = `${process.env.NEXT_PUBLIC_API}/user/announcement/${slug}`;
  }

  return fetch(`${removeAnnouncementEndpoint}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      authorization: "Bearer " + localStorage.getItem("accessToken"),
    },
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.error(err));
};

export const update = (announcement, slug, user) => {
  let updateAnnouncementEndpoint;

  if ((user && user.role === "admin") || user.role === "moderator") {
    updateAnnouncementEndpoint = `${process.env.NEXT_PUBLIC_API}/announcement/${slug}`;
  } else if (user && user.role === "user") {
    updateAnnouncementEndpoint = `${process.env.NEXT_PUBLIC_API}/user/announcement/${slug}`;
  }

  return fetch(`${updateAnnouncementEndpoint}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      authorization: "Bearer " + localStorage.getItem("accessToken"),
    },
    body: announcement,
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.error(err));
};

export const listSearch = (params) => {
  let query = queryString.stringify(params);

  return fetch(`${process.env.NEXT_PUBLIC_API}/announcements/search?${query}`, {
    method: "GET",
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};
