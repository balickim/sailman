import { useState } from "react";
import { useAuth } from "../actions/AuthProvider";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";
import Link from "next/link";
import Search from "./blog/Search";

const Header = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const { signout, user } = useAuth();

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
              <Link href="/blogs">
                <NavLink>Blogs</NavLink>
              </Link>
            </NavItem>
            <NavItem>
              <Link href="/user">
                <NavLink
                  style={{ cursor: "pointer" }}
                >{`${user.name} Dashboard`}</NavLink>
              </Link>
            </NavItem>
            <NavItem>
              <NavLink
                style={{ cursor: "pointer" }}
                onClick={() => signout(() => Router.replace(`/signin`))}
              >
                Signout
              </NavLink>
            </NavItem>
            <NavItem>
              <Link href="/contact">
                <NavLink style={{ cursor: "pointer" }}>Contact</NavLink>
              </Link>
            </NavItem>
            <NavItem>
              <Link href="/user/crud/blog">
                <NavLink className="btn btn-primary text-light">
                  Add blog
                </NavLink>
              </Link>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
      <Search />
    </>
  );
};

export default Header;
