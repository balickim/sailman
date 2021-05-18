import useTranslation from "next-translate/useTranslation";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { MDBSpinner } from "mdb-react-ui-kit";
import Image from "next/image";
import { withRouter, useRouter } from "next/router";
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
} from "mdb-react-ui-kit";
import Link from "next/link";

import { getCategories } from "@actions/category";
import { getTags } from "@actions/tag";
import { update, singleAnnouncement } from "@actions/announcement";
import { create } from "@actions/announcement";
import { useAuth } from "@components/auth/AuthProvider";
import LimitedInput from "@components/helpers/LimitedInput";

const ReactQuill = dynamic(() => import("react-quill"), {
  loading: () => <MDBSpinner color="primary" />,
  ssr: false,
});
import { QuillModules, QuillFormats } from "@helpers/quill";

const Map = dynamic(() => import("../map/Map"), {
  loading: () => <MDBSpinner color="primary" />,
  ssr: false,
});

const AnnouncementForm = ({ router }) => {
  const announcementFromLS = () => {
    if (!router.query.slug) {
      if (typeof window === "undefined") {
        return false;
      }

      if (localStorage.getItem("announcement")) {
        return JSON.parse(localStorage.getItem("announcement"));
      } else {
        return false;
      }
    } else {
      return "";
    }
  };

  let { t } = useTranslation("announcements");
  const { locale } = useRouter();

  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);

  const [checkedCategory, setCheckedCategory] = useState([]);
  const [checkedTag, setCheckedTag] = useState([]);

  const [body, setBody] = useState(announcementFromLS());

  const [seedRoutes, setSeedRoutes] = useState();
  const [currentRoutes, setCurrentRoutes] = useState();

  const [modal, setModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  const [values, setValues] = useState({
    error: "",
    success: "",
    responseData: "",
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
    photo: "",
  });

  const {
    error,
    success,
    responseData,
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
    photo,
  } = values;

  const { user } = useAuth();

  useEffect(() => {
    setValues({ ...values });
    initCategories();
    initTags();

    if (router.query.slug) {
      initAnnouncement();
    }
  }, [router]);

  const initAnnouncement = () => {
    singleAnnouncement(router.query.slug).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setValues({
          ...values,
          title: data.title,
          startDate: data.startDate,
          endDate: data.endDate,
          days: data.days,
          price: data.price,
          currency: data.currency,
          includedInPrice: data.includedInPrice,
          yacht: data.yacht,
          lastMinute: data.lastMinute,
          tidalCruise: data.tidalCruise,
        });
        setBody(data.body);
        setCategoriesArray(data.categories);
        setTagsArray(data.tags);
        setSeedRoutes(data.route);
      }
    });
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
    let value;
    const target = e.target;

    if (name === "photo") {
      value = target.files[0];
    } else if (target.type === "checkbox") {
      value = target.checked;
    } else {
      value = target.value;
    }

    setValues({ ...values, [name]: value, error: "" });
  };

  const handleBody = (e) => {
    setBody(e);
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
            type="checkbox"
            onChange={handleCategoryToggle(c._id)}
            checked={findOutCategory(c._id)}
            className="me-2"
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
            type="checkbox"
            onChange={handleTagToggle(t._id)}
            checked={findOutTag(t._id)}
            className="me-2"
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

  const toggleShow = () => setModal(!modal);

  const cleanAllState = (e) => {
    e.preventDefault();

    setValues({
      ...values,
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
      photo: "",
      responseData: "",
    });
    setBody("");
    setCheckedCategory([]);
    setCheckedTag([]);
    setSeedRoutes({});
    setModalLoading(false);
    setModal(false);
    // zero out everything for user to add new one
  };

  const publishOrEditAnnouncement = async (e) => {
    e.preventDefault();

    setModalLoading(true);
    await toggleShow();

    const allRoutes = [];

    if (currentRoutes) {
      await currentRoutes.map((element) => {
        allRoutes.push(element.circleCoords);
      });
    }

    if (seedRoutes) {
      await seedRoutes.map((element) => {
        allRoutes.push(element);
      });
    }

    let formData = await new FormData();
    await formData.append("title", values.title);
    await formData.append("body", body);
    await formData.append("startDate", startDate);
    await formData.append("endDate", endDate);
    await formData.append("days", days);
    await formData.append("price", price);
    await formData.append("includedInPrice", includedInPrice);
    await formData.append("yacht", yacht);
    await formData.append("lastMinute", lastMinute);
    await formData.append("tidalCruise", tidalCruise);
    await formData.append("language", locale);
    await formData.append("currency", currency);
    await formData.append("categories", checkedCategory);
    await formData.append("tags", checkedTag);
    await formData.append("allRoutes", JSON.stringify(allRoutes));
    if (photo) {
      // prevent photo from overwriting with empty
      await formData.append("photo", photo);
    }

    if (!router.query.slug) {
      create(formData).then((data) => {
        if (data.error) {
          setValues({ ...values, error: data.error, success: "" });
          setModalLoading(false);
        } else {
          setModalLoading(false);
          setValues({
            ...values,
            error: "",
            responseData: data,
            success: t("create_success", { title: data.title }),
          });
        }
      });
    } else if (router.query.slug) {
      update(formData, router.query.slug, user).then((data) => {
        if (data.error) {
          setValues({ ...values, error: data.error, success: "" });
          setModalLoading(false);
        } else {
          setModalLoading(false);
          setValues({
            ...values,
            error: "",
            responseData: data,
            success: t("update_success", { title: data.title }),
          });
        }
      });
    }
  };

  const mainForm = () => {
    return (
      <form onSubmit={publishOrEditAnnouncement} id="announcementForm">
        <div className="form-group">
          <label className="text-muted">{t("Title")}*</label>
          <LimitedInput
            type="text"
            value={title}
            onChange={handleChange("title")}
            limit={70}
          />
        </div>

        <div className="row">
          <div className="form-group col-md-3">
            <label className="text-muted">{t("Start date")}*</label>
            <input
              id="startDate"
              type="date"
              className="form-control"
              value={startDate}
              onChange={handleChange("startDate")}
            />
          </div>

          <div className="form-group col-md-3">
            <label className="text-muted">{t("End date")}*</label>
            <input
              id="endDate"
              type="date"
              className="form-control"
              value={endDate}
              onChange={handleChange("endDate")}
            />
          </div>
          <div className="form-group col-md-2">
            <label className="text-muted text-nowrap">
              {t("Number of cruise days")}*
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
              {t("Price per person")}*
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
            {t("What's included in the price")}*
          </label>
          <LimitedInput
            type="text"
            limit={120}
            value={includedInPrice}
            onChange={handleChange("includedInPrice")}
          />
        </div>

        <div className="form-group">
          <label className="text-muted">
            {t("The yacht and its description")}*
          </label>
          <LimitedInput
            type="text"
            limit={120}
            value={yacht}
            onChange={handleChange("yacht")}
          />
        </div>

        <div className="form-group">
          <label className="text-muted">{t("Description")}*</label>
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

  const additionalInfo = () => {
    return (
      <>
        <div className="form-group pb-2 mt-3">
          <h5>{t("Featured image")}</h5>
          <hr />
          <div className="d-flex justify-content-center">
            {router.query.slug && body && (
              <Image
                src={`${process.env.NEXT_PUBLIC_API}/announcement/photo/${router.query.slug}`}
                alt={title}
                width={300}
                height={300}
              />
            )}
          </div>
          <small className="text-muted me-2">{t("Max size 1mb")} </small>
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

        <div className="form-group">
          <h5>{t("Cruise map (Optional)")}</h5>
          <hr />
          <div className="border" style={{ width: "auto", height: "400px" }}>
            <Map
              setCurrentRoutes={setCurrentRoutes}
              setSeedRoutes={setSeedRoutes}
              seedRoutes={seedRoutes}
            />
          </div>
        </div>

        <div className="mt-3">
          <h5>{t("Categories")}*</h5>
          <hr />
          <ul style={{ maxHeight: "200px", overflowY: "scroll" }}>
            {showCategories()}
          </ul>
        </div>

        <div>
          <h5>{t("Tags")}*</h5>
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
            className="me-1"
            checked={lastMinute}
            onChange={handleChange("lastMinute")}
          />
          <label htmlFor="lastMinute" className="small">
            {t(
              "Tick if less than a month left until the trip and the price has been reduced"
            )}
          </label>
        </div>

        <div className="mt-4">
          <h5>{t("Tidal cruise")}</h5>
          <hr />
          <input
            type="checkbox"
            className="me-1"
            checked={tidalCruise}
            onChange={handleChange("tidalCruise")}
          />
          <label htmlFor="tidalCruise" className="small">
            {t("Check if the voyage is tidal")}
          </label>
        </div>
      </>
    );
  };

  return (
    <>
      <div className="container-fluid pb-3">
        <div className="row">
          <div className="col-xl-8">{mainForm()}</div>
          <div className="col-xl-4">{additionalInfo()}</div>
        </div>
        <div className="float-end mb-4">
          <button
            type="submit"
            className="btn btn-primary  "
            form="announcementForm"
          >
            {router.query.slug
              ? t("Edit announcement")
              : t("Publish announcement")}
          </button>
        </div>
      </div>
      <MDBModal tabIndex="-1" show={modal} getOpenState={(e) => setModal(e)}>
        <MDBModalDialog centered>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>
                {router.query.slug
                  ? t("Edit announcement")
                  : t("Publish announcement")}
              </MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={toggleShow}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              <div>
                {modalLoading && (
                  <div className="d-flex justify-content-center">
                    <MDBSpinner
                      color="primary"
                      role="status"
                      style={{ width: "3rem", height: "3rem" }}
                    />
                  </div>
                )}
                {showError()}
                {showSuccess()}
              </div>
            </MDBModalBody>
            <MDBModalFooter>
              {responseData && success && (
                <>
                  <MDBBtn onClick={cleanAllState}>{t("add_new")}</MDBBtn>

                  <Link href={`/announcements/${responseData.slug}`}>
                    <a>
                      <MDBBtn>{t("see")}</MDBBtn>
                    </a>
                  </Link>
                  <Link href={`/user/manage/${responseData.slug}`}>
                    <a>
                      <MDBBtn>{t("edit")}</MDBBtn>
                    </a>
                  </Link>
                </>
              )}
              {error && <MDBBtn onClick={toggleShow}>{t("close")}</MDBBtn>}
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </>
  );
};

export default withRouter(AnnouncementForm);
