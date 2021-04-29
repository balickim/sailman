import { useAuth } from "./auth/AuthProvider";

import { useState } from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";
import Link from "next/link";
import useTranslation from "next-translate/useTranslation";

const Header = ({ role }) => {
  const { signout, user } = useAuth();
  const { t } = useTranslation("common");

  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  return (
    <>
      <Navbar color="light" light expand="md">
        <Link href="/">
          <a
            className="nav-link"
            style={{ cursor: "pointer" }}
            className="navbar-brand"
          >
            Sailman
          </a>
        </Link>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="mr-auto" navbar>
            <NavItem style={{ cursor: "pointer" }}>
              <Link href="/announcements">
                <a className="nav-link">{t("Announcements")}</a>
              </Link>
            </NavItem>

            {/* -------------------------------------------------------------- USER -------------------------------------------------------------- */}
            {role === "user" && (
              <>
                <NavItem>
                  <Link href="/user">
                    <a className="nav-link" style={{ cursor: "pointer" }}>{`${
                      user.name
                    } ${t("Dashboard")}`}</a>
                  </Link>
                </NavItem>
                <NavItem>
                  <a
                    className="nav-link"
                    style={{ cursor: "pointer" }}
                    onClick={() => signout(() => Router.replace(`/signin`))}
                  >
                    {t("Signout")}
                  </a>
                </NavItem>
              </>
            )}
            {/* -------------------------------------------------------------- USER -------------------------------------------------------------- */}

            {/* -------------------------------------------------------------- MODERATOR -------------------------------------------------------------- */}
            {role === "moderator" && (
              <>
                <NavItem>
                  <Link href="/admin">
                    <a className="nav-link" style={{ cursor: "pointer" }}>{`${
                      user.name
                    } ${t("Dashboard")}`}</a>
                  </Link>
                </NavItem>
                <NavItem>
                  <a
                    className="nav-link"
                    style={{ cursor: "pointer" }}
                    onClick={() => signout(() => Router.replace(`/signin`))}
                  >
                    {t("Signout")}
                  </a>
                </NavItem>
              </>
            )}
            {/* -------------------------------------------------------------- MODERATOR -------------------------------------------------------------- */}

            {/* -------------------------------------------------------------- ADMIN -------------------------------------------------------------- */}
            {role === "admin" && (
              <>
                <NavItem>
                  <Link href="/admin">
                    <a className="nav-link" style={{ cursor: "pointer" }}>{`${
                      user.name
                    } ${t("Dashboard")}`}</a>
                  </Link>
                </NavItem>
                <NavItem>
                  <a
                    className="nav-link"
                    style={{ cursor: "pointer" }}
                    onClick={() => signout(() => Router.replace(`/signin`))}
                  >
                    {t("Signout")}
                  </a>
                </NavItem>
              </>
            )}
            {/* -------------------------------------------------------------- ADMIN -------------------------------------------------------------- */}

            {/* -------------------------------------------------------------- NOT LOGGED IN -------------------------------------------------------------- */}
            {!role && (
              <>
                <NavItem style={{ cursor: "pointer" }}>
                  <Link href="/signup">
                    <a className="nav-link">{t("Signup")}</a>
                  </Link>
                </NavItem>
                <NavItem style={{ cursor: "pointer" }}>
                  <Link href="/signin">
                    <a className="nav-link">{t("Signin")}</a>
                  </Link>
                </NavItem>
              </>
            )}
            {/* -------------------------------------------------------------- NOT LOGGED IN -------------------------------------------------------------- */}

            <NavItem>
              <Link href="/contact">
                <a className="nav-link" style={{ cursor: "pointer" }}>
                  {t("Contact")}
                </a>
              </Link>
            </NavItem>
          </Nav>
        </Collapse>

        {process.env.NEXT_PUBLIC_NODE_ENV === "development" ? (
          <NavItem>{role ?? "Not logged in"}</NavItem>
        ) : null}
      </Navbar>
    </>
  );
};

export default Header;
