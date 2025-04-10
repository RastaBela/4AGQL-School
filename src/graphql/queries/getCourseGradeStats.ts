import { gql } from "@apollo/client";

export const GET_COURSE_GRADE_STATS = gql`
  query GetStudentGradeStats($courseId: Int!) {
    getCourseGradeStats(courseId: $courseId) {
        median
        min
        max
    }
}
`;