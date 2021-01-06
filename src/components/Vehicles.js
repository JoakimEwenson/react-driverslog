import React, { useEffect, useState } from "react";
import { Alert, Container, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import AppMenu from "./AppMenu";

export default function Vehicles() {
  const [error, setError] = useState("");
  const [vehicles, setVehicles] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    const unsubscribe = db.collection("vehicles")
    .where("owner_id", "==", currentUser.uid)
    .orderBy("created_timestamp", "asc")
    .onSnapshot((snap) => {
        var output = [];
        setError("");
        snap.forEach((doc) => {
          output.push({id: doc.id, data: doc.data()});
        });
        setVehicles(output);
      }, (error) => {
        setError(`Error while fetching data. ${error}`)
      });

      return () => unsubscribe;
  }, [currentUser]);

  return (
    <>
      <AppMenu />
      <Container fluid className="mt-3">
        <h3>Vehicles</h3>
        <Link to="/add/vehicle">Add new vehicle</Link>
        {error && <Alert variant="danger">{error}</Alert>}
        <Table responsive striped bordered className="mt-3">
          <thead>
            <tr>
              <th>Plate</th>
              <th>Make</th>
              <th>Model</th>
              <th>&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.length > 0 ?
            (
              vehicles.map((row) => (
                <tr key={row.data.plate}>
                  <td>{row.data.plate}</td>
                  <td>{row.data.make}</td>
                  <td>{row.data.model}</td>
                  <td>
                    <Link to={`/edit/vehicle/${row.id}`}>Edit</Link>
                  </td>
                </tr>
              ))
            )
              :
              (
              <tr>
                <td colSpan="5">No vehicles found</td>
              </tr>
            )}
          </tbody>
        </Table>
      </Container>
    </>
  );
}
