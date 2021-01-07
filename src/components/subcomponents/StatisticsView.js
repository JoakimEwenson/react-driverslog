import { Card, Col, Container, Row } from "react-bootstrap";
import React from "react";

export default function StatisticsView({ data }) {
  let totalDistance = 0.0,
    totalFuel = 0.0,
    totalPrice = 0.0;

  data.forEach((row) => {
    totalDistance += parseFloat(row.data.distance);
    totalFuel += parseFloat(row.data.fuel);
    totalPrice += parseFloat(row.data.fuelprice) * parseFloat(row.data.fuel);
  });

  let consumtionPerDistance =
    totalFuel !== 0 ? (totalFuel / totalDistance) * 100 : 0;
  let pricePerDistance =
    totalPrice !== 0 ? (totalPrice / totalDistance) * 100 : 0;
  let avgPrice = totalPrice !== 0 ? totalPrice / totalFuel : 0;

  if (data.length > 0) {
    return (
      <Card className="mx-auto my-3">
        <Card.Body>
          <Row className="text-center">
            <Col sm={4}>
              <span className="text-muted">total</span>
              <h1>{parseInt(totalDistance).toLocaleString("sv-SE")}</h1>
              <span className="text-muted">km</span>
              <br />
            </Col>
            <Col sm={4}>
              <span className="text-muted">total</span>
              <h1>{parseInt(totalFuel).toLocaleString("sv-SE")}</h1>
              <span className="text-muted">liter</span>
              <br />
            </Col>
            <Col sm={4}>
              <span className="text-muted">total</span>
              <h1>{parseInt(totalPrice).toLocaleString("sv-SE")}</h1>
              <span className="text-muted">kr</span>
              <br />
            </Col>
          </Row>
          <hr className="mx-auto my-3" />
          <Row className="text-center">
            <Col sm={4}>
              <span className="text-muted">avg</span>
              <h1>
                {consumtionPerDistance.toFixed(2).toLocaleString("sv-SE")}
              </h1>
              <p className="text-muted">liter/100 km</p>
            </Col>
            <Col sm={4}>
              <span className="text-muted">avg</span>
              <h1>{pricePerDistance.toFixed(2).toLocaleString("sv-SE")}</h1>
              <p className="text-muted">kr/100 km</p>
            </Col>
            <Col sm={4}>
              <span className="text-muted">avg</span>
              <h1>{avgPrice.toFixed(2).toLocaleString("sv-SE")}</h1>
              <p className="text-muted">kr/liter</p>
            </Col>
          </Row>
          <Container className="text-center mt-3">
            <p className="text-muted">
              Statistics based on {data.length} entries stored in the logbook.
            </p>
          </Container>
        </Card.Body>
      </Card>
    );
  } else {
    return <></>;
  }
}