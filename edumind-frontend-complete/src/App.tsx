import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuthStore } from "./store/authStore";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Tutor from "./pages/Tutor";
import Quizzes from "./pages/Quizzes";
import Courses from "./pages/Courses";
import StudyPlanner from "./pages/StudyPlanner";
import Progress from "./pages/Progress";
import Documents from "./pages/Documents";
import Profile from "./pages/Profile";
import Career from "./pages/Career";

function Protected({ children }: { children: React.ReactElement }) {
  const auth = useAuthStore();
  if (auth.loading) return <div className="center-screen"><div className="spinner" /></div>;
  return auth.isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const checkAuth = useAuthStore((s) => s.checkAuth);
  useEffect(() => { void checkAuth(); }, [checkAuth]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Protected><Layout /></Protected>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="tutor" element={<Tutor />} />
        <Route path="tutor/:id" element={<Tutor />} />
        <Route path="quizzes" element={<Quizzes />} />
        <Route path="courses" element={<Courses />} />
        <Route path="study-planner" element={<StudyPlanner />} />
        <Route path="progress" element={<Progress />} />
        <Route path="documents" element={<Documents />} />
        <Route path="career" element={<Career />} />
        <Route path="profile" element={<Profile />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}