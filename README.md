# School Management System

A modern web application for managing school classes, courses, and student grades. Built with React, TypeScript, GraphQL, and Chakra UI.

## 🚀 Features

- **User Authentication**
  - Role-based access (Teachers, Students)
  - Secure login system

- **Class Management**
  - Create and manage classes
  - Add/remove students from classes
  - View class statistics and grades

- **Course Management**
  - Create and manage courses
  - Assign courses to classes
  - Track student enrollment

- **Grade Management**
  - Record and view student grades
  - View grade statistics (min, median, max)
  - Track student progress

- **Student Dashboard**
  - View enrolled classes
  - Check grades and progress
  - Access course materials

## 🛠️ Tech Stack

- **Frontend**
  - React
  - TypeScript
  - GraphQL (Apollo Client)
  - Chakra UI
  - React Router

- **Backend**
  - GraphQL API
  - TypeScript
  - PostgreSQL

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/school-management-system.git
cd school-management-system
```

2. Install dependencies:
```bash
npm install
```

4. Start the development server:
```bash
npm run dev
```

## 🎨 UI Components

The application uses Chakra UI for a modern and responsive design:

- **Navigation**
  - Dashboard
  - Classes
  - Courses
  - Grades

- **Cards**
  - Class cards with statistics
  - Course cards with grade information
  - Student cards with enrollment status

- **Forms**
  - Class creation
  - Student enrollment
  - Grade input

## 📊 Data Structure

```graphql
type Class {
  id: ID!
  name: String!
  students: [Student!]!
  courses: [Course!]!
}

type Course {
  id: ID!
  title: String!
  teacherId: ID!
  classId: ID!
  students: [Student!]!
}

type Student {
  id: ID!
  name: String!
  email: String!
  role: String!
}

type Grade {
  id: ID!
  studentId: ID!
  courseId: ID!
  value: Float!
}
```

## 🔐 Authentication

The application uses a role-based authentication system:

- **Teachers**
  - Create and manage classes
  - Add/remove students
  - Record grades
  - View statistics

- **Students**
  - View enrolled classes
  - Check grades
  - Access course materials
