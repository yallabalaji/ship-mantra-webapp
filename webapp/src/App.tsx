import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import SignUpPage from './pages/SignUpPage';
import RoutePlannerDashboard from './pages/PlannerDashboard';
import HubRegisterPage from "./pages/HubRegistration";
import HubViewPage from "./pages/HubViewPage";
import GraphPage from "./pages/GraphPage";
import routes from "./routes";
import RouteRegistrationPage from "./pages/RouteRegistration";

const App = () => {
  return (
    <Router>
      <Routes>
      <Route path={routes.login} element={<Login />} />
      <Route path={routes.dashboard} element={<Dashboard />} />
      <Route path={routes.signup} element={<SignUpPage />} /> 
      <Route path={routes.routePlannerDashboard} element={<RoutePlannerDashboard />} />
      <Route path={routes.hubRegistartion} element={<HubRegisterPage />} />
      <Route path={routes.hubView} element={<HubViewPage />} />
      <Route path={routes.graphPage} element={<GraphPage />} />
      <Route path={routes.routeRegistration} element={<RouteRegistrationPage />} />
      </Routes>
    </Router>
  );
};

export default App;
