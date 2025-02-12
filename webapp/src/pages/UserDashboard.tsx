import { useNavigate } from "react-router-dom";
import styles from "../styles/dashboard.module.css";
import { useEffect } from "react";

const RouteUserDashboard = () => {
  const navigate = useNavigate();
  useEffect(() => {
    document.body.classList.add(styles.dashboardPage);
    return () => {
      document.body.classList.remove(styles.dashboardPage);
    };
  }, []);

  return (
    <div className ={styles.dashboardContainer}>
      <h2 className={styles.dashboardh1p1}>Dashboard</h2>
      <p className={styles.dashboardh1p1}>Welcome to the Route User dashboard!</p>
      
      {/* Navigation Buttons */}
      <button onClick={() => navigate("/view-hubs")} style={{ margin: "10px" }}>
        View Hubs
      </button>
      <button onClick={() => navigate("/view-routes")} style={{ margin: "10px" }}>
        View Routes
      </button>
      <button onClick={() => navigate("/view-graphs")} style={{ margin: "10px" }}>
        Find Routes
      </button>
      <button onClick={() => navigate("/logout")} style={{ margin: "10px", color: "brown" }}>
        Logout
      </button>
    </div>
  );
};

export default RouteUserDashboard;
