import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicLayout from "./components/layout/PublicLayout";
import DashboardLayout from "./components/layout/DashboardLayout";

import Home from "./pages/public/Home";
import About from "./pages/public/About";
import Features from "./pages/public/Features";
import ZonesMap from "./pages/public/ZonesMap";
import Faq from "./pages/public/Faq";
import Announcements from "./pages/public/Announcements";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import VerifyOtp from "./pages/auth/VerifyOtp";
import AdminLogin from "./pages/auth/AdminLogin";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

import VendorDashboard from "./pages/vendor/VendorDashboard";
import ApplyLicense from "./pages/vendor/ApplyLicense";
import MyApplications from "./pages/vendor/MyApplications";
import MyLicenses, { LicenseDetail } from "./pages/vendor/MyLicenses";
import VendorProfile from "./pages/vendor/VendorProfile";
import Notifications from "./pages/vendor/Notifications";
import Feedback from "./pages/vendor/Feedback";
import SuccessStories from "./pages/vendor/SuccessStories";
import WomenSupportWrapper from "./pages/vendor/WomenSupportWrapper";
import {
  ComplaintList,
  NewComplaint,
  ComplaintDetail,
} from "./pages/vendor/Complaints";

import AdminDashboard from "./pages/admin/AdminDashboard";
import ApplicationsReview from "./pages/admin/ApplicationsReview";
import AdminZones from "./pages/admin/AdminZones";
import AdminComplaints from "./pages/admin/AdminComplaints";
import AdminVendors from "./pages/admin/AdminVendors";
import AdminVendorDetail from "./pages/admin/AdminVendorDetail";
import AdminAnnouncements from "./pages/admin/AdminAnnouncements";
import AdminFeedback from "./pages/admin/AdminFeedback";
import AdminWomenSupport from "./pages/admin/AdminWomenSupport";

import NotFound from "./pages/NotFound";

const vendorLinks = [
  { to: "/vendor/dashboard", label: "Dashboard", end: true },
  { to: "/vendor/licenses", label: "My Licenses" },
  { to: "/vendor/applications/new", label: "Apply for License", end: true },
  { to: "/vendor/applications", label: "My Applications", end: true },
  { to: "/vendor/complaints", label: "My Complaints" },
  { to: "/vendor/notifications", label: "Notifications" },
  { to: "/vendor/feedback", label: "Feedback" },
  { to: "/vendor/success-stories", label: "Community Forum", excludeForWomen: true },
  { to: "/vendor/women-support", label: "Women Support", womenOnly: true },
  { to: "/vendor/profile", label: "Profile" },
];

const adminLinks = [
  { to: "/admin/dashboard", label: "Dashboard", end: true },
  { to: "/admin/vendors", label: "Vendors" },
  { to: "/admin/applications", label: "Applications" },
  { to: "/admin/zones", label: "Zones" },
  { to: "/admin/complaints", label: "Complaints" },
  { to: "/admin/announcements", label: "Announcements" },
  { to: "/admin/women-support", label: "Women's Support" },
  { to: "/admin/feedback", label: "Feedback" },
];

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/features" element={<Features />} />
            <Route path="/zones" element={<ZonesMap />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/announcements" element={<Announcements />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Route>

          <Route element={<ProtectedRoute role="VENDOR" />}>
            <Route
              element={
                <DashboardLayout title="Vendor Portal" links={vendorLinks} />
              }
            >
              <Route path="/vendor/dashboard" element={<VendorDashboard />} />
              <Route path="/vendor/applications" element={<MyApplications />} />
              <Route
                path="/vendor/applications/new"
                element={<ApplyLicense />}
              />
              <Route path="/vendor/licenses" element={<MyLicenses />} />
              <Route path="/vendor/licenses/:id" element={<LicenseDetail />} />
              <Route path="/vendor/complaints" element={<ComplaintList />} />
              <Route path="/vendor/complaints/new" element={<NewComplaint />} />
              <Route
                path="/vendor/complaints/:id"
                element={<ComplaintDetail />}
              />
              <Route path="/vendor/notifications" element={<Notifications />} />
              <Route path="/vendor/feedback" element={<Feedback />} />
              <Route path="/vendor/success-stories" element={<SuccessStories />} />
              <Route path="/vendor/women-support" element={<WomenSupportWrapper />} />
              <Route path="/vendor/profile" element={<VendorProfile />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute role="ADMIN" />}>
            <Route
              element={
                <DashboardLayout title="Admin Portal" links={adminLinks} />
              }
            >
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route
                path="/admin/applications"
                element={<ApplicationsReview />}
              />
              <Route path="/admin/vendors" element={<AdminVendors />} />
              <Route
                path="/admin/vendors/:id"
                element={<AdminVendorDetail />}
              />
              <Route path="/admin/zones" element={<AdminZones />} />
              <Route path="/admin/complaints" element={<AdminComplaints />} />
              <Route path="/admin/announcements" element={<AdminAnnouncements />} />
              <Route path="/admin/women-support" element={<AdminWomenSupport />} />
              <Route path="/admin/feedback" element={<AdminFeedback />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
