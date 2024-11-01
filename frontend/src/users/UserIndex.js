import Button from "components/Button/Button";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

/**
 * UserIndex component - Displays a list of all users (admin only)
 * @param {Object} props - Component props
 * @param {Function} props.t - Translation function
 */
export default function UserIndex({ t }) {
  // State management
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  /**
   * Formats date to local string
   * @param {string} date - Date to format
   */
  const formatDate = (date) => {
    if (!date) return "Not set";
    return new Date(date).toLocaleDateString();
  };

  /**
   * Fetches users from the API
   * Requires authentication token and admin privileges
   */
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const userStr = localStorage.getItem("user");

      // Validate authentication
      if (!token || !userStr) {
        throw new Error("Authentication required");
      }

      // Validate admin privileges
      const user = JSON.parse(userStr);
      if (!user.privilege || user.privilege.name !== "admin") {
        throw new Error("Admin privileges required");
      }

      // Fetch users data
      const response = await fetch("http://localhost:5000/api/users/all", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      setUsers(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles user deletion
   * @param {number} userId - ID of user to delete
   */
  const handleDelete = async (userId) => {
    if (!window.confirm(t("user.delete_confirm"))) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/users/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      // Refresh users list after successful deletion
      await fetchUsers();
    } catch (err) {
      console.error("Error deleting user:", err);
      setError(err.message);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchUsers();
  }, []);

  /**
   * Handles column sorting
   * @param {string} key - Column key to sort by
   */
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  /**
   * Returns sorted users array based on current sort configuration
   */
  const sortedUsers = React.useMemo(() => {
    if (!users.length) return [];

    return [...users].sort((a, b) => {
      if (!sortConfig.key) return 0;

      const aValue = a[sortConfig.key]?.toString().toLowerCase() || "";
      const bValue = b[sortConfig.key]?.toString().toLowerCase() || "";

      return sortConfig.direction === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });
  }, [users, sortConfig]);

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div
        className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 m-4"
        role="alert"
      >
        <p className="font-bold">Error</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap">
      <div className="w-full px-3 sm:w-[80%] sm:mx-0 mb-16 sm:mb-24">
        <h2 className="mb-[2rem] p-3">{t("user_list_titre")}</h2>

        <div className="overflow-x-auto">
          <table className="w-full divide-y divide-gray-200 bg-[#21283B] mt-4 rounded-lg mb-[4rem]">
            <thead>
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-large text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("name")}
                >
                  <span
                    className={sortConfig.key === "name" ? "font-bold" : ""}
                  >
                    {t("user.username")}{" "}
                    {sortConfig.key === "name"
                      ? sortConfig.direction === "asc"
                        ? "▲"
                        : "▼"
                      : "⇅"}
                  </span>
                </th>
                <th className="px-6 py-3 text-left text-xs font-large text-gray-500 uppercase tracking-wider">
                  {t("user.courriel")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-large text-gray-500 uppercase tracking-wider">
                  {t("user.birthday")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-large text-gray-500 uppercase tracking-wider">
                  {t("user.privilege")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-large text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-[#21283B] divide-y divide-gray-200">
              {sortedUsers.map((user) => (
                <tr key={user.id}>
                  <td className="px-4 py-2 whitespace-nowrap text-white">
                    {user.name}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-white">
                    {user.email}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-white">
                    {formatDate(user.birthday)}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-white">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        user.privilege === "admin"
                          ? "bg-purple-200 text-purple-800"
                          : "bg-green-200 text-green-800"
                      }`}
                    >
                      {user.privilege}
                    </span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap flex gap-2">
                    <Link to={`/user/${user.id}`}>
                      <Button>{t("btn_edit")}</Button>
                    </Link>
                    <Button
                      onClick={() => handleDelete(user.id)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {t("btn_delete")}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
