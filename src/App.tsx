import "./App.css";
// import { MockedProvider } from "@apollo/client/testing";
// import { mocks } from "./graphql/mocks/mocks";
import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import StudentGradesPage from "./pages/StudentGradesPage";
import StudentClassesPage from "./pages/StudentClassesPage";
import PrivateRoute from "./components/PrivateRoute";
import PublicOnlyRoute from "./components/PublicOnlyRoute";
import TeacherClassesPage from "./pages/TeacherClassesPage";
import TeacherClassDetailPage from "./pages/TeacherClassDetailPage";
import CourseDetailPage from "./pages/CourseDetailPage";

function App() {
  return (
    // <MockedProvider mocks={mocks} addTypename={false}>
    <Routes>
      {/* public routes */}
      <Route
        path="/"
        element={
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicOnlyRoute>
            <RegisterPage />
          </PublicOnlyRoute>
        }
      />

      {/* protected routes */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/grades/:classId"
        element={
          <PrivateRoute requiredRole="student">
            <StudentGradesPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/classes"
        element={
          <PrivateRoute requiredRole="student">
            <StudentClassesPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/prof/classes"
        element={
          <PrivateRoute requiredRole="teacher">
            <TeacherClassesPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/prof/classes/:id"
        element={
          <PrivateRoute requiredRole="teacher">
            <TeacherClassDetailPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/prof/courses/:id"
        element={
          <PrivateRoute requiredRole="teacher">
            <CourseDetailPage />
          </PrivateRoute>
        }
      />
    </Routes>
    //</MockedProvider>
  );
}

export default App;
