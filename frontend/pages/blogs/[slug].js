import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import dayjs from "dayjs";
import parseToHTML from "html-react-parser";

import Layout from "../../components/Layout";

import { singleBlog } from "../../actions/blog";

const SingleBlog = ({ blog }) => {
  const showBlogCategories = (blog) =>
    blog.categories.map((c, i) => (
      <Link key={i} href={`/categories/${c.slug}`}>
        <a className="btn btn-primary mr-1 ml-1 mt-3 ">{c.name}</a>
      </Link>
    ));

  const showBlogTags = (blog) =>
    blog.tags.map((t, i) => (
      <Link key={i} href={`/tags/${t.slug}`}>
        <a className="btn btn-outline-primary mr-1 ml-1 mt-3 ">{t.name}</a>
      </Link>
    ));
  return (
    <>
      <Layout>
        <main>
          <article>
            <div className="container-fluid">
              <section>
                <div className="row">
                  <img
                    src={`${process.env.NEXT_PUBLIC_API}/blog/photo/${blog.slug}`}
                    alt={blog.title}
                    className="img img-fluid featured-image"
                  />
                </div>
              </section>
              <section>
                <p className="lead mt-3 mark">
                  Posted by {blog.postedBy.name} | Published{" "}
                  {dayjs(blog.updatedAt).format("D MMMM, YYYY HH:MM")}
                </p>

                <div className="pb-3">
                  {showBlogCategories(blog)}
                  {showBlogTags(blog)}
                </div>
              </section>
            </div>
            <div className="container">
              <section>
                <div className="col-md-12 lead">{parseToHTML(blog.body)}</div>
              </section>
            </div>
            <div className="container pb-5">
              <h4 className="text-center pt-5 pb-5 h2">Related blogs</h4>
              <hr />
              <p>show related blogs</p>
            </div>
            <div className="container pb-5">
              <h4 className="text-center pt-5 pb-5 h2">Comments</h4>
              <hr />
              <p>comments</p>
            </div>
          </article>
        </main>
      </Layout>
    </>
  );
};

SingleBlog.getInitialProps = ({ query }) => {
  return singleBlog(query.slug).then((data) => {
    if (data.error) {
      return console.log("ERROR " + data.error);
    } else {
      return { blog: data };
    }
  });
};

export default SingleBlog;
