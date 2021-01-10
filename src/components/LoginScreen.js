import React, { useRef, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import {
  Alert,
  Button,
  Card,
  Form,
  Container,
  FormControl,
} from "react-bootstrap";
import { useAuth } from "../context/AuthContext";

export default function LoginScreen() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value);
      setLoading(false);
      history.push("/dashboard");
    } catch (e) {
      setError(`Failed to sign in! ${e}`);
      setLoading(false);
    }
  }

  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <div className="w-100" style={{ maxWidth: "400px" }}>
        <Card className="logbook-card">
          <Card.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <h3>Please sign in</h3>
              <Form.Group>
                <Form.Label>E-mail</Form.Label>
                <FormControl
                  autoComplete="username"
                  id="logbook-email"
                  placeholder="name@domain.com"
                  type="email"
                  ref={emailRef}
                  required
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Password</Form.Label>
                <FormControl
                  autoComplete="current-password"
                  id="logbook-password"
                  type="password"
                  placeholder="*****"
                  ref={passwordRef}
                  required
                />
              </Form.Group>
              <Form.Group className="mt-5">
                <Button type="submit" disabled={loading} className="w-100">
                  Log in
                </Button>
              </Form.Group>
            </Form>
            <p className="text-center small">
              <Link to="/reminder">Forgot your password?</Link> | Need an
              account? <Link to="/signup">Sign up</Link>
            </p>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
}
