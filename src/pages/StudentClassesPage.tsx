import { Box, Heading, Text, Button } from "@chakra-ui/react";
import { VStack } from "@chakra-ui/layout";
import { useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { GET_MY_CLASSES } from "../graphql/queries/getMyClasses";

type SchoolClass = {
  id: string;
  name: string;
  teacherName: string;
};

export default function StudentClassesPage() {
  const { role } = useAuth();
  const navigate = useNavigate();

  const { data, error } = useQuery<{ myClasses: SchoolClass[] }>(
    GET_MY_CLASSES,
    {
      skip: role !== "student",
    }
  );

  if (error) {
    return (
      <Box mt={20} textAlign="center">
        <Text color="red.500">Error while loading the classes.</Text>
      </Box>
    );
  }

  const classes = data?.myClasses || [];

  return (
    <Box maxW="xl" mx="auto" mt={10}>
      <Heading mb={4}>My classes</Heading>
      <VStack spacing={4} align="stretch">
        {classes.map((c) => (
          <Box key={c.id} p={4} borderWidth={1} rounded="md">
            <Text fontWeight="bold">{c.name}</Text>
            <Text>Teacher: {c.teacherName}</Text>
          </Box>
        ))}
      </VStack>

      <Button
        mt={4}
        onClick={() => {
          navigate("/dashboard");
        }}
      >
        ◀️ Go back to dashboard
      </Button>
    </Box>
  );
}
