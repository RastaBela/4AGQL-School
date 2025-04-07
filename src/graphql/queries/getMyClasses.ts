import { gql } from "@apollo/client";

export const GET_MY_CLASSES = gql`
  query GetMyClasses {
    myClasses {
      id
      name
      teacherName
    }
  }
`;
