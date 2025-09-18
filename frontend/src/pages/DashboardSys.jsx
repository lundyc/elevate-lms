import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DashboardSys = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    async function fetchStats() {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/settings/stats`);
      setStats(res.data);
    }
    fetchStats();
  }, []);

  if (!stats) return <div>Loading dashboard...</div>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Sysadmin Dashboard</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-gray-100 rounded shadow">
          <h3 className="font-semibold mb-2">Total Games</h3>
          <p>{stats.gamesCount}</p>
        </div>
        <div className="p-4 bg-gray-100 rounded shadow">
          <h3 className="font-semibold mb-2">Active Players</h3>
          <p>{stats.playersCount}</p>
        </div>
        {/* Add more KPIs: Biggest Pot, Rollover Chains, etc. */}
      </div>
    </div>
  );
};

export default DashboardSys;
