import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Spinner, Box, Text } from "@chakra-ui/react";
import { JSX } from "react";

type PrivateRouteProps = {
  children: JSX.Element;
  requiredRole?: string;
};

export default function PrivateRoute({
  children,
  requiredRole,
}: PrivateRouteProps) {
  const { token, role, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Box mt={20} textAlign="center">
        <Spinner size="xl" />
        <Text mt={4}>Chargement de la session...</Text>
      </Box>
    );
  }

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/dashboard" />;
  }

  return children;
}
