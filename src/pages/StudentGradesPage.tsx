import {
  Box,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Spinner,
  Badge,
} from "@chakra-ui/react";
import { useQuery } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { GET_GRADES } from "../graphql/queries/getGrades";
import { GET_CLASS_BY_ID } from "../graphql/queries/getClassById";
import { clientSchool } from "../services/clientSchool";
import { useEffect, useState } from "react";

type Grade = {
  id: string;
  studentId: string;
  courseId: string;
  value: number;
};

type Course = {
  id: string;
  title: string;
  teacherId: string;
  classId: string;
};

type SchoolClass = {
  id: string;
  name: string;
  courses: Course[];
};

export default function StudentGradesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { classId } = useParams<{ classId: string }>();
  const [grades, setGrades] = useState<Record<string, Grade>>({});

  console.log('Class ID from URL:', classId);
  console.log('Parsed Class ID:', parseInt(classId || '0'));

  // Get the class data
  const { data: classData, loading: classLoading, error: classError } = useQuery<{ getClass: SchoolClass }>(
    GET_CLASS_BY_ID,
    {
      variables: { classId: classId || '0' },
      client: clientSchool,
    }
  );

  console.log('Class Data:', classData);
  console.log('Loading:', classLoading);
  console.log('Error:', classError);

  // Get grades for each course
  useEffect(() => {
    const fetchGrades = async () => {
      if (!classData?.getClass?.courses || !user?.id) return;

      console.log('Fetching grades for courses:', classData.getClass.courses);
      console.log('Current user ID:', user.id);

      const gradesMap: Record<string, Grade> = {};
      for (const course of classData.getClass.courses) {
        console.log('Fetching grades for course:', course.id);
        const { data: gradesData } = await clientSchool.query<{ getGrades: Grade[] }>({
          query: GET_GRADES,
          variables: { courseId: parseInt(course.id) },
        });

        console.log('Grades data for course:', course.id, gradesData?.getGrades);

        if (gradesData?.getGrades) {
          // Find the current student's grade for this course
          const studentGrade = gradesData.getGrades.find(
            g => String(g.studentId) === String(user.id)
          );
          console.log('Found grade for student:', studentGrade);
          if (studentGrade) {
            gradesMap[course.id] = studentGrade;
          }
        }
      }
      console.log('Final grades map:', gradesMap);
      setGrades(gradesMap);
    };

    fetchGrades();
  }, [classData, user?.id]);

  if (classLoading) {
    return (
      <Box mt={20} textAlign="center">
        <Spinner size="xl" />
        <Text mt={4}>Loading your grades...</Text>
      </Box>
    );
  }

  if (classError) {
    return (
      <Box mt={20} textAlign="center">
        <Text color="red.500">Error while loading your grades: {classError.message}</Text>
        <Text mt={2} color="gray.600">
          Class ID: {classId}
        </Text>
      </Box>
    );
  }

  if (!classData?.getClass) {
    return (
      <Box mt={20} textAlign="center">
        <Text color="red.500">Class not found</Text>
        <Text mt={2} color="gray.600">
          Class ID: {classId}
        </Text>
        <Button mt={4} onClick={() => navigate("/classes")}>
          Back to Classes
        </Button>
      </Box>
    );
  }

  return (
    <Box maxW="1200px" mx="auto" mt={10} px={4}>
      <HStack justify="space-between" mb={8}>
        <Box>
          <Heading size="xl">My Grades</Heading>
          <Text color="white" fontStyle="italic" mt={1} >Class: {classData.getClass.name}</Text>
        </Box>
        <Button
          colorScheme="blue"
          variant="outline"
          onClick={() => navigate("/classes")}
          color={"white"}
        >
          ◀️ Back to Classes
        </Button>
      </HStack>

      <VStack align="stretch" gap={4}>
        {classData.getClass.courses.map((course) => {
          const grade = grades[course.id];
          return (
            <Box key={course.id} p={4} borderWidth={1} borderRadius="lg">
              <HStack justify="space-between" align="center">
                <Box>
                  <Text fontWeight="bold" fontSize="lg">{course.title}</Text>
                </Box>
                <HStack gap={4}>
                  {grade ? (
                    <>
                      <Text fontWeight="bold" fontSize="xl">
                        {grade.value.toFixed(2)}/20
                      </Text>
                      <Badge
                        colorScheme={grade.value >= 10 ? "green" : "red"}
                        fontSize="sm"
                        px={2}
                        py={1}
                        borderRadius="full"
                      >
                        {grade.value >= 10 ? "Passed" : "Failed"}
                      </Badge>
                    </>
                  ) : (
                    <Badge
                      colorScheme="gray"
                      fontSize="sm"
                      px={2}
                      py={1}
                      borderRadius="full"
                    >
                      No grade yet
                    </Badge>
                  )}
                </HStack>
              </HStack>
            </Box>
          );
        })}
      </VStack>
    </Box>
  );
}
