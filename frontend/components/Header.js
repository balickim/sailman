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

const Header = (props) => {
  const [isOpen, setIsOpen] = useState(false);

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

            <NavItem>
              <Link href="/contact">
                <a className="nav-link" style={{ cursor: "pointer" }}>
                  {t("Contact")}
                </a>
              </Link>
            </NavItem>

            {process.env.NEXT_PUBLIC_NODE_ENV === "development" ? (
              <NavItem>Not logged in</NavItem>
            ) : null}
          </Nav>
        </Collapse>
      </Navbar>
    </>
  );
};

export default Header;
