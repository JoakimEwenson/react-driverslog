import React, { useEffect, useState } from "react";
import { Alert, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase";

export default function CarStatistics({ data }) {
  const [error, setError] = useState("");
  const [stats, setStats] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    let query = db
      .collection("logposts")
      .where("owner_id", "==", currentUser.uid)
      .where("vehicle", "==", data.plate)
      .onSnapshot(
        (snap) => {
          setError("");
          let totalDistance = 0.0,
            totalFuel = 0.0,
            totalPrice = 0.0;
          // Iterate data
          snap.forEach((doc) => {
            let data = doc.data();
            totalDistance += parseFloat(data.distance);
            totalFuel += parseFloat(data.fuel);
            totalPrice += parseFloat(data.fuelprice) * parseFloat(data.fuel);
          });
          //
          let consumtionPerDistance =
            totalFuel !== 0 ? (totalFuel / totalDistance) * 100 : 0;
          let pricePerDistance =
            totalPrice !== 0 ? (totalPrice / totalDistance) * 100 : 0;
          let avgPrice = totalPrice !== 0 ? totalPrice / totalFuel : 0;
          setStats({
            entries: snap.docs.length,
            consumtionPerDistance: consumtionPerDistance,
            pricePerDistance: pricePerDistance,
            avgPrice: avgPrice,
          });
        },
        (error) => {
          setError(error);
        }
      );
    return () => query;
  }, [currentUser.uid, data.plate]);

  return (
    <>
      {error && <Alert variant="danger">{error}</Alert>}
      {stats.entries > 0 ? (
        <Card className="logbook-card">
          <Card.Body className="text-center">
            <h3>
              <Link to={`/logbook/${data.plate}`}>{data.plate}</Link>
            </h3>
            <span className="text-muted small">
              {stats.entries} logbook entries
            </span>
            <h1>
              {stats.consumtionPerDistance.toFixed(2).toLocaleString("sv-SE")}
            </h1>
            <span className="text-muted small">l/100 km avg.</span>
            <h1>{stats.pricePerDistance.toFixed(2).toLocaleString("sv-SE")}</h1>
            <span className="text-muted small">kr/100 km</span>
            <h1>{stats.avgPrice.toFixed(2).toLocaleString("sv-SE")}</h1>
            <span className="text-muted small">kr/liter</span>
          </Card.Body>
        </Card>
      ) : (
        <Card className="logbook-card">
          <Card.Body className="text-center">
            <h3>
              <Link to={`/logbook/${data.plate}`}>{data.plate}</Link>
            </h3>
            <span className="text-muted small">
              No logbook entries found.<br />
              Please <Link to="/add/logpost/">add one</Link> to show statistics.
            </span>
          </Card.Body>
        </Card>
      )}
    </>
  );
}
