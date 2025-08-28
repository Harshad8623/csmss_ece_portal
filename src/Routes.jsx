import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import AnalyticsDashboard from './pages/analytics-dashboard';
import LoginScreen from './pages/login-screen';
import StudentDashboard from './pages/student-dashboard';
import AttendanceManagement from './pages/attendance-management';
import MarksManagement from './pages/marks-management';
import TeacherDashboard from './pages/teacher-dashboard';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<AnalyticsDashboard />} />
        <Route path="/analytics-dashboard" element={<AnalyticsDashboard />} />
        <Route path="/login-screen" element={<LoginScreen />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/attendance-management" element={<AttendanceManagement />} />
        <Route path="/marks-management" element={<MarksManagement />} />
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
