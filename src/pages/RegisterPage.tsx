import { Box, Button, Input, Heading, Text } from "@chakra-ui/react";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { VStack } from "@chakra-ui/layout";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import { REGISTER } from "../graphql/mutations/register";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [pseudo, setPseudo] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const [register, { loading }] = useMutation(REGISTER, {
    onCompleted: (data) => {
      const { token, role } = data.register;
      authLogin(token, role);
      setMessage("Successfully signed up!");
      navigate("/dashboard");
    },
    onError: () => {
      setMessage("Error while signing up");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register({ variables: { email, password, pseudo } });
  };

  return (
    <Box maxW="md" mx="auto" mt={10}>
      <Heading mb={6}>🖖 Sign Up</Heading>
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
            <FormLabel>Pseudo</FormLabel>
            <Input
              type="text"
              value={pseudo}
              onChange={(e) => setPseudo(e.target.value)}
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
            Sign Up
          </Button>
        </VStack>
      </form>
      {message && (
        <Text mt={4} color={"red.500"}>
          {message}
        </Text>
      )}

      <Text mt={2} mb={2} textAlign="center">
        OR
      </Text>
      <Button onClick={() => navigate("/login")}>Go to the Sign In page</Button>
    </Box>
  );
}
