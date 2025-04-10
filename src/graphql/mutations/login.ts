import { gql } from "@apollo/client";

export const LOGIN = gql`
  mutation Login($pseudo: String!, $password: String!) {
    login(pseudo: $pseudo, password: $password) {
      token
      user {
        id
        firstname
        lastname
        pseudo
        phone
        email
        role
      }
    }
  }
`;
