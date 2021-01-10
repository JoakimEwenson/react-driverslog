import React, { useRef, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Container,
  Form,
  FormControl,
} from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { Link, useHistory } from "react-router-dom";

export default function SignUp() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { signup } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  async function handleSubmit(e) {
    e.preventDefault();

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match");
    }
    try {
      setError("");
      setLoading(true);
      await signup(emailRef.current.value, passwordRef.current.value);
      history.push("/dashboard");
    } catch (e) {
      setError(`Failed to create an account! ${e}`);
    }

    setLoading(false);
  }

  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <div className="w-100" style={{ maxWidth: "400px" }}>
        <Card className="my-3 logbook-card">
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <h3>Sign up</h3>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form.Group id="user-email">
                <Form.Label>E-mail</Form.Label>

                <FormControl
                  placeholder="E-mail address"
                  type="email"
                  ref={emailRef}
                  required
                />
              </Form.Group>
              <Form.Group id="user-password">
                <Form.Label>Password</Form.Label>

                <FormControl
                  placeholder="Password"
                  type="password"
                  ref={passwordRef}
                  required
                />
              </Form.Group>

              <Form.Group id="user-confirm_password">
                <Form.Label>Confirm password</Form.Label>
                <FormControl
                  placeholder="Confirm password"
                  type="password"
                  ref={passwordConfirmRef}
                  required
                />
              </Form.Group>
              <Form.Group className="mt-5">
                <Button disabled={loading} type="submit" className="w-100">
                  Save data
                </Button>
              </Form.Group>
            </Form>
            <p className="text-center small">
              Already have an account? <Link to="/login">Log in!</Link>
            </p>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
}
