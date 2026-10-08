import { useState, useEffect } from "react";
import UserRow from "./UserRow";
import "./Users.css";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/users?page=${page}&limit=${limit}`);
      const data = await res.json();

      setUsers(data.users || []);
      setTotalPages(data.totalPages || 1);
      setTotalUsers(data.totalUsers || 0);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, limit]);

  const handleLimitChange = (e) => {
    setLimit(Number(e.target.value));
    setPage(1);
  };

  return (
    <div className="users-container">
      {/* Header section */}
      <div className="header">
        <div>
          <h2>Users List</h2>
          <span className="subtitle">Total records: {totalUsers}</span>
        </div>

        <div className="limit-box">
          <label htmlFor="limitSelect">Rows per page: </label>
          <select id="limitSelect" value={limit} onChange={handleLimitChange}>
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>

      {/* Users table */}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Age</th>
              <th>City</th>
              <th>Role</th>
              <th>Salary</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center">Loading users...</td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center">No users found</td>
              </tr>
            ) : (
              users.map((user, idx) => (
                <UserRow
                  key={user._id || idx}
                  user={user}
                  index={(page - 1) * limit + idx + 1}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      <div className="pagination">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1 || loading}
        >
          Previous
        </button>

        <span className="page-info">
          Page <strong>{page}</strong> of <strong>{totalPages}</strong>
        </span>

        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages || loading}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Users;
