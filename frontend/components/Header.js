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

const Header = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

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
                <NavLink>Announcements</NavLink>
              </Link>
            </NavItem>
            <>
              <NavItem style={{ cursor: "pointer" }}>
                <Link href="/signup">
                  <NavLink>Signup</NavLink>
                </Link>
              </NavItem>
              <NavItem style={{ cursor: "pointer" }}>
                <Link href="/signin">
                  <NavLink>Signin</NavLink>
                </Link>
              </NavItem>
            </>
            <NavItem>
              <Link href="/contact">
                <NavLink style={{ cursor: "pointer" }}>Contact</NavLink>
              </Link>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    </>
  );
};

export default Header;
