import { gql } from "@apollo/client";

export const DELETE_GRADE = gql`
  mutation DeleteGrade($courseId: Int!, $studentId: Int!) {
    deleteGrade(courseId: $courseId, studentId: $studentId)
  }
`;
