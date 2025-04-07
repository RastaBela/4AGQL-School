import { LOGIN } from "../mutations/login";
import { REGISTER } from "../mutations/register";
import { GET_GRADES } from "../queries/getGrades";
import { GET_MY_CLASSES } from "../queries/getMyClasses";
import { MockedResponse } from "@apollo/client/testing";

const loginMock = (email: string, password: string): MockedResponse => ({
  request: {
    query: LOGIN,
    variables: { email, password },
  },
  result: {
    data: {
      login: {
        token: "token-for-" + email,
        role: email.includes("prof") ? "professor" : "student",
      },
    },
  },
});

const registerMock = (
  email: string,
  pseudo: string,
  password: string
): MockedResponse => ({
  request: {
    query: REGISTER,
    variables: { email, pseudo, password },
  },
  result: {
    data: {
      register: {
        token: "token-for-" + email,
        role: email.includes("prof") ? "professor" : "student",
      },
    },
  },
});

const gradesMock = (): MockedResponse => ({
  request: {
    query: GET_GRADES,
  },
  result: {
    data: {
      grades: [
        { course: "Maths", grade: 15 },
        { course: "History", grade: 12 },
        { course: "Physics", grade: 18 },
      ],
    },
  },
});

const classesMock = (): MockedResponse => ({
  request: {
    query: GET_MY_CLASSES,
  },
  result: {
    data: {
      myClasses: [
        { id: "1", name: "Maths - 4A", teacherName: "Mr. Einstein" },
        { id: "2", name: "History - 4A", teacherName: "Mrs. Curie" },
        { id: "3", name: "Physics - 4A", teacherName: "Mr. Newton" },
      ],
    },
  },
});

export const mocks = [
  loginMock("test@student.com", "student123"),
  loginMock("test@prof.com", "prof123"),
  registerMock("new@student.com", "newbie", "newpassword"),
  registerMock("new@prof.com", "newbie", "newpassword"),
  gradesMock(),
  classesMock(),
];

// export const mocks = [
//   {
//     request: {
//       query: LOGIN,
//       variables: {
//         email: "test@student.com",
//         password: "student123",
//       },
//     },
//     result: {
//       data: {
//         login: {
//           token: "fake-student-token",
//           role: "student",
//         },
//       },
//     },
//   },
//   {
//     request: {
//       query: LOGIN,
//       variables: {
//         email: "prof@school.com",
//         password: "professor123",
//       },
//     },
//     result: {
//       data: {
//         login: {
//           token: "fake-professor-token",
//           role: "professor",
//         },
//       },
//     },
//   },

//   {
//     request: {
//       query: REGISTER,
//       variables: {
//         email: "newuser@example.com",
//         password: "newpassword",
//         pseudo: "newbie",
//       },
//     },
//     result: {
//       data: {
//         register: {
//           token: "fake-newuser-token",
//           role: "student", // or "professor"
//         },
//       },
//     },
//   },

//   {
//     request: {
//       query: GET_GRADES,
//     },
//     result: {
//       data: {
//         grades: [
//           { course: "Maths", grade: 15 },
//           { course: "History", grade: 12 },
//           { course: "Physics", grade: 18 },
//         ],
//       },
//     },
//   },

//   {
//     request: {
//       query: GET_MY_CLASSES,
//     },
//     result: {
//       data: {
//         myClasses: [
//           { id: "1", name: "Maths - 4A", teacherName: "Mr. Einstein" },
//           { id: "2", name: "History - 4A", teacherName: "Mrs. Curie" },
//           { id: "3", name: "Physics - 4A", teacherName: "Mr. Newton" },
//         ],
//       },
//     },
//   },
// ];
