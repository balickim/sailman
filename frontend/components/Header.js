import { useAuth } from "./auth/AuthProvider";

import { useState } from "react";
import {
  MDBNavbar,
  MDBNavbarToggler,
  MDBContainer,
  MDBCollapse,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBNavbarBrand,
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
        <Link href="/">
          <a>
            <MDBNavbarBrand>Sailman</MDBNavbarBrand>
          </a>
        </Link>
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
              <Link href="/announcements">
                <a>
                  <MDBNavbarLink>{t("Announcements")}</MDBNavbarLink>
                </a>
              </Link>
            </MDBNavbarItem>

            {/* ᐯᐯᐯᐯᐯᐯᐯᐯᐯᐯᐯ -------------------------------------------------------------- USER -------------------------------------------------------------- ᐯᐯᐯᐯᐯᐯᐯᐯᐯᐯᐯ */}
            {role === "user" && (
              <>
                <MDBNavbarItem>
                  <Link href="/user">
                    <a>
                      <MDBNavbarLink>{`${user.name} ${t(
                        "Dashboard"
                      )}`}</MDBNavbarLink>
                    </a>
                  </Link>
                </MDBNavbarItem>
                <MDBNavbarItem>
                  <Link href="/contact">
                    <a>
                      <MDBNavbarLink>{t("Contact")}</MDBNavbarLink>
                    </a>
                  </Link>
                </MDBNavbarItem>
                <MDBNavbarItem>
                  <Link href="/user/crud/announcement">
                    <a>
                      <MDBBtn>{t("Add announcement")}</MDBBtn>
                    </a>
                  </Link>
                </MDBNavbarItem>
              </>
            )}
            {/* ᐱᐱᐱᐱᐱᐱᐱᐱᐱᐱᐱ -------------------------------------------------------------- USER -------------------------------------------------------------- ᐱᐱᐱᐱᐱᐱᐱᐱᐱᐱᐱ */}

            {/* ᐯᐯᐯᐯᐯᐯᐯᐯᐯᐯᐯ -------------------------------------------------------------- MODERATOR -------------------------------------------------------------- ᐯᐯᐯᐯᐯᐯᐯᐯᐯᐯᐯ */}
            {role === "moderator" && (
              <>
                <MDBNavbarItem>
                  <Link href="/admin">
                    <a>
                      <MDBNavbarLink>{`${user.name} ${t(
                        "Dashboard"
                      )}`}</MDBNavbarLink>
                    </a>
                  </Link>
                </MDBNavbarItem>
              </>
            )}
            {/* ᐱᐱᐱᐱᐱᐱᐱᐱᐱᐱᐱ -------------------------------------------------------------- MODERATOR -------------------------------------------------------------- ᐱᐱᐱᐱᐱᐱᐱᐱᐱᐱᐱ */}

            {/* ᐯᐯᐯᐯᐯᐯᐯᐯᐯᐯᐯ -------------------------------------------------------------- ADMIN -------------------------------------------------------------- ᐯᐯᐯᐯᐯᐯᐯᐯᐯᐯᐯ */}
            {role === "admin" && (
              <>
                <MDBNavbarItem>
                  <Link href="/admin">
                    <a>
                      <MDBNavbarLink>{`${user.name} ${t(
                        "Dashboard"
                      )}`}</MDBNavbarLink>
                    </a>
                  </Link>
                </MDBNavbarItem>
              </>
            )}
            {/* ᐱᐱᐱᐱᐱᐱᐱᐱᐱᐱᐱ -------------------------------------------------------------- ADMIN -------------------------------------------------------------- ᐱᐱᐱᐱᐱᐱᐱᐱᐱᐱᐱ */}

            {/* ᐯᐯᐯᐯᐯᐯᐯᐯᐯᐯᐯ -------------------------------------------------------------- NOT LOGGED IN -------------------------------------------------------------- ᐯᐯᐯᐯᐯᐯᐯᐯᐯᐯᐯ */}
            {!role && (
              <>
                <MDBNavbarItem>
                  <Link href="/signup">
                    <a>
                      <MDBBtn>{t("Signup")}</MDBBtn>
                    </a>
                  </Link>
                </MDBNavbarItem>
                <MDBNavbarItem>
                  <Link href="/signin">
                    <a>
                      <MDBBtn>{t("Signin")}</MDBBtn>
                    </a>
                  </Link>
                </MDBNavbarItem>
                <MDBNavbarItem>
                  <Link href="/contact">
                    <a>
                      <MDBNavbarLink>{t("Contact")}</MDBNavbarLink>
                    </a>
                  </Link>
                </MDBNavbarItem>
              </>
            )}
            {/* ᐱᐱᐱᐱᐱᐱᐱᐱᐱᐱᐱ -------------------------------------------------------------- NOT LOGGED IN -------------------------------------------------------------- ᐱᐱᐱᐱᐱᐱᐱᐱᐱᐱᐱ */}
          </MDBNavbarNav>

          {/* ᐯᐯᐯᐯᐯᐯᐯᐯᐯᐯᐯ -------------------------------------------------------------- LOGGED IN -------------------------------------------------------------- ᐯᐯᐯᐯᐯᐯᐯᐯᐯᐯᐯ */}
          {role && (
            <>
              <MDBBtn onClick={() => signout(() => Router.replace(`/signin`))}>
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
