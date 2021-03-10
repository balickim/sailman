import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import dayjs from "dayjs";
import parseToHTML from "html-react-parser";

import Layout from "../../components/Layout";

import { singleBlog } from "../../actions/blog";

const SingleBlog = ({ blog, query }) => {
  const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN;
  const API = process.env.NEXT_PUBLIC_API;
  const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME;
  const FB_APP_ID = process.env.NEXT_PUBLIC_FB_APP_ID;

  const head = () => (
    <Head>
      <title>
        {blog.title} | {APP_NAME}
      </title>
      <meta name="description" content={blog.mdesc} />
      <link rel="canonical" href={`${DOMAIN}/blogs/${query.slug}`} />
      <meta property="og:title" content={`${blog.title} | ${APP_NAME}`} />
      <meta property="og:description" content={blog.mdesc} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`${DOMAIN}/blogs/${query.slug}`} />
      <meta property="og:site_name" content={`${APP_NAME}`} />

      <meta property="og:image" content={`${API}/blog/photo/${blog.slug}`} />
      <meta
        property="og:image:secure_url"
        content={`${API}/blog/photo/${blog.slug}`}
      />
      <meta property="og:image:type" content="image/jpg" />
      <meta property="fb:app_id" content={`${FB_APP_ID}`} />
    </Head>
  );

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
      {head()}
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
                <div className="container">
                  <h1 className="display-2 pb-3 text-center pt-3 font-weight-bold">
                    {blog.title}
                  </h1>
                  <p className="lead mt-3 mark">
                    Posted by {blog.postedBy.name} | Published{" "}
                    {dayjs(blog.updatedAt).format("D MMMM, YYYY HH:MM")}
                  </p>

                  <div className="pb-3">
                    {showBlogCategories(blog)}
                    {showBlogTags(blog)}
                  </div>
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
      return { blog: data, query };
    }
  });
};

export default SingleBlog;
