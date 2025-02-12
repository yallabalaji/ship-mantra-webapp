import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/dashboard.module.css";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add(styles.dashboardPage);
    // Clear all stored data (LocalStorage, SessionStorage, Cookies)
    localStorage.clear();
    sessionStorage.clear();
    document.cookie.split(";").forEach((cookie) => {
      document.cookie = cookie
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    return () => {
        document.body.classList.remove(styles.dashboardPage);
      };
  }, []);

  return (
    <div >
      <h2 className={styles.dashboardh1p1}>You have been logged out.</h2>
      <button onClick={() => navigate("/login")} style={{ margin: "10px"}}>
        Re-login
      </button>
    </div>
  );
};

export default Logout;
