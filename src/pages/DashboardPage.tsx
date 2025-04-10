import { Box, Heading, Text, Button, VStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function DashboardPage() {
  const { user, logout, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (isLoading) {
    return <Text>Loading your dashboard...</Text>;
  }

  if (!user) {
    return <Text color="red.500">User not found.</Text>;
  }

  return (
    <Box maxW="2xl" mx="auto" mt={10}>
      <Heading mb={4}>Dashboard</Heading>

      <VStack mb={6}>
        <Text>
          👋 Welcome back, {user.firstname} {user.lastname} ({user.role})
        </Text>
        <Text>📧 {user.email}</Text>
      </VStack>

      {user.role === "teacher" ? (
        <VStack align="center">
          <Button colorScheme="blue" onClick={() => navigate("/prof/classes")}>
            Manage classes
          </Button>
        </VStack>
      ) : user.role === "student" ? (
        <VStack align="center">
          <Button colorScheme="purple" onClick={() => navigate("/classes")}>
            My classes
          </Button>
        </VStack>
      ) : (
        <Text>Unknown role</Text>
      )}

      <Button onClick={handleLogout} color={"red.400"} mt={6}>
        ↩️ Sign Out
      </Button>
    </Box>
  );
}
