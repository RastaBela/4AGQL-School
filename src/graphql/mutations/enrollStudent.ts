import { gql } from "@apollo/client";

export const ENROLL_STUDENT = gql`
  mutation EnrollStudent($input: EnrollStudentInput!) {
    enrollStudent(input: $input) {
      id
      courseId
      studentId
    }
  }
`;
