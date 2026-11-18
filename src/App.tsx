import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { StoreProvider, useStore } from "@/lib/store";
import { ScrollToTop, ToastHost } from "@/components/SiteLayout";
import Home from "@/pages/Home";
import Auth from "@/pages/Auth";
import Expos from "@/pages/Expos";
import ExpoDetail from "@/pages/ExpoDetail";
import FloorPlanPage from "@/pages/FloorPlanPage";
import SchedulePage from "@/pages/SchedulePage";
import PricingPage from "@/pages/PricingPage";
import SupportPage from "@/pages/SupportPage";
import AdminLayout from "@/pages/admin/AdminLayout";
import AdminOverview from "@/pages/admin/AdminOverview";
import AdminExpos from "@/pages/admin/AdminExpos";
import AdminExhibitors from "@/pages/admin/AdminExhibitors";
import AdminSchedule from "@/pages/admin/AdminSchedule";
import AdminFloorPlan from "@/pages/admin/AdminFloorPlan";
import AdminAnalytics from "@/pages/admin/AdminAnalytics";
import AdminMessages from "@/pages/admin/AdminMessages";
import AdminSettings from "@/pages/admin/AdminSettings";
import ExhibitorPortal from "@/pages/ExhibitorPortal";
import AttendeePortal from "@/pages/AttendeePortal";

function RequireRole({ role, children }: { role: "organizer" | "exhibitor" | "attendee"; children: React.ReactNode }) {
  const { user } = useStore();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to="/login?switch=1" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <StoreProvider>
      <HashRouter>
        <ScrollToTop />
        <ToastHost />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/expos" element={<Expos />} />
          <Route path="/expos/:slug" element={<ExpoDetail />} />
          <Route path="/floor-plan" element={<FloorPlanPage />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/login" element={<Auth mode="login" />} />
          <Route path="/register" element={<Auth mode="register" />} />
          <Route path="/forgot-password" element={<Auth mode="forgot" />} />

          <Route
            path="/admin"
            element={
              <RequireRole role="organizer">
                <AdminLayout />
              </RequireRole>
            }
          >
            <Route index element={<AdminOverview />} />
            <Route path="expos" element={<AdminExpos />} />
            <Route path="exhibitors" element={<AdminExhibitors />} />
            <Route path="schedule" element={<AdminSchedule />} />
            <Route path="floor-plan" element={<AdminFloorPlan />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="messages" element={<AdminMessages />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          <Route
            path="/portal"
            element={
              <RequireRole role="exhibitor">
                <ExhibitorPortal />
              </RequireRole>
            }
          />
          <Route
            path="/attendee"
            element={
              <RequireRole role="attendee">
                <AttendeePortal />
              </RequireRole>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </StoreProvider>
  );
}
