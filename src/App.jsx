import { Routes, Route, Navigate } from "react-router-dom";
import FriendsHub from "./pages/FriendsHub/FriendsHub";
import Games from "./pages/Games/Games";
import { useAuth } from "./hooks/useAuth";
import LudoHome from "./pages/Games/ludo/LudoHome";
import CreateRoom from "./pages/Games/ludo/CreateRoom";
import Loader from "./components/Loader/Loader";

import MainLayout from "./layouts/MainLayout";

import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import UsernameSetup from "./pages/UsernameSetup/UsernameSetup";

import Dashboard from "./pages/Dashboard/Dashboard";

import Tasks from "./pages/Tasks/Tasks";
import CreateTask from "./pages/Tasks/CreateTask";
import EditTask from "./pages/Tasks/EditTask";
import Finance from "./pages/Finance/Finance";

import Journal from "./pages/Journal/Journal";
import Notes from "./pages/Notes/Notes";
import Expenses from "./pages/Expenses/Expenses";
import Goals from "./pages/Goals/Goals";
import Calendar from "./pages/Calendar/Calendar";
import AI from "./pages/AI/AI";
import Settings from "./pages/Settings/Settings";
import LudoBoard from "./pages/Games/ludo/LudoBoard";
import MySpace from "./pages/MySpace/MySpace";
import Vault from "./pages/Vault/Vault";
import MyLibrary from "./pages/MyLibrary/MyLibrary";
import LudoRoom from "./pages/Games/ludo/LudoRoom";
import JoinRoom from "./pages/Games/ludo/JoinRoom";

function App() {

  const { user, loading } = useAuth();

if (loading) {

    return <Loader />;

}

  return (

    <Routes>

      {/* ================= PUBLIC ROUTES ================= */}

      <Route
  path="/login"
  element={
    !user ? (
      <Login />
    ) : !user.onboardingCompleted ? (
      <Navigate to="/setup-username" replace />
    ) : (
      <Navigate to="/dashboard" replace />
    )
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
    !user ? (
      <Navigate to="/login" replace />
    ) : !user.onboardingCompleted ? (
      <Navigate to="/setup-username" replace />
    ) : (
      <MainLayout />
    )
  }
>

        <Route
          index
          element={<Navigate to="/dashboard" replace />}
        />

        {/* ================= DASHBOARD ================= */}

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
    path="library"
    element={<MyLibrary />}
/>

        <Route
          path="journal"
          element={<Journal />}
        />
        <Route
  path="friends"
  element={<FriendsHub />}
/>
<Route
    path="games/ludo"
    element={<LudoHome />}
/>
<Route
    path="games/ludo/create"
    element={<CreateRoom />}
/>
<Route
    path="games/ludo/game/:roomId"
    element={<LudoBoard />}
/>
<Route
  path="games"
  element={<Games />}
/>

<Route
    path="games/ludo/room/:roomId"
    element={<LudoRoom />}
/>
<Route
    path="games/ludo/join"
    element={<JoinRoom />}
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
  path="finance"
  element={<Finance />}
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
          path="vault"
          element={<Vault />}
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