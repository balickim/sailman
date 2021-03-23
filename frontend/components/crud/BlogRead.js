import Link from "next/link";
import { useState, useEffect } from "react";
import dayjs from "dayjs";

import { list, remove } from "../../actions/blog";

import { useAuth } from "../../actions/AuthProvider";

const BlogRead = ({ username }) => {
  const [blogs, setBlogs] = useState([]);
  const [message, setMessage] = useState("");

  const { user } = useAuth();

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = () => {
    list(username).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setBlogs(data);
      }
    });
  };

  const deleteBlog = (slug) => {
    remove(slug, user).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setMessage(data.message);
        loadBlogs();
      }
    });
  };

  const deleteConfirm = (slug) => {
    let answer = window.confirm("Are you sure you want to delete this?");
    if (answer) {
      deleteBlog(slug);
    }
  };

  const showUpdateButton = (blog) => {
    if (user && user.role === "user") {
      return (
        <Link href={`/user/crud/${blog.slug}`}>
          <a className="btn btn-sm btn-warning">Update</a>
        </Link>
      );
    } else if ((user && user.role === "admin") || user.role === "moderator") {
      return (
        <Link href={`/admin/crud/${blog.slug}`}>
          <a className="ml-2 btn btn-sm btn-warning">Update</a>
        </Link>
      );
    }
  };

  const showAllBlogs = () => {
    return blogs.map((blog, i) => {
      return (
        <div key={i} className="pb-5">
          <h3>
            <Link href={`/blogs/${blog.slug}`}>
              <a>
                <h2 className="pt-3 pb-3 font-weight-bold">{blog.title}</h2>
              </a>
            </Link>
          </h3>
          <p className="mark">
            Written by {blog.postedBy.name} | Published{" "}
            {dayjs(blog.updatedAt).format("D MMMM, YYYY HH:MM")}
          </p>
          <button
            className="btn btn-sm btn-danger"
            onClick={() => deleteConfirm(blog.slug)}
          >
            Delete
          </button>
          {showUpdateButton(blog)}
        </div>
      );
    });
  };

  return (
    <>
      <div className="row">
        <div className="col-md-12">
          {message && <div className="alert alert-warning">{message}</div>}
          {showAllBlogs()}
        </div>
      </div>
    </>
  );
};

export default BlogRead;
