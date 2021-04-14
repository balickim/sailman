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
          <NavLink style={{ cursor: "pointer" }} className="navbar-brand">
            Sailman
          </NavLink>
        </Link>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="mr-auto" navbar>
            <NavItem style={{ cursor: "pointer" }}>
              <Link href="/announcements">
                <NavLink>{t("Announcements")}</NavLink>
              </Link>
            </NavItem>

            <>
              <NavItem style={{ cursor: "pointer" }}>
                <Link href="/signup">
                  <NavLink>{t("Signup")}</NavLink>
                </Link>
              </NavItem>
              <NavItem style={{ cursor: "pointer" }}>
                <Link href="/signin">
                  <NavLink>{t("Signin")}</NavLink>
                </Link>
              </NavItem>
            </>

            <NavItem>
              <Link href="/contact">
                <NavLink style={{ cursor: "pointer" }}>{t("Contact")}</NavLink>
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
