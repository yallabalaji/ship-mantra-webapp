import React, { useState, useEffect } from 'react';
import {ForceGraph3D} from 'react-force-graph';
import styles from '../styles/graphVisualization.module.css';
import API from '../api/axiosInstance';

interface GraphData {
  graph: Record<string, string[]>; // Connections between hubs
  shortestRoute?: string[]; // Highlights shortest path
  groupedHubsByCity?: Record<string, string[]>; // Groups hubs by city
}

interface Node {
  id: string;
  color?: string;
}

interface Link {
  source: string;
  target: string;
  color?: string;
}

  interface GraphData {
    graph: Record<string, string[]>; // Connections between hubs
    shortestRoute?: string[]; // Highlights shortest path
    groupedHubsByCity?: Record<string, string[]>; // Groups hubs by city
  }
  
  interface Node {
    id: string;
    color?: string;
  }
  
  interface Link {
    source: string;
    target: string;
    color?: string;
  }
  
const GraphVisualization: React.FC = () => {
    const [sourceCity, setSourceCity] = useState<string>('');
    const [destinationCity, setDestinationCity] = useState<string>('');
  
    const [cities, setCities] = useState<string[]>([]);
    const [sourceHubs, setSourceHubs] = useState<string[]>([]);
    const [destinationHubs, setDestinationHubs] = useState<string[]>([]);
  

    useEffect(() => {
      // Fetch all cities
      const fetchCities = async () => {
        try {
          const response = await API.get<string[]>('/hub/valid-cities');
          setCities(response.data);
        } catch (error) {
          console.error('Error fetching cities:', error);
        }
      };
  
      fetchCities();
    }, []);
  
    useEffect(() => {
      // Fetch source hubs based on selected source city
      const fetchSourceHubs = async () => {
        if (sourceCity) {
          try {
            const response = await API.get<string[]>(`/hub/available?city=${sourceCity}`);
            setSourceHubs(response.data);
          } catch (error) {
            console.error('Error fetching source hubs:', error);
          }
        }
      };
  
      fetchSourceHubs();
    }, [sourceCity]);
  
    useEffect(() => {
      // Fetch destination hubs based on selected destination city
      const fetchDestinationHubs = async () => {
        if (destinationCity) {
          try {
            const response = await API.get<string[]>(`/hub/available?city=${destinationCity}`);
            setDestinationHubs(response.data);
          } catch (error) {
            console.error('Error fetching destination hubs:', error);
          }
        }
      };
  
      fetchDestinationHubs();
    }, [destinationCity]);


    const [graphData, setGraphData] = useState<{ nodes: Node[]; links: Link[] }>({
      nodes: [],
      links: [],
    });
  
    const [sourceHub, setSourceHub] = useState("Old City Hub");
    const [destinationHub, setDestinationHub] = useState("Old town hub");
  
    const fetchGraphData = async () => {
      try {
        const API_URL = "/routes/find-routes";
        const response = await API.post<GraphData>(API_URL, {
          sourceHub,
          destinationHub,
        });
  
        const data = await response.data;
        const nodes: Node[] = [];
        const links: Link[] = [];
  
        // Generate dynamic colors for each city
        const cityColors: Record<string, string> = {};
        const colorPalette = ["red", "blue", "green", "orange", "purple", "cyan", "magenta"];
        let colorIndex = 0;
  
        if (data.groupedHubsByCity) {
          Object.keys(data.groupedHubsByCity).forEach((city) => {
            cityColors[city] = colorPalette[colorIndex % colorPalette.length];
            colorIndex++;
          });
        }
  
        // Create nodes with city-based colors
        Object.keys(data.graph).forEach((hub) => {
          const city = Object.entries(data.groupedHubsByCity || {}).find(([_, hubs]) => hubs.includes(hub))?.[0];
          nodes.push({
            id: hub,
            color: city ? cityColors[city] : "gray",
          });
  
          // Create links
          data.graph[hub].forEach((connectedHub) => {
            links.push({
              source: hub,
              target: connectedHub,
              color: data.shortestRoute?.includes(hub) && data.shortestRoute?.includes(connectedHub) ? "yellow" : "gray",
            });
          });
        });
  
        setGraphData({ nodes, links });
      } catch (error) {
        console.error("Error fetching graph data:", error);
      }
    };
  
    useEffect(() => {
      fetchGraphData();
    }, [sourceHub, destinationHub]);
  

  return (
    <div className={styles.graphParent}>
      <div className={styles.graphFormSection}>
        <div className={styles.graphheader}>
          <h1>Graph Visualization</h1>
          <h2>Find Logistics Route</h2>
        </div>
        <div className={styles.graphInputs}>
          <label>Source City:</label>
          <select value={sourceCity} onChange={(e) => setSourceCity(e.target.value)} required>
            <option value="">Select Source City</option>
            {Array.isArray(cities) && cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>

          <label>Source Hub:</label>
          <select value={sourceHub} onChange={(e) => setSourceHub(e.target.value)} required>
            <option value="">Select Source Hub</option>
            {sourceHubs.map(hub => (
              <option key={hub} value={hub}>{hub}</option>
            ))}
          </select>

          <label>Destination City:</label>
          <select value={destinationCity} onChange={(e) => setDestinationCity(e.target.value)} required>
            <option value="">Select Destination City</option>
            {Array.isArray(cities) && cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>

          <label>Destination Hub:</label>
          <select value={destinationHub} onChange={(e) => setDestinationHub(e.target.value)} required>
            <option value="">Select Destination Hub</option>
            {destinationHubs.map(hub => (
              <option key={hub} value={hub}>{hub}</option>
            ))}
          </select>

          <button onClick={fetchGraphData}>
            Find Route
          </button>
        </div>
      </div>
      <div className={styles.graphSection} >
        <ForceGraph3D
          graphData={graphData}
          nodeAutoColorBy="color"
          linkWidth={(link) => (link.color === "yellow" ? 3 : 1)}
          nodeLabel="id"
          onNodeClick={(node) => alert(`Clicked: ${node.id}`)}
        />
      </div>
    </div>
  );
};

export default GraphVisualization;