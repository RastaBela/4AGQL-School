import "./App.css";
import { MockedProvider } from "@apollo/client/testing";
import { mocks } from "./graphql/mocks/mocks";
import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import StudentGradesPage from "./pages/StudentGradesPage";
import StudentClassesPage from "./pages/StudentClassesPage";
import PrivateRoute from "./components/PrivateRoute";
import PublicOnlyRoute from "./components/PublicOnlyRoute";

function App() {
  return (
    <MockedProvider mocks={mocks} addTypename={false}>
      <Routes>
        {/* public routes */}
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
          path="/grades"
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
      </Routes>
    </MockedProvider>
  );
}

export default App;
