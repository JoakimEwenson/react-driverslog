import React, { useEffect, useRef, useState } from "react";
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
import { LogPost } from "../models/LogPost";
import { Link, useHistory, useParams } from "react-router-dom";

export default function LogPostForm() {
  // Input refs
  const plateRef = useRef();
  const dateRef = useRef();
  const distanceRef = useRef();
  const fuelRef = useRef();
  const fuelPriceRef = useRef();
  const commentRef = useRef();
  const isPrivateRef = useRef();
  // Get current user
  const { currentUser } = useAuth();
  // Other
  const { postId } = useParams();
  const [isEdit] = useState(postId != null || postId === "" ? true : false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const history = useHistory();

  function fetchLogpostData(id) {
    var docRef = db.collection("logposts").doc(id);
    docRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          const data = doc.data();
          // Set messages
          setError("");
          // Populate form fields
          plateRef.current.value = data.vehicle;
          dateRef.current.value = new Date(
            data.created_timestamp.seconds * 1000
          ).toLocaleDateString("sv-SE");
          distanceRef.current.value = data.distance;
          fuelRef.current.value = data.fuel;
          fuelPriceRef.current.value = data.fuelprice;
          commentRef.current.value = data.comment;
          isPrivateRef.current.Check = data.isPrivate;
        } else {
          setError("No data found.");
        }
      })
      .catch((error) => {
        setError(`Error fetching data. ${error}`);
      });
  }

  if (postId) {
    fetchLogpostData(postId);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setLoading(true);

    // Create a LogPost of data
    const logpost = new LogPost(
      commentRef.current.value,
      new Date(dateRef.current.value),
      "SEK",
      parseFloat(distanceRef.current.value),
      new Date(),
      parseFloat(fuelRef.current.value),
      parseFloat(fuelPriceRef.current.value),
      currentUser.uid,
      isPrivateRef.current.checked,
      plateRef.current.value
    );

    // Insert data into Firestore
    if (isEdit) {
      try {
        db.collection("logposts").doc(postId).set(Object.assign({}, logpost));
        setMessage("Logbook entry saved.");
        history.push(`/logbook/${plateRef.current.value}`)
      } catch (error) {
        setError(`Error saving data. ${error}`);
        setLoading(false);
      }
    } else {
      try {
        db.collection("logposts").add(Object.assign({}, logpost));
        setMessage("New logbook entry created.");
        history.push("/logbook/")
      } catch (error) {
        setError(`Error saving data. ${error}`);
        setLoading(false);
      }
    }
  }

  // Fetch list of vehicles and populate a select-field
  useEffect(() => {
    var output = [];
    db.collection("vehicles")
      .where("owner_id", "==", currentUser.uid)
      .orderBy("plate", "asc")
      .get()
      .then((result) => {
        result.forEach((doc) => {
          const data = doc.data();
          output.push(data.plate);
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

      <Container>
        <Card className="mt-3">
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <h5>Logpost data</h5>
              {error && <Alert variant="danger">{error}</Alert>}
              {message && <Alert variant="success">{message}</Alert>}
              <Form.Group>
                <Form.Label>Plate number</Form.Label>
                {isEdit ? (
                  <FormControl
                    id="logpost-plate"
                    disabled={isEdit}
                    placeholder="ABC123"
                    ref={plateRef}
                    required
                  />
                ) : (
                  <Form.Control as="select" ref={plateRef} required>
                    {vehicles.map((row) => (
                      <option key={row}>{row}</option>
                    ))}
                  </Form.Control>
                )}
              </Form.Group>
              <Form.Group>
                <Form.Label>Date</Form.Label>
                <FormControl
                  id="logpost-date"
                  type="date"
                  placeholder="YYYY-MM-DD"
                  ref={dateRef}
                  required
                />
                <Form.Text id="logpost-fuel_price" hidden={!isEdit} muted>
                  YYYY-MM-DD
                </Form.Text>
              </Form.Group>
              <Form.Group>
                <Form.Label>Distance</Form.Label>
                <FormControl
                  id="logpost-distance"
                  type="number"
                  step="0.1"
                  placeholder="123.4"
                  ref={distanceRef}
                  required
                />
                <Form.Text id="logpost-fuel_price" hidden={!isEdit} muted>
                  km
                </Form.Text>
              </Form.Group>
              <Form.Group>
                <Form.Label>Amount of fuel liter</Form.Label>
                <FormControl
                  id="logpost-fuel"
                  type="number"
                  step="0.01"
                  placeholder="12.34"
                  ref={fuelRef}
                  required
                />
                <Form.Text id="logpost-fuel_price" hidden={!isEdit} muted>
                  liter
                </Form.Text>
              </Form.Group>
              <Form.Group>
                <Form.Label>Fuel price</Form.Label>
                <FormControl
                  id="logpost-fuel_price"
                  type="number"
                  step="0.01"
                  placeholder="12.34"
                  ref={fuelPriceRef}
                  required
                />
                <Form.Text id="logpost-fuel_price" hidden={!isEdit} muted>
                  kr/liter
                </Form.Text>
              </Form.Group>
              <Form.Group>
                <Form.Label>Comment</Form.Label>
                <FormControl
                  as="textarea"
                  id="logpost-comment"
                  placeholder="Comment"
                  ref={commentRef}
                />
              </Form.Group>
              <Form.Group>
                <Form.Check
                  type="switch"
                  id="private"
                  label="Private"
                  ref={isPrivateRef}
                />
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
          <Link to="/logbook">Back to logbook</Link>
        </Container>
      </Container>
    </>
  );
}
