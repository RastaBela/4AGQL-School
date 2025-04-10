import { gql } from "@apollo/client";

export const REMOVE_STUDENT_FROM_COURSE = gql`
  mutation RemoveStudentFromCourse($input: RemoveStudentFromCourseInput!) {
    removeStudentFromCourse(input: $input)
  }
`;
