import {
  Box,
  Button,
  Heading,
  Input,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { useEffect, useState } from "react";

import { clientSchool } from "../services/clientSchool";
import { clientUsers } from "../services/clientUsers";
import { GET_COURSE_BY_ID } from "../graphql/queries/getCourseById";
import { GET_ENROLLMENTS } from "../graphql/queries/getEnrollments";
import { GET_GRADES } from "../graphql/queries/getGrades";
import { ADD_GRADE } from "../graphql/mutations/addGrade";
import { UPDATE_GRADE } from "../graphql/mutations/updateGrade";
import { toaster, Toaster } from "../components/ui/toaster";

export type Enrollment = {
  studentId: string;
  student: {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    role: string;
  };
};

export type Grade = {
  id: string;
  studentId: string;
  courseId: string;
  value: number;
};

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const courseId = Number(id);
  const navigate = useNavigate();
  const [gradesInput, setGradesInput] = useState<Record<number, number>>({});

  const { data: courseData, loading: courseLoading, refetch: refetchCourse } = useQuery(
    GET_COURSE_BY_ID,
    {
      client: clientSchool,
      variables: { id: courseId },
    }
  );

  const { data: enrollmentData, loading: enrollmentLoading, refetch: refetchEnrollments } = useQuery(
    GET_ENROLLMENTS,
    {
      client: clientSchool,
      variables: { courseId },
    }
  );

  const {
    data: gradesData,
    loading: gradesLoading,
    refetch: refetchGrades,
  } = useQuery(GET_GRADES, {
    client: clientSchool,
    variables: { courseId },
  });

  const [addGrade] = useMutation(ADD_GRADE, {
    client: clientSchool,
  });
  const [updateGrade] = useMutation(UPDATE_GRADE, {
    client: clientSchool,
  });

  const course = courseData?.getCourse;
  const enrollments: Enrollment[] = enrollmentData?.getEnrollments ?? [];
  const existingGrades: Grade[] = gradesData?.getGrades ?? [];

  useEffect(() => {
    const initialValues: Record<number, number> = {};
    for (const grade of existingGrades) {
      initialValues[Number(grade.studentId)] = grade.value;
    }
    setGradesInput(initialValues);
  }, [gradesData]);

  const handleGradeChange = (studentId: number, value: string) => {
    setGradesInput((prev) => ({
      ...prev,
      [studentId]: Number(value),
    }));
  };

  const handleSubmitGrade = async (studentId: number) => {
    const gradeValue = gradesInput[studentId];

    if (gradeValue < 0 || gradeValue > 20) {
      toaster.create({
        title: "Error",
        description: "The grade must be between 0 and 20.",
        type: "error",
      });
      return;
    }

    const existing = existingGrades.find(
      (g) => Number(g.studentId) === studentId
    );

    try {
      if (existing) {
        await updateGrade({
          variables: {
            input: {
              courseId,
              studentId,
              value: gradeValue,
            },
          },
        });

        toaster.create({
          title: "Grade updated",
          description: `Updated to ${gradeValue}/20 for student ID ${studentId}.`,
          type: "success",
        });
      } else {
        await addGrade({
          variables: {
            input: {
              courseId,
              studentId,
              value: gradeValue,
            },
          },
        });

        toaster.create({
          title: "Grade added",
          description: `Grade ${gradeValue}/20 added for student ID ${studentId}.`,
          type: "success",
        });
      }

      await refetchGrades();
    } catch (err) {
      console.error(err);
      toaster.create({
        title: "Error",
        description: "An error occurred while saving the grade.",
        type: "error",
      });
    }
  };

  // Add a function to refetch all data
  const refetchAllData = async () => {
    await Promise.all([
      refetchCourse(),
      refetchEnrollments(),
      refetchGrades(),
    ]);
  };

  // Add an effect to refetch data when the courseId changes
  useEffect(() => {
    refetchAllData();
  }, [courseId]);

  if (courseLoading || enrollmentLoading || gradesLoading) {
    return (
      <Box mt={10} textAlign="center">
        <Spinner />
        <Text>Loading...</Text>
      </Box>
    );
  }

  return (
    <Box maxW="xl" mx="auto" mt={10}>
      <Heading mb={4}>Course: {course.title}</Heading>

      <VStack align="stretch">
        {enrollments.length > 0 ? (
          enrollments.map((enrollment) => {
            const studentId = Number(enrollment.studentId);
            const currentGrade = gradesInput[studentId] ?? "";

            return (
              <Box key={studentId} p={4} borderWidth={1} rounded="md">
                <Text>
                  <strong>
                    {enrollment.student.firstname} {enrollment.student.lastname}
                  </strong>{" "}
                  (ID: {studentId})
                </Text>
                <Input
                  type="number"
                  placeholder="Enter grade"
                  value={currentGrade}
                  onChange={(e) => handleGradeChange(studentId, e.target.value)}
                />
                <Button
                  mt={2}
                  colorScheme="blue"
                  onClick={() => handleSubmitGrade(studentId)}
                  disabled={isNaN(currentGrade)}
                >
                  💾 Save grade
                </Button>
              </Box>
            );
          })
        ) : (
          <Text>No students enrolled in this course.</Text>
        )}
      </VStack>

      <Button mt={6} onClick={() => navigate(-1)}>
        ◀️ Back
      </Button>

      <Toaster />
    </Box>
  );
}
