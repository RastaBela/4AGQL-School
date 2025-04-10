import { gql } from "@apollo/client";

export const ME = gql`
  query Me {
    me {
      id
      firstname
      lastname
      pseudo
      phone
      email
      role
    }
  }
`;
