import {
  Box,
  Heading,
  Spinner,
  Text,
  Input,
  Button,
  VStack,
  Field,
  Separator,
  HStack,
} from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useLazyQuery } from "@apollo/client";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Toaster, toaster } from "../components/ui/toaster";

import { GET_CLASS_BY_ID } from "../graphql/queries/getClassById";
import { GET_CLASS_STUDENTS } from "../graphql/queries/getClassStudents";
import { ADD_STUDENT_TO_CLASS } from "../graphql/mutations/addStudentToClass";
import { CREATE_COURSE } from "../graphql/mutations/createCourse";
import { GET_USER_BY_EMAIL } from "../graphql/queries/getUserByEmail";
import { clientUsers } from "../services/clientUsers";
import { clientSchool } from "../services/clientSchool";
import { ENROLL_STUDENT } from "../graphql/mutations/enrollStudent";
import { REMOVE_STUDENT_FROM_CLASS } from "../graphql/mutations/removeStudentFromClass";
import { REMOVE_STUDENT_FROM_COURSE } from "../graphql/mutations/removeStudentFromCourse";
import { DELETE_GRADE } from "../graphql/mutations/deleteGrade";
import { GET_COURSE_GRADE_STATS } from "../graphql/queries/getCourseGradeStats";

export type Course = {
  id: string;
  title: string;
  teacherId: string;
  classId: string;
  students?: { studentId: string }[];
};

export type Student = {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
};

export type SchoolClass = {
  id: string;
  name: string;
  students: Student[];
  courses: Course[];
};

type GradeStats = {
  median: number;
  min: number;
  max: number;
};

export default function ProfessorClassDetailPage() {
  const { id } = useParams<{ id: string }>();
  const classIdNumber = Number(id);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [courseStats, setCourseStats] = useState<Record<string, GradeStats>>({});

  const [enrollStudent] = useMutation(ENROLL_STUDENT);

  const { data: classData, loading: classLoading, error: classError, refetch: refetchClass } = useQuery<{ getClass: SchoolClass }>(GET_CLASS_BY_ID, {
    variables: { classId: id || '0' },
    client: clientSchool,
  });

  const { data: studentsData, loading: studentsLoading, error: studentsError, refetch: refetchStudents } = useQuery(GET_CLASS_STUDENTS, {
    client: clientSchool,
    variables: { classId: Number(id) },
    skip: !id,
  });

  const classInfo = classData?.getClass;
  const students = studentsData?.getClassStudents?.map((entry: { student: Student }) => entry.student) ?? [];
  const courses = classInfo?.courses ?? [];

  const [addStudentToClass, { loading: adding }] = useMutation(
    ADD_STUDENT_TO_CLASS,
    {
      client: clientSchool,
      onCompleted: () => {
        toaster.create({
          title: "Student added",
          description: `The student has been successfully added to the class.`,
          type: "success",
        });
        setEmail("");
        refetchClass();
        refetchStudents();
      },
      onError: () => {
        toaster.create({
          title: "Error",
          description: "Failed to add student",
          type: "error",
        });
      },
    }
  );

  const [createCourse, { loading: createLoading }] = useMutation(
    CREATE_COURSE,
    {
      client: clientSchool,
      onCompleted: async (data) => {
        const course = data.createCourse;
        toaster.create({
          title: "Course created",
          description: `The course "${course.title}" has been added.`,
          type: "success",
        });
        setCourseTitle("");

        for (const student of students) {
          const alreadyEnrolled = course.students?.some(
            (s: Student) => Number(s.id) === Number(student.id)
          );
          if (!alreadyEnrolled) {
            await enrollStudent({
              client: clientSchool,
              variables: {
                input: {
                  studentId: Number(student.id),
                  courseId: Number(course.id),
                },
              },
            });
          }
        }

        await refetchClass();
      },
      onError: () => {
        toaster.create({
          title: "Error",
          description: "Unable to create the course",
          type: "error",
        });
      },
    }
  );

  const [findUser] = useLazyQuery(GET_USER_BY_EMAIL, { client: clientUsers });

  const [removeStudentFromClass, { loading: removing }] = useMutation(REMOVE_STUDENT_FROM_CLASS, {
    client: clientSchool,
    onCompleted: () => {
      toaster.create({
        title: "Student removed",
        description: "The student has been successfully removed from the class.",
        type: "success",
      });
      refetchClass();
      refetchStudents();
    },
    onError: () => {
      toaster.create({
        title: "Error",
        description: "Failed to remove student",
        type: "error",
      });
    },
  });

  const [removeStudentFromCourse] = useMutation(REMOVE_STUDENT_FROM_COURSE, {
    client: clientSchool,
  });

  const [deleteGrade] = useMutation(DELETE_GRADE, {
    client: clientSchool,
  });

  // Fetch grade stats for each course
  useEffect(() => {
    const fetchCourseStats = async () => {
      if (!classData?.getClass?.courses) return;

      const statsMap: Record<string, GradeStats> = {};
      for (const course of classData.getClass.courses) {
        try {
          const { data: statsData } = await clientSchool.query<{ getCourseGradeStats: GradeStats }>({
            query: GET_COURSE_GRADE_STATS,
            variables: { courseId: parseInt(course.id) },
          });

          if (statsData?.getCourseGradeStats) {
            statsMap[course.id] = statsData.getCourseGradeStats;
          }
        } catch (error) {
          console.error(`Error fetching stats for course ${course.id}:`, error);
        }
      }
      setCourseStats(statsMap);
    };

    fetchCourseStats();
  }, [classData?.getClass?.courses]);

  const handleAddStudent = async () => {
    if (!email) {
      toaster.create({
        title: "Error",
        description: "Please enter an email address",
        type: "error",
      });
      return;
    }

    try {
      // First, get the user by email
      const { data: userData } = await clientUsers.query({
        query: GET_USER_BY_EMAIL,
        variables: { email },
      });

      if (!userData?.getUserByEmail) {
        toaster.create({
          title: "Error",
          description: "User not found",
          type: "error",
        });
        return;
      }

      const student = userData.getUserByEmail;
      if (student.role !== "student") {
        toaster.create({
          title: "Error",
          description: "User is not a student",
          type: "error",
        });
        return;
      }

      // Add student to class
      await addStudentToClass({
        variables: {
          classId: id,
          studentId: student.id,
        },
      });

      // Enroll student in all courses
      for (const course of classData?.getClass?.courses || []) {
        try {
          await enrollStudent({
            variables: {
              courseId: course.id,
              studentId: student.id,
            },
          });
        } catch (error) {
          console.error(`Failed to enroll student in course ${course.id}:`, error);
          toaster.create({
            title: "Warning",
            description: `Failed to enroll student in course ${course.title}`,
            type: "warning",
          });
        }
      }

      toaster.create({
        title: "Success",
        description: "Student added to class and enrolled in all courses",
        type: "success",
      });
      setEmail("");
      refetchClass();
      refetchStudents();
    } catch (error) {
      console.error("Error adding student:", error);
      toaster.create({
        title: "Error",
        description: "Failed to add student to class",
        type: "error",
      });
    }
  };

  const handleRemoveStudent = async (studentId: number) => {
    if (!id) return;

    try {
      // First remove the student from the class
      await removeStudentFromClass({
        variables: {
          classId: Number(id),
          studentId,
        },
      });

      // Then remove the student from all courses and delete their grades
      for (const course of courses) {
        try {
          // Remove from course
          await removeStudentFromCourse({
            variables: {
              input: {
                courseId: Number(course.id),
                studentId,
              },
            },
          });

          // Delete their grade
          await deleteGrade({
            variables: {
              courseId: Number(course.id),
              studentId,
            },
          });
        } catch (err) {
          console.error(`Error removing student from course ${course.id}:`, err);
          toaster.create({
            title: "Warning",
            description: `Failed to remove student from course ${course.title}`,
            type: "warning",
          });
        }
      }

      // Refetch all data to ensure UI is up to date
      await Promise.all([
        refetchClass(),
        refetchStudents(),
      ]);

      toaster.create({
        title: "Student removed",
        description: "The student has been successfully removed from the class and all courses.",
        type: "success",
      });
    } catch (err) {
      console.error("Error removing student:", err);
      toaster.create({
        title: "Error",
        description: "Something went wrong while removing the student",
        type: "error",
      });
    }
  };

  if (classLoading || studentsLoading) {
    return (
      <Box textAlign="center" mt={20}>
        <Spinner size="xl" />
        <Text mt={4}>Loading...</Text>
      </Box>
    );
  }

  if (classError || studentsError || !classInfo) {
    return (
      <Box mt={10} textAlign="center">
        <Text color="red.500">Class not found</Text>
        <Button onClick={() => navigate("/prof/classes")} mt={6}>
          ◀️ Go back to the class list
        </Button>
      </Box>
    );
  }

  return (
    <Box maxW="xl" mx="auto" mt={10} w={500}>
      <Heading mb={4}>Class: {classInfo.name}</Heading>

      {/* Add Student */}
      <Field.Root>
        <Field.Label>Add a student to this class</Field.Label>
        <Input
          placeholder="student@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          textAlign={"center"}
        />
        <Button
          colorScheme="blue"
          mt={2}
          onClick={handleAddStudent}
          loading={adding}
          disabled={!email.trim()}
          alignSelf={"center"}
        >
          ➕ Add student
        </Button>
      </Field.Root>

      {/* Display Students */}
      <Box mt={10}>
        <Heading size="md">Students in this class:</Heading>
        <VStack align="stretch" mt={4}>
          {students.length > 0 ? (
            students.map((student: Student) => (
              <Box key={student.id} p={4} borderWidth={1} rounded="md">
                <HStack justify="space-between" align="center">
                  <Box>
                    <Text fontWeight="bold">
                      {student.firstname} {student.lastname}
                    </Text>
                    <Text color="white.600">{student.email}</Text>
                    <Text fontSize="sm" color="white.500">{student.role}</Text>
                  </Box>
                  <Button
                    colorScheme="red"
                    size="sm"
                    onClick={() => handleRemoveStudent(Number(student.id))}
                    loading={removing}
                    color={"red.400"}
                  >
                    Remove
                  </Button>
                </HStack>
              </Box>
            ))
          ) : (
            <Text color="white.500">No students yet.</Text>
          )}
        </VStack>
      </Box>

      <Separator mt={6} mb={6} />

      {/* Add Course */}
      <Field.Root>
        <Field.Label>Create a new course</Field.Label>
        <Input
          value={courseTitle}
          onChange={(e) => setCourseTitle(e.target.value)}
          placeholder="ex: Algebra"
          textAlign={"center"}
        />
        <Button
          mt={2}
          colorScheme="green"
          onClick={() => {
            if (id && user?.id) {
              createCourse({
                variables: {
                  input: {
                    title: courseTitle,
                    teacherId: Number(user.id),
                    classId: Number(id),
                  },
                },
              });
            }
          }}
          disabled={!courseTitle.trim()}
          loading={createLoading}
          alignSelf={"center"}
        >
          ➕ Create course
        </Button>
      </Field.Root>

      {/* Display Courses */}
      <Box mt={6}>
        <Heading size="md">Courses in this class:</Heading>
        <VStack align="stretch" gap={4}>
          {classData?.getClass?.courses.map((course) => (
            <Box key={course.id} p={4} borderWidth={1} borderRadius="lg">
              <HStack justify="space-between" align="center">
                <Box>
                  <Text fontWeight="bold" fontSize="lg">{course.title}</Text>
                  {courseStats[course.id] && (
                    <HStack mt={2} gap={4}>
                      <Text fontSize="sm" color="white.600">
                        Min: {courseStats[course.id].min.toFixed(2)}
                      </Text>
                      <Text fontSize="sm" color="white.600">
                        Median: {courseStats[course.id].median.toFixed(2)}
                      </Text>
                      <Text fontSize="sm" color="white.600">
                        Max: {courseStats[course.id].max.toFixed(2)}
                      </Text>
                    </HStack>
                  )}
                </Box>
                <Button
                  colorScheme="blue"
                  variant="outline"
                  onClick={() => navigate(`/prof/courses/${course.id}`)}
                  color={"blue.400"}
                >
                  View Details
                </Button>
              </HStack>
            </Box>
          ))}
        </VStack>
      </Box>

      <Button onClick={() => navigate("/prof/classes")} mt={6}>
        ◀️ Go back to the class list
      </Button>

      <Toaster />
    </Box>
  );
}
