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
    var output = [];
    db.collection("vehicles")
      .where("owner_id", "==", currentUser.uid)
      .orderBy("created_timestamp", "asc")
      .get()
      .then((result) => {
        result.forEach((doc) => {
          output.push(doc.data());
          setError("");
        });
      })
      .catch((error) => {
        setError(`Error fetching document. ${error}`);
      })
      .finally(() => {
        setVehicles(output);
      });
  }, [currentUser]);

  return (
    <>
      <AppMenu />
      <Container fluid className="mt-3">
        <h3>Vehicles</h3>
        <Link to="/add/vehicle">Add new vehicle</Link>
        {error && <Alert variant="danger">{error}</Alert>}
        <Table striped bordered className="mt-3">
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
                <tr key={row.plate}>
                  <td>{row.plate}</td>
                  <td>{row.make}</td>
                  <td>{row.model}</td>
                  <td>
                    <Link to={`/edit/vehicle/${row.plate}`}>Edit</Link>
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
