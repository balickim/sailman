import Image from "next/image";
import useTranslation from "next-translate/useTranslation";
import dayjs from "dayjs";
import Link from "next/link";

const Card = ({ announcement }) => {
  let { t } = useTranslation("announcements");

  const showAnnouncementCategories = (announcement) =>
    announcement.categories.map((c, i) => (
      <Link key={i} href={`/categories/${c.slug}`}>
        <a className="btn btn-primary m-1">{c.name}</a>
      </Link>
    ));

  const showAnnouncementTags = (announcement) =>
    announcement.tags.map((t, i) => (
      <Link key={i} href={`/tags/${t.slug}`}>
        <a className="btn btn-outline-primary m-1">{t.name}</a>
      </Link>
    ));

  return (
    <div className="card border">
      <div className="row card-text">
        <div className="col-xxl-3 text-center">
          <Image
            width={"200px"}
            height={"200px"}
            src={`${process.env.NEXT_PUBLIC_API}/announcement/photo/${announcement.slug}`}
            alt={announcement.title}
            className="img img-fluid pt-1 ms-3"
          />
        </div>
        <div className="col-xxl-9">
          <div className="ms-3">
            <div>
              <h2>{announcement.title}</h2>
            </div>
            <div>
              <strong>Termin:</strong> {announcement.startDate} -{" "}
              {announcement.endDate} ({announcement.days} dni)
            </div>
            <div>
              <strong>Cena:</strong>{" "}
              {announcement.price + " " + announcement.currency} za osobę
            </div>
            <div>
              <strong>Jacht: </strong> {announcement.yacht}
            </div>
            <div>
              <strong>Zawarte: </strong> {announcement.includedInPrice}
            </div>
          </div>
          <div className="float-end">
            {announcement.lastMinute === true && (
              <Image
                src="/images/clock.svg"
                width={"40px"}
                height={"40px"}
                alt="clock"
                title={t("Last Minute")}
                className="me-2"
              />
            )}
            {announcement.tidalCruise === true && (
              <Image
                src="/images/tide.svg"
                width={"40px"}
                height={"40px"}
                alt="tide"
                title={t("Tidal cruise")}
                className="me-1"
              />
            )}
            {announcement.route && announcement.route.length > 0 && (
              <Image
                src="/images/map.svg"
                width={"48px"}
                height={"48px"}
                alt="map"
                title={t("Announcement includes map")}
              />
            )}
            <Link href={`/announcements/${announcement.slug}`}>
              <a className="btn btn-primary m-2">{t("Read more")}</a>
            </Link>
          </div>
        </div>
      </div>
      <div className="card-footer text-muted">
        <Link href={`/profile/${announcement.postedBy.username}`}>
          <a>{announcement.postedBy.username}</a>
        </Link>{" "}
        | {dayjs(announcement.updatedAt).format("D MMMM, YYYY HH:MM")}
        <div className="float-end">
          {showAnnouncementCategories(announcement)}
          {showAnnouncementTags(announcement)}
        </div>
      </div>
    </div>
  );
};

export default Card;
