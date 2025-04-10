import { gql } from "@apollo/client";

export const GET_CLASS_GRADE_STATS = gql`
  query GetClassGradeStats($classId: Int!) {
    getClassGradeStats(classId: $classId) {
        median
        min
        max
    }
}
`;