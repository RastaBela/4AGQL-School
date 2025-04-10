import { gql } from "@apollo/client";

export const GET_CLASSES = gql`
  query GetClasses {
    getClasses {
      id
      name
      students {
        id
        name
        email
      }
    }
  }
`;
