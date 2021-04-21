import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import parseToHTML from "html-react-parser";

const Card = ({ announcement }) => {
  const showAnnouncementCategories = (announcement) =>
    announcement.categories.map((c, i) => (
      <Link key={i} href={`/categories/${c.slug}`}>
        <a className="btn btn-primary mr-1 ml-1 mt-3 ">{c.name}</a>
      </Link>
    ));

  const showAnnouncementTags = (announcement) =>
    announcement.tags.map((t, i) => (
      <Link key={i} href={`/tags/${t.slug}`}>
        <a className="btn btn-outline-primary mr-1 ml-1 mt-3 ">{t.name}</a>
      </Link>
    ));

  return (
    <div className="card">
      <div className="card-header">
        <h3>{announcement.title}</h3>
      </div>
      <div className="row">
        <div className="col-md-3">
          <section>
            <Image
              width={"200px"}
              height={"200px"}
              src={`${process.env.NEXT_PUBLIC_API}/announcement/photo/${announcement.slug}`}
              alt={announcement.title}
              className="img img-fluid pt-3 ml-3"
            />
          </section>
        </div>
        <div className="col-md-9 card-text">
          <section>
            <div className="row">
              <div className="col-md-6">Od: {announcement.startDate}</div>
              <div className="col-md-6">Do: {announcement.endDate}</div>
            </div>
            <div className="row">
              <div className="col-md-6">Dni: {announcement.days}</div>
              <div className="col-md-6">
                Cena: {announcement.price + " " + announcement.currency} za
                osobę
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                Zawarte: {announcement.includedInPrice}
              </div>
              <div className="col-md-6">Jacht: {announcement.yacht}</div>
            </div>
            <div className="row">
              <div className="col-md-6">
                LastMinute: {announcement.lastMinute === false ? "tak" : "nie"}
              </div>
              <div className="col-md-6">
                Pływowy: {announcement.tidalCruise === false ? "tak" : "nie"}
              </div>
            </div>
            <div className="row">{parseToHTML(announcement.excerpt)}</div>
            <Link href={`/announcements/${announcement.slug}`}>
              <a className="btn btn-primary pt-2 mr-2 float-right">Read more</a>
            </Link>
          </section>
        </div>
      </div>
      <section>
        <div className="card-footer text-muted">
          Posted by{" "}
          <Link href={`/profile/${announcement.postedBy.username}`}>
            <a>{announcement.postedBy.username}</a>
          </Link>{" "}
          | Published{" "}
          {dayjs(announcement.updatedAt).format("D MMMM, YYYY HH:MM")}
          {showAnnouncementCategories(announcement)}
          {showAnnouncementTags(announcement)}
        </div>
      </section>
    </div>
  );
};

export default Card;
