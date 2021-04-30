import { useAuth } from "./auth/AuthProvider";

import { useState } from "react";
import {
  MDBNavbar,
  MDBNavbarToggler,
  MDBContainer,
  MDBCollapse,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBBtn,
  MDBIcon,
} from "mdb-react-ui-kit";
import Link from "next/link";
import useTranslation from "next-translate/useTranslation";

const Header = ({ role }) => {
  const { signout, user } = useAuth();
  const { t } = useTranslation("common");

  const [show, setShow] = useState(false);

  return (
    <MDBNavbar expand="lg" light bgColor="white" className="p-3">
      <MDBContainer fluid>
        <div className="navbar-brand">
          <Link href="/">Sailman</Link>
        </div>
        <MDBNavbarToggler
          type="button"
          aria-expanded="false"
          aria-label="Toggle navigation"
          onClick={() => setShow(!show)}
        >
          <MDBIcon icon="bars" fas />
        </MDBNavbarToggler>
        <MDBCollapse navbar show={show}>
          <MDBNavbarNav className="mb-2 mb-lg-0">
            <MDBNavbarItem>
              <div className="nav-link">
                <Link href="/announcements">{t("Announcements")}</Link>
              </div>
            </MDBNavbarItem>

            {/* ᐯᐯᐯᐯᐯᐯᐯᐯᐯᐯᐯ -------------------------------------------------------------- USER -------------------------------------------------------------- ᐯᐯᐯᐯᐯᐯᐯᐯᐯᐯᐯ */}
            {role === "user" && (
              <>
                <MDBNavbarItem>
                  <div className="nav-link">
                    <Link href="/user">{`${user.name} ${t("Dashboard")}`}</Link>
                  </div>
                </MDBNavbarItem>
                <MDBNavbarItem>
                  <div className="nav-link">
                    <Link href="/contact">{t("Contact")}</Link>
                  </div>
                </MDBNavbarItem>
                <MDBNavbarItem>
                  <MDBBtn rounded>
                    <Link href="/user/crud/announcement">
                      <a className="text-white">{t("Add announcement")}</a>
                    </Link>
                  </MDBBtn>
                </MDBNavbarItem>
              </>
            )}
            {/* ᐱᐱᐱᐱᐱᐱᐱᐱᐱᐱᐱ -------------------------------------------------------------- USER -------------------------------------------------------------- ᐱᐱᐱᐱᐱᐱᐱᐱᐱᐱᐱ */}

            {/* ᐯᐯᐯᐯᐯᐯᐯᐯᐯᐯᐯ -------------------------------------------------------------- MODERATOR -------------------------------------------------------------- ᐯᐯᐯᐯᐯᐯᐯᐯᐯᐯᐯ */}
            {role === "moderator" && (
              <>
                <MDBNavbarItem>
                  <div className="nav-link">
                    <Link href="/admin">
                      {`${user.name} ${t("Dashboard")}`}
                    </Link>
                  </div>
                </MDBNavbarItem>
              </>
            )}
            {/* ᐱᐱᐱᐱᐱᐱᐱᐱᐱᐱᐱ -------------------------------------------------------------- MODERATOR -------------------------------------------------------------- ᐱᐱᐱᐱᐱᐱᐱᐱᐱᐱᐱ */}

            {/* ᐯᐯᐯᐯᐯᐯᐯᐯᐯᐯᐯ -------------------------------------------------------------- ADMIN -------------------------------------------------------------- ᐯᐯᐯᐯᐯᐯᐯᐯᐯᐯᐯ */}
            {role === "admin" && (
              <>
                <MDBNavbarItem>
                  <div className="nav-link">
                    <Link href="/admin">
                      {`${user.name} ${t("Dashboard")}`}
                    </Link>
                  </div>
                </MDBNavbarItem>
              </>
            )}
            {/* ᐱᐱᐱᐱᐱᐱᐱᐱᐱᐱᐱ -------------------------------------------------------------- ADMIN -------------------------------------------------------------- ᐱᐱᐱᐱᐱᐱᐱᐱᐱᐱᐱ */}

            {/* ᐯᐯᐯᐯᐯᐯᐯᐯᐯᐯᐯ -------------------------------------------------------------- NOT LOGGED IN -------------------------------------------------------------- ᐯᐯᐯᐯᐯᐯᐯᐯᐯᐯᐯ */}
            {!role && (
              <>
                <MDBNavbarItem>
                  <MDBBtn rounded>
                    <Link href="/signup">
                      <a className="text-white">{t("Signup")}</a>
                    </Link>
                  </MDBBtn>
                </MDBNavbarItem>
                <MDBNavbarItem>
                  <MDBBtn rounded>
                    <Link href="/signin">
                      <a className="text-white">{t("Signin")}</a>
                    </Link>
                  </MDBBtn>
                </MDBNavbarItem>
                <MDBNavbarItem>
                  <div className="nav-link">
                    <Link href="/contact">{t("Contact")}</Link>
                  </div>
                </MDBNavbarItem>
              </>
            )}
            {/* ᐱᐱᐱᐱᐱᐱᐱᐱᐱᐱᐱ -------------------------------------------------------------- NOT LOGGED IN -------------------------------------------------------------- ᐱᐱᐱᐱᐱᐱᐱᐱᐱᐱᐱ */}
          </MDBNavbarNav>

          {/* ᐯᐯᐯᐯᐯᐯᐯᐯᐯᐯᐯ -------------------------------------------------------------- LOGGED IN -------------------------------------------------------------- ᐯᐯᐯᐯᐯᐯᐯᐯᐯᐯᐯ */}
          {role && (
            <>
              <MDBBtn
                rounded
                onClick={() => signout(() => Router.replace(`/signin`))}
              >
                {t("Signout")}
              </MDBBtn>
            </>
          )}
          {/* ᐱᐱᐱᐱᐱᐱᐱᐱᐱᐱᐱ -------------------------------------------------------------- LOGGED IN -------------------------------------------------------------- ᐱᐱᐱᐱᐱᐱᐱᐱᐱᐱᐱ */}
          {process.env.NEXT_PUBLIC_NODE_ENV === "development" ? (
            <>{role ?? "Not logged in"}</>
          ) : null}
        </MDBCollapse>
      </MDBContainer>
    </MDBNavbar>
  );
};

export default Header;
