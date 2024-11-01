import React, { useState, useEffect } from "react";

export default function Box1({ t, language }) {
  const [newUsersCount, setNewUsersCount] = useState(0);
  const [period, setPeriod] = useState(30);

  const getStartDate = (days) => {
    const today = new Date();
    return new Date(today.setDate(today.getDate() - days));
  };

  useEffect(() => {
    const fetchNewUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/users/all", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const usersData = await response.json();
        console.log("Response from API:", usersData);

        // Filtra usuários com base na data de criação
        const startDate = getStartDate(period);
        const filteredUsers = usersData.filter((user) => {
          const createAt = new Date(user.createdAt); // Use createdAt
          // Verifica se createdAt não é null e é uma data válida
          return (
            createAt && !isNaN(createAt.getTime()) && createAt >= startDate
          );
        });

        setNewUsersCount(filteredUsers.length); // Atualiza o contador de novos usuários
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchNewUsers();
  }, [period]);

  return (
    <div className="w-full px-6 sm:w-1/2 xl:w-1/3">
      <div className="flex items-center px-5 py-6 bg-white rounded-md shadow-sm">
        <div className="p-3 bg-indigo-600 bg-opacity-75 rounded-full">
          <svg
            className="w-8 h-8 text-white"
            viewBox="0 0 28 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* SVG paths aqui */}
          </svg>
        </div>

        <div className="mx-5">
          <h4 className="text-2xl font-semibold text-gray-700">
            {newUsersCount}
          </h4>
          <div className="text-gray-500">New Users</div>

          <select
            className="mt-2 px-2 py-1 text-gray-700 bg-white border border-gray-300 rounded-md"
            value={period}
            onChange={(e) => setPeriod(Number(e.target.value))}
          >
            <option value={30}>Last 30 Days</option>
            <option value={90}>Last 90 Days</option>
            <option value={180}>Last 180 Days</option>
            <option value={365}>Last Year</option>
          </select>
        </div>
      </div>
    </div>
  );
}
