import React, { useRef, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Form,
  Container,
  FormControl,
} from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import AppMenu from "./AppMenu";
import { Vehicle } from "../models/Vehicle";
import { Link, useHistory, useParams } from "react-router-dom";

export default function VehicleForm() {
  // Input refs
  const plateRef = useRef();
  const makeRef = useRef();
  const modelRef = useRef();
  const modelYearRef = useRef();
  const displayNameRef = useRef();
  const isPrivateRef = useRef();
  // Current user
  const { currentUser } = useAuth();
  // Other
  const { vehicleId } = useParams();
  const [isEdit] = useState(
    vehicleId != null || vehicleId === "" ? true : false
  );
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  function fetchVehicleData(id) {
    var docRef = db.collection("vehicles").doc(`${currentUser.uid}_${id}`);
    docRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          const data = doc.data();
          // Populate fields
          plateRef.current.value = data.plate;
          makeRef.current.value = data.make;
          modelRef.current.value = data.model;
          modelYearRef.current.value = data.modelyear;
          displayNameRef.current.value = data.displayname;
          isPrivateRef.current.checked = data.isPrivate;
        } else {
          setError("No vehicle found.");
        }
      })
      .catch((error) => {
        console.error(`Error fetching data. ${error}`);
      });
  }

  function vehicleExists() {
    if (vehicleId == null || vehicleId === "") {
      db.collection("vehicles")
        .doc(`${currentUser.uid}_${plateRef.current.value}`)
        .get()
        .then((doc) => {
          if (doc.exists) {
            setError("Vehicle exists");
            setLoading(true);
          } else {
            setError("");
            setLoading(false);
          }
        });
    }
  }

  if (vehicleId) {
    fetchVehicleData(vehicleId);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setLoading(true);

    const vehicle = new Vehicle(
      new Date(),
      displayNameRef.current.value,
      new Date(),
      "",
      makeRef.current.value,
      modelRef.current.value,
      modelYearRef.current.value,
      currentUser.uid,
      plateRef.current.value,
      isPrivateRef.current.checked
    );
    try {
      db.collection("vehicles")
        .doc(`${currentUser.uid}_${plateRef.current.value}`)
        .set(Object.assign({}, vehicle));
      setMessage("New vehicle created.");
      history.push("/vehicles");
    } catch (error) {
      setError(`Error saving vehicle data. ${error}`);
      setLoading(false);
    }
  }

  return (
    <>
      <AppMenu />
      <Container>
        <Card className="mt-3">
          <Card.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            {message && <Alert variant="success">{message}</Alert>}
            <Form onSubmit={handleSubmit}>
              <h5>Vehicle data</h5>
              <Form.Group>
                <Form.Label>Plate number</Form.Label>
                <FormControl
                autoComplete="false"
                  id="vehicle-plate"
                  placeholder="Plate number"
                  ref={plateRef}
                  disabled={isEdit}
                  onBlur={vehicleExists}
                  required
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Manufacturer</Form.Label>
                <FormControl
                  id="vehicle-make"
                  placeholder="Manufacturer"
                  ref={makeRef}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Model</Form.Label>
                <FormControl
                  id="vehicle-model"
                  placeholder="Model"
                  ref={modelRef}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Model year</Form.Label>
                <FormControl
                  id="vehicle-modelyear"
                  placeholder="YYYY"
                  ref={modelYearRef}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Display name</Form.Label>
                <FormControl
                  id="vehicle-displayname"
                  placeholder="Display name"
                  ref={displayNameRef}
                />
              </Form.Group>
              <Form.Group>
                <Form.Switch id="private" label="Private" ref={isPrivateRef} />
              </Form.Group>
              <Form.Group className="mt-5">
                <Button type="submit" disabled={loading} className="w-100">
                  Save data
                </Button>
              </Form.Group>
            </Form>
          </Card.Body>
        </Card>
        <Container className="text-center mb-3">
          <Link to="/vehicles">Back to vehicles</Link>
        </Container>
      </Container>
    </>
  );
}
