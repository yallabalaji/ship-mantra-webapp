import React, { useEffect, useState } from "react";
import { ForceGraph3D } from "react-force-graph";
import axios from "axios";
import styles from  "../styles/graphVisualization.module.css";


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
  const [graphData, setGraphData] = useState<{ nodes: Node[]; links: Link[] }>({
    nodes: [],
    links: [],
  });

  const [sourceHub, setSourceHub] = useState("Old City Hub");
  const [destinationHub, setDestinationHub] = useState("Old town hub");

  const fetchGraphData = async () => {
    try {
      const API_URL = "http://localhost:5000/routes/find-routes";
      const response = await axios.post<GraphData>(API_URL, {
        sourceHub,
        destinationHub,
      });

      const data = response.data;
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
          <label>Source hub:</label>
            <input
              type="text"
              value={sourceHub}
              onChange={(e) => setSourceHub(e.target.value)}
              placeholder="Enter source hub"
            />
            <label>Destination hub:</label>
            <input
              type="text"
              value={destinationHub}
              onChange={(e) => setDestinationHub(e.target.value)}
              placeholder="Enter destination hub"
            />
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
