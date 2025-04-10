import { gql } from "@apollo/client";

export const GET_ENROLLMENTS = gql`
  query GetEnrollments($courseId: Int!) {
    getEnrollments(courseId: $courseId) {
      id
      courseId
      studentId
      student {
        id
        firstname
        lastname
        email
        role
      }
    }
  }
`;
