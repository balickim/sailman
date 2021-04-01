import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { withRouter } from "next/router";
import { getCategories } from "../../actions/category";
import { getTags } from "../../actions/tag";
import { update, singleAnnouncement } from "../../actions/announcement";
import { useAuth } from "../../actions/AuthProvider";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import { QuillModules, QuillFormats } from "../../helpers/quill";

const AnnouncementUpdate = ({ router }) => {
  const [body, setBody] = useState("");

  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);

  const [checkedCategory, setCheckedCategory] = useState([]);
  const [checkedTag, setCheckedTag] = useState([]);

  const [values, setValues] = useState({
    error: "",
    success: "",
    title: "",
    body: "",
  });

  const { error, success, title } = values;
  const { user } = useAuth();

  useEffect(() => {
    setValues({ ...values /*, formData: new FormData()*/ });
    initAnnouncement();
    initCategories();
    initTags();
  }, [router]);

  const initAnnouncement = () => {
    if (router.query.slug) {
      singleAnnouncement(router.query.slug).then((data) => {
        if (data.error) {
          console.log(data.error);
        } else {
          setValues({ ...values, title: data.title });
          setBody(data.body);
          setCategoriesArray(data.categories);
          setTagsArray(data.tags);
        }
      });
    }
  };

  const setCategoriesArray = (announcementCategories) => {
    let ca = [];
    announcementCategories.map((c, i) => {
      ca.push(c._id);
    });
    setCheckedCategory(ca);
  };

  const setTagsArray = (announcementTags) => {
    let ta = [];
    announcementTags.map((t, i) => {
      ta.push(t._id);
    });
    setCheckedTag(ta);
  };

  const initCategories = () => {
    getCategories().then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setCategories(data);
      }
    });
  };

  const initTags = () => {
    getTags().then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setTags(data);
      }
    });
  };

  const handleChange = (name) => (e) => {
    const value = name === "photo" ? e.target.files[0] : e.target.value;
    setValues({ ...values, [name]: value, error: "" });
  };

  const handleBody = (e) => {
    setBody(e);
  };

  const editAnnouncement = (e) => {
    e.preventDefault();

    let formData = new FormData();
    formData.append("title", values.title);
    formData.append("body", body);
    formData.append("categories", checkedCategory);
    formData.append("tags", checkedTag);

    update(formData, router.query.slug, user).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          ...values,
          title: "",
          success: `Announcement titled "${data.title}" was successfully updated.`,
        });
      }
    });
  };

  const handleCategoryToggle = (c) => () => {
    setValues({ ...values, error: "" });
    const clickedCategory = checkedCategory.indexOf(c);
    const all = [...checkedCategory];

    if (clickedCategory === -1) {
      all.push(c);
    } else {
      all.splice(clickedCategory, 1);
    }
    console.log(all);
    setCheckedCategory(all);
  };

  const handleTagToggle = (c) => () => {
    setValues({ ...values, error: "" });
    const clickedTag = checkedTag.indexOf(c);
    const all = [...checkedTag];

    if (clickedTag === -1) {
      all.push(c);
    } else {
      all.splice(clickedTag, 1);
    }
    setCheckedTag(all);
  };

  const findOutCategory = (c) => {
    const result = checkedCategory.indexOf(c);
    if (result !== -1) {
      return true;
    } else {
      return false;
    }
  };

  const findOutTag = (t) => {
    const result = checkedTag.indexOf(t);
    if (result !== -1) {
      return true;
    } else {
      return false;
    }
  };

  const showCategories = () => {
    return (
      categories &&
      categories.map((c, i) => (
        <li key={i} className="list-unstyled">
          <input
            onChange={handleCategoryToggle(c._id)}
            checked={findOutCategory(c._id)}
            type="checkbox"
            className="mr-2"
          />
          <label className="form-check-label">{c.name}</label>
        </li>
      ))
    );
  };

  const showTags = () => {
    return (
      tags &&
      tags.map((t, i) => (
        <li key={i} className="list-unstyled">
          <input
            onChange={handleTagToggle(t._id)}
            checked={findOutTag(t._id)}
            type="checkbox"
            className="mr-2"
          />
          <label className="form-check-label">{t.name}</label>
        </li>
      ))
    );
  };

  const showError = () => (
    <div
      className="alert alert-danger"
      style={{ display: error ? "" : "none" }}
    >
      {error}
    </div>
  );

  const showSuccess = () => (
    <div
      className="alert alert-success"
      style={{ display: success ? "" : "none" }}
    >
      {success}
    </div>
  );

  const updateAnnouncementForm = () => {
    return (
      <form onSubmit={editAnnouncement}>
        <div className="form-group">
          <label className="text-muted">Title</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={handleChange("title")}
          />
        </div>

        <div className="form-group">
          <ReactQuill
            modules={QuillModules}
            formats={QuillFormats}
            value={body}
            placeholder="Write something..."
            onChange={handleBody}
          />
        </div>

        <div>
          <button type="submit" className="btn btn-primary">
            Publish
          </button>
        </div>
      </form>
    );
  };

  return (
    <div className="container-fluid pb-3">
      <div className="row">
        <div className="col-md-8">
          {updateAnnouncementForm()}
          <div className="pt-3">
            {showError()}
            {showSuccess()}
          </div>

          {body && (
            <img
              src={`${process.env.NEXT_PUBLIC_API}/announcement/photo/${router.query.slug}`}
              alt={title}
              style={{ width: "100%" }}
            />
          )}
        </div>
        <div className="col-md-4">
          <div>
            <div className="form-group pb-2">
              <h5>Featured image</h5>
              <hr />

              {/* <small className="text-muted">Max size 1mb </small>
              <label className="btn btn-outline-info">
                Upload featured image
                <input
                  onChange={handleChange("photo")}
                  type="file"
                  accept="image/*"
                  hidden
                />
              </label> */}
            </div>
          </div>
          <div>
            <h5>Categories</h5>
            <hr />
            <ul style={{ maxHeight: "200px", overflowY: "scroll" }}>
              {showCategories()}
            </ul>
          </div>
          <div>
            <h5>Tags</h5>
            <hr />
            <ul style={{ maxHeight: "200px", overflowY: "scroll" }}>
              {showTags()}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(AnnouncementUpdate);
