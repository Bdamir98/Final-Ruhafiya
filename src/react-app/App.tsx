import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "../components/sections/Home";
import AdminLogin from "../components/admin/dashboard/AdminLogin";
import AdminDashboard from "../components/admin/dashboard/AdminDashboard";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}
