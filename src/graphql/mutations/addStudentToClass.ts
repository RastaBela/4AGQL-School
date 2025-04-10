import { gql } from "@apollo/client";

export const ADD_STUDENT_TO_CLASS = gql`
  mutation AddStudentToClass($input: AddStudentToClassInput!) {
    addStudentToClass(input: $input) {
      id
      name
    }
  }
`;
