import { Box, Heading, Text, Button, VStack, HStack, Spinner } from "@chakra-ui/react";
import { useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { GET_MY_CLASSES } from "../graphql/queries/getMyClasses";
import { GET_CLASS_STUDENTS } from "../graphql/queries/getClassStudents";
import { clientSchool } from "../services/clientSchool";
import { useEffect, useState } from "react";

type SchoolClass = {
  id: string;
  name: string;
  courses: {
    id: string;
    title: string;
    teacherId: string;
    classId: string;
  }[];
};

type ClassStudent = {
  id: string;
  classId: number;
  studentId: number;
  student: {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    role: string;
  };
};

export default function StudentClassesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [enrolledClassIds, setEnrolledClassIds] = useState<string[]>([]);
  const [classStudents, setClassStudents] = useState<Record<string, ClassStudent[]>>({});

  const { data: classesData, loading: classesLoading, error: classesError } = useQuery<{ getClasses: SchoolClass[] }>(
    GET_MY_CLASSES,
    {
      client: clientSchool,
      skip: user?.role !== "student",
    }
  );

  // For each class, check if the student is enrolled
  useEffect(() => {
    const checkEnrollment = async () => {
      if (!classesData?.getClasses || !user?.id) return;

      const enrolledIds: string[] = [];
      const studentsMap: Record<string, ClassStudent[]> = {};

      for (const c of classesData.getClasses) {
        const { data: studentsData } = await clientSchool.query<{ getClassStudents: ClassStudent[] }>({
          query: GET_CLASS_STUDENTS,
          variables: { classId: parseInt(c.id) },
        });
        
        if (studentsData?.getClassStudents) {
          studentsMap[c.id] = studentsData.getClassStudents;
          
          if (studentsData.getClassStudents.some(
            (cs) => cs.studentId === parseInt(user.id)
          )) {
            enrolledIds.push(c.id);
          }
        }
      }
      setEnrolledClassIds(enrolledIds);
      setClassStudents(studentsMap);
    };

    checkEnrollment();
  }, [classesData, user?.id]);

  if (classesLoading) {
    return (
      <Box mt={20} textAlign="center">
        <Spinner size="xl" />
        <Text mt={4}>Loading your classes...</Text>
      </Box>
    );
  }

  if (classesError) {
    return (
      <Box mt={20} textAlign="center">
        <Text color="red.500">Error while loading your classes: {classesError.message}</Text>
      </Box>
    );
  }

  const enrolledClasses = classesData?.getClasses?.filter(c => 
    enrolledClassIds.includes(c.id)
  ) || [];

  return (
    <Box maxW="xl" mx="auto" mt={10} w={500}>
      <Heading mb={4}>My Classes</Heading>
      <VStack align="stretch" gap={4}>
        {enrolledClasses.length > 0 ? (
          enrolledClasses.map((c) => (
            <Box key={c.id} p={4} borderWidth={1} rounded="md">
              <HStack justify="space-between" align="start">
                <Box>
                  <Text fontWeight="bold" fontSize="lg">{c.name}</Text>
                  <Text color="white.600">
                    Students: {classStudents[c.id]?.length || 0}
                  </Text>
                  {c.courses && c.courses.length > 0 && (
                    <Box mt={2}>
                      <Text fontWeight="medium">Courses:</Text>
                      <VStack align="start" mt={1} gap={1}>
                        {c.courses.map((course) => (
                          <Text key={course.id} color="white.600" fontStyle="italic">
                            • {course.title}
                          </Text>
                        ))}
                      </VStack>
                    </Box>
                  )}
                </Box>
                <Button
                  colorScheme="blue"
                  onClick={() => navigate(`/grades/${c.id}`)}
                >
                  View Details
                </Button>
              </HStack>
            </Box>
          ))
        ) : (
          <Text color="gray.500">You are not enrolled in any classes yet.</Text>
        )}
      </VStack>

      <Button mt={6} onClick={() => navigate("/dashboard")}>
        ◀️ Go back to dashboard
      </Button>
    </Box>
  );
}
