import React from "react";
import { Nav, Navbar } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useHistory } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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
      <Navbar.Brand>Drivers logbook</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
          <LinkContainer to="/dashboard" eventKey="dashboard">
            <Nav.Link>
              <i className="fas fa-th-large"></i> Dashboard
            </Nav.Link>
          </LinkContainer>
          <LinkContainer to="/edit/user" eventKey="settings">
            <Nav.Link>
              <i className="fas fa-cogs"></i> User settings
            </Nav.Link>
          </LinkContainer>
          <LinkContainer to="/vehicles" eventKey="vehicles">
            <Nav.Link>
              <i className="fas fa-car-side"></i> Vehicles
            </Nav.Link>
          </LinkContainer>

          <LinkContainer to="/logbook" eventKey="logposts">
            <Nav.Link>
              <i className="fas fa-book"></i> Logbook
            </Nav.Link>
          </LinkContainer>
          <LinkContainer to="/logout" onClick={handleLogout} eventKey="logout">
            <Nav.Link className="justify-content-end">
              <i className="fas fa-sign-out-alt"></i> Log out ({currentUser.email})
            </Nav.Link>
          </LinkContainer>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
