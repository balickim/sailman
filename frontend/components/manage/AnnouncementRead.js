/* eslint-disable react/display-name */
import Link from 'next/link';
import { useState, useEffect, Fragment } from 'react';
import dynamic from 'next/dynamic';
import { MDBSpinner } from 'mdb-react-ui-kit';
import dayjs from 'dayjs';
import parseToHTML from 'html-react-parser';

import { listRelated } from '@actions/announcement';
import SmallCard from '@components/announcement/SmallCard';

const Map = dynamic(() => import('@components/map/Map'), {
  loading: () => <MDBSpinner color="primary" />,
  ssr: false,
});

const ImageGallery = dynamic(() => import('react-image-gallery'), {
  loading: () => <MDBSpinner color="primary" />,
});

const AnnouncementRead = ({ announcement, gallery }) => {
  const [related, setRelated] = useState([]);

  const loadRelated = () => {
    listRelated({ announcement }).then(data => {
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

  const showAnnouncementCategories = announcement =>
    announcement.categories.map((c, i) => (
      <Link key={i} href={`/categories/${c.slug}`}>
        <a className="btn btn-primary me-1 ms-1 mt-3 ">{c.name}</a>
      </Link>
    ));

  const showAnnouncementTags = announcement =>
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

  const showIncludedInPrice = includedInPrice => {
    let length = includedInPrice.length;
    return includedInPrice.map((item, i) => {
      return i < length - 1 ? (
        <Fragment key={i}> {item.label},</Fragment>
      ) : (
        <Fragment key={i}> {item.label}</Fragment>
      );
    });
  };

  const showNotIncludedInPrice = notIncludedInPrice => {
    let length = notIncludedInPrice.length;
    return notIncludedInPrice.map((item, i) => {
      return i < length - 1 ? (
        <Fragment key={i}> {item.label},</Fragment>
      ) : (
        <Fragment key={i}> {item.label}</Fragment>
      );
    });
  };

  const days = announcement => {
    let startDateSplit = announcement.startDate.split('-');
    let endDateSplit = announcement.endDate.split('-');
    let startDateParsed = new Date(
      Number(startDateSplit[0]),
      Number(startDateSplit[1]) - 1,
      Number(startDateSplit[2]) + 1,
    );
    let endDateParsed = new Date(
      Number(endDateSplit[0]),
      Number(endDateSplit[1]) - 1,
      Number(endDateSplit[2]) + 1,
    );
    return (endDateParsed - startDateParsed) / 60 / 60 / 24 / 1000;
  };

  return (
    <>
      <div className="container">
        <h2 className="pb-3 text-center pt-3">{announcement.title}</h2>
        {gallery && gallery.length > 0 && <ImageGallery items={gallery} />}
        <section>
          {announcement.route && announcement.route.length > 0 && (
            <div className="border" style={{ width: 'auto', height: '400px' }}>
              <Map seedRoutes={announcement.route} />
            </div>
          )}
          <div className="row">Od: {announcement.startDate}</div>
          <div className="row">Do: {announcement.endDate}</div>
          <div className="row">Dni: {days(announcement)}</div>
          <div className="row">
            Cena: {announcement.price + ' ' + announcement.currency} za osobę
          </div>
          <div className="row">Zawarte: {showIncludedInPrice(announcement.includedInPrice)}</div>
          <div className="row">
            Nie zawarte: {showNotIncludedInPrice(announcement.notIncludedInPrice)}
          </div>
          <div className="row">Jacht: {announcement.yacht}</div>
          <div className="row">LastMinute: {announcement.lastMinute === false ? 'tak' : 'nie'}</div>
          <div className="row">Pływowy: {announcement.tidalCruise === false ? 'tak' : 'nie'}</div>
          <div className="col-md-12 lead mt-3 text-break">{parseToHTML(announcement.body)}</div>
        </section>
      </div>
      <div className="container pb-5">
        <h4 className="text-center pt-5 pb-5 h2">Related announcements</h4>
        <hr />
        <div className="row">{showRelatedAnnouncement()}</div>
      </div>
      <div className="container-fluid">
        <div className="container">
          <p className="lead mt-3 mark">
            Posted by{' '}
            <Link href={`/profile/${announcement.postedBy.username}`}>
              <a>{announcement.postedBy.username}</a>
            </Link>{' '}
            | Published {dayjs(announcement.updatedAt).format('D MMMM, YYYY HH:MM')}
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
    </>
  );
};

export default AnnouncementRead;
