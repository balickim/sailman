import { useState } from "react";
import { useAuth } from "../components/auth/AuthProvider";
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

            <NavItem>
              <Link href="/admin">
                <NavLink style={{ cursor: "pointer" }}>{`${user.name} ${t(
                  "Dashboard"
                )}`}</NavLink>
              </Link>
            </NavItem>

            <NavItem>
              <NavLink
                style={{ cursor: "pointer" }}
                onClick={() => signout(() => Router.replace(`/signin`))}
              >
                {t("Signout")}
              </NavLink>
            </NavItem>

            <NavItem>
              <Link href="/contact">
                <NavLink style={{ cursor: "pointer" }}>{t("Contact")}</NavLink>
              </Link>
            </NavItem>

            <NavItem>Admin</NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    </>
  );
};

export default Header;
