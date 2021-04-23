import Head from "next/head";
import Link from "next/link";
import { withRouter } from "next/router";
import { useState, useEffect } from "react";

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

  const [values, setValues] = useState({
    phrase: "",
    priceFrom: 0,
    priceTo: 0,
    dateStartFrom: "",
    dateStartTo: "",
    dateEndFrom: "",
    dateEndTo: "",
    lastMinute: false,
    tidalCruise: false,
    map: false,
  });

  const {
    phrase,
    priceFrom,
    priceTo,
    dateStartFrom,
    dateStartTo,
    dateEndFrom,
    dateEndTo,
    lastMinute,
    tidalCruise,
    map,
  } = values;

  let { t } = useTranslation("announcements");

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

  const showAllAnnouncements = () => {
    return announcements.map((announcement, i) => {
      return (
        <article key={i} className="mb-3">
          <Card announcement={announcement} />
        </article>
      );
    });
  };

  const showLoadedAnnouncements = () => {
    return loadedAnnouncements.map((announcement, i) => (
      <article key={i} className="mb-3">
        <Card announcement={announcement} />
      </article>
    ));
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

  const handleChange = (name) => (e) => {
    let value;
    const target = e.target;

    if (target.type === "checkbox") {
      value = target.checked;
    } else {
      value = target.value;
    }

    setValues({ ...values, [name]: value });
  };

  const pushParams = (e) => {
    e.preventDefault();

    router.push(`/announcements?${new URLSearchParams(values).toString()}`);
  };

  const filterForm = () => {
    return (
      <div
        className="container border ml-1"
        style={{ width: "100%", height: "auto" }}
      >
        <form onSubmit={pushParams} id="filterForm" className="mt-2">
          {/* <div className="pb-5 text-center">
            {showAllCategories()}
            <br />
            {showAllTags()}
          </div> */}
          <div className="form-group">
            <div className="row mb-3">
              <div className="col-md-12">
                <input
                  type="phrase"
                  className="form-control"
                  placeholder={t("Search phrase")}
                  onChange={handleChange("phrase")}
                />
              </div>
            </div>
            <label className="ml-2">{t("Price per person")}</label>
            <div className="row">
              <div className="col-6">
                <input
                  type="number"
                  className="form-control"
                  placeholder="from"
                  value={priceFrom}
                  min={0}
                  max={10000}
                  onChange={handleChange("priceFrom")}
                />
              </div>
              <div className="col-6">
                <input
                  type="number"
                  className="form-control"
                  placeholder="to"
                  value={priceTo}
                  min={0}
                  max={10000}
                  onChange={handleChange("priceTo")}
                />
              </div>
            </div>
          </div>
          <div className="form-group">
            <label className="ml-2">{t("Start date")}</label>
            <div className="row">
              <div className="col-6">
                <input
                  type="date"
                  className="form-control"
                  value={dateStartFrom}
                  onChange={handleChange("dateStartFrom")}
                />
              </div>
              <div className="col-6">
                <input
                  type="date"
                  className="form-control"
                  value={dateStartTo}
                  onChange={handleChange("dateStartTo")}
                />
              </div>
            </div>
          </div>
          <div className="form-group">
            <label className="ml-2">{t("End date")}</label>
            <div className="row">
              <div className="col-6">
                <input
                  type="date"
                  className="form-control"
                  value={dateEndFrom}
                  onChange={handleChange("dateEndFrom")}
                />
              </div>
              <div className="col-6">
                <input
                  type="date"
                  className="form-control"
                  value={dateEndTo}
                  onChange={handleChange("dateEndTo")}
                />
              </div>
            </div>
          </div>
          <div className="row ml-3 mb-1">
            <input
              type="checkbox"
              value={lastMinute}
              onChange={handleChange("lastMinute")}
            />
            <label htmlFor="lastMinute" className="ml-1 small">
              {t("Last Minute")}
            </label>
          </div>
          <div className="row ml-3 mb-1">
            <input
              type="checkbox"
              value={tidalCruise}
              onChange={handleChange("tidalCruise")}
            />
            <label htmlFor="lastMinute" className="ml-1 small">
              {t("Tidal cruise")}
            </label>
          </div>
          <div className="row ml-3">
            <input type="checkbox" value={map} onChange={handleChange("map")} />
            <label htmlFor="lastMinute" className="ml-1 small">
              {t("Announcement with map")}
            </label>
          </div>
          <div style={{ display: "flow-root" }} className="row">
            <div className="float-right">
              <button
                type="submit"
                className="btn btn-primary m-2"
                form="filterForm"
              >
                {t("Search")}
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  };

  return (
    <>
      {head()}
      <Layout>
        <main>
          <div className="container-fluid">
            <header>
              <div className="col-md-12 pt-3">
                <h1 className="display-4 font-weight-bold text-center mb-5">
                  {t("Announcements")}
                </h1>
              </div>
            </header>
          </div>
          <div className="row">
            <div className="col-xl-4">{filterForm()}</div>
            <div className="col-xl-8">
              <div className="container-fluid">{showAllAnnouncements()}</div>
              <div className="container-fluid">{showLoadedAnnouncements()}</div>
              <div className="text-center pt-5 pb-5">{loadMoreButton()}</div>
            </div>
          </div>
        </main>
      </Layout>
    </>
  );
};

export async function getServerSideProps(context) {
  let skip = 0;
  let limit = 1;

  return listAnnouncementsWithCategoriesAndTags(
    skip,
    limit,
    context.query
  ).then((data) => {
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
}

export default withRouter(Announcements);
