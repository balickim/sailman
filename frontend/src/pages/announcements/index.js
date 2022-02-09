import Head from 'next/head';
import useTranslation from 'next-translate/useTranslation';
import { useState } from 'react';
import { withRouter } from 'next/router';

import Layout from '@components/layout/Layout';
import Card from '@components/announcements/Card';
import { listAnnouncements } from '@http/announcement';

const Announcements = ({ announcements, totalAnnouncements, announcementsLimit, router }) => {
  const [limit] = useState(announcementsLimit);
  const [skip, setSkip] = useState(0);
  const [size, setSize] = useState(totalAnnouncements);
  const [loadedAnnouncements, setLoadedAnnouncements] = useState([]);

  const [values, setValues] = useState({
    phrase: '',
    priceFrom: 0,
    priceTo: 0,
    dateStartFrom: '',
    dateStartTo: '',
    dateEndFrom: '',
    dateEndTo: '',
    lastMinute: false,
    tidalCruise: false,
    map: false,
  });

  const {
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

  let { t } = useTranslation('announcements');

  const DOMAIN = process.env.NEXT_PUBLIC_SEO_DOMAIN;
  const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME;
  const FB_APP_ID = process.env.NEXT_PUBLIC_FB_APP_ID;

  const head = () => (
    <Head>
      <title>Boat renting | {DOMAIN}</title>
      <meta name="description" content="Boat renting announcements" />
      <link rel="canonical" href={`${DOMAIN}${router.pathname}`} />
      <meta property="og:title" content={`Latest Boat renting announcements | ${APP_NAME}`} />
      <meta property="og:description" content="Boat renting announcements" />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`${DOMAIN}${router.pathname}`} />
      <meta property="og:site_name" content={`${APP_NAME}`} />

      <meta property="og:image" content={`${DOMAIN}/images/sailman-wynajem.jpg`} />
      <meta property="og:image:secure_url" content={`${DOMAIN}/images/sailman-wynajem.jpg`} />
      <meta property="og:image:type" content="image/jpg" />
      <meta property="fb:app_id" content={`${FB_APP_ID}`} />
    </Head>
  );

  const loadMore = () => {
    let toSkip = skip + limit;
    listAnnouncements(toSkip, limit).then(data => {
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

  const chunkArray = (arr, chunkSize) => {
    let chunked = [];
    for (let i = 0, j = arr.length; i < j; i += chunkSize) {
      chunked.push(arr.slice(i, i + chunkSize));
    }
    return chunked;
  };

  const showAllAnnouncements = () => {
    let cols = 2;
    const chunkedArray = chunkArray(announcements, cols);
    cols = 12 / cols;

    return chunkedArray.map((announcement, i) => {
      return (
        <div key={i} className="row">
          {announcement[0] && (
            <article className={`mb-3 col-lg-${cols}`} key={announcement[0]._id}>
              <Card announcement={announcement[0]} />
            </article>
          )}

          {announcement[1] && (
            <article className={`mb-3 col-lg-${cols}`} key={announcement[1]._id}>
              <Card announcement={announcement[1]} />
            </article>
          )}
        </div>
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

  const handleChange = name => e => {
    let value;
    const target = e.target;

    if (target.type === 'checkbox') {
      value = target.checked;
    } else {
      value = target.value;
    }

    setValues({ ...values, [name]: value });
  };

  const pushParams = e => {
    e.preventDefault();

    router.push(`/announcements?${new URLSearchParams(values).toString()}`);
  };

  const filterForm = () => {
    return (
      <div className="container border mb-3" style={{ overflow: 'hidden' }}>
        <form onSubmit={pushParams} id="filterForm" className="mt-2">
          <div className="form-group">
            <div className="mb-3">
              <div>
                <input
                  type="phrase"
                  className="form-control"
                  placeholder={t('search_phrase')}
                  onChange={handleChange('phrase')}
                />
              </div>
            </div>
            <label className="ms-2">{t('price_per_person')}</label>
            <div className="row">
              <div className="col-6">
                <input
                  type="number"
                  className="form-control"
                  placeholder="from"
                  value={priceFrom}
                  min={0}
                  max={10000}
                  onChange={handleChange('priceFrom')}
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
                  onChange={handleChange('priceTo')}
                />
              </div>
            </div>
          </div>
          <div className="form-group">
            <label className="ms-2">{t('start_date')}</label>
            <div className="row">
              <div className="col-6">
                <input
                  type="date"
                  className="form-control"
                  value={dateStartFrom}
                  onChange={handleChange('dateStartFrom')}
                />
              </div>
              <div className="col-6">
                <input
                  type="date"
                  className="form-control"
                  value={dateStartTo}
                  onChange={handleChange('dateStartTo')}
                />
              </div>
            </div>
          </div>
          <div className="form-group">
            <label className="ms-2">{t('end_date')}</label>
            <div className="row">
              <div className="col-6">
                <input
                  type="date"
                  className="form-control"
                  value={dateEndFrom}
                  onChange={handleChange('dateEndFrom')}
                />
              </div>
              <div className="col-6">
                <input
                  type="date"
                  className="form-control"
                  value={dateEndTo}
                  onChange={handleChange('dateEndTo')}
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-10">
              <div>
                <input
                  id="lastMinute"
                  type="checkbox"
                  value={lastMinute}
                  onChange={handleChange('lastMinute')}
                />
                <label htmlFor="lastMinute" className="ms-1 small">
                  {t('last_minute')}
                </label>
              </div>
              <div>
                <input
                  id="tidalCruise"
                  type="checkbox"
                  value={tidalCruise}
                  onChange={handleChange('tidalCruise')}
                />
                <label htmlFor="tidalCruise" className="ms-1 small">
                  {t('tidal_cruise')}
                </label>
              </div>
              <div>
                <input id="withMap" type="checkbox" value={map} onChange={handleChange('map')} />
                <label htmlFor="withMap" className="ms-1 small">
                  {t('with_map')}
                </label>
              </div>
            </div>

            <div className="col-2">
              <button type="submit" className="btn btn-primary m-3 float-end" form="filterForm">
                {t('action.search')}
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
                <h1 className="font-weight-bold text-start mb-5">{t('announcements')}</h1>
              </div>
            </header>
          </div>
          <div>
            <div>{filterForm()}</div>
            <div>{showAllAnnouncements()}</div>
            <div className="container-fluid">{showLoadedAnnouncements()}</div>
            <div className="text-center pt-5 pb-5">{loadMoreButton()}</div>
          </div>
        </main>
      </Layout>
    </>
  );
};

export async function getServerSideProps(context) {
  let skip = 0;
  let limit = 4;

  return listAnnouncements(skip, limit, context.query).then(data => {
    if (data.error) {
      console.log(data.error);
    } else {
      return {
        props: {
          announcements: data.announcements,
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
