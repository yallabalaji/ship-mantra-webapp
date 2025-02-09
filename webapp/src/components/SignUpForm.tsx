import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/signUpForm.module.css';


// Define types for the form data
interface SignUpFormProps {
  onSubmit: (data: { email: string; password: string; role: string }) => void;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ onSubmit }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [role, setRole] = useState<string>('RoutePlanner'); // default role
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  

  const onSuccess = (role: string, message : string) => {
    console.log(`User signed up with role: ${role} ` , message);
    // Add any additional success handling logic here
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!email || !password || !role) {
      setError('All fields are required!');
      return;
    }

    setError('');
    onSubmit({ email, password, role });

    let username = email;
    let roles : string[] = [];
    roles.push(role);
    try {
        const response = await fetch("http://localhost:5000/auth/signIn", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password, roles }),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          onSuccess(roles[0],data.message);
          setSuccessMessage(data.message);
          
        } else {
          setError(data.message || "Registration failed");
        }

      } catch (err: any) {
        console.log(err);
        setError("Something went wrong. Please try again."+ err.message);
      }

    // Reset the form after submission
    setEmail('');
    setPassword('');
    setRole('RoutePlanner'); // reset to default role
  };

  const handleRedirect = () => {
    navigate('/login'); // Redirects to /login page
  };

  return (
    <div className="sign-up-form">
      <h2>Sign Up</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>
        <div>
          <label>Role:</label>
          
          <select
           style={{ marginLeft: '10px' }}
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="RoutePlanner">RoutePlanner</option>
            <option value="RouteUser">Router User</option>
          </select>
        
        </div>        
        <button type="submit" className={styles.signUpBtn}>Sign Up</button>
        <button onClick={handleRedirect}  className={styles.logInBtn} >Login</button>
      </form>
    </div>
  );
};

export default SignUpForm;
