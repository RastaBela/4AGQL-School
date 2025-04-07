import { Box, Button, Input, Heading, Text } from "@chakra-ui/react";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { VStack } from "@chakra-ui/layout";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN } from "../graphql/mutations/login";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const [login, { loading }] = useMutation(LOGIN, {
    onCompleted: (data) => {
      const { token, role } = data.login;
      authLogin(token, role);
      setMessage(`Successfully signed in as ${role}`);
      navigate("/dashboard");
    },
    onError: () => {
      setMessage("Error while signing in");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ variables: { email, password } });
  };

  return (
    <Box maxW="md" mx="auto" mt="10">
      <Heading mb={6}>👋 Sign In</Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </FormControl>
          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </FormControl>
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

      <Text mt={2} mb={2} textAlign="center">
        OR
      </Text>
      <Button colorScheme="teal" onClick={() => navigate("/register")}>
        Sign Up
      </Button>
    </Box>
  );
}
