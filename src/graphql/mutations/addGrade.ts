import { gql } from "@apollo/client";

export const ADD_GRADE = gql`
  mutation AddGrade($input: AddGradeInput!) {
    addGrade(input: $input) {
      id
      studentId
      courseId
      value
    }
  }
`;
