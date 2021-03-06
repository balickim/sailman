import Head from "next/head";
import Link from "next/link";
import { withRouter } from "next/router";
import { useState } from "react";

import Layout from "../../components/Layout";
import Card from "../../components/blog/Card";
import { listBlogsWithCategoriesAndTags } from "../../actions/blog";

const Blogs = ({
  blogs,
  categories,
  tags,
  totalBlogs,
  blogsLimit,
  blogsSkip,
  router,
}) => {
  const [limit, setLimit] = useState(blogsLimit);
  const [skip, setSkip] = useState(0);
  const [size, setSize] = useState(totalBlogs);
  const [loadedBlogs, setLoadedBlogs] = useState([]);

  const loadMore = () => {
    let toSkip = skip + limit;
    listBlogsWithCategoriesAndTags(toSkip, limit).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setLoadedBlogs([...loadedBlogs, ...data.blogs]);
        setSize(data.size);
        setSkip(toSkip);
      }
    });
  };

  const loadMoreButton = () => {
    return (
      size > 0 &&
      size >= limit && (
        <button onClick={loadMore} className="btn btn-outline-primary btn-lg">
          Load more
        </button>
      )
    );
  };

  const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN;
  const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME;
  const FB_APP_ID = process.env.NEXT_PUBLIC_FB_APP_ID;

  const head = () => (
    <Head>
      <title>Boat renting | {DOMAIN}</title>
      <meta name="description" content="Boat renting announcements" />
      <link rel="canonical" href={`${DOMAIN}${router.pathname}`} />
      <meta
        property="og:title"
        content={`Latest Boat renting announcements | ${APP_NAME}`}
      />
      <meta property="og:description" content="Boat renting announcements" />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`${DOMAIN}${router.pathname}`} />
      <meta property="og:site_name" content={`${APP_NAME}`} />

      <meta
        property="og:image"
        content={`${DOMAIN}/images/sailman-wynajem.jpg`}
      />
      <meta
        property="og:image:secure_url"
        content={`${DOMAIN}/images/sailman-wynajem.jpg`}
      />
      <meta property="og:image:type" content="image/jpg" />
      <meta property="fb:app_id" content={`${FB_APP_ID}`} />
    </Head>
  );

  const showAllBlogs = () => {
    return blogs.map((blog, i) => {
      return (
        <article key={i}>
          <Card blog={blog} />
          <hr />
        </article>
      );
    });
  };

  const showAllCategories = () => {
    if (categories) {
      return categories.map((c, i) => (
        <Link href={`/categories/${c.slug}`} key={i}>
          <a className="btn btn-primary mr-1 ml-1 mt-3">{c.name}</a>
        </Link>
      ));
    }
  };

  const showAllTags = () => {
    return tags.map((t, i) => (
      <Link href={`/tags/${t.slug}`} key={i}>
        <a className="btn btn-outline-primary mr-1 ml-1 mt-3">{t.name}</a>
      </Link>
    ));
  };

  const showLoadedBlogs = () => {
    return loadedBlogs.map((blog, i) => (
      <article key={i}>
        <Card blog={blog} />
      </article>
    ));
  };

  return (
    <>
      {head()}
      <Layout>
        <main>
          <div className="container-fluid">
            <header>
              <div className="col-md-12 pt-3">
                <h1 className="display-4 font-weight-bold text-center">
                  Blogs
                </h1>
              </div>
              <section>
                <div className="pb-5 text-center">
                  {showAllCategories()}
                  <br />
                  {showAllTags()}
                </div>
              </section>
            </header>
          </div>
          <div className="container-fluid">{showAllBlogs()}</div>
          <div className="container-fluid">{showLoadedBlogs()}</div>
          <div className="text-center pt-5 pb-5">{loadMoreButton()}</div>
        </main>
      </Layout>
    </>
  );
};

Blogs.getInitialProps = () => {
  let skip = 0;
  let limit = 2;
  return listBlogsWithCategoriesAndTags(skip, limit).then((data) => {
    if (data.error) {
      console.log(data.error);
    } else {
      return {
        blogs: data.blogs,
        categories: data.categories,
        tags: data.tags,
        totalBlogs: data.size,
        blogsLimit: limit,
        blogsSkip: skip,
      };
    }
  });
};

export default withRouter(Blogs);
