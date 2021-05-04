import Head from "next/head";
import Link from "next/link";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { MDBSpinner } from "mdb-react-ui-kit";
import dayjs from "dayjs";
import parseToHTML from "html-react-parser";

import Layout from "@components/Layout";

import { singleAnnouncement, listRelated } from "@actions/announcement";
import SmallCard from "@components/announcement/SmallCard";

const Map = dynamic(() => import("@components/map/Map"), {
  loading: () => <MDBSpinner />,
  ssr: false,
});

const SingleAnnouncement = ({ announcement, query }) => {
  const [related, setRelated] = useState([]);

  const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN;
  const API = process.env.NEXT_PUBLIC_API;
  const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME;
  const FB_APP_ID = process.env.NEXT_PUBLIC_FB_APP_ID;

  const head = () => (
    <Head>
      <title>
        {announcement.title} | {APP_NAME}
      </title>
      <meta name="description" content={announcement.mdesc} />
      <link rel="canonical" href={`${DOMAIN}/announcements/${query.slug}`} />
      <meta
        property="og:title"
        content={`${announcement.title} | ${APP_NAME}`}
      />
      <meta property="og:description" content={announcement.mdesc} />
      <meta property="og:type" content="website" />
      <meta
        property="og:url"
        content={`${DOMAIN}/announcements/${query.slug}`}
      />
      <meta property="og:site_name" content={`${APP_NAME}`} />

      <meta
        property="og:image"
        content={`${API}/announcement/photo/${announcement.slug}`}
      />
      <meta
        property="og:image:secure_url"
        content={`${API}/announcement/photo/${announcement.slug}`}
      />
      <meta property="og:image:type" content="image/jpg" />
      <meta property="fb:app_id" content={`${FB_APP_ID}`} />
    </Head>
  );

  const loadRelated = () => {
    listRelated({ announcement }).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setRelated(data);
      }
    });
  };

  useEffect(() => {
    loadRelated();
  }, []);

  const showAnnouncementCategories = (announcement) =>
    announcement.categories.map((c, i) => (
      <Link key={i} href={`/categories/${c.slug}`}>
        <a className="btn btn-primary me-1 ms-1 mt-3 ">{c.name}</a>
      </Link>
    ));

  const showAnnouncementTags = (announcement) =>
    announcement.tags.map((t, i) => (
      <Link key={i} href={`/tags/${t.slug}`}>
        <a className="btn btn-outline-primary me-1 ms-1 mt-3 ">{t.name}</a>
      </Link>
    ));

  const showRelatedAnnouncement = () => {
    return related.map((announcement, i) => (
      <div className="col-md-4" key={i}>
        <article>
          <SmallCard announcement={announcement} />
        </article>
      </div>
    ));
  };

  return (
    <>
      {head()}
      <Layout>
        <main>
          <article>
            <div className="container">
              <h2 className="pb-3 text-center pt-3">{announcement.title}</h2>
              <section>
                {announcement.route && announcement.route.length > 0 && (
                  <div
                    className="border"
                    style={{ width: "auto", height: "400px" }}
                  >
                    <Map seedRoutes={announcement.route} />
                  </div>
                )}
                <div className="row">Od: {announcement.startDate}</div>
                <div className="row">Do: {announcement.endDate}</div>
                <div className="row">Dni: {announcement.days}</div>
                <div className="row">
                  Cena: {announcement.price + " " + announcement.currency} za
                  osobę
                </div>
                <div className="row">
                  Zawarte: {announcement.includedInPrice}
                </div>
                <div className="row">Jacht: {announcement.yacht}</div>
                <div className="row">
                  LastMinute:{" "}
                  {announcement.lastMinute === false ? "tak" : "nie"}
                </div>
                <div className="row">
                  Pływowy: {announcement.tidalCruise === false ? "tak" : "nie"}
                </div>
                <div className="col-md-12 lead mt-3 text-break">
                  {parseToHTML(announcement.body)}
                </div>
              </section>
            </div>
            <div className="container pb-5">
              <h4 className="text-center pt-5 pb-5 h2">
                Related announcements
              </h4>
              <hr />
              <div className="row">{showRelatedAnnouncement()}</div>
            </div>
            <div className="container-fluid">
              <div className="container">
                <p className="lead mt-3 mark">
                  Posted by{" "}
                  <Link href={`/profile/${announcement.postedBy.username}`}>
                    <a>{announcement.postedBy.username}</a>
                  </Link>{" "}
                  | Published{" "}
                  {dayjs(announcement.updatedAt).format("D MMMM, YYYY HH:MM")}
                </p>

                <div className="pb-3">
                  {showAnnouncementCategories(announcement)}
                  {showAnnouncementTags(announcement)}
                </div>
              </div>
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

export const getServerSideProps = async ({ query }) => {
  return singleAnnouncement(query.slug).then((data) => {
    if (data.error) {
      return console.log("ERROR " + data.error);
    } else {
      return { props: { announcement: data, query } };
    }
  });
};

export default SingleAnnouncement;
