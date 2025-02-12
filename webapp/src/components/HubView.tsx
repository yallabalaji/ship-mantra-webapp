import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import API from '../api/axiosInstance';

const HubView: React.FC = () => {
  // State for the table data and loading state
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>('');
  const [filteredData, setFilteredData] = useState<any[]>([]);
  
  // Filters for each column
  const [isCentralFilter, setIsCentralFilter] = useState<string>('All');
  const [hubNameSort, setHubNameSort] = useState<'asc' | 'desc'>('asc');

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API.get('/hub/allhubs');
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

  // Handle isCentral filter
  const handleIsCentralChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setIsCentralFilter(event.target.value);
  };

  // Handle Hub Name sort order
  const handleHubNameSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const sortOrder = event.target.value as 'asc' | 'desc';
    setHubNameSort(sortOrder);
  };

  // Filter and Sort Data
  const filterData = () => {
    let filtered = data.filter((item) =>
      item.hubCode.toLowerCase().includes(searchText.toLowerCase()) ||
      item.hubName.toLowerCase().includes(searchText.toLowerCase()) ||
      item.hubCity.toLowerCase().includes(searchText.toLowerCase())
    );

    // Filter by `isCentral`
    if (isCentralFilter !== 'All') {
      const isCentralValue = isCentralFilter === 'Yes';
      filtered = filtered.filter(item => item.isCentral === isCentralValue);
    }

    // Sort by Hub Name
    filtered = filtered.sort((a, b) => {
      if (hubNameSort === 'asc') {
        return a.hubName.localeCompare(b.hubName);
      } else {
        return b.hubName.localeCompare(a.hubName);
      }
    });

    return filtered;
  };

  useEffect(() => {
    setFilteredData(filterData());
  }, [searchText, isCentralFilter, hubNameSort, data]);

  // Columns definition for the DataTable
  const columns = [
    {
      name: 'Hub Code',
      selector: (row: any) => row.hubCode,
      sortable: true,
    },
    {
      name: 'Hub Name',
      selector: (row: any) => row.hubName,
      sortable: true,
    },
    {
      name: 'Hub City',
      selector: (row: any) => row.hubCity,
      sortable: true,
    },
    {
      name: 'Is Central',
      selector: (row: any) => (row.isCentral ? 'Yes' : 'No'),
      sortable: true,
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h3 style={{paddingBottom : '10px'}}>Hub View</h3>

      {/* Search input */}
      <input
        type="text"
        placeholder="Search hubs..."
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

      {/* Filters for Is Central and Hub Name */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <select
          value={isCentralFilter}
          onChange={handleIsCentralChange}
          style={{ padding: '8px' }}
        >
          <option value="All">All Hubs</option>
          <option value="Yes">Central Hubs</option>
          <option value="No">Non Central Hubs</option>
        </select>

        <select
          value={hubNameSort}
          onChange={handleHubNameSortChange}
          style={{ padding: '8px' }}
        >
          <option value="asc">Hub Name Ascending</option>
          <option value="desc">Hub Name Descending</option>
        </select>
      </div>

      {/* DataTable */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <DataTable
          title="Hub List"
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

export default HubView;
