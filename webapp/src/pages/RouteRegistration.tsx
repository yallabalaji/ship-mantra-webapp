import RouteRegisterForm from "../components/RouteRegisterForm";
import styles from '../styles/routeRegistrationForm.module.css';
import { useEffect } from 'react';

const RouteRegistrationPage: React.FC = () => {

  useEffect(() => {
    document.body.classList.add(styles.routeRegisterForm);
    return () => {
      document.body.classList.remove(styles.routeRegisterForm);
    };
  }, []);

  const handleSubmit = (data: { routeName: string; sourceCity: string; destinationCity: string; hubs: string[] }) => {
    // handle form submission
    console.log(data);
  };

  return (
    <div className="centered-container">
      <RouteRegisterForm onSubmit={handleSubmit} />
    </div>
  );
}

export default RouteRegistrationPage;