import React, { useState } from 'react';
import axios from 'axios';

const Installer = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    stripeKey: '',
    footballKey: '',
    themeId: 1,
    platformFee: 10,
    testMode: true
  });
  const [loading, setLoading] = useState(false);
  const [complete, setComplete] = useState(false);

  const next = () => setStep(step + 1);
  const prev = () => setStep(step - 1);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/install/setup`, formData);
      console.log(res.data);
      setComplete(true);
      // refresh page or set environment to mark installer complete
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (complete) return <div>Installer complete! Please restart the server.</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl mb-4">First Time Setup</h2>
      {step === 1 && (
        <>
          <label className="block mb-2">Stripe Secret Key</label>
          <input
            type="text"
            className="w-full p-2 border"
            value={formData.stripeKey}
            onChange={(e) => setFormData({ ...formData, stripeKey: e.target.value })}
          />
          <label className="block mt-4 mb-2">Football Data API Key</label>
          <input
            type="text"
            className="w-full p-2 border"
            value={formData.footballKey}
            onChange={(e) => setFormData({ ...formData, footballKey: e.target.value })}
          />
          <button className="mt-4 bg-blue-600 text-white px-4 py-2" onClick={next}>
            Next
          </button>
        </>
      )}
      {step === 2 && (
        <>
          <label className="block mb-2">Select Theme</label>
          <select
            className="w-full p-2 border"
            value={formData.themeId}
            onChange={(e) => setFormData({ ...formData, themeId: parseInt(e.target.value) })}
          >
            <option value={1}>Classic Dark</option>
            <option value={2}>Modern Light</option>
            <option value={3}>Crimson & Gold</option>
            <option value={4}>Ocean Blue</option>
            <option value={5}>Forest Green</option>
          </select>
          <label className="block mt-4 mb-2">Platform Fee (%)</label>
          <input
            type="number"
            className="w-full p-2 border"
            value={formData.platformFee}
            onChange={(e) => setFormData({ ...formData, platformFee: parseFloat(e.target.value) })}
            min={0}
            max={30}
          />
          <label className="block mt-4 mb-2">
            <input
              type="checkbox"
              checked={formData.testMode}
              onChange={(e) => setFormData({ ...formData, testMode: e.target.checked })}
            />
            Enable Test Mode
          </label>
          <div className="mt-4 flex justify-between">
            <button className="bg-gray-500 text-white px-4 py-2" onClick={prev}>
              Back
            </button>
            <button
              className="bg-green-600 text-white px-4 py-2"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Setting up...' : 'Complete Setup'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Installer;
