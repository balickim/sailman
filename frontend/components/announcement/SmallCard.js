import dayjs from "dayjs";
import Link from "next/link";
import parseToHTML from "html-react-parser";

const SmallCard = ({ announcement }) => {
  return (
    <div className="card">
      <section>
        <Link href={`/announcements/${announcement.slug}`}>
          <img
            style={{ height: "250px", width: "100%" }}
            src={`${process.env.NEXT_PUBLIC_API}/announcement/photo/${announcement.slug}`}
            alt={announcement.title}
            className="img img-fluid"
          />
        </Link>
      </section>
      <div className="card-body">
        <section>
          <Link href={`/announcements/${announcement.slug}`}>
            <a>
              <h5 className="card-title">{announcement.title}</h5>
            </a>
          </Link>
          <p className="card-text">{parseToHTML(announcement.excerpt)}</p>
        </section>
      </div>
      <div className="card-body">
        <div>
          <p className="mark ml-1 pt-2 pb-2">
            Posted by{" "}
            <Link href={`/profile/${announcement.postedBy.username}`}>
              <a>{announcement.postedBy.username}</a>
            </Link>{" "}
            | Published{" "}
            {dayjs(announcement.updatedAt).format("D MMMM, YYYY HH:MM")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SmallCard;
