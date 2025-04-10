import { gql } from "@apollo/client";

export const GET_GRADES = gql`
  query GetGrades($courseId: Int!) {
    getGrades(courseId: $courseId) {
      id
      studentId
      courseId
      value
    }
  }
`;
