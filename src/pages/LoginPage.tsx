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
import { LOGIN } from "../graphql/mutations/login";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { clientUsers } from "../services/clientUsers";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const [pseudo, setPseudo] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const [login, { loading }] = useMutation(LOGIN, {
    client: clientUsers,
    onCompleted: ({ login }) => {
      const { token, user } = login;

      authLogin(token, user);

      navigate("/dashboard");
    },
    onError: () => {
      setMessage("Invalid credentials or server error.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ variables: { pseudo, password } });
  };

  return (
    <Box maxW="md" mx="auto" mt="10">
      <Heading mb={6}>👋 Sign In</Heading>
      <form onSubmit={handleSubmit}>
        <VStack>
          <Field.Root>
            <Field.Label>Pseudo</Field.Label>
            <Input
              type="text"
              value={pseudo}
              onChange={(e) => setPseudo(e.target.value)}
              required
            />
          </Field.Root>
          <Field.Root>
            <Field.Label>Password</Field.Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Field.Root>
          <Button type="submit" colorScheme="blue" loading={loading}>
            Sign In
          </Button>
        </VStack>
      </form>

      {message && (
        <Text mt={4} color={"red.400"}>
          {message}
        </Text>
      )}

      <Text mt={4} mb={2} textAlign="center">
        OR
      </Text>
      <Button colorScheme="teal" onClick={() => navigate("/register")}>
        Sign Up
      </Button>
    </Box>
  );
}
