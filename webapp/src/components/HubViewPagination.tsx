import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import API from '../api/axiosInstance';

const HubViewPagination: React.FC = () => {
  // State for table data, loading, and pagination
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>('');
  const [filteredData, setFilteredData] = useState<any[]>([]);

  // Filters & Sorting
  const [isCentralFilter, setIsCentralFilter] = useState<string>('All');
  const [hubNameSort, setHubNameSort] = useState<'asc' | 'desc'>('asc');

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalRows, setTotalRows] = useState<number>(0);
  const rowsPerPage = 10; // Fixed limit

  // Fetch paginated data from the API
  const fetchData = async (page: number) => {
    setLoading(true);
    try {
      const response = await API.get(`/hub/allHubsByPagination?page=${page}&limit=${rowsPerPage}`);
      setData(response.data.hubs);
      setTotalRows(response.data.totalHubs);
      setFilteredData(response.data.hubs); // Set initial filtered data
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]); // Fetch data when page changes

  // Handle search input
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  // Handle filter changes
  const handleIsCentralChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setIsCentralFilter(event.target.value);
  };

  const handleHubNameSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setHubNameSort(event.target.value as 'asc' | 'desc');
  };

  // Apply filtering and sorting to the current page's data
  useEffect(() => {
    let filtered = data.filter((item) =>
      item.hubCode.toLowerCase().includes(searchText.toLowerCase()) ||
      item.hubName.toLowerCase().includes(searchText.toLowerCase()) ||
      item.hubCity.toLowerCase().includes(searchText.toLowerCase())
    );

    if (isCentralFilter !== 'All') {
      const isCentralValue = isCentralFilter === 'Yes';
      filtered = filtered.filter(item => item.isCentral === isCentralValue);
    }

    filtered.sort((a, b) => hubNameSort === 'asc'
      ? a.hubName.localeCompare(b.hubName)
      : b.hubName.localeCompare(a.hubName)
    );

    setFilteredData(filtered);
  }, [searchText, isCentralFilter, hubNameSort, data]);

  // Columns for DataTable
  const columns = [
    { name: 'Hub Code', selector: (row: any) => row.hubCode, sortable: true },
    { name: 'Hub Name', selector: (row: any) => row.hubName, sortable: true },
    { name: 'Hub City', selector: (row: any) => row.hubCity, sortable: true },
    { name: 'Is Central', selector: (row: any) => (row.isCentral ? 'Yes' : 'No'), sortable: true },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h3 style={{ paddingBottom: '10px' }}>Hub View</h3>

      {/* Search Input */}
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

      {/* Filters */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <select value={isCentralFilter} onChange={handleIsCentralChange} style={{ padding: '8px' }}>
          <option value="All">All Hubs</option>
          <option value="Yes">Central Hubs</option>
          <option value="No">Non-Central Hubs</option>
        </select>

        <select value={hubNameSort} onChange={handleHubNameSortChange} style={{ padding: '8px' }}>
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
          paginationServer
          paginationTotalRows={totalRows}
          paginationPerPage={rowsPerPage}
          paginationComponentOptions={{ noRowsPerPage: true }}
          onChangePage={(page) => setCurrentPage(page)}
          highlightOnHover
          pointerOnHover
          striped
          responsive
          customStyles={{
            table: { style: { backgroundColor: '#e5fff3' } },
            headRow: { style: { backgroundColor: '#25d366', color: 'white' } },
            rows: {
              style: {
                '&:nth-of-type(even)': { backgroundColor: '#f9f9f9' },
                '&:hover': { backgroundColor: '#d4f5e9' },
              },
            },
          }}
        />
      )}
    </div>
  );
};

export default HubViewPagination;
