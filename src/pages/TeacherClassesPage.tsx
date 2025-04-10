import {
  Box,
  Heading,
  Spinner,
  Text,
  Button,
  Input,
  VStack,
  Field,
  Dialog,
  Portal,
  useDisclosure,
  HStack,
} from "@chakra-ui/react";
import { Toaster, toaster } from "../components/ui/toaster";
import { useMutation, useQuery } from "@apollo/client";
import { clientSchool } from "../services/clientSchool";
import { GET_CLASSES } from "../graphql/queries/getAllClasses";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { CREATE_CLASS } from "../graphql/mutations/createClass";
import { DELETE_CLASS } from "../graphql/mutations/deleteClass";
import { useAuth } from "../contexts/AuthContext";
import { GET_CLASS_GRADE_STATS } from "../graphql/queries/getClassGradesStats";

type SchoolClass = {
  id: string;
  name: string;
  students: {
    id: string;
    name: string;
    email: string;
  }[];
};

type GradeStats = {
  median: number;
  min: number;
  max: number;
};

export default function ProfessorClassesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [newClassName, setNewClassName] = useState("");
  const [classToDelete, setClassToDelete] = useState<string | null>(null);
  const { open, onOpen, onClose } = useDisclosure();
  const [classStats, setClassStats] = useState<Record<string, GradeStats>>({});

  const { data, loading, error, refetch } = useQuery<{
    getClasses: SchoolClass[];
  }>(GET_CLASSES, {
    client: clientSchool,
  });

  const [createClass, { loading: createLoading }] = useMutation(CREATE_CLASS, {
    client: clientSchool,
    onCompleted: async (data) => {
      toaster.create({
        title: "Class created",
        description: `The class "${data.createClass.name}" has been added.`,
        type: "success",
        duration: 3000,
        closable: true,
      });
      setNewClassName("");
      await refetch();
    },
    onError: () => {
      toaster.create({
        title: "Error",
        description: "Error while creating the class",
        type: "error",
        duration: 3000,
        closable: true,
      });
    },
  });

  const [deleteClass, { loading: deleteLoading }] = useMutation(DELETE_CLASS, {
    client: clientSchool,
  });

  const handleCreateClass = () => {
    if (!newClassName.trim()) return;

    createClass({
      variables: {
        input: {
          name: newClassName,
          // teacherId: user?.id,
        },
      },
    });
  };

  const handleDelete = async () => {
    if (!classToDelete) return;

    try {
      await deleteClass({
        variables: {
          id: classToDelete,
        },
      });

      toaster.create({
        title: "Class deleted",
        description: `The class has been successfully deleted.`,
        type: "success",
        duration: 3000,
        closable: true,
      });

      await refetch();
      onClose();
      setClassToDelete(null);
    } catch (error) {
      console.log(error);
      toaster.create({
        title: "Error",
        description: "Failed to delete the class.",
        type: "error",
        duration: 3000,
        closable: true,
      });
    }
  };

  // Fetch grade stats for each class
  useEffect(() => {
    const fetchClassStats = async () => {
      if (!data?.getClasses) return;

      const statsMap: Record<string, GradeStats> = {};
      for (const class_ of data.getClasses) {
        try {
          const { data: statsData } = await clientSchool.query<{ getClassGradeStats: GradeStats }>({
            query: GET_CLASS_GRADE_STATS,
            variables: { classId: parseInt(class_.id) },
          });

          if (statsData?.getClassGradeStats) {
            statsMap[class_.id] = statsData.getClassGradeStats;
          }
        } catch (error) {
          console.error(`Error fetching stats for class ${class_.id}:`, error);
        }
      }
      setClassStats(statsMap);
    };

    fetchClassStats();
  }, [data]);

  if (loading) {
    return (
      <Box mt={20} textAlign="center">
        <Spinner size="xl" />
        <Text mt={4}>Loading...</Text>
      </Box>
    );
  }

  if (error || !user || user?.role !== "teacher") {
    return (
      <Box mt={20} textAlign="center">
        <Text color="red.500">Error while loading the classes.</Text>
      </Box>
    );
  }

  const classes = data?.getClasses ?? [];

  return (
    <Box maxW="2xl" mx="auto" mt={10} w={500}>
      <Heading mb={6}>📚 All classes</Heading>

      <VStack align="stretch" gap={4}>
        {classes.map((class_) => (
          <Box key={class_.id} p={4} borderWidth={1} borderRadius="lg">
            <HStack justify="space-between" align="center">
              <Box>
                <Text fontWeight="bold" fontSize="lg">{class_.name}</Text>
                <Text fontSize="sm" color="white.600">
                  Students: {class_.students?.length ?? 0}
                </Text>
                {classStats[class_.id] && (
                  <HStack mt={2} gap={4}>
                    <Text fontSize="sm" color="white.600">
                      Min: {classStats[class_.id].min.toFixed(2)}
                    </Text>
                    <Text fontSize="sm" color="white.600">
                      Median: {classStats[class_.id].median.toFixed(2)}
                    </Text>
                    <Text fontSize="sm" color="white.600">
                      Max: {classStats[class_.id].max.toFixed(2)}
                    </Text>
                  </HStack>
                )}
              </Box>
              <Button
                colorScheme="blue"
                variant="outline"
                onClick={() => navigate(`/prof/classes/${class_.id}`)}
                color={"blue.400"}
              >
                View Details
              </Button>
            </HStack>
          </Box>
        ))}
      </VStack>

      <Field.Root mt={8}>
        <Field.Label>Name of the new class:</Field.Label>
        <HStack w="100%">
          <Input
            placeholder="Name"
            value={newClassName}
            onChange={(e) => setNewClassName(e.target.value)}
            textAlign="center"
            mr={2}
          />
          <Button
            colorScheme="green"
            onClick={handleCreateClass}
            disabled={!newClassName.trim()}
            loading={createLoading}
          >
            ➕ Create the class
          </Button>
        </HStack>
      </Field.Root>

      <Button mt={6} onClick={() => navigate("/dashboard")}>
        ◀️ Go back to the dashboard
      </Button>

      <Toaster />

      <Dialog.Root open={open} onOpenChange={onClose} placement="center">
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content bg="black">
              <Dialog.Header>
                <Dialog.Title>Delete class</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <p>Are you sure you want to delete this class?</p>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button variant="outline" bg="whiteAlpha.400" color="white">
                    Cancel
                  </Button>
                </Dialog.ActionTrigger>
                <Button
                  colorScheme="red"
                  onClick={handleDelete}
                  ml={3}
                  loading={deleteLoading}
                  color="red.400"
                  bg="whiteAlpha.400"
                >
                  Delete
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </Box>
  );
}
