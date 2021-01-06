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
import AppMenu from "./AppMenu";

export default function UserForm() {
  const displayNameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const {
    currentUser,
    updateDisplayName,
    updateEmail,
    updatePassword,
  } = useAuth();
  const [error, setError] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setMessages([]);
    var responseMessages = [];

    // Check if password and password confirmation is the same value
    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match");
    }

    // Check for changes
    if (displayNameRef.current.value !== currentUser.displayName) {
      setLoading(true);
      try {
        await updateDisplayName(displayNameRef.current.value);
        responseMessages.push("Successfully updated display name.");
      } catch (error) {
        setError(`Unable to update display name. ${error}`);
      }
    }
    if (emailRef.current.value !== currentUser.email) {
      setLoading(true);
      try {
        await updateEmail(emailRef.current.value);
        responseMessages.push("Successfully updated e-mail.");
      } catch (error) {
        setError(`Unable to update e-mail. ${error}`);
      }
    }

    if (passwordRef.current.value) {
      setLoading(true);
      try {
        await updatePassword(passwordRef.current.value);
        responseMessages.push("Successfully updated password");
      } catch (error) {
        setError(`Unable to update password. ${error}`);
      }
    }
    setMessages(responseMessages);
    setLoading(false);
  }

  return (
    <>
      <AppMenu />
      <Container>
        <Card className="mt-3">
          <Card.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            {messages &&
              messages.map((row, index) => (
                <Alert variant="success" key={index}>
                  {row}
                </Alert>
              ))}
            <Form onSubmit={handleSubmit}>
              <h5>User</h5>
              <Form.Group>
                <Form.Label>Display name</Form.Label>
                <FormControl
                  id="user-displayname"
                  placeholder="Display name"
                  ref={displayNameRef}
                  defaultValue={currentUser.displayName}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>E-mail</Form.Label>

                <FormControl
                  autoComplete="username"
                  id="user-email"
                  placeholder="E-mail address"
                  type="email"
                  ref={emailRef}
                  defaultValue={currentUser.email}
                  required
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Password</Form.Label>

                <FormControl
                  autoComplete="new-password"
                  id="user-password"
                  placeholder="Leave blank to keep the same"
                  type="password"
                  ref={passwordRef}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Confirm password</Form.Label>

                <FormControl
                  autoComplete="new-password"
                  id="user-confirm_password"
                  placeholder="Leave blank to keep the same"
                  type="password"
                  ref={passwordConfirmRef}
                />
              </Form.Group>
              <Form.Group className="mt-5">
                <Button type="submit" className="w-100" disabled={loading}>
                  Save data
                </Button>
              </Form.Group>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}
