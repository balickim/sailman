import Image from 'next/image';
import useTranslation from 'next-translate/useTranslation';
import dayjs from 'dayjs';
import { Fragment, useState } from 'react';
import Link from 'next/link';

const Card = ({ announcement }) => {
  let { t } = useTranslation('announcements');

  const [imageFailed, setImageFailed] = useState(false);

  const showAnnouncementCategories = announcement =>
    announcement.categories.map((c, i) => (
      <Link key={i} href={`/categories/${c.slug}`}>
        <a className="btn btn-primary m-1">{c.name}</a>
      </Link>
    ));

  const showAnnouncementTags = announcement =>
    announcement.tags.map((t, i) => (
      <Link key={i} href={`/tags/${t.slug}`}>
        <a className="btn btn-outline-primary m-1">{t.name}</a>
      </Link>
    ));

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
    <div className="card border">
      <div className="card-text">
        <div className=" ms-2 mt-2">
          <div>
            <h2 className="h3">{announcement.title}</h2>
          </div>
          <div className="row">
            <div className="col-xxl-4">
              <div style={{ minWidth: '200px' }}>
                <Image
                  width={'200px'}
                  height={'100%'}
                  src={`${process.env.NEXT_PUBLIC_API}/announcement/photo/${announcement.slug}`}
                  onError={e => {
                    if (!imageFailed) {
                      setImageFailed(true);
                      e.target.src = '/images/ann-default.webp';
                    }
                  }}
                  alt={announcement.title}
                  className="img img-fluid"
                  unoptimized={true}
                />
              </div>
            </div>
            <div className="col-xxl-8">
              <div>
                <strong>Termin:</strong> {announcement.startDate} - {announcement.endDate} (
                {days(announcement)} dni)
              </div>
              <div>
                <strong>Cena:</strong> {announcement.price + ' ' + announcement.currency} za osobę
              </div>
              <div>
                <strong>Jacht: </strong> {announcement.yacht}
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="ms-2">
            <div>
              <strong>Zawarte: </strong>
              {announcement.includedInPrice && showIncludedInPrice(announcement.includedInPrice)}
            </div>
            <div>
              <strong>Nie zawarte: </strong>
              {announcement.notIncludedInPrice &&
                showNotIncludedInPrice(announcement.notIncludedInPrice)}
            </div>
          </div>
          <div className="float-end">
            {announcement.lastMinute === true && (
              <Image
                src="/images/clock.svg"
                width={'35px'}
                height={'35px'}
                alt="clock"
                title={t('last_minute')}
                className="me-2"
              />
            )}
            {announcement.tidalCruise === true && (
              <Image
                src="/images/tide.svg"
                width={'35px'}
                height={'35px'}
                alt="tide"
                title={t('tidal_cruise')}
                className="me-1"
              />
            )}
            {announcement.route && announcement.route.length > 0 && (
              <Image
                src="/images/map.svg"
                width={'48px'}
                height={'48px'}
                alt="map"
                title={t('Announcement includes map')}
                className="mt-2"
              />
            )}
            <Link href={`/announcements/${announcement.slug}`}>
              <a className="btn btn-primary m-2">{t('Read more')}</a>
            </Link>
          </div>
        </div>
      </div>
      <div className="card-footer text-muted">
        <Link href={`/profile/${announcement.postedBy.username}`}>
          <a>{announcement.postedBy.username}</a>
        </Link>{' '}
        | {dayjs(announcement.updatedAt).format('D MMMM, YYYY HH:MM')}
        <div className="float-end">
          {showAnnouncementCategories(announcement)}
          {showAnnouncementTags(announcement)}
        </div>
      </div>
    </div>
  );
};

export default Card;
