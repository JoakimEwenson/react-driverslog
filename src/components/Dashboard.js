import React from "react";
import { Container } from "react-bootstrap";
import AppMenu from "./AppMenu";
import "../App.css";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { currentUser } = useAuth();

  return (
    <>
      <AppMenu />
      <Container fluid className="my-3">
        <h1>Welcome {currentUser.displayName && currentUser.displayName}</h1>
        <p className="lead">
          This is a demo of a drivers logbook using React and Firebase FireStore
        </p>

        {currentUser && <p>Currently logged in as {currentUser.email}</p>}
      </Container>
    </>
  );
}
