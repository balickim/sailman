/* eslint-disable jsx-a11y/no-onchange */
/* eslint-disable react/display-name */
import useTranslation from 'next-translate/useTranslation';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import CreatableSelect from 'react-select/creatable';
import Router, { withRouter, useRouter } from 'next/router';
import {
  MDBSpinner,
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
} from 'mdb-react-ui-kit';
import Link from 'next/link';

import { getTags } from '@actions/tag';
import { update, singleAnnouncement } from '@actions/announcement';
import { create } from '@actions/announcement';
import { useAuth } from '@components/auth/AuthProvider';
import LimitedInput from '@components/helpers/LimitedInput';
import useExitPrompt from '@components/helpers/useExitPrompt.js';
import { availableCategories } from '@root/config';

const ReactQuill = dynamic(() => import('react-quill'), {
  loading: () => <MDBSpinner color="primary" />,
  ssr: false,
});
import { QuillModules, QuillFormats } from '@helpers/quill';

const Map = dynamic(() => import('../map/Map'), {
  loading: () => <MDBSpinner color="primary" />,
  ssr: false,
});

const CreateUpdate = ({ router }) => {
  let { t } = useTranslation('announcements');
  const { locale } = useRouter();
  const [, setShowExitPrompt] = useExitPrompt(false);

  const [tags, setTags] = useState([]);

  const [checkedTag, setCheckedTag] = useState([]);

  const [body, setBody] = useState('');

  const [seedRoutes, setSeedRoutes] = useState();
  const [currentRoutes, setCurrentRoutes] = useState();

  const [modal, setModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  const [renderedPhoto, setRenderedPhoto] = useState('');
  const [gallery, setGallery] = useState([]);

  const [includedInPrice, setIncludedInPrice] = useState([]);
  const [notIncludedInPrice, setNotIncludedInPrice] = useState([]);

  const [values, setValues] = useState({
    error: '',
    success: '',
    responseData: '',
    title: '',
    startDate: '',
    endDate: '',
    price: '',
    currency: 'pln',
    yacht: '',
    yachtDesc: '',
    organizer: '',
    category: 'commercial_cruise',
    lastMinute: false,
    tidalCruise: false,
    photo: '',
  });

  const {
    error,
    success,
    responseData,
    title,
    startDate,
    endDate,
    price,
    currency,
    yacht,
    yachtDesc,
    organizer,
    category,
    lastMinute,
    tidalCruise,
    photo,
  } = values;

  const { user } = useAuth();

  const includedInPriceData = Object.freeze([
    { label: t('yacht_safe'), value: 'yacht_safe' },
    { label: t('transport'), value: 'transport' },
    { label: t('bunk'), value: 'bunk' },
    { label: t('insurance'), value: 'insurance' },
    { label: t('food'), value: 'food' },
    { label: t('alcohol'), value: 'alcohol' },
  ]);

  useEffect(() => {
    setValues({ ...values });
    initTags();

    if (router.query.slug) {
      initAnnouncement();
    }

    return () => {
      setShowExitPrompt(false);
    };
  }, [router]);

  const initAnnouncement = () => {
    singleAnnouncement(router.query.slug).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        setValues({
          ...values,
          title: data.title,
          startDate: data.startDate,
          endDate: data.endDate,
          price: data.price,
          currency: data.currency,
          yacht: data.yacht,
          yachtDesc: data.yachtDesc,
          organizer: data.organizer,
          category: data.category,
          lastMinute: data.lastMinute,
          tidalCruise: data.tidalCruise,
        });
        setIncludedInPrice(data.includedInPrice);
        setNotIncludedInPrice(data.notIncludedInPrice);
        setBody(data.body);
        setTagsArray(data.tags);
        setSeedRoutes(data.route);
      }
    });
  };

  const setTagsArray = announcementTags => {
    let ta = [];
    announcementTags.map(t => {
      ta.push(t._id);
    });
    setCheckedTag(ta);
  };

  const initTags = () => {
    getTags().then(data => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setTags(data);
      }
    });
  };

  const handleTagToggle = c => () => {
    setValues({ ...values, error: '' });
    const clickedTag = checkedTag.indexOf(c);
    const all = [...checkedTag];

    if (clickedTag === -1) {
      all.push(c);
    } else {
      all.splice(clickedTag, 1);
    }
    setCheckedTag(all);
  };

  const findOutTag = t => {
    const result = checkedTag.indexOf(t);
    if (result !== -1) {
      return true;
    } else {
      return false;
    }
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
    <div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>
      {error}
    </div>
  );

  const showSuccess = () => (
    <div className="alert alert-success" style={{ display: success ? '' : 'none' }}>
      {success}
    </div>
  );

  const handleChange = name => e => {
    let value;
    const target = e.target;

    if (name === 'photo') {
      if (target.files[0].size <= 1000000) {
        value = target.files[0];
        setRenderedPhoto(URL.createObjectURL(value));
      } else {
        alert(t('file_too_big'));
      }
    } else if (name === 'gallery') {
      let safeToSave = true;
      const length = target.files.length;

      if (length > 10) {
        safeToSave = false;
        alert(t('too_many_images'));
      }

      for (let i = 0; i < length; i++) {
        if (target.files[i].size <= 1000000) {
          value = target.files[i];
        } else {
          safeToSave = false;
          alert(t('file_too_big'));
        }
      }

      if (safeToSave) {
        setGallery(target.files);
      }
    } else if (target.type === 'checkbox') {
      value = target.checked;
    } else {
      value = target.value;
    }

    setShowExitPrompt(true);

    setValues({ ...values, [name]: value, error: '' });
  };

  const toggleShow = () => setModal(!modal);

  const publishOrEditAnnouncement = async e => {
    e.preventDefault();

    setModalLoading(true);
    await toggleShow();

    const allRoutes = [];

    if (currentRoutes) {
      await currentRoutes.map(element => {
        allRoutes.push(element.circleCoords);
      });
    }

    if (seedRoutes) {
      await seedRoutes.map(element => {
        allRoutes.push(element);
      });
    }

    let formData = await new FormData();
    await formData.append('title', values.title);
    await formData.append('body', body);
    await formData.append('startDate', startDate);
    await formData.append('endDate', endDate);
    await formData.append('price', price);
    await formData.append('includedInPrice', JSON.stringify(includedInPrice));
    await formData.append('notIncludedInPrice', JSON.stringify(notIncludedInPrice));
    await formData.append('yacht', yacht);
    await formData.append('yachtDesc', yachtDesc);
    await formData.append('organizer', organizer);
    await formData.append('category', category);
    await formData.append('lastMinute', lastMinute);
    await formData.append('tidalCruise', tidalCruise);
    await formData.append('language', locale);
    await formData.append('currency', currency);
    await formData.append('tags', checkedTag);
    await formData.append('allRoutes', JSON.stringify(allRoutes));
    if (photo) {
      // prevent photo from overwriting with empty
      await formData.append('photo', photo);
    }
    if (gallery) {
      // prevent gallery from overwriting with empty
      const length = gallery.length;
      for (let i = 0; i < length; i++) {
        await formData.append('gallery', gallery[i]);
      }
    }

    if (!router.query.slug) {
      create(formData).then(data => {
        if (data.error) {
          setValues({ ...values, error: data.error, success: '' });
          setModalLoading(false);
        } else {
          setModalLoading(false);
          setShowExitPrompt(false);
          setValues({
            ...values,
            error: '',
            responseData: data,
            success: t('create_success', { title: data.title }),
          });
        }
      });
    } else if (router.query.slug) {
      update(formData, router.query.slug, user).then(data => {
        if (data.error) {
          setValues({ ...values, error: data.error, success: '' });
          setModalLoading(false);
        } else {
          setModalLoading(false);
          setShowExitPrompt(false);
          setValues({
            ...values,
            error: '',
            responseData: data,
            success: t('update_success', { title: data.title }),
          });
        }
      });
    }
  };

  const mainForm = () => {
    return (
      <form onSubmit={publishOrEditAnnouncement} id="announcementForm">
        <div className="form-group">
          <label className="text-muted">{t('Title')}*</label>
          <LimitedInput type="text" value={title} onChange={handleChange('title')} limit={70} />
        </div>

        <div className="row">
          <div className="form-group col-md-4 mt-2">
            <label className="text-muted">{t('Start date')}*</label>
            <input
              id="startDate"
              type="date"
              className="form-control"
              value={startDate}
              onChange={handleChange('startDate')}
            />
          </div>

          <div className="form-group col-md-4 mt-2">
            <label className="text-muted">{t('End date')}*</label>
            <input
              id="endDate"
              type="date"
              className="form-control"
              value={endDate}
              onChange={handleChange('endDate')}
            />
          </div>

          <div className="form-group col-md-2 mt-2">
            <label className="text-muted text-nowrap">{t('Price per person')}*</label>
            <input
              type="number"
              min="0"
              className="form-control"
              value={price}
              onChange={handleChange('price')}
            />
          </div>

          <div className="form-group col-md-2 mt-2">
            <br />
            <select
              name="currency"
              id="currency"
              className="form-control"
              value={currency}
              onChange={handleChange('currency')}>
              <option value="pln">PLN</option>
              <option value="eur">EUR</option>
            </select>
          </div>
        </div>

        <label className="text-muted mt-2">{t('what_included_in_price')}*</label>
        <CreatableSelect
          isMulti
          isClearable
          value={includedInPrice}
          onChange={inputValue => setIncludedInPrice(inputValue)}
          options={includedInPriceData}
          placeholder={t('choose') + '...'}
        />

        <label className="text-muted mt-2">{t('what_not_included_in_price')}*</label>
        <CreatableSelect
          isMulti
          isClearable
          value={notIncludedInPrice}
          onChange={inputValue => setNotIncludedInPrice(inputValue)}
          options={includedInPriceData}
          placeholder={t('choose') + '...'}
        />

        <div className="form-group mt-2">
          <label className="text-muted">{t('yacht')}*</label>
          <LimitedInput type="text" limit={50} value={yacht} onChange={handleChange('yacht')} />
        </div>

        <div className="form-group mt-2">
          <label className="text-muted">{t('yacht_desc')}</label>
          <LimitedInput
            type="text"
            limit={120}
            value={yachtDesc}
            onChange={handleChange('yachtDesc')}
          />
        </div>

        <div className="form-group mt-2">
          <label className="text-muted">{t('organizer')}*</label>
          <LimitedInput
            type="text"
            limit={120}
            value={organizer}
            onChange={handleChange('organizer')}
          />
        </div>

        <div className="form-group mt-2">
          <label className="text-muted">{t('Description')}</label>
          <ReactQuill
            modules={QuillModules}
            formats={QuillFormats}
            value={body}
            placeholder={t('Write something')}
            onChange={e => setBody(e)}
          />
        </div>
      </form>
    );
  };

  const additionalInfo = () => {
    return (
      <>
        <div className="form-group pb-2 mt-3">
          <h5>{t('featured_image')}</h5>
          <hr />
          <div className="d-flex justify-content-center mb-1">
            {router.query.slug && !renderedPhoto && (
              <Image
                src={`${process.env.NEXT_PUBLIC_API}/announcement/photo/${router.query.slug}`}
                alt={title}
                width={200}
                height={'100%'}
                unoptimized={true}
              />
            )}
            {renderedPhoto && (
              <div
                style={{
                  width: '200px',
                }}>
                <img
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                  }}
                  src={renderedPhoto}
                  alt={title}
                />
              </div>
            )}
          </div>
          <small className="text-muted me-2">{t('max_image_size_1mb')}</small>
          <label className="btn btn-outline-info">
            {t('upload_featured_image')}
            <input onChange={handleChange('photo')} type="file" accept="image/*" hidden />
          </label>
        </div>

        <div className="form-group pb-2 mt-3">
          <h5>{t('gallery')}</h5>
          <hr />
          <small className="text-muted me-2">{t('max_images', { count: 10 })}</small>-{' '}
          <small className="text-muted me-2">{t('max_image_size_1mb')}</small>
          <label className="btn ">
            <input onChange={handleChange('gallery')} type="file" accept="image/*" multiple />
          </label>
        </div>

        <div className="form-group mt-3">
          <h5>{t('Cruise map (Optional)')}</h5>
          <hr />
          <div className="border" style={{ width: 'auto', height: '400px' }}>
            <Map
              setCurrentRoutes={setCurrentRoutes}
              setSeedRoutes={setSeedRoutes}
              seedRoutes={seedRoutes}
            />
          </div>
        </div>

        <div className="mt-3">
          <h5>{t('Category')}*</h5>
          <hr />
          <select className="form-select mb-3" value={category} onChange={handleChange('category')}>
            {availableCategories.map((cat, i) => (
              <option key={i} value={cat.value}>
                {t(`${cat.value}`)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <h5>{t('Tags')}*</h5>
          <hr />
          <ul style={{ maxHeight: '200px', overflowY: 'scroll' }}>{showTags()}</ul>
        </div>

        <div className="mb-2">
          <h5>{t('last_minute')}</h5>
          <hr />
          <input
            type="checkbox"
            className="me-1"
            checked={lastMinute}
            onChange={handleChange('lastMinute')}
          />
          <label htmlFor="lastMinute" className="small">
            {t('last_minute_message')}
          </label>
        </div>

        <div className="mt-4">
          <h5>{t('tidal_cruise')}</h5>
          <hr />
          <input
            type="checkbox"
            className="me-1"
            checked={tidalCruise}
            onChange={handleChange('tidalCruise')}
          />
          <label htmlFor="tidalCruise" className="small">
            {t('tidal_cruise_message')}
          </label>
        </div>
      </>
    );
  };

  return (
    <>
      <MDBModal tabIndex="-1" show={modal} getOpenState={e => setModal(e)}>
        <MDBModalDialog centered>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>
                {router.query.slug ? t('Edit announcement') : t('Publish announcement')}
              </MDBModalTitle>
            </MDBModalHeader>
            <MDBModalBody>
              <div>
                {modalLoading && (
                  <div className="d-flex justify-content-center">
                    <MDBSpinner
                      color="primary"
                      role="status"
                      style={{ width: '3rem', height: '3rem' }}
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
                  {!router.query.slug && (
                    <>
                      <MDBBtn onClick={() => Router.reload(window.location.pathname)}>
                        {t('add_new')}
                      </MDBBtn>

                      <Link href={`/user/manage/${responseData.slug}`}>
                        <a>
                          <MDBBtn>{t('edit')}</MDBBtn>
                        </a>
                      </Link>
                    </>
                  )}
                  <Link href={`/announcements/${responseData.slug}`}>
                    <a>
                      <MDBBtn>{t('see')}</MDBBtn>
                    </a>
                  </Link>
                </>
              )}
              {error && <MDBBtn onClick={toggleShow}>{t('close')}</MDBBtn>}
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
      <div className="container-fluid pb-3">
        <div className="row">
          <div className="col-xl-8">{mainForm()}</div>
          <div className="col-xl-4">{additionalInfo()}</div>
        </div>
        <div className="float-end mb-4 mt-5">
          <button type="submit" className="btn btn-primary" form="announcementForm">
            {router.query.slug ? t('Edit announcement') : t('Publish announcement')}
          </button>
        </div>
      </div>
    </>
  );
};

export default withRouter(CreateUpdate);
