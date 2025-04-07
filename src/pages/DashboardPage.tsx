import { Box, Heading, Text, Button } from "@chakra-ui/react";
import { VStack } from "@chakra-ui/layout";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function DashboardPage() {
  const { role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Box maxW="2xl" mx="auto" mt={10}>
      <Heading mb={4}>Dashboard</Heading>

      {role === "professor" ? (
        <VStack align="center" spacing={4}>
          <Text>👨‍🏫 Welcome Professor!</Text>
          <Button colorScheme="blue" onClick={() => alert("Voir les classes")}>
            Manage classes
          </Button>
          <Button colorScheme="green" onClick={() => alert("Voir les notes")}>
            Manage grades
          </Button>
        </VStack>
      ) : role === "student" ? (
        <VStack align="center" spacing={4}>
          <Text>🎓 Welcome Student!</Text>
          <Button colorScheme="teal" onClick={() => navigate("/grades")}>
            My grades
          </Button>
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
