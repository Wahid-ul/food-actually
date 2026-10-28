import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Questionnaire from './pages/Questionnaire';
import Plans from './pages/Plans';
import Blog from './pages/Blog';
import AdminUpload from './pages/AdminUpload';
import AdminWeeklyMenuUpload from './pages/AdminWeeklyMenuUpload';
import MenuItemDetail from './pages/MenuItemDetail';
import WeeklyMenuItemDetail from './pages/WeeklyMenuItemDetail';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/questionnaire" element={<Questionnaire />} />
      <Route path="/plans" element={<Plans />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/admin-upload" element={<AdminUpload />} />
      <Route path="/admin-weekly-menu-upload" element={<AdminWeeklyMenuUpload />} />
      <Route path="/menu-item/:id" element={<MenuItemDetail />} />
      <Route path="/weekly-menu-item/:id" element={<WeeklyMenuItemDetail />} />
    </Routes>
  );
}