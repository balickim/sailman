import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import parseToHTML from "html-react-parser";
import useTranslation from "next-translate/useTranslation";

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
    <div className="card">
      <section>
        <div className="card-header">
          <h3>{announcement.title}</h3>
        </div>
      </section>
      <div className="row">
        <div className="col-3">
          <section className="ms-3">
            <Image
              width={"200px"}
              height={"200px"}
              src={`${process.env.NEXT_PUBLIC_API}/announcement/photo/${announcement.slug}`}
              alt={announcement.title}
              className="img img-fluid pt-3"
            />
          </section>
        </div>
        <div className="col-9 card-text">
          <section>
            <div className="row" style={{}}>
              <div className="col-6">
                <strong>Od:</strong> {announcement.startDate}
              </div>
              <div className="col-6">
                <strong>Do:</strong> {announcement.endDate}
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <strong>Dni:</strong> {announcement.days}
              </div>
              <div className="col-6">
                <strong>Cena:</strong>{" "}
                {announcement.price + " " + announcement.currency} za osobę
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <strong>Zawarte:</strong> {announcement.includedInPrice}
              </div>
              <div className="col-6">
                <strong>Jacht:</strong> {announcement.yacht}
              </div>
            </div>

            <div>{parseToHTML(announcement.excerpt)}</div>
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
              {announcement.route && (
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
          </section>
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
