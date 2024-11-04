import React, { useState, useEffect } from "react";

export default function Box2({ t, language }) {
  const [birthdaysCount, setBirthdaysCount] = useState(0);
  const [period, setPeriod] = useState(1); // 1 = Hoje, 7 = Próximos 7 dias, 30 = Próximos 30 dias

  const getEndDate = (days) => {
    const today = new Date();
    return new Date(today.setDate(today.getDate() + days));
  };

  useEffect(() => {
    const fetchBirthdays = async () => {
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

        // Filtra aniversários com base no período selecionado
        const today = new Date();
        const endDate = getEndDate(period);

        const filteredBirthdays = usersData.filter((user) => {
          if (!user.birthday) return false;
          const userBirthday = new Date(user.birthday);
          userBirthday.setFullYear(today.getFullYear()); // Mantém o ano atual para comparação
          return userBirthday >= today && userBirthday <= endDate;
        });

        setBirthdaysCount(filteredBirthdays.length); // Atualiza o contador de aniversários
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchBirthdays();
  }, [period]);

  return (
    <div className="w-full px-6 mt-6 sm:w-1/2 xl:w-1/3 sm:mt-0">
      <div className="flex items-center px-5 py-6 bg-white rounded-md shadow-sm">
        <div className="p-3 bg-orange-600 bg-opacity-75 rounded-full">
          <svg
            className="w-8 h-8 text-white"
            viewBox="0 0 28 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* SVG paths aqui */}
          </svg>
        </div>

        <div className="mx-5">
          <h4 className="text-2xl font-semibold text-gray-700">
            {birthdaysCount}
          </h4>
          <div className="text-gray-500">Aniversários</div>

          <select
            className="mt-2 px-2 py-1 text-gray-700 bg-white border border-gray-300 rounded-md"
            value={period}
            onChange={(e) => setPeriod(Number(e.target.value))}
          >
            <option value={1}>Hoje</option>
            <option value={7}>Próximos 7 dias</option>
            <option value={30}>Próximos 30 dias</option>
          </select>
        </div>
      </div>
    </div>
  );
}
