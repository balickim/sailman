import Head from 'next/head';

import Layout from '@components/layout/Layout';
import Card from '@components/announcements/Card';
import { singleTag } from '@root/src/actions/tag';

const Tag = ({ tag, announcements, query }) => {
  const DOMAIN = process.env.NEXT_PUBLIC_SEO_DOMAIN;
  const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME;
  const FB_APP_ID = process.env.NEXT_PUBLIC_FB_APP_ID;

  const head = () => (
    <Head>
      <title>
        {tag.name} | {APP_NAME}
      </title>
      <meta name="description" content="Boat rent" />
      <link rel="canonical" href={`${DOMAIN}/tags/${query.slug}`} />
      <meta property="og:title" content={`${tag.name} | ${APP_NAME}`} />
      <meta property="og:description" content="Boat rent" />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`${DOMAIN}/tags/${query.slug}`} />
      <meta property="og:site_name" content={`${APP_NAME}`} />

      <meta property="og:image" content={`${DOMAIN}/images/sailman-wynajem.jpg`} />
      <meta property="og:image:secure_url" content={`${DOMAIN}/images/sailman-wynajem.jpg`} />
      <meta property="og:image:type" content="image/jpg" />
      <meta property="fb:app_id" content={`${FB_APP_ID}`} />
    </Head>
  );

  return (
    <>
      {head()}
      <Layout>
        <main>
          <div className="container-fluid text-center">
            <header>
              <div className="col-md-12 pt-3">
                <h1 className="display-4 font-weight-bold">{tag.name}</h1>
                {announcements.map((b, i) => (
                  <Card key={i} announcement={b} />
                ))}
              </div>
            </header>
          </div>
        </main>
      </Layout>
    </>
  );
};

export const getServerSideProps = async ({ query }) => {
  return singleTag(query.slug).then(data => {
    if (data.error) {
      console.log(data.error);
    } else {
      return {
        props: { tag: data.tag, announcements: data.announcements, query },
      };
    }
  });
};

export default Tag;
