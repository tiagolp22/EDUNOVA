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
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    birthday: "",
    privilege: "",
  });

  // Format date helpers
  const formatDate = (date) => {
    if (!date) return "Not set";
    return new Date(date).toLocaleDateString();
  };

  const formatDateForInput = (date) => {
    if (!date) return "";
    return new Date(date).toISOString().split("T")[0];
  };

  // API calls
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const userStr = localStorage.getItem("user");

      if (!token || !userStr) {
        throw new Error("Authentication required");
      }

      const user = JSON.parse(userStr);
      if (!user.privilege || user.privilege.name !== "admin") {
        throw new Error("Admin privileges required");
      }

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

  const handleDelete = async (userId) => {
    if (!window.confirm(t("user.delete_confirm"))) return;

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

      await fetchUsers();
    } catch (err) {
      console.error("Error deleting user:", err);
      setError(err.message);
    }
  };

  const handleUpdate = async (userId) => {
    try {
      // Pegar o token e informações do usuário do localStorage
      const token = localStorage.getItem("token");
      const userStr = localStorage.getItem("user");

      if (!token || !userStr) {
        throw new Error("Authentication required");
      }

      const currentUser = JSON.parse(userStr);

      // Verificar se o usuário tem permissão
      if (
        currentUser.privilege?.name !== "admin" &&
        currentUser.id !== userId
      ) {
        throw new Error("Unauthorized to update this user");
      }

      const response = await fetch(
        `http://localhost:5000/api/users/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: editFormData.name,
            email: editFormData.email,
            birthday: editFormData.birthday || null,
            privilege_id: editFormData.privilege,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const updatedUser = await response.json();

      // Atualizar a lista de usuários
      setUsers(users.map((user) => (user.id === userId ? updatedUser : user)));

      // Limpar o modo de edição
      setEditingId(null);
      setEditFormData({
        name: "",
        email: "",
        birthday: "",
        privilege: "",
      });
    } catch (err) {
      console.error("Error updating user:", err);
      setError(err.message);
    }
  };

  // Função auxiliar para validar os dados antes de enviar
  const validateUpdateData = (data) => {
    const errors = [];

    if (!data.name?.trim()) {
      errors.push("Name is required");
    }

    if (!data.email?.trim()) {
      errors.push("Email is required");
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      errors.push("Invalid email format");
    }

    // Validação opcional para data de nascimento
    if (data.birthday && !isValidDate(data.birthday)) {
      errors.push("Invalid date format");
    }

    return errors;
  };

  // Função auxiliar para validar data
  const isValidDate = (dateString) => {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
  };

  // Event handlers
  const handleEditClick = (user) => {
    setEditingId(user.id);
    setEditFormData({
      name: user.name,
      email: user.email,
      birthday: user.birthday || "",
      privilege: user.privilege,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditFormData({
      name: "",
      email: "",
      birthday: "",
      privilege: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

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

  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

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
          <table className="w-full divide-y  text-center divide-gray-200 bg-[--azul-escuro] mt-4 rounded-lg mb-[4rem]">
            <thead>
              <tr>
                <th
                  onClick={() => handleSort("name")}
                  className="px-6 py-3 text-xs font-large text-center text-gray-500 uppercase tracking-wider cursor-pointer"
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
                <th className="px-6 py-3 text-center text-xs font-large text-gray-500 uppercase tracking-wider">
                  {t("user.email")}
                </th>
                <th className="px-6 py-3 text-center text-xs font-large text-gray-500 uppercase tracking-wider">
                  {t("user.birthday")}
                </th>
                <th className="px-6 py-3 text-center text-xs font-large text-gray-500 uppercase tracking-wider">
                  {t("user.privilege")}
                </th>
                <th className="px-6 py-3 text-center text-xs font-large text-gray-500 uppercase tracking-wider">
                  {t("user.actions")}
                </th>
              </tr>
            </thead>
            <tbody className="bg-[--azul-escuro] divide-y divide-gray-200">
              {sortedUsers.map((user) => (
                <tr key={user.id}>
                  <td className="px-4 py-2 whitespace-nowrap text-white">
                    {editingId === user.id ? (
                      <input
                        type="text"
                        name="name"
                        value={editFormData.name}
                        onChange={handleInputChange}
                        className="w-full px-2 py-1 text-black rounded"
                      />
                    ) : (
                      user.name
                    )}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-white">
                    {editingId === user.id ? (
                      <input
                        type="email"
                        name="email"
                        value={editFormData.email}
                        onChange={handleInputChange}
                        className="w-full px-2 py-1 text-black rounded"
                      />
                    ) : (
                      user.email
                    )}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-white">
                    {editingId === user.id ? (
                      <input
                        type="date"
                        name="birthday"
                        value={formatDateForInput(editFormData.birthday)}
                        onChange={handleInputChange}
                        className="w-full px-2 py-1 text-black rounded"
                      />
                    ) : (
                      formatDate(user.birthday)
                    )}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-white">
                    {editingId === user.id ? (
                      <select
                        name="privilege"
                        value={editFormData.privilege}
                        onChange={handleInputChange}
                        className="w-full px-2 py-1 text-black rounded"
                      >
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                        <option value="teacher">Teacher</option>
                      </select>
                    ) : (
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          user.privilege === "admin"
                            ? "bg-purple-200 text-purple-800"
                            : "bg-green-200 text-green-800"
                        }`}
                      >
                        {user.privilege}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap flex gap-2">
                    {editingId === user.id ? (
                      <>
                        <Button
                          onClick={() => handleUpdate(user.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {t("btn_save")}
                        </Button>
                        <Button
                          onClick={handleCancelEdit}
                          className="bg-gray-600 hover:bg-gray-700"
                        >
                          {t("btn_cancel")}
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button onClick={() => handleEditClick(user)}>
                          {t("btn_edit")}
                        </Button>
                        <Button
                          onClick={() => handleDelete(user.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          {t("btn_delete")}
                        </Button>
                      </>
                    )}
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
