import React, { useRef, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Container,
  Form,
  FormControl,
  Modal,
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
  const [ownerId, setOwnerId] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const history = useHistory();
  // Handle delete modal
  const handleClose = () => setShowDeleteModal(false);
  const handleShow = () => setShowDeleteModal(true);

  function fetchVehicleData(id) {
    var docRef = db.collection("vehicles").doc(id);
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
          // Set owner id from Firestore data
          setOwnerId(data.owner_id);
        } else {
          setError("No vehicle found.");
        }
      })
      .catch((error) => {
        console.error(`Error fetching data. ${error}`);
      });
  }

  function vehicleExists() {
    if (!isEdit) {
      db.collection("vehicles")
        .where("plate", "==", plateRef.current.value)
        .get()
        .then((doc) => {
          if (!doc.empty) {
            setError("Vehicle exists");
            setLoading(true);
          } else {
            setError("");
            setLoading(false);
          }
        })
        .catch((error) => {
          console.error(error);
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
    if (isEdit) {
      try {
        db.collection("vehicles")
          .doc(vehicleId)
          .set(Object.assign({}, vehicle));
        //setMessage("Vehicle data saved.");
        history.push("/vehicles");
      } catch (error) {
        setError(`Error saving vehicle data. ${error}`);
        setLoading(false);
      }
    } else {
      try {
        db.collection("vehicles").add(Object.assign({}, vehicle));
        //setMessage("New vehicle created.");
        history.push("/vehicles");
      } catch (error) {
        setError(`Error saving vehicle data. ${error}`);
        setLoading(false);
      }
    }
  }

  async function handleRemoveVehicle(e) {
    e.preventDefault();
    if (
      ownerId === currentUser.uid &&
      (vehicleId !== null || vehicleId !== "")
    ) {
      try {
        db.collection("logposts")
          .where("vehicle", "==", plateRef.current.value)
          .where("owner_id", "==", currentUser.uid)
          .get()
          .then((docs) => {
            docs.forEach((row) => {
              db.collection("logposts")
                .doc(row.id)
                .delete()
                .catch((error) => console.error(error));
            });
          })
          .catch((error) => console.error(error));
        db.collection("vehicles")
          .doc(vehicleId)
          .delete()
          .then(() => {
            setError("");
            setShowDeleteModal(false);
            history.push("/vehicles");
          })
          .catch((error) => {
            console.error(error);
            setError(`Error deleting data. ${error}`);
          });
      } catch (error) {
        setError(`Error deleting data. ${error}`);
      }
    } else {
      console.error("Nope...");
    }
  }

  return (
    <>
      <AppMenu />
      <Container>
        <Card className="my-3 logbook-card">
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
              <Form.Group className="my-3">
                <Button type="submit" disabled={loading} className="w-100">
                  Save data
                </Button>
              </Form.Group>
              {isEdit ? (
                <Container className="text-center">
                  <Button variant="danger" onClick={handleShow}>
                    Delete
                  </Button>
                </Container>
              ) : (
                <></>
              )}
              <Modal show={showDeleteModal} onHide={handleClose}>
                <Modal.Header closeButton>
                  <Modal.Title>Delete logbook entry</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Container className="text-center">
                    <p className="text-left">
                      Are you really sure that you want to delete this vehicle?
                    </p>
                    <p className="text-left">
                      Deleting the vehicle <strong>will also</strong> delete all
                      logposts that belongs to the vehicle.
                    </p>
                    <Button
                      variant="danger"
                      className="mx-auto text-center"
                      onClick={handleRemoveVehicle}
                    >
                      Delete this entry!
                    </Button>
                  </Container>
                </Modal.Body>
              </Modal>
            </Form>
          </Card.Body>
        </Card>
        <Container className="text-center my-3">
          <Link to="/vehicles">Back to vehicles</Link>
        </Container>
      </Container>
    </>
  );
}
