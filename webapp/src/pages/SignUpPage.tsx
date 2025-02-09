import SignUpForm from '../components/SignUpForm';
import { useEffect } from 'react';
import styles from '../styles/signUpForm.module.css';

const SignUpPage: React.FC = () => {

    useEffect(() => {
        document.body.classList.add(styles.signUpPage);
        return () => {
          document.body.classList.remove(styles.signUpPage);
        };
      }, []);

    const handleSubmit = (data: { email: string; password: string; role: string }) => {
        // handle form submission
        console.log(data);
    };

return (
        <div className="centered-container">
            <SignUpForm onSubmit={handleSubmit} />
        </div>
    );
}

export default SignUpPage;
