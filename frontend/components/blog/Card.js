import dayjs from "dayjs";
import Link from "next/link";

const Card = ({ blog }) => {
  const showBlogCategories = (blog) =>
    blog.categories.map((c, i) => (
      <Link key={i} href={`/categories/${c.slug}`}>
        <a className="btn btn-primary mr-1 ml-1 mt-3 ">{c.name}</a>
      </Link>
    ));

  const showBlogTags = (blog) =>
    blog.tags.map((t, i) => (
      <Link key={i} href={`/tags/${t.slug}`}>
        <a className="btn btn-outline-primary mr-1 ml-1 mt-3 ">{t.name}</a>
      </Link>
    ));

  return (
    <div className="lead pb-4">
      <header>
        <Link href={`/blogs/${blog.slug}`}>
          <a>
            <h2 className="pt-3 pb-3 font-weight-bold">{blog.title}</h2>
          </a>
        </Link>
      </header>
      <section>
        <p className="mark ml-1 pt-2 pb-2">
          Posted by {blog.postedBy.name} | Published{" "}
          {dayjs(blog.updatedAt).format("D MMMM, YYYY HH:MM")}
        </p>
      </section>
      <section>
        {showBlogCategories(blog)}
        {showBlogTags(blog)}
      </section>
      <div className="row">
        <div className="col-md-4">
          <section>
            <Link href={`/blogs/${blog.slug}`}>
              <img
                style={{ maxHeight: "150px", width: "auto" }}
                src={`${process.env.NEXT_PUBLIC_API}/blog/photo/${blog.slug}`}
                alt={blog.title}
                className="img img-fluid pt-3"
              />
            </Link>
          </section>
        </div>
        <div className="col-md-8">
          <section>
            <div className="pb-3">{blog.excerpt}</div>
            <Link href={`/blogs/${blog.slug}`}>
              <a className="btn btn-primary pt-2">Read more</a>
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Card;
