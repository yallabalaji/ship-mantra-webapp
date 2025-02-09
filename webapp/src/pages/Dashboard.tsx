import { useNavigate } from "react-router-dom";


const Dashboard: React.FC = () => {
  const navigate = useNavigate();


  return (
    <div>
      <h2>Dashboard</h2>
      <p>Welcome to the dashboard!</p>

      {/* Navigation Buttons */}
      <button onClick={() => navigate("/hubs")} style={{ margin: "10px" }}>
        Manage Hubs
      </button>
      <button onClick={() => navigate("/routes")} style={{ margin: "10px" }}>
        Manage Routes
      </button>
      <button onClick={() => navigate("/logout")} style={{ margin: "10px", color: "red" }}>
        Logout
      </button>
      </div>
  );
};

export default Dashboard;
