import React, { useEffect, useState } from "react";
import { FaBuilding, FaPlus } from "react-icons/fa";
import axios from "axios";

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });

  const fetchCompanies = async () => {
    setLoading(true);
    setError("");
    try {
      // Replace with your backend endpoint
      const res = await axios.get("/api/company", { withCredentials: true });
      setCompanies(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load companies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // Replace with your backend endpoint
      await axios.post(
        "/api/company",
        { ...form },
        { withCredentials: true }
      );
      setForm({ name: "", description: "" });
      setShowForm(false);
      fetchCompanies();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create company");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-10 max-w-md mx-auto">
      <div className="mb-4">
        <button
          className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-2 rounded-full shadow-lg hover:scale-105 hover:from-blue-500 hover:to-cyan-400 transition-all font-bold tracking-wide text-lg"
          onClick={() => setShowForm(true)}
        >
          <FaPlus /> Create Portal
        </button>
      </div>

      {/* Modal for creating a company */}
      {showForm && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl"
              onClick={() => setShowForm(false)}
            >
              &times;
            </button>
            <h3 className="text-xl font-semibold mb-4">Create New Portal</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2"
                  rows={3}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold transition"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Portal'}
              </button>
              {error && <div className="text-red-500 mt-2">{error}</div>}
            </form>
          </div>
        </div>
      )}

      {/* List of portals */}
      <div className="mt-6 bg-gray-900 rounded-lg shadow-md p-4">
        <div className="text-white font-semibold text-lg mb-2">My Portals</div>
        {companies.length === 0 && !loading && (
          <div className="text-gray-400">No portals found.</div>
        )}
        {companies.map((company) => (
          <div
            key={company._id}
            className="flex items-center gap-2 py-2 px-3 hover:bg-gray-800 rounded cursor-pointer transition"
          >
            <FaBuilding className="text-lg text-cyan-400" />
            <span className="text-cyan-400 font-semibold">{company.name}</span>
          </div>
        ))}
        <div
          className="mt-4 text-cyan-400 font-semibold cursor-pointer hover:underline"
          onClick={() => setShowForm(true)}
        >
          + Create Portal
        </div>
      </div>
    </div>
  );
};

export default Companies;
