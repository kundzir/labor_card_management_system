import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import ProductionTrackingDashboard from './pages/production-tracking-dashboard';
import ScrapRegistrationInterface from './pages/scrap-registration-interface';
import WorkerAuthentication from './pages/worker-authentication';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<ProductionTrackingDashboard />} />
        <Route path="/production-tracking-dashboard" element={<ProductionTrackingDashboard />} />
        <Route path="/scrap-registration-interface" element={<ScrapRegistrationInterface />} />
        <Route path="/worker-authentication" element={<WorkerAuthentication />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
