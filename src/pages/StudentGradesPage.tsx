import { Box, Heading, Text, Button } from "@chakra-ui/react";
import { VStack } from "@chakra-ui/layout";
import { Select } from "@chakra-ui/select";
import { useQuery } from "@apollo/client";
import { GET_GRADES } from "../graphql/queries/getGrades";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

type Grade = {
  course: string;
  grade: number;
};

export default function StudentGradesPage() {
  const navigate = useNavigate();
  const { role } = useAuth();
  const [selectedCourse, setSelectedCourse] = useState("");

  const { data, error } = useQuery<{ grades: Grade[] }>(GET_GRADES, {
    skip: role !== "student", // if not student, not executed
  });

  if (error) {
    return (
      <Box mt={20} textAlign="center">
        <Text color="red.500">Error while loading the grades.</Text>
      </Box>
    );
  }

  const grades = data?.grades || [];
  const courses = [...new Set(grades.map((g) => g.course))];
  const filteredGrades = selectedCourse
    ? grades.filter((g) => g.course === selectedCourse)
    : grades;

  return (
    <Box maxW="xl" mx="auto" mt={10}>
      <Heading mb={4}>My grades</Heading>

      <Select
        placeholder="Filter by course"
        mb={4}
        onChange={(e) => setSelectedCourse(e.target.value)}
      >
        {courses.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </Select>

      <VStack align="start" spacing={3}>
        {filteredGrades.map((g, i) => (
          <Box key={i} p={4} borderWidth={1} rounded="md" w="100%">
            <Text>
              <strong>Course :</strong> {g.course}
            </Text>
            <Text>
              <strong>Grade :</strong> {g.grade}/20
            </Text>
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
