import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import styles from '../styles/routeRegistrationForm.module.css';

// Define types for the form data
interface RouteRegisterFormProps {
  onSubmit: (data: { routeName: string; sourceCity: string; destinationCity: string; hubs: string[] }) => void;
}

interface Hub {
  _id: string;
  hubCode: string;
  hubName: string;
  hubCity: string;
  isCentral: boolean;
}

const RouteRegisterForm: React.FC<RouteRegisterFormProps> = ({ onSubmit }) => {
  const navigate = useNavigate();
  const [routeName, setRouteName] = useState<string>('');
  const [sourceCity, setSourceCity] = useState<string>('');
  const [destinationCity, setDestinationCity] = useState<string>('');
  const [hubs, setHubs] = useState<{ id: string; name: string }[]>([]);
  const [allHubs, setAllHubs] = useState<Hub[]>([]);
  const [filteredHubs, setFilteredHubs] = useState<Hub[]>([]);
  const [hubSearch, setHubSearch] = useState<string>('');
  const [sourceCitySearch, setSourceCitySearch] = useState<string>('');
  const [destinationCitySearch, setDestinationCitySearch] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  useEffect(() => {
    const fetchHubs = async () => {
      try {
        const response = await axios.get<Hub[]>('http://localhost:5000/hub/allhubs');
        console.log('Fetched hubs:', response.data);
        setAllHubs(response.data);
      } catch (error) {
        console.error('Error fetching hubs:', error);
      }
    };

    fetchHubs();
  }, []);

  const handleHubSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value;
    setHubSearch(searchValue);
    if (searchValue) {
      const filtered = allHubs.filter(hub =>
        `${hub.hubName} ${hub.hubCity}`.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredHubs(filtered);
    } else {
      setFilteredHubs([]);
    }
  };

  const handleSourceCitySearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value;
    setSourceCitySearch(searchValue);
    if (searchValue) {
      const filtered = allHubs.filter(hub =>
        `${hub.hubName} ${hub.hubCity}`.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredHubs(filtered);
    } else {
      setFilteredHubs([]);
    }
  };

  const handleDestinationCitySearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value;
    setDestinationCitySearch(searchValue);
    if (searchValue) {
      const filtered = allHubs.filter(hub =>
        `${hub.hubName} ${hub.hubCity}`.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredHubs(filtered);
    } else {
      setFilteredHubs([]);
    }
  };

  const handleHubSelect = (hub: Hub) => {
    if (!hubs.some(h => h.id === hub._id)) {
      setHubs([...hubs, { id: hub._id, name: hub.hubName }]);
    }
    setHubSearch('');
    setFilteredHubs([]);
  };

  const handleSourceCitySelect = (hub: Hub) => {
    setSourceCity(hub.hubCity);
    setHubs([{ id: hub._id, name: hub.hubName }, ...hubs.filter(h => h.id !== hub._id)]);
    setSourceCitySearch('');
    setFilteredHubs([]);
  };

  const handleDestinationCitySelect = (hub: Hub) => {
    setDestinationCity(hub.hubCity);
    setHubs([...hubs.filter(h => h.id !== hub._id), { id: hub._id, name: hub.hubName }]);
    setDestinationCitySearch('');
    setFilteredHubs([]);
  };

  const handleRemoveHub = (hubId: string) => {
    setHubs(hubs.filter(hub => hub.id !== hubId));
    if (hubId === sourceCity) setSourceCity('');
    if (hubId === destinationCity) setDestinationCity('');
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!routeName || !sourceCity || !destinationCity || hubs.length < 2) {
      setError('All fields are required!');
      return;
    }

    setError('');
    onSubmit({ routeName, sourceCity, destinationCity, hubs: hubs.map(hub => hub.id) });

    try {
      const response = await fetch("http://localhost:5000/routes/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ routeName, sourceCity, destinationCity, hubs: hubs.map(hub => hub.id) }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("Route registered successfully");
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err: any) {
      console.log(err);
      setError("Something went wrong. Please try again." + err.message);
    }

    // Reset the form after submission
    setRouteName('');
    setSourceCity('');
    setDestinationCity('');
    setHubs([]);
  };

  const handleRedirect = () => {
    navigate('/view-routes'); // Redirects to /view-routes page
  };

  const availableHubs = allHubs.filter(hub => !hubs.some(h => h.id === hub._id));

  return (
    <div className={styles.routeRegisterForm}>
      <h2>Route Registration Page</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Route Name:</label>
          <input
            type="text"
            value={routeName}
            onChange={(e) => setRouteName(e.target.value)}
            placeholder="Enter route name"
            required
          />
        </div>

        <div>
          <label>Source City:</label>
          <input
            type="text"
            value={sourceCitySearch || sourceCity}
            onChange={handleSourceCitySearchChange}
            placeholder="Search for source city"
            required
          />
          {sourceCitySearch && filteredHubs.length > 0 && (
            <ul className={styles.hubList}>
              {filteredHubs.map(hub => (
                <li key={hub._id} onClick={() => handleSourceCitySelect(hub)}>
                  {hub.hubName} {hub.hubCity}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <label>Intermediate Hubs:</label>
          <input
            type="text"
            value={hubSearch}
            onChange={handleHubSearchChange}
            placeholder="Search for hubs"
          />
          {hubSearch && filteredHubs.length > 0 && (
            <ul className={styles.hubList}>
              {filteredHubs.map(hub => (
                <li key={hub._id} onClick={() => handleHubSelect(hub)}>
                  {hub.hubName} {hub.hubCity}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <label>Destination City:</label>
          <input
            type="text"
            value={destinationCitySearch || destinationCity}
            onChange={handleDestinationCitySearchChange}
            placeholder="Search for destination city"
            required
          />
          {destinationCitySearch && filteredHubs.length > 0 && (
            <ul className={styles.hubList}>
              {filteredHubs.map(hub => (
                <li key={hub._id} onClick={() => handleDestinationCitySelect(hub)}>
                  {hub.hubName} {hub.hubCity}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button type="submit">Register</button>
        <button type="button" onClick={handleRedirect}>View Routes</button>
      </form>

      <div className={styles.selectedHubsContainer}>
        <label>Selected Hubs:</label>
        <Stack direction="row" spacing={1} className={styles.selectedHubs}>
          {hubs.map(hub => (
            <Chip
              key={hub.id}
              label={hub.name}
              onDelete={() => handleRemoveHub(hub.id)}
              className={styles.hubTag}
              sx={{ backgroundColor: '#FFFDD0', color: 'black' }} // Light cream white background with black text
            />
          ))}
        </Stack>
      </div>
    </div>
  );
};

export default RouteRegisterForm;