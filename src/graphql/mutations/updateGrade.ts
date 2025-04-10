import { gql } from "@apollo/client";

export const UPDATE_GRADE = gql`
  mutation UpdateGrade($input: UpdateGradeInput!) {
    updateGrade(input: $input) {
      id
      studentId
      courseId
      value
    }
  }
`;
