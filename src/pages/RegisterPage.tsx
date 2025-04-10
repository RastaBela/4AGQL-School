import {
  Box,
  Button,
  Input,
  Heading,
  Text,
  VStack,
  Field,
} from "@chakra-ui/react";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import { REGISTER } from "../graphql/mutations/register";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { clientUsers } from "../services/clientUsers";

export default function RegisterPage() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [pseudo, setPseudo] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const [register, { loading }] = useMutation(REGISTER, {
    client: clientUsers,
    onCompleted: ({ register }) => {
      const { token, user } = register;

      authLogin(token, user);
      navigate("/login");
    },
    onError: () => {
      setMessage("Error while signing up");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    register({
      variables: {
        input: {
          firstname,
          lastname,
          pseudo,
          email,
          phone,
          password,
          role: "student",
        },
      },
    });
  };

  return (
    <Box maxW="md" mx="auto" mt={10}>
      <Heading mb={6}>🖖 Sign Up</Heading>
      <form onSubmit={handleSubmit}>
        <VStack>
          <Field.Root required>
            <Field.Label>First name</Field.Label>
            <Input
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
            />
          </Field.Root>
          <Field.Root required>
            <Field.Label>Last name</Field.Label>
            <Input
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
            />
          </Field.Root>
          <Field.Root required>
            <Field.Label>Pseudo</Field.Label>
            <Input value={pseudo} onChange={(e) => setPseudo(e.target.value)} />
          </Field.Root>
          <Field.Root required>
            <Field.Label>Email</Field.Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field.Root>
          <Field.Root required>
            <Field.Label>Phone</Field.Label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
          </Field.Root>
          <Field.Root required>
            <Field.Label>Password</Field.Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field.Root>
          <Button type="submit" colorScheme="blue" loading={loading}>
            Sign Up
          </Button>
        </VStack>
      </form>

      {message && (
        <Text mt={4} color="red.400">
          {message}
        </Text>
      )}

      <Text mt={4} mb={2} textAlign="center">
        OR
      </Text>
      <Button colorScheme="teal" onClick={() => navigate("/login")}>
        Sign In
      </Button>
    </Box>
  );
}
