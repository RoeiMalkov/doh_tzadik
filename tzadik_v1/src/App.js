import React, { useState, useEffect } from "react";
import { saveSubmission, getSubmissions, clearAllSubmissions } from "./firebase";
import "./App.css";
import { db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";

// Serial numbers and corresponding equipment numbers
const serialNumbers = {
  "064": ["346211", "769658"],
  "082": ["346290", "764442"],
  "129": ["326269", "769492"],
  "054": ["346365", "761733"],
  "085": ["985542", "770210"],
  "039": ["346160", "769912"],
};
// const fetchSerialNumbers = async () => {
//   const tankIds = ["064", "082", "129", "054", "085", "039"]; // List of document IDs
//   const serialNumbers = {};

//   for (const tankId of tankIds) {
//     const docRef = doc(db, "Tanks", tankId);
//     const docSnap = await getDoc(docRef);

//     if (docSnap.exists()) {
//       serialNumbers[tankId] = [
//         docSnap.data().equipment1, // Fetch equipment1
//         docSnap.data().equipment2, // Fetch equipment2
//       ];
//     } else {
//       console.log(`No document found for tank ID: ${tankId}`);
//     }
//   }

//   return serialNumbers;
// };
// const serialNumbers = fetchSerialNumbers();



function App() {
  const [serialNumber, setSerialNumber] = useState("");
  const [equipment1, setEquipment1] = useState("");
  const [equipment2, setEquipment2] = useState("");
  const [hasEquipment1, setHasEquipment1] = useState(false);
  const [hasEquipment2, setHasEquipment2] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const data = await getSubmissions();
      setSubmissions(data);
    }
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!serialNumber) {
      setStatusMessage("Error:תבחר טנק אחי");
      return;
    }

    try {
      await saveSubmission(serialNumber, equipment1, equipment2, hasEquipment1, hasEquipment2);
      setStatusMessage("✅ הדוח נשלח יאח");

      // Refresh submissions list
      const updatedData = await getSubmissions();
      setSubmissions(updatedData);

      // Reset form
      setSerialNumber("");
      setEquipment1("");
      setEquipment2("");
      setHasEquipment1(false);
      setHasEquipment2(false);
    } catch (error) {
      console.error("Submission error:", error);
      setStatusMessage("❌ Submission failed. Please try again.");
    }
  };

  const generateText = () => {
    return submissions
      .map(
        (entry) =>
          `${entry.serialNumber}\nיעת/סיאף:${entry.equipment1} ${entry.hasEquipment1 ? '✔' : '✖'} \nמבן: ${entry.equipment2} ${entry.hasEquipment2 ? '✔' : '✖'}`
      )
      .join("\n----------------\n");

  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateText());
    setStatusMessage("✅ Text copied to clipboard!");
  };


  // Clear all data after password verification
  const handleClearAll = async () => {
    const password = prompt("Enter admin password to clear all data:");
    if (password === "9363335") {
      await clearAllSubmissions();
      setSubmissions([]);
      setStatusMessage("✅ All data cleared successfully.");
    } else {
      setStatusMessage("❌ Incorrect password. Action denied.");
    }
  };

  // Handle serial number change
  const handleSerialNumberChange = (e) => {
    const selectedSerial = e.target.value;
    setSerialNumber(selectedSerial);
    const [equipment1, equipment2] = serialNumbers[selectedSerial] || [];
    setEquipment1(equipment1 || "");
    setEquipment2(equipment2 || "");
  };

  return (
    <div className="App">
      <h1>דוח צ</h1>
      <form onSubmit={handleSubmit}>
        <label>צ טנק:</label>
        <select value={serialNumber} onChange={handleSerialNumberChange}>
          <option value="">בחר מספר טנק</option>
          {Object.keys(serialNumbers).map((serial) => (
            <option key={serial} value={serial}>
              {serial}
            </option>
          ))}
        </select>

        <div className="checkbox-container">
          <label>
            <input
              type="checkbox"
              checked={hasEquipment1}
              onChange={(e) => setHasEquipment1(e.target.checked)}
            />
            יעת/סיאף ({equipment1})
          </label>
        </div>

        <div className="checkbox-container">
          <label>
            <input
              type="checkbox"
              checked={hasEquipment2}
              onChange={(e) => setHasEquipment2(e.target.checked)}
            />
            מבן ({equipment2})
          </label>
        </div>

        <button type="submit">שלח דוח</button>
      </form>

      {statusMessage && <p>{statusMessage}</p>}

      <h2>דוח נוכחי</h2>
      <textarea
        value={generateText()}
        readOnly
        style={{ width: "100%", height: "120px" }}
      ></textarea>

      <div className="button-group">
        <button onClick={copyToClipboard}>העתק למקלדת</button>
        <button onClick={handleClearAll} style={{ backgroundColor: "red" }}>
          איפוס ואתחול
        </button>
      </div>
    </div>
  );
}

export default App;
