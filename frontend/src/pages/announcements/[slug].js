import Head from 'next/head';

import { singleAnnouncement, getGalleryCount } from '@root/src/actions/announcement';
import Layout from '@components/layout/Layout';
import Read from '@components/announcements/Read';

const SingleAnnouncement = ({ announcement, gallery, query }) => {
  const DOMAIN = process.env.NEXT_PUBLIC_SEO_DOMAIN;
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
      <meta property="og:title" content={`${announcement.title} | ${APP_NAME}`} />
      <meta property="og:description" content={announcement.mdesc} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`${DOMAIN}/announcements/${query.slug}`} />
      <meta property="og:site_name" content={`${APP_NAME}`} />

      <meta property="og:image" content={`${API}/announcement/photo/${announcement.slug}`} />
      <meta
        property="og:image:secure_url"
        content={`${API}/announcement/photo/${announcement.slug}`}
      />
      <meta property="og:image:type" content="image/jpg" />
      <meta property="fb:app_id" content={`${FB_APP_ID}`} />
    </Head>
  );
  return (
    <>
      {head()}
      <Layout>
        <main>
          <article>
            <Read announcement={announcement} gallery={gallery} />
          </article>
        </main>
      </Layout>
    </>
  );
};
export const getServerSideProps = async ({ query }) => {
  const gallery = [];

  const announcement = await singleAnnouncement(query.slug);

  let count = await getGalleryCount(query.slug);

  if (count && count.size > 0) {
    for (let i = 0; i < count.size; i++) {
      let original = `${process.env.NEXT_PUBLIC_API}/announcement/${query.slug}/gallery/${i}/`;
      gallery.push({ original, thumbnail: original });
    }
  }

  return {
    props: { announcement: announcement, gallery: gallery, query },
  };
};

export default SingleAnnouncement;
