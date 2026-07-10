import { Routes, Route, Navigate } from "react-router-dom";

import { useAuth } from "./hooks/useAuth";
import MySpace from "./pages/MySpace/MySpace";
import MainLayout from "./layouts/MainLayout";

import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import UsernameSetup from "./pages/UsernameSetup/UsernameSetup";

import Dashboard from "./pages/Dashboard/Dashboard";

import Tasks from "./pages/Tasks/Tasks";
import CreateTask from "./pages/Tasks/CreateTask";
import EditTask from "./pages/Tasks/EditTask";

import Habits from "./pages/Habits/Habits";
import Journal from "./pages/Journal/Journal";
import Notes from "./pages/Notes/Notes";
import Expenses from "./pages/Expenses/Expenses";
import Goals from "./pages/Goals/Goals";
import Calendar from "./pages/Calendar/Calendar";
import AI from "./pages/AI/AI";
import Settings from "./pages/Settings/Settings";

function App() {

  const { user, loading } = useAuth();

  if (loading) {

    return (

      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "24px",
          fontWeight: "600",
        }}
      >

        Loading...

      </div>

    );

  }

  return (

    <Routes>

      {/* ================= PUBLIC ROUTES ================= */}

      <Route
        path="/login"
        element={
          user
            ? <Navigate to="/dashboard" replace />
            : <Login />
        }
      />

      <Route
        path="/register"
        element={
          user
            ? <Navigate to="/dashboard" replace />
            : <Register />
        }
      />

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      <Route
        path="/setup-username"
        element={
          user
            ? <UsernameSetup />
            : <Navigate to="/login" replace />
        }
      />

      {/* ================= PROTECTED ROUTES ================= */}

      <Route
        path="/"
        element={
          user
            ? <MainLayout />
            : <Navigate to="/login" replace />
        }
      >

        <Route
          index
          element={<Navigate to="/dashboard" replace />}
        />

        <Route
          path="dashboard"
          element={<Dashboard />}
        />

        {/* ================= TASKS ================= */}

        <Route
          path="tasks"
          element={<Tasks />}
        />

        <Route
          path="tasks/create"
          element={<CreateTask />}
        />

        <Route
          path="tasks/edit/:id"
          element={<EditTask />}
        />

        {/* ================= OTHER PAGES ================= */}

        <Route
          path="habits"
          element={<Habits />}
        />

        <Route
          path="journal"
          element={<Journal />}
        />

        <Route
          path="notes"
          element={<Notes />}
        />

        <Route
          path="expenses"
          element={<Expenses />}
        />

        <Route
          path="goals"
          element={<Goals />}
        />

        <Route
          path="calendar"
          element={<Calendar />}
        />

        <Route
          path="ai"
          element={<AI />}
        />
        <Route
  path="profile"
  element={<MySpace />}
/>

        <Route
          path="settings"
          element={<Settings />}
        />

      </Route>

      {/* ================= 404 ================= */}

      <Route
        path="*"
        element={
          <Navigate
            to={user ? "/dashboard" : "/login"}
            replace
          />
        }
      />

    </Routes>

  );

}

export default App;