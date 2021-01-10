import {
  Assignment,
  Commute,
  Dashboard,
  ExitToApp,
  Settings,
} from "@material-ui/icons";
import React from "react";
import { Nav, Navbar } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useHistory } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "../logo.svg"

export default function AppMenu() {
  const { currentUser, logout } = useAuth();
  const history = useHistory();

  async function handleLogout(e) {
    e.preventDefault();
    try {
      await logout();
      history.push("/login");
    } catch (e) {
      console.log(`Failed to log out. ${e}`);
    }
  }

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <LinkContainer to="/dashboard" eventKey="dashboard">
        <Navbar.Brand>
          <img src={Logo} alt="React logo" style={{width: "50px"}} />
          Drivers logbook
        </Navbar.Brand>
      </LinkContainer>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
          <LinkContainer to="/dashboard" eventKey="dashboard">
            <Nav.Link>
              <Dashboard /> Dashboard
            </Nav.Link>
          </LinkContainer>
          <LinkContainer to="/edit/user" eventKey="settings">
            <Nav.Link>
              <Settings /> User settings
            </Nav.Link>
          </LinkContainer>
          <LinkContainer to="/vehicles" eventKey="vehicles">
            <Nav.Link>
              <Commute /> Vehicles
            </Nav.Link>
          </LinkContainer>

          <LinkContainer to="/logbook" eventKey="logposts">
            <Nav.Link>
              <Assignment /> Logbook
            </Nav.Link>
          </LinkContainer>
          <LinkContainer to="/logout" onClick={handleLogout} eventKey="logout">
            <Nav.Link className="justify-content-end">
              <ExitToApp /> Log out ({currentUser.email})
            </Nav.Link>
          </LinkContainer>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
