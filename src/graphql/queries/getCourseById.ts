import { gql } from "@apollo/client";

export const GET_COURSE_BY_ID = gql`
  query GetCourse($id: ID!) {
    getCourse(id: $id) {
      id
      title
      teacherId
      classId
    }
  }
`;
