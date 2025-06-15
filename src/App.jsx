import React from "react";


import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "./LoginForm/LoginForm.jsx";
import SignupForm from "./SignupForm/SignupForm.jsx";
import LandingPage from "./LandingPage.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import AddUser from './Components/Admin/AddUser';
import UserRoleTable from './Components/Admin/UserRoleTable';
import AdminDashboard from './Components/Admin/AdminDashboard';
import ManagerFeedback from './Components/Manager/ManagerFeedback';
import ManagerHome from './Components/Manager/ManagerHome';
import ManagerDashboard from './Components/Manager/ManagerDashboard';
import ManagerGoals from './Components/Manager/ManagerGoals';
import ManagerReports from './Components/Manager/ManagerReports';
import SeniorDashboard from './Components/Senior/SeniorDashboard';
import SeniorHome from './Components/Senior/SeniorHome.jsx';
import SeniorFeedback from './Components/Senior/SeniorFeedback.jsx';
import IconTest from './IconTest';
import EditUser from './Components/Admin/EditUser';
import JuniorDashboard from './Components/Junior/JuniorDashboard.jsx';
import JuniorFeedbackForm from './Components/Junior/JuniorFeedbackForm';
import JuniorHome from './Components/Junior/JuniorHome.jsx';
import JuniorGoals from './Components/Junior/JuniorGoals';
import JuniorNotes from './Components/Junior/JuniorNotes';
import SeniorGoals from './Components/Senior/SeniorGoals';
import SeniorNotes from './Components/Senior/SeniorNotes';


import 'bootstrap-icons/font/bootstrap-icons.css';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/icon-test" element={<IconTest />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />


        <Route path="/dashboard/admin" element={<AdminDashboard />}>
          <Route index element={<UserRoleTable />} />
          <Route path="manage-users" element={<UserRoleTable />} />
          <Route path="add-user" element={<AddUser />} />
          <Route path="edit-user/:id" element={<EditUser />} />
        </Route>



        <Route path="/dashboard/manager" element={<Navigate to="/dashboard/manager/home" />} />
        <Route path="/dashboard/senioremployee" element={<Navigate to="/dashboard/senioremployee/home" />} />
        <Route path="/dashboard/junioremployee" element={<Navigate to="/dashboard/junioremployee/home" />} />


        <Route path="/dashboard/manager" element={<ManagerDashboard />}>
          <Route index element={<ManagerHome />} />
          <Route path="home" element={<ManagerHome />} />
          <Route path="feedback" element={<ManagerFeedback />} />
          <Route path="goals" element={<ManagerGoals />} />
          <Route path="reports" element={<ManagerReports />} />
        </Route>

        <Route path="/dashboard/senioremployee" element={<SeniorDashboard />}>

          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<SeniorHome />} />
          <Route path="feedback" element={<SeniorFeedback />} />
          <Route path="goals" element={<SeniorGoals />} />
          <Route path="notes" element={<SeniorNotes />} />
        </Route>

        <Route path="/dashboard/junioremployee" element={<JuniorDashboard />}>
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<JuniorHome />} />
          <Route path="feedback" element={<JuniorFeedbackForm />} />
          <Route path="goals" element={<JuniorGoals />} />
          <Route path="notes" element={<JuniorNotes />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;