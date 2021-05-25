import Link from 'next/link';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import useTranslation from 'next-translate/useTranslation';

import { list, remove } from '@actions/announcement';

import { useAuth } from '@components/auth/AuthProvider';

const AnnouncementList = ({ username }) => {
  const [announcements, setAnnouncements] = useState([]);
  const [message, setMessage] = useState('');

  const { user } = useAuth();

  const { t } = useTranslation('common');

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = () => {
    list(username).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        setAnnouncements(data);
      }
    });
  };

  const deleteAnnouncement = slug => {
    remove(slug, user).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        setMessage(data.message);
        loadAnnouncements();
      }
    });
  };

  const deleteConfirm = slug => {
    let answer = window.confirm('Are you sure you want to delete this?');
    if (answer) {
      deleteAnnouncement(slug);
    }
  };

  const showUpdateButton = announcement => {
    if (user && user.role === 'user') {
      return (
        <Link href={`/user/manage/${announcement.slug}`}>
          <a className="btn btn-sm btn-warning">Update</a>
        </Link>
      );
    } else if ((user && user.role === 'admin') || user.role === 'moderator') {
      return (
        <Link href={`/admin/manage/${announcement.slug}`}>
          <a className="ms-2 btn btn-sm btn-warning">Update</a>
        </Link>
      );
    }
  };

  const showAllAnnouncements = () => {
    return announcements.map((announcement, i) => {
      return (
        <div key={i} className="pb-5">
          <h3>
            <Link href={`/announcements/${announcement.slug}`}>
              <a>
                <h2 className="pt-3 pb-3 font-weight-bold">{announcement.title}</h2>
              </a>
            </Link>
          </h3>
          <p className="mark">
            Written by {announcement.postedBy.name} | Published{' '}
            {dayjs(announcement.updatedAt).format('D MMMM, YYYY HH:MM')}
          </p>
          <button
            className="btn btn-sm btn-danger"
            onClick={() => deleteConfirm(announcement.slug)}>
            Delete
          </button>
          {showUpdateButton(announcement)}
        </div>
      );
    });
  };

  return (
    <>
      <div className="col-md-12 pt-5 pb-5">
        <h2>{t('Manage announcements')}</h2>
      </div>
      <div className="row">
        <div className="col-md-12">
          {message && <div className="alert alert-warning">{message}</div>}
          {showAllAnnouncements()}
        </div>
      </div>
    </>
  );
};

export default AnnouncementList;
