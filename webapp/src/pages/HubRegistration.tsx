import HubRegisterForm from '../components/HubRegisterForm';
import styles from '../styles/hubRegisterForm.module.css';
import { useEffect } from 'react';

const HubRegisterPage: React.FC = () => {

    useEffect(() => {
        document.body.classList.add(styles.hubRegisterForm);
        return () => {
          document.body.classList.remove(styles.hubRegisterForm);
        };
      }, []);
    

    const handleSubmit = (data: { hubCode: string; hubName: string; hubCity: string , isCentral : boolean }) => {
        // handle form submission
        console.log(data);
    };

return (
        <div className="centered-container">
            <HubRegisterForm onSubmit={handleSubmit} />
        </div>
    );
}

export default HubRegisterPage;
