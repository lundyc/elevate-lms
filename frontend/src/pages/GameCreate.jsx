import React, { useState } from 'react';
import axios from 'axios';

const GameCreate = () => {
  const [formData, setFormData] = useState({
    teamId: '',
    name: '',
    startWeek: 1,
    entryFee: 10,
    prizePercentage: 50,
    buybackWeek: 1
  });
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/games`, formData);
      alert('Game created');
    } catch (err) {
      console.error(err);
      alert('Error creating game');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Create Game</h2>
      {/* Team selector */}
      <label className="block mb-2">Team</label>
      <input
        type="number"
        className="w-full border p-2"
        value={formData.teamId}
        onChange={(e) => setFormData({ ...formData, teamId: e.target.value })}
      />
      <label className="block mt-4 mb-2">Game Name</label>
      <input
        type="text"
        className="w-full border p-2"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      <label className="block mt-4 mb-2">Start Week</label>
      <input
        type="number"
        className="w-full border p-2"
        min={1}
        value={formData.startWeek}
        onChange={(e) => setFormData({ ...formData, startWeek: parseInt(e.target.value) })}
      />
      <label className="block mt-4 mb-2">Entry Fee (£)</label>
      <input
        type="number"
        className="w-full border p-2"
        value={formData.entryFee}
        onChange={(e) => setFormData({ ...formData, entryFee: parseFloat(e.target.value) })}
      />
      <label className="block mt-4 mb-2">Prize Percentage (%)</label>
      <input
        type="number"
        className="w-full border p-2"
        value={formData.prizePercentage}
        onChange={(e) => setFormData({ ...formData, prizePercentage: parseFloat(e.target.value) })}
      />
      <label className="block mt-4 mb-2">Buy Back Week</label>
      <input
        type="number"
        className="w-full border p-2"
        value={formData.buybackWeek}
        onChange={(e) => setFormData({ ...formData, buybackWeek: parseInt(e.target.value) })}
      />
      <button
        className="mt-4 bg-blue-600 text-white px-4 py-2"
        onClick={handleCreate}
        disabled={loading}
      >
        {loading ? 'Creating...' : 'Create Game'}
      </button>
    </div>
  );
};

export default GameCreate;
