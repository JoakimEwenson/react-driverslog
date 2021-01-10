import React, { useEffect, useState } from "react";
import { Alert, Card, Container, Table } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import AppMenu from "./AppMenu";
import StatisticsView from "./subcomponents/StatisticsView";

export default function Logbook() {
  const { vehicleId } = useParams();
  const [logposts, setLogposts] = useState([]);
  const [error, setError] = useState("");
  const { currentUser } = useAuth();

  useEffect(() => {
    var query;
    if (vehicleId) {
      query = db
        .collection("logposts")
        .where("owner_id", "==", currentUser.uid)
        .where("vehicle", "==", vehicleId)
        .orderBy("created_timestamp", "desc");
    } else {
      query = db
        .collection("logposts")
        .where("owner_id", "==", currentUser.uid)
        .orderBy("created_timestamp", "desc");
    }
    const unsubscribe = query.onSnapshot(
      (snap) => {
        var output = [];
        setError("");
        snap.forEach((doc) => {
          output.push({ id: doc.id, data: doc.data() });
        });
        setLogposts(output);
      },
      (error) => {
        setError(`Error while fetching data. ${error}`);
      }
    );
    return () => unsubscribe;
  }, [currentUser, vehicleId]);

  return (
    <>
      <AppMenu />
      <Container fluid className="my-3">
        <h3>Logbook {vehicleId && vehicleId}</h3>
        {vehicleId ? (
          <Link to={`/add/logpost/${vehicleId}`}>Add new post</Link>
        ) : (
          <Link to={`/add/logpost/`}>Add new post</Link>
        )}
        {error && <Alert variant="danger">{error}</Alert>}
        {logposts && (
          <>
          <StatisticsView data={logposts} />
          <Card className="my-3">

          <Table responsive striped borderless className="m-0 p-0">
            <thead>
              <tr>
                <th>Date</th>
                {!vehicleId && <th>Vehicle</th>}
                <th>Distance</th>
                <th>Fuel</th>
                <th>Price</th>
                <th>Consumption</th>
                <th>&nbsp;</th>
              </tr>
            </thead>
            <tbody>
              {logposts.length > 0 ? (
                logposts.map((row) => (
                  <tr key={row.id}>
                    <td>
                      {new Date(
                        row.data.created_timestamp.seconds * 1000
                      ).toLocaleDateString("sv-SE")}
                    </td>
                    {!vehicleId && (
                      <td>
                        <Link to={`/logbook/${row.data.vehicle}`}>
                          {row.data.vehicle}
                        </Link>
                      </td>
                    )}
                    <td>{parseFloat(row.data.distance).toFixed(1)} km</td>
                    <td>{parseFloat(row.data.fuel).toFixed(2)} liter</td>
                    <td>
                      {parseFloat(row.data.fuelprice)}{" "}
                      {row.data.currency === "SEK"
                        ? " kr/liter"
                        : row.data.currency + "/liter"}
                    </td>
                    <td>
                      {parseFloat(
                        (row.data.fuel / row.data.distance) * 100
                      ).toFixed(2)}{" "}
                      l/100 km
                    </td>
                    <td>
                      <Link to={`/edit/logpost/${row.id}`}>Edit</Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={vehicleId ? "6" : "7"}>No logposts found.</td>
                </tr>
              )}
            </tbody>
          </Table>
          </Card>
          </>
        )}
        {vehicleId && (
          <Container className="my-3 text-center">
            <Link to="/logbook">Back to logbook</Link>
          </Container>
        )}
      </Container>
    </>
  );
}
