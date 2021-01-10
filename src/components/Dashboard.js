import React, { useEffect, useState } from "react";
import { Container, Col, Row, Alert } from "react-bootstrap";
import AppMenu from "./AppMenu";
import "../App.css";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import CarStatistics from "./subcomponents/CarStatistics";

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let query = db
      .collection("vehicles")
      .where("owner_id", "==", currentUser.uid)
      .orderBy("created_timestamp", "desc")
      .onSnapshot(
        (snap) => {
          var plates = [];
          snap.forEach((doc) => {
            let data = doc.data();
            plates.push({ id: doc.id, plate: data.plate });
          });
          setVehicles(plates);
        },
        (error) => {
          setError(error);
        }
      );

    return () => query;
  }, [currentUser.uid]);

  return (
    <>
      <AppMenu />
      <Container fluid className="my-3">
        <h1>Welcome {currentUser.displayName && currentUser.displayName}</h1>
        <p className="lead">
          This is a demo of a drivers logbook using React and Firebase FireStore
        </p>
        {error && <Alert variant="danger">{error}</Alert>}
        {vehicles && (
          <>
            {vehicles.length > 0 ? (
              <>
                <h3>Your vehicles</h3>
                <Row>
                  {vehicles.map((row) => (
                    <Col sm={6} md={4} className="my-3" key={row.id}>
                      <CarStatistics data={row} />
                    </Col>
                  ))}
                </Row>
              </>
            ) : (
              <Alert variant="info">No vehicles found</Alert>
            )}
          </>
        )}
      </Container>
    </>
  );
}
