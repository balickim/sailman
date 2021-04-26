import { useState } from "react";
import { useAuth } from "../auth/AuthProvider";
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

const Header = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const { signout, user } = useAuth();

  const toggle = () => setIsOpen(!isOpen);

  let { t } = useTranslation("common");

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

            <NavItem>
              <Link href="/contact">
                <a className="nav-link" style={{ cursor: "pointer" }}>
                  {t("Contact")}
                </a>
              </Link>
            </NavItem>

            <NavItem>
              <Link href="/user/crud/announcement">
                <a className="nav-link" className="btn btn-primary text-light">
                  {t("Add announcement")}
                </a>
              </Link>
            </NavItem>
            {process.env.NEXT_PUBLIC_NODE_ENV === "development" ? (
              <NavItem>User</NavItem>
            ) : null}
          </Nav>
        </Collapse>
      </Navbar>
    </>
  );
};

export default Header;
