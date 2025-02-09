import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';

const RouteView: React.FC = () => {
  // State for the table data and loading state
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>('');
  const [filteredData, setFilteredData] = useState<any[]>([]);

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/routes');
        setData(response.data);
        setFilteredData(response.data); // Set initial filtered data
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle search input
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  // Filter Data
  const filterData = () => {
    let filtered = data.filter((item) =>
      item.routeName.toLowerCase().includes(searchText.toLowerCase()) ||
      item.sourceCity.toLowerCase().includes(searchText.toLowerCase()) ||
      item.destinationCity.toLowerCase().includes(searchText.toLowerCase()) ||
      item.intermediateCities.some((city: string) => city.toLowerCase().includes(searchText.toLowerCase()))
    );

    return filtered;
  };

  useEffect(() => {
    setFilteredData(filterData());
  }, [searchText, data]);

  // Columns definition for the DataTable
  const columns = [
    {
      name: 'Route Name',
      selector: (row: any) => row.routeName,
      sortable: true,
    },
    {
      name: 'Source City',
      selector: (row: any) => row.sourceCity,
      sortable: true,
    },
    {
      name: 'Destination City',
      selector: (row: any) => row.destinationCity,
      sortable: true,
    },
    {
      name: 'Intermediate Cities',
      selector: (row: any) => row.intermediateCities.join(', '),
      sortable: true,
    },
    {
      name: 'Number of Hubs',
      selector: (row: any) => row.hubs.length,
      sortable: true,
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h3 style={{ paddingBottom: '10px' }}>Route View</h3>

      {/* Search input */}
      <input
        type="text"
        placeholder="Search routes..."
        value={searchText}
        onChange={handleSearch}
        style={{
          marginBottom: '20px',
          padding: '8px',
          width: '100%',
          maxWidth: '300px',
          borderRadius: '4px',
        }}
      />

      {/* DataTable */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <DataTable
          title="Route List"
          columns={columns}
          data={filteredData}
          pagination
          highlightOnHover
          pointerOnHover
          striped
          responsive
          customStyles={{
            table: {
              style: {
                backgroundColor: '#e5fff3', // Light green background
              },
            },
            headRow: {
              style: {
                backgroundColor: '#25d366', // WhatsApp green
                color: 'white',
              },
            },
            rows: {
              style: {
                '&:nth-of-type(even)': {
                  backgroundColor: '#f9f9f9', // Light white stripe
                },
                '&:hover': {
                  backgroundColor: '#d4f5e9', // Light green hover effect
                },
              },
            },
          }}
        />
      )}
    </div>
  );
};

export default RouteView;