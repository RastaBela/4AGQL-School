import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Spinner, Box, Text } from "@chakra-ui/react";
import { JSX } from "react";

type PublicOnlyRouteProps = {
  children: JSX.Element;
};

export default function PublicOnlyRoute({ children }: PublicOnlyRouteProps) {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Box mt={20} textAlign="center">
        <Spinner size="xl" />
        <Text mt={4}>Loading...</Text>
      </Box>
    );
  }

  if (token) {
    return <Navigate to="/dashboard" />; // if already connected = no access
  }

  return children;
}
