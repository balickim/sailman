import Head from "next/head";
import Link from "next/link";
import { withRouter } from "next/router";
import { useState } from "react";

import Layout from "../../components/Layout";
import Card from "../../components/announcement/Card";
import { listAnnouncementsWithCategoriesAndTags } from "../../actions/announcement";
import useTranslation from "next-translate/useTranslation";
import Search from "../../components/announcement/Search";

const Announcements = ({
  announcements,
  categories,
  tags,
  totalAnnouncements,
  announcementsLimit,
  announcementsSkip,
  router,
}) => {
  const [limit, setLimit] = useState(announcementsLimit);
  const [skip, setSkip] = useState(0);
  const [size, setSize] = useState(totalAnnouncements);
  const [loadedAnnouncements, setLoadedAnnouncements] = useState([]);

  let { t } = useTranslation("announcements");

  const loadMore = () => {
    let toSkip = skip + limit;
    listAnnouncementsWithCategoriesAndTags(toSkip, limit).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setLoadedAnnouncements([...loadedAnnouncements, ...data.announcements]);
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

  const showAllAnnouncements = () => {
    return announcements.map((announcement, i) => {
      return (
        <article key={i}>
          <Card announcement={announcement} />
          <hr />
        </article>
      );
    });
  };

  const showAllCategories = () => {
    return categories.map((c, i) => (
      <Link href={`/categories/${c.slug}`} key={i}>
        <a className="btn btn-primary mr-1 ml-1 mt-3">{c.name}</a>
      </Link>
    ));
  };

  const showAllTags = () => {
    return tags.map((t, i) => (
      <Link href={`/tags/${t.slug}`} key={i}>
        <a className="btn btn-outline-primary mr-1 ml-1 mt-3">{t.name}</a>
      </Link>
    ));
  };

  const showLoadedAnnouncements = () => {
    return loadedAnnouncements.map((announcement, i) => (
      <article key={i}>
        <Card announcement={announcement} />
      </article>
    ));
  };

  return (
    <>
      {head()}
      <Layout>
        <main>
          <Search />
          <div className="container-fluid">
            <header>
              <div className="col-md-12 pt-3">
                <h1 className="display-4 font-weight-bold text-center">
                  {t("Announcements")}
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
          <div className="container-fluid">{showAllAnnouncements()}</div>
          <div className="container-fluid">{showLoadedAnnouncements()}</div>
          <div className="text-center pt-5 pb-5">{loadMoreButton()}</div>
        </main>
      </Layout>
    </>
  );
};

export const getServerSideProps = async () => {
  let skip = 0;
  let limit = 2;
  return listAnnouncementsWithCategoriesAndTags(skip, limit).then((data) => {
    if (data.error) {
      console.log(data.error);
    } else {
      return {
        props: {
          announcements: data.announcements,
          categories: data.categories,
          tags: data.tags,
          totalAnnouncements: data.size,
          announcementsLimit: limit,
          announcementsSkip: skip,
        },
      };
    }
  });
};

export default withRouter(Announcements);
