import React, { useState } from 'react';
import styles from '../styles/login.module.css';

interface LoginFormProps {
  onError: (message: string) => void;
  onSuccess: (role: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onError, onSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onError(""); // Clear previous errors

    try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Assuming backend returns { message: "success", email, role: ["routeplanner"] }
        localStorage.setItem("email", JSON.stringify(data));
        onSuccess(data.role[0]);
      } else {
        onError(data.message || "Login failed");
      }
    } catch (err) {
      onError("Something went wrong. Please try again.");
    }
  };

  return (
    <form  onSubmit={handleSubmit} >
      <div>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      
      <div>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      
      <button type="submit" className={styles.loginBtn}>Login</button>
    </form>
  );
};

export default LoginForm;
