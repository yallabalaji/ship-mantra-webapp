import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axiosInstance';

// Define types for the form data
interface HubRegisterFormProps {
  onSubmit: (data: { hubCode: string; hubName: string; hubCity: string, isCentral : boolean }) => void;
}

const HubRegisterForm: React.FC<HubRegisterFormProps> = ({ onSubmit }) => {
  const navigate = useNavigate();
  const [hubCode, sethubCode] = useState<string>('');
  const [hubName, sethubName] = useState<string>('');
  const [hubCity, sethubCity] = useState<string>(''); 
  const [isCentral, setIsCentral] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  

  const onSuccess = (hubCode: string, hubName: string, hubCity :string) => {
    console.log(` ${hubCode}  ${hubCity} ${hubName}`);
    // Add any additional success handling logic here
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!hubCode || !hubCity || !hubName ) {
      setError('All fields are required!');
      return;
    }

    setError('');
    onSubmit({ hubCode, hubCity, hubName, isCentral });

    try {
        const API_URL = "/hub/createhub";
        const response = await API.post(API_URL, { hubCode, hubName, hubCity, isCentral });
        const data = await response.data;
  
        if (response.status.toString().startsWith('2')) {
          onSuccess(hubCode, hubName, hubCity);
          setSuccessMessage("Hub registered successfully");
          
        } else {
          setError(data.message || "Registration failed");
        }

      } catch (err: any) {
        console.log(err);
        setError("Something went wrong. Please try again."+ err.message);
      }

    // Reset the form after submission
    sethubCity('');
    sethubCode('');
    sethubName('');
    setIsCentral(false); // reset to default role
  };

  const handleRedirect = () => {
    navigate('/view-hubs'); // Redirects to /login page
  };

  return (
    <div className="hub-register-form">
      <h2>Hub Registration Page</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Hub Code:</label>
          <input
            type="text"
            value={hubCode}
            onChange={(e) => sethubCode(e.target.value)}
            placeholder="Enter your hub code"
            required
          />
        </div>

        <div>
          <label>Hub Name:</label>
          <input
            type="text"
            value={hubName}
            onChange={(e) => sethubName(e.target.value)}
            placeholder="Enter your hub name"
            required
          />
        </div>

        <div>
          <label>Hub City:</label>
          <input
            type="text"
            value={hubCity}
            onChange={(e) => sethubCity(e.target.value)}
            placeholder="Enter your hub city"
            required
          />
        </div>

        <div>
          <label>Is Central Hub:</label> 
          <select
           style={{ marginLeft: '10px' }}
            onChange={(e) => setIsCentral(e.target.value === 'true')}
            required
          >
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        </div>  
        <button type="submit">Register</button>
        <button onClick={handleRedirect}>View Hubs</button>
      </form>
    </div>
  );
};

export default HubRegisterForm;
