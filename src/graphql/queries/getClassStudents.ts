import { gql } from "@apollo/client";

export const GET_CLASS_STUDENTS = gql`
  query GetClassStudents($classId: Int!) {
    getClassStudents(classId: $classId) {
        id
        classId
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