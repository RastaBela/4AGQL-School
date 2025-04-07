import { gql } from "@apollo/client";

export const GET_GRADES = gql`
  query GetGrades {
    grades {
      course
      grade
    }
  }
`;
