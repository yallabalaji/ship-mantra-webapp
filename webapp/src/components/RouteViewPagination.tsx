import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import API from '../api/axiosInstance';

const RouteViewPagination: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>('');
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);

  // Fetch data from the API with pagination
  const fetchData = async (page: number, limit: number) => {
    setLoading(true);
    try {
      const response = await API.get(`/routes/routesPagination?page=${page}&limit=${limit}`);
      setData(response.data.routes);
      setFilteredData(response.data.routes);
      setTotalRows(response.data.totalRoutes);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage, perPage);
  }, [currentPage, perPage]);

  // Handle search input
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  // Filter data client-side
  useEffect(() => {
    const filtered = data.filter((item) =>
      item.routeName.toLowerCase().includes(searchText.toLowerCase()) ||
      item.sourceCity.toLowerCase().includes(searchText.toLowerCase()) ||
      item.destinationCity.toLowerCase().includes(searchText.toLowerCase()) ||
      item.intermediateCities.some((city: string) => city.toLowerCase().includes(searchText.toLowerCase()))
    );
    setFilteredData(filtered);
  }, [searchText, data]);

  // Handle pagination change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePerRowsChange = (newPerPage: number, page: number) => {
    setPerPage(newPerPage);
    setCurrentPage(page);
  };

  const columns = [
    { name: 'Route Name', selector: (row: any) => row.routeName, sortable: true },
    { name: 'Source City', selector: (row: any) => row.sourceCity, sortable: true },
    { name: 'Destination City', selector: (row: any) => row.destinationCity, sortable: true },
    { name: 'Intermediate Cities', selector: (row: any) => row.intermediateCities.join(', '), sortable: true },
    { name: 'Number of Hubs', selector: (row: any) => row.hubs.length, sortable: true },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h3 style={{ paddingBottom: '10px' }}>Route View</h3>

      <input
        type="text"
        placeholder="Search routes..."
        value={searchText}
        onChange={handleSearch}
        style={{ marginBottom: '20px', padding: '8px', width: '100%', maxWidth: '300px', borderRadius: '4px' }}
      />

      {loading ? (
        <p>Loading...</p>
      ) : (
        <DataTable
          title="Route List"
          columns={columns}
          data={filteredData}
          pagination
          paginationServer
          paginationTotalRows={totalRows}
          onChangePage={handlePageChange}
          onChangeRowsPerPage={handlePerRowsChange}
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

export default RouteViewPagination;
