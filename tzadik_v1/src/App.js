import React, { useState, useEffect } from "react";
import { saveSubmission, getSubmissions, clearAllSubmissions } from "./firebase";
import "./App.css";

// Serial numbers and corresponding equipment numbers
const serialNumbers = {
  "064": ["346211", "769658"],
  "082": ["346290", "764442"],
  "129": ["326269", "769492"],
  "054": ["346365", "761733"],
  "085": ["985542", "770210"],
  "039": ["346160", "769912"],
};

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
      setStatusMessage("Error: Please select a serial number.");
      return;
    }

    try {
      await saveSubmission(serialNumber, equipment1, equipment2, hasEquipment1, hasEquipment2);
      setStatusMessage("✅ Submission Successful!");

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
        // `${entry.serialNumber}\nיעת/סיאף:${entry.equipment1}\nמבן: ${entry.equipment2}`
      )
      .join("\n----------------\n");

  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateText());
    setStatusMessage("✅ Text copied to clipboard!");
  };
  // const copyToClipboard = () => {
  //   const textToCopy = `${serialNumber}\nיעת/סיאף: ${hasEquipment1 ? '✔' : '✖'}  \nמבן: ${hasEquipment2 ? '✔' : '✖'}`;
    
  //   // Create a temporary textarea element to hold the text to copy
  //   const textArea = document.createElement("textarea");
  //   textArea.value = textToCopy;
  //   document.body.appendChild(textArea);
    
  //   // Select and copy the text
  //   textArea.select();
  //   document.execCommand("copy");
    
  //   // Remove the temporary textarea element
  //   document.body.removeChild(textArea);
    
  //   alert("Text copied to clipboard!");
  // };

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
      <h1>Form Submission</h1>
      <form onSubmit={handleSubmit}>
        <label>Serial Number:</label>
        <select value={serialNumber} onChange={handleSerialNumberChange}>
          <option value="">Select a serial number</option>
          {Object.keys(serialNumbers).map((serial) => (
            <option key={serial} value={serial}>
              {serial}
            </option>
          ))}
        </select>

        <div>
          <label>
            <input
              type="checkbox"
              checked={hasEquipment1}
              onChange={(e) => setHasEquipment1(e.target.checked)}
            />
            יעת/סיאף ({equipment1})
          </label>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={hasEquipment2}
              onChange={(e) => setHasEquipment2(e.target.checked)}
            />
            מבן ({equipment2})
          </label>
        </div>

        <button type="submit">Submit</button>
      </form>

      {statusMessage && <p>{statusMessage}</p>}

      <h2>Saved Submissions</h2>
      <textarea
        value={generateText()}
        readOnly
        style={{ width: "100%", height: "120px" }}
      ></textarea>

      <div className="button-group">
        <button onClick={copyToClipboard}>Copy to Clipboard</button>
        <button onClick={handleClearAll} style={{ backgroundColor: "red" }}>
          Clear All Data
        </button>
      </div>
    </div>
  );
}

export default App;
