import  { useState } from 'react';
import LoginForm from '../components/LoginForm';
import styles from '../styles/login.module.css';
import { useEffect } from 'react';

const LoginPage = () => {

  useEffect(() => {
    document.body.classList.add(styles.loginPage);
    return () => {
      document.body.classList.remove(styles.loginPage);
    };
  }, []);

  const [error, setError] = useState('');

  const handleError = (message: string) => {
    setError(message); // Handle error message
  };

  const handleSuccess = (role: string) => {
    // Redirect based on user role
    switch (role) {
      case "Admin":
        window.location.href = "/register-user";
        break;
      case "RoutePlanner":
        window.location.href = "/route-planner";
        break;
      case "RouteUser":
        window.location.href = "/find-route";
        break;
      default:
        setError("Invalid role");
    }
  };

  return (
    <div>
      <h1 className={styles.loginPageh1}>Login</h1>
      <LoginForm onError={handleError} onSuccess={handleSuccess} />
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default LoginPage;
