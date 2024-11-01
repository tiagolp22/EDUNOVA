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
        console.log("Response from API:", usersData); // Verifique se createdAt aparece corretamente

        // Resto do código para filtrar usuários
        // Aqui vamos tentar analisar a estrutura do campo createdAt
        usersData.forEach((user) => {
          console.log("Created At (raw):", user.createdAt);
          const parsedDate = new Date(user.createdAt);
          console.log("Parsed Date:", parsedDate);
        });

        // Coloque a lógica de filtragem aqui para verificar a data corretamente
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
            <path
              d="M18.2 9.08889C18.2 11.5373 16.3196 13.5222 14 13.5222C11.6804 13.5222 9.79999 11.5373 9.79999 9.08889C9.79999 6.64043 11.6804 4.65556 14 4.65556C16.3196 4.65556 18.2 6.64043 18.2 9.08889Z"
              fill="currentColor"
            ></path>
            <path
              d="M25.2 12.0444C25.2 13.6768 23.9464 15 22.4 15C20.8536 15 19.6 13.6768 19.6 12.0444C19.6 10.4121 20.8536 9.08889 22.4 9.08889C23.9464 9.08889 25.2 10.4121 25.2 12.0444Z"
              fill="currentColor"
            ></path>
            <path
              d="M19.6 22.3889C19.6 19.1243 17.0927 16.4778 14 16.4778C10.9072 16.4778 8.39999 19.1243 8.39999 22.3889V26.8222H19.6V22.3889Z"
              fill="currentColor"
            ></path>
            <path
              d="M8.39999 12.0444C8.39999 13.6768 7.14639 15 5.59999 15C4.05359 15 2.79999 13.6768 2.79999 12.0444C2.79999 10.4121 4.05359 9.08889 5.59999 9.08889C7.14639 9.08889 8.39999 10.4121 8.39999 12.0444Z"
              fill="currentColor"
            ></path>
            <path
              d="M22.4 26.8222V22.3889C22.4 20.8312 22.0195 19.3671 21.351 18.0949C21.6863 18.0039 22.0378 17.9556 22.4 17.9556C24.7197 17.9556 26.6 19.9404 26.6 22.3889V26.8222H22.4Z"
              fill="currentColor"
            ></path>
            <path
              d="M6.64896 18.0949C5.98058 19.3671 5.59999 20.8312 5.59999 22.3889V26.8222H1.39999V22.3889C1.39999 19.9404 3.2804 17.9556 5.59999 17.9556C5.96219 17.9556 6.31367 18.0039 6.64896 18.0949Z"
              fill="currentColor"
            ></path>
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
