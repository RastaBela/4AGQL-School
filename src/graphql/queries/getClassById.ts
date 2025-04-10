import { gql } from "@apollo/client";

export const GET_CLASS_BY_ID = gql`
  query GetClass($classId: ID!) {
    getClass(id: $classId) {
      id
      name
      students {
        id
        name
        email
      }
      courses {
        id
        title
        teacherId
        classId
      }
    }
  }
`;
