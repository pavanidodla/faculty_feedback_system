import { Route, Routes } from "react-router-dom";
import AdminLayout from "../layout/AdminLayout";

import DashboardPage from "../components/DashboardHome";
import ManageSubjects from "../components/ManageSubjects";
import ViewFeedback from "../components/ViewFeedback";
import ExportFeedback from "../components/ExportFeedback";

export default function AdminDashboard() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="subjects" element={<ManageSubjects />} />
        <Route path="feedback" element={<ViewFeedback />} />
        <Route path="export" element={<ExportFeedback />} />
      </Route>
    </Routes>
  );
}
