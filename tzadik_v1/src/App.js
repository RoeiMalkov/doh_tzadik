import { useState } from "react";
import './App.css';

export default function App() {
  const [formData, setFormData] = useState({
    serialNumber: "",
    hasEquipment1: false,
    hasEquipment2: false,
  });
  const [submissions, setSubmissions] = useState([]);

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmissions([...submissions, formData]);
    setFormData({ serialNumber: "", hasEquipment1: false, hasEquipment2: false });
  };

  const serialNumbers = ["SN001", "SN002", "SN003", "SN004", "SN005"];

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg font-sans">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Daily Submission Form</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 font-medium mb-2">Serial Number</label>
          <select
            name="serialNumber"
            value={formData.serialNumber}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          >
            <option value="">Select Serial Number</option>
            {serialNumbers.map((sn, index) => (
              <option key={index} value={sn}>{sn}</option>
            ))}
          </select>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg">
          <label className="flex items-center text-gray-700 font-medium">
            <input
              type="checkbox"
              name="hasEquipment1"
              checked={formData.hasEquipment1}
              onChange={handleChange}
              className="mr-2 w-5 h-5"
            />
            Has Equipment 1
          </label>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg">
          <label className="flex items-center text-gray-700 font-medium">
            <input
              type="checkbox"
              name="hasEquipment2"
              checked={formData.hasEquipment2}
              onChange={handleChange}
              className="mr-2 w-5 h-5"
            />
            Has Equipment 2
          </label>
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white p-3 rounded-lg text-lg font-medium hover:bg-blue-600">
          Submit
        </button>
      </form>

      {submissions.length > 0 && (
        <div className="mt-8 p-6 bg-gray-50 shadow-md rounded-lg">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Submitted Data</h2>
          <ul className="divide-y divide-gray-300">
            {submissions.map((submission, index) => (
              <li key={index} className="py-3">
                <p className="text-gray-700">Serial Number: <span className="font-medium">{submission.serialNumber}</span></p>
                <p className="text-gray-700">Has Equipment 1: <span className="font-medium">{submission.hasEquipment1 ? "Yes" : "No"}</span></p>
                <p className="text-gray-700">Has Equipment 2: <span className="font-medium">{submission.hasEquipment2 ? "Yes" : "No"}</span></p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
