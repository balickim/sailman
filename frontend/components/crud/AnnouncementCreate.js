import { useState, useEffect } from "react";
import useTranslation from "next-translate/useTranslation";
import dynamic from "next/dynamic";
import { withRouter, useRouter } from "next/router";
import { getCategories } from "../../actions/category";
import { getTags } from "../../actions/tag";
import { create } from "../../actions/announcement";

import { useAuth } from "../../components/auth/AuthProvider";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import { QuillModules, QuillFormats } from "../../helpers/quill";

const CreateAnnouncement = ({ router }) => {
  const announcementFromLS = () => {
    if (typeof window === "undefined") {
      return false;
    }

    if (localStorage.getItem("announcement")) {
      return JSON.parse(localStorage.getItem("announcement"));
    } else {
      return false;
    }
  };

  let { t } = useTranslation("announcements");
  const { locale } = useRouter();

  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);

  const [checkedCategory, setCheckedCategory] = useState([]);
  const [checkedTag, setCheckedTag] = useState([]);

  const [body, setBody] = useState(announcementFromLS());
  const [values, setValues] = useState({
    error: "",
    sizeError: "",
    success: "",
    formData: "",
    title: "",
    startDate: "",
    endDate: "",
    days: "",
    price: "",
    currency: "pln",
    includedInPrice: "",
    yacht: "",
    lastMinute: false,
    tidalCruise: false,
    hidePublishButton: false,
  });

  const {
    error,
    sizeError,
    success,
    formData,
    title,
    startDate,
    endDate,
    days,
    price,
    currency,
    includedInPrice,
    yacht,
    lastMinute,
    tidalCruise,
    hidePublishButton,
  } = values;

  const { user } = useAuth();

  useEffect(() => {
    setValues({ ...values, formData: new FormData() });
    initCategories();
    initTags();
  }, [router]);

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

  const publishAnnouncement = (e) => {
    e.preventDefault();
    formData.set("language", locale);
    formData.set("currency", currency);
    create(formData, user).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          ...values,
          title: "",
          error: "",
          success: t("resp_success", { title: data.title }),
        });
        setBody("");
        setCategories([]);
        setTags([]);
      }
    });
  };

  const handleChange = (name) => (e) => {
    let value;
    const target = e.target;

    if (name === "photo") {
      value = target.files[0];
    } else if (target.type === "checkbox") {
      value = target.checked;
    } else {
      value = target.value;
    }

    formData.set(name, value);
    setValues({ ...values, [name]: value, formData, error: "" });
  };

  const handleBody = (e) => {
    setBody(e);
    formData.set("body", e);
    if (typeof window !== "undefined") {
      localStorage.setItem("announcement", JSON.stringify(e));
    }
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
    setCheckedCategory(all);
    formData.set("categories", all);
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
    formData.set("tags", all);
  };

  const showCategories = () => {
    return (
      categories &&
      categories.map((c, i) => (
        <li key={i} className="list-unstyled">
          <input
            onChange={handleCategoryToggle(c._id)}
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

  const createAnnouncementForm = () => {
    return (
      <form onSubmit={publishAnnouncement} id="announcementForm">
        <div className="form-group">
          <label className="text-muted">{t("Title")}</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={handleChange("title")}
          />
        </div>

        <div className="row">
          <div className="form-group col-md-3">
            <label className="text-muted">{t("Start date")}</label>
            <input
              type="date"
              className="form-control"
              value={startDate}
              onChange={handleChange("startDate")}
            />
          </div>

          <div className="form-group col-md-3">
            <label className="text-muted">{t("End date")}</label>
            <input
              type="date"
              className="form-control"
              value={endDate}
              onChange={handleChange("endDate")}
            />
          </div>
          <div className="form-group col-md-2">
            <label className="text-muted text-nowrap">
              {t("Number of cruise days")}
            </label>
            <input
              type="number"
              min="0"
              className="form-control"
              value={days}
              onChange={handleChange("days")}
            />
          </div>
          <div className="form-group col-md-2">
            <label className="text-muted text-nowrap">
              {t("Price per person")}
            </label>
            <input
              type="number"
              min="0"
              className="form-control"
              value={price}
              onChange={handleChange("price")}
            />
          </div>
          <div className="form-group col-md-2">
            <label className="text-muted text-nowrap">
              <br />
            </label>
            <select
              name="currency"
              id="currency"
              className="form-control"
              onChange={handleChange("currency")}
            >
              <option value="pln">PLN</option>
              <option value="eur">EUR</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="text-muted">
            {t("What's included in the price")}
          </label>
          <input
            type="text"
            className="form-control"
            value={includedInPrice}
            onChange={handleChange("includedInPrice")}
          />
        </div>

        <div className="form-group">
          <label className="text-muted">
            {t("The yacht and its description")}
          </label>
          <input
            type="text"
            className="form-control"
            value={yacht}
            onChange={handleChange("yacht")}
          />
        </div>

        <div className="form-group">
          <label className="text-muted">{t("Description")}</label>
          <ReactQuill
            modules={QuillModules}
            formats={QuillFormats}
            value={body}
            placeholder={t("Write something")}
            onChange={handleBody}
          />
        </div>
      </form>
    );
  };

  return (
    <div className="container-fluid pb-3">
      <div className="row">
        <div className="col-xl-8">{createAnnouncementForm()}</div>
        <div className="col-xl-4">
          <div>
            <div className="form-group pb-2">
              <h5>{t("Featured image")}</h5>
              <hr />

              <small className="text-muted">{t("Max size 1mb")} </small>
              <label className="btn btn-outline-info">
                {t("Upload featured image")}
                <input
                  onChange={handleChange("photo")}
                  type="file"
                  accept="image/*"
                  hidden
                />
              </label>
            </div>
          </div>

          <div className="form-group">
            <h5>{t("Cruise map (Optional)")}</h5>
            <hr />
            <div
              className="border"
              style={{ width: "auto", height: "400px" }}
            ></div>
          </div>

          <div>
            <h5>{t("Categories")}</h5>
            <hr />
            <ul style={{ maxHeight: "200px", overflowY: "scroll" }}>
              {showCategories()}
            </ul>
          </div>

          <div>
            <h5>{t("Tags")}</h5>
            <hr />
            <ul style={{ maxHeight: "200px", overflowY: "scroll" }}>
              {showTags()}
            </ul>
          </div>

          <div className="mb-2">
            <h5>{t("Last Minute")}</h5>
            <hr />
            <input
              type="checkbox"
              id="lastMinute"
              className="mr-1"
              checked={lastMinute}
              onChange={handleChange("lastMinute")}
            />
            <label htmlFor="lastMinute" className="small">
              {t(
                "Tick if less than a month left until the trip and the price has been reduced"
              )}
            </label>
          </div>

          <div>
            <h5>{t("Tidal cruise")}</h5>
            <hr />
            <input
              type="checkbox"
              id="tidalCruise"
              className="mr-1"
              checked={tidalCruise}
              onChange={handleChange("tidalCruise")}
            />
            <label htmlFor="tidalCruise" className="small">
              {t("Check if the voyage is tidal")}
            </label>
          </div>
        </div>
      </div>
      <div>
        <div className="pt-3">
          {showError()}
          {showSuccess()}
        </div>
      </div>
      <div className="sticky float-right mb-4">
        <button
          type="submit"
          className="btn btn-primary  "
          form="announcementForm"
        >
          {t("Publish announcement")}
        </button>
      </div>
    </div>
  );
};

export default withRouter(CreateAnnouncement);
