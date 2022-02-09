import { useAuth } from '@components/auth/AuthProvider';

import { useState } from 'react';
import {
  MDBNavbar,
  MDBNavbarToggler,
  MDBContainer,
  MDBCollapse,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBBtn,
  MDBIcon,
} from 'mdb-react-ui-kit';
import Image from 'next/image';
import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';

const Header = ({ userRole }) => {
  const { signout } = useAuth();
  const { t } = useTranslation('common');

  const [show, setShow] = useState(false);

  return (
    <MDBNavbar expand="lg" light bgColor="white" className="p-3">
      <MDBContainer fluid>
        <Link href="/">
          <a>
            <div className="navbar-brand">
              <Image
                src="/images/logo.png"
                alt="living by sail logo"
                width="135"
                height="40"
                priority={true}
              />
            </div>
          </a>
        </Link>

        <MDBNavbarToggler
          type="button"
          aria-expanded="false"
          aria-label="Toggle navigation"
          onClick={() => setShow(!show)}>
          <MDBIcon icon="bars" fas />
        </MDBNavbarToggler>
        <MDBCollapse navbar show={show}>
          <MDBNavbarNav className="mb-2 mb-lg-0">
            <MDBNavbarItem>
              <div className="nav-link">
                <Link href="/announcements">{t('announcements').toUpperCase()}</Link>
              </div>
            </MDBNavbarItem>

            {/* ᐯᐯᐯᐯᐯᐯᐯᐯᐯᐯᐯ -------------------------------------------------------------- USER -------------------------------------------------------------- ᐯᐯᐯᐯᐯᐯᐯᐯᐯᐯᐯ */}
            {userRole === 'user' && (
              <>
                <MDBNavbarItem>
                  <div className="nav-link">
                    <Link href="/contact">{t('contact').toUpperCase()}</Link>
                  </div>
                </MDBNavbarItem>
                <MDBNavbarItem>
                  <Link href="/user/manage/announcement">
                    <a className="text-white">
                      <MDBBtn rounded>{t('add_announcement')}</MDBBtn>
                    </a>
                  </Link>
                </MDBNavbarItem>
              </>
            )}
            {/* ᐱᐱᐱᐱᐱᐱᐱᐱᐱᐱᐱ -------------------------------------------------------------- USER -------------------------------------------------------------- ᐱᐱᐱᐱᐱᐱᐱᐱᐱᐱᐱ */}

            {/* ᐯᐯᐯᐯᐯᐯᐯᐯᐯᐯᐯ -------------------------------------------------------------- MODERATOR -------------------------------------------------------------- ᐯᐯᐯᐯᐯᐯᐯᐯᐯᐯᐯ */}
            {userRole === 'moderator' && <>{/*  */}</>}
            {/* ᐱᐱᐱᐱᐱᐱᐱᐱᐱᐱᐱ -------------------------------------------------------------- MODERATOR -------------------------------------------------------------- ᐱᐱᐱᐱᐱᐱᐱᐱᐱᐱᐱ */}

            {/* ᐯᐯᐯᐯᐯᐯᐯᐯᐯᐯᐯ -------------------------------------------------------------- ADMIN -------------------------------------------------------------- ᐯᐯᐯᐯᐯᐯᐯᐯᐯᐯᐯ */}
            {userRole === 'admin' && <>{/*  */}</>}
            {/* ᐱᐱᐱᐱᐱᐱᐱᐱᐱᐱᐱ -------------------------------------------------------------- ADMIN -------------------------------------------------------------- ᐱᐱᐱᐱᐱᐱᐱᐱᐱᐱᐱ */}

            {/* ᐯᐯᐯᐯᐯᐯᐯᐯᐯᐯᐯ -------------------------------------------------------------- NOT LOGGED IN -------------------------------------------------------------- ᐯᐯᐯᐯᐯᐯᐯᐯᐯᐯᐯ */}
            {!userRole && (
              <>
                <MDBNavbarItem>
                  <div className="nav-link">
                    <Link href="/contact">{t('contact').toUpperCase()}</Link>
                  </div>
                </MDBNavbarItem>
                <MDBNavbarItem>
                  <Link href="/signup">
                    <a className="text-white me-1">
                      <MDBBtn rounded>{t('signup')}</MDBBtn>
                    </a>
                  </Link>
                </MDBNavbarItem>
                <MDBNavbarItem>
                  <Link href="/signin">
                    <a className="text-white">
                      <MDBBtn rounded>{t('login')}</MDBBtn>
                    </a>
                  </Link>
                </MDBNavbarItem>
              </>
            )}
            {/* ᐱᐱᐱᐱᐱᐱᐱᐱᐱᐱᐱ -------------------------------------------------------------- NOT LOGGED IN -------------------------------------------------------------- ᐱᐱᐱᐱᐱᐱᐱᐱᐱᐱᐱ */}
          </MDBNavbarNav>

          {/* ᐯᐯᐯᐯᐯᐯᐯᐯᐯᐯᐯ -------------------------------------------------------------- LOGGED IN -------------------------------------------------------------- ᐯᐯᐯᐯᐯᐯᐯᐯᐯᐯᐯ */}
          {userRole && (
            <div className="ms-auto">
              <MDBNavbarNav>
                <MDBNavbarItem>
                  <Link href={`/${userRole}`}>
                    <a className="text-white me-1">
                      <MDBBtn rounded>
                        <div className="row text-nowrap">{t('my_account')}</div>
                      </MDBBtn>
                    </a>
                  </Link>
                </MDBNavbarItem>
                <MDBNavbarItem>
                  <MDBBtn rounded onClick={() => signout()}>
                    {t('logout')}
                  </MDBBtn>
                </MDBNavbarItem>
              </MDBNavbarNav>
            </div>
          )}
          {/* ᐱᐱᐱᐱᐱᐱᐱᐱᐱᐱᐱ -------------------------------------------------------------- LOGGED IN -------------------------------------------------------------- ᐱᐱᐱᐱᐱᐱᐱᐱᐱᐱᐱ */}
        </MDBCollapse>
      </MDBContainer>
    </MDBNavbar>
  );
};

export default Header;
