import { gql } from "@apollo/client";

export const UPDATE_CLASS = gql`
  mutation UpdateClass($id: Int!, $input: UpdateClassInput!) {
    updateClass(id: $id, input: $input) {
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