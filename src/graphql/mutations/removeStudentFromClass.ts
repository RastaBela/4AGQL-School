import { gql } from "@apollo/client";

export const REMOVE_STUDENT_FROM_CLASS = gql`
  mutation RemoveStudentFromClass($classId: Int!, $studentId: Int!) {
    removeStudentFromClass(input: { classId: $classId, studentId: $studentId })
  }
`;

type RemoveStudentFromClassInput = {
  classId: number;
  studentId: number;
  teacherId: number;
};
