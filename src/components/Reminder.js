import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Alert,
  Button,
  Card,
  Container,
  Form,
  FormControl,
} from "react-bootstrap";
import { useAuth } from "../context/AuthContext";

export default function Reminder() {
  const emailRef = useRef();
  const { resetPassword } = useAuth();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setMessage("");
      setError("");
      setLoading(true);
      await resetPassword(emailRef.current.value);
      setMessage("Check your inbox for further instructions.");
    } catch (err) {
      setError(`Failed to request password reset. ${err}`);
    }
  }

  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <div className="w-100" style={{ maxWidth: "400px" }}>
        <Card>
          <Card.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            {message && <Alert variant="success">{message}</Alert>}
            <Form onSubmit={handleSubmit}>
              <h3>Request new password</h3>
              <Form.Group>
                <Form.Label>E-mail</Form.Label>
                <FormControl
                  id="logbook-email"
                  placeholder="name@domain.com"
                  type="email"
                  ref={emailRef}
                  required
                />
              </Form.Group>
              <Form.Group>
                <Button type="submit" className="w-100" disabled={loading}>
                  Reset password
                </Button>
              </Form.Group>
            </Form>
            <p className="text-center small">
              Return to <Link to="/login">login</Link>
            </p>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
}
