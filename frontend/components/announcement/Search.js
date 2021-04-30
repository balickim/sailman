import Link from "next/link";
import { useState } from "react";

import { listSearch } from "@actions/announcement";

const Search = () => {
  const [values, setValues] = useState({
    search: undefined,
    results: [],
    searched: false,
    message: "",
  });

  const { search, results, searched, message } = values;

  const searchSubmit = (e) => {
    e.preventDefault();
    listSearch({ search }).then((data) => {
      setValues({
        ...values,
        results: data,
        searched: true,
        message: `${data.length} announcements found`,
      });
    });
  };

  const handleChange = (e) => {
    setValues({
      ...values,
      search: e.target.value,
      searched: false,
      results: [],
    });
  };

  const searchedAnnouncements = (results = []) => {
    return (
      <div className="jumbotron bg-white">
        {message && <p className="pt-4 text-muted font-italic">{message}</p>}

        {results.map((announcement, i) => {
          return (
            <div key={i}>
              <Link href={`/announcements/${announcement.slug}`}>
                <a className="text-primary">{announcement.title}</a>
              </Link>
            </div>
          );
        })}
      </div>
    );
  };

  const searchForm = () => (
    <form onSubmit={searchSubmit}>
      <div className="row">
        <div className="col-md-8">
          <input
            type="search"
            className="form-control"
            placeholder="Search announcements"
            onChange={handleChange}
          />
        </div>

        <div className="col-md-4">
          <button className="btn btn-block btn-outline-primary" type="submit">
            Search
          </button>
        </div>
      </div>
    </form>
  );

  return (
    <div className="container-fluid">
      <div className="pt-3 pb-5">{searchForm()}</div>
      {searched && (
        <div style={{ marginTop: "-120px", marginBottom: "-80px" }}>
          {searchedAnnouncements(results)}
        </div>
      )}
    </div>
  );
};

export default Search;
