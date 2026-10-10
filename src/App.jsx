import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import KanjiDetailPage from "./pages/KanjiDetailPage";
import ProfilePage from "./pages/ProfilePage";
import ProtectedRoute from "./components/ProtectedRoute";
import CardTestPage from "./pages/CardTestPage";


function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/u/:username" element={<ProfilePage />} />
      <Route path="/cardtest" element={<CardTestPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/kanji/:characters"
        element={
          <ProtectedRoute>
            <KanjiDetailPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;