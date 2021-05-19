import Head from "next/head";
import Link from "next/link";
import dayjs from "dayjs";

import { userPublicProfile } from "@actions/user";
import Layout from "@components/Layout";

const UserProfile = ({ user, announcements, query }) => {
  const showUserAnnouncements = () => {
    return announcements.map((announcement, i) => {
      return (
        <div className="mt-4 mb-4" key={i}>
          <Link href={`/announcements/${announcement.slug}`}>
            <a className="lead">{announcement.title}</a>
          </Link>
        </div>
      );
    });
  };

  const DOMAIN = process.env.NEXT_PUBLIC_SEO_DOMAIN;
  const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME;
  const FB_APP_ID = process.env.NEXT_PUBLIC_FB_APP_ID;

  const head = () => (
    <Head>
      <title>
        {user.name} | {APP_NAME}
      </title>
      <meta name="description" content={`Profile of ${user.username}`} />
      <link rel="canonical" href={`${DOMAIN}/profile/${query.username}`} />
      <meta property="og:title" content={`${user.username} | ${APP_NAME}`} />
      <meta property="og:description" content={`Profile of ${user.username}`} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`${DOMAIN}/profile/${query.username}`} />
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

  return (
    <>
      {head()}
      <Layout footer={false}>
        <div className="container pb-5">
          <div className="row">
            <div className="col-md-12">
              <div className="card">
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-8">
                      <h5>{user.name}</h5>
                    </div>
                    <div className="col-md-4">
                      {user.username &&
                      user.username !== "" &&
                      Boolean(user.username) !== false ? (
                        <img
                          src={`${process.env.NEXT_PUBLIC_API}/user/photo/${user.username}`}
                          alt="user profile"
                          style={{ maxHeight: "auto", maxWidth: "100%" }}
                          className="img img-fluid img-thumbnail mb-3"
                        />
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                  <p className="text-muted">
                    Joined {dayjs(user.createdAt).format("D MMMM, YYYY HH:MM")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container pb-5">
          <div className="row">
            <div className="col-md-6">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title bg-primary pt-4 pb-4 pl-4 pr-4 text-light">
                    Recent announcements by {user.name}
                  </h5>
                  {showUserAnnouncements()}
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title bg-primary pt-4 pb-4 pl-4 pr-4 text-light">
                    Message {user.name}
                  </h5>
                  <p>contact form</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export const getServerSideProps = async ({ query }) => {
  return userPublicProfile(query.username).then((data) => {
    if (data.error) {
      return console.log("ERROR " + data.error);
    } else {
      return {
        props: { user: data.user, announcements: data.announcements, query },
      };
    }
  });
};

export default UserProfile;
