import dayjs from 'dayjs';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const SmallCard = ({ announcement }) => {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <div className="card">
      <section className="m-2 text-center">
        <Image
          width={'200px'}
          height={'100%'}
          src={`${process.env.NEXT_PUBLIC_API}/announcement/photo/${announcement.slug}`}
          onError={e => {
            if (!imageFailed) {
              setImageFailed(true);
              e.target.src = '/images/ann-default.webp';
            }
          }}
          alt={announcement.title}
          className="img img-fluid"
          unoptimized={true}
        />
      </section>
      <div className="card-body">
        <section>
          <Link href={`/announcements/${announcement.slug}`}>
            <a>
              <h5 className="card-title">{announcement.title}</h5>
            </a>
          </Link>
          <div className="card-text">{announcement.mdesc}</div>
        </section>
      </div>
      <div className="card-body">
        <div>
          <div className="mark ms-1 pt-2 pb-2">
            Posted by{' '}
            <Link href={`/profile/${announcement.postedBy.username}`}>
              <a>{announcement.postedBy.username}</a>
            </Link>{' '}
            | Published {dayjs(announcement.updatedAt).format('D MMMM, YYYY HH:MM')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmallCard;
