import dayjs from "dayjs";
import Link from "next/link";
import parseToHTML from "html-react-parser";

const SmallCard = ({ blog }) => {
  return (
    <div className="card">
      <section>
        <Link href={`/blogs/${blog.slug}`}>
          <img
            style={{ maxHeight: "auto", width: "100%" }}
            src={`${process.env.NEXT_PUBLIC_API}/blog/photo/${blog.slug}`}
            alt={blog.title}
            className="img img-fluid"
          />
        </Link>
      </section>
      <div className="card-body">
        <section>
          <Link href={`/blogs/${blog.slug}`}>
            <a>
              <h5 className="card-title">{blog.title}</h5>
            </a>
          </Link>
          <p className="card-text">{parseToHTML(blog.excerpt)}</p>
        </section>
      </div>
      <div className="card-body">
        <div>
          <p className="mark ml-1 pt-2 pb-2">
            Posted by{" "}
            <Link href={`/`}>
              <a className="float-right">{blog.postedBy.name}</a>
            </Link>{" "}
            | Published {dayjs(blog.updatedAt).format("D MMMM, YYYY HH:MM")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SmallCard;
