import { ADD_STUDENT_TO_CLASS } from "../mutations/addStudentToClass";
import { CREATE_CLASS } from "../mutations/createClass";
import { DELETE_CLASS } from "../mutations/deleteClass";
import { LOGIN } from "../mutations/login";
import { REGISTER } from "../mutations/register";
import { GET_ALL_CLASSES } from "../queries/getAllClasses";
import { GET_CLASS_BY_ID } from "../queries/getClassById";
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

const allClassesMock = (): MockedResponse => ({
  request: {
    query: GET_ALL_CLASSES,
  },
  result: {
    data: {
      allClasses: [
        { id: "1", name: "Maths", studentCount: 24 },
        { id: "2", name: "History", studentCount: 18 },
        { id: "3", name: "Physics", studentCount: 30 },
      ],
    },
  },
});

const createClassMock = (name: string): MockedResponse => ({
  request: {
    query: CREATE_CLASS,
    variables: {
      name: name,
    },
  },
  result: {
    data: {
      createClass: {
        id: "4",
        name: name,
        studentCount: 0,
      },
    },
  },
});

const getClassesByIdMock = (id: string): MockedResponse => ({
  request: {
    query: GET_CLASS_BY_ID,
    variables: { id: id },
  },
  result: {
    data: {
      class: {
        id: id,
        name: "Maths",
        students: [
          { id: "s1", email: "alice@example.com", pseudo: "alice01" },
          { id: "s2", email: "bob@example.com", pseudo: "bobby" },
        ],
      },
    },
  },
});

const addStudentToClassMock = (id: string, email: string): MockedResponse => ({
  request: {
    query: ADD_STUDENT_TO_CLASS,
    variables: {
      classId: id,
      email: email,
    },
  },
  result: {
    data: {
      addStudentToClass: {
        id: "s3",
        email: email,
        pseudo: "newbie",
      },
    },
  },
});

const deleteClassMock = (id: string): MockedResponse => ({
  request: {
    query: DELETE_CLASS,
    variables: {
      id: id,
    },
  },
  result: {
    data: {
      deleteClass: {
        success: true,
        message: "The class has been deleted.",
      },
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
  allClassesMock(),
  createClassMock("Biology"),
  allClassesMock(),
  getClassesByIdMock("1"),
  addStudentToClassMock("1", "new@student.com"),
  deleteClassMock("1"),
];
