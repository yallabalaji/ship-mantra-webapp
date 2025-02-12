import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { getUserRole } from "./utils/authUtils";

import Login from "./pages/LoginPage";
import SignUpPage from './pages/SignUpPage';
import RoutePlannerDashboard from './pages/PlannerDashboard';
import HubRegisterPage from "./pages/HubRegistration";
import HubViewPage from "./pages/HubViewPage";
import GraphPage from "./pages/GraphPage";
import RouteRegistrationPage from "./pages/RouteRegistration";
import RouteViewPage from "./pages/RouteViewPage";
import RouteUserDashboard from "./pages/UserDashboard";
import Unauthorized from "./components/Unauthorized";
import Logout from "./pages/LogoutPage";
import routes from "./routes";

const App = () => {
  const userRole = getUserRole(); // Fetch user role

  return (
    <Router>
      <Routes>
        <Route path={routes.login} element={<Login />} />
        <Route path={routes.signup} element={<SignUpPage />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/logout" element={<Logout />} />

        {/* Routes for Route Planners */}
        <Route element={<ProtectedRoute allowedRoles={["RoutePlanner"]} userRole={userRole} />}>
          <Route path={routes.routePlannerDashboard} element={<RoutePlannerDashboard />} />
          <Route path={routes.hubRegistartion} element={<HubRegisterPage />} />
          <Route path={routes.routeRegistration} element={<RouteRegistrationPage />} />
        </Route>

        {/* Routes for Both Route Planners & Route Users */}
        <Route element={<ProtectedRoute allowedRoles={["RoutePlanner", "RouteUser"]} userRole={userRole} />}>
          <Route path={routes.hubView} element={<HubViewPage />} />
          <Route path={routes.graphPage} element={<GraphPage />} />
          <Route path={routes.routeViewPage} element={<RouteViewPage />} />
        </Route>

        {/* Routes for Route Users */}
        <Route element={<ProtectedRoute allowedRoles={["RouteUser"]} userRole={userRole} />}>
          <Route path={routes.userDashboard} element={<RouteUserDashboard />} />
        </Route>
      </Routes>
      
    </Router>
  );
};

export default App;
