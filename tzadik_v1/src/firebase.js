import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDocs, collection, deleteDoc } from "firebase/firestore";

// Firebase configuration (replace with your own credentials)
const firebaseConfig = {
    apiKey: "AIzaSyC0MI6aXkuDXtoE3nh50b3gitNkVuD3FII",
    authDomain: "dohtzadik198.firebaseapp.com",
    projectId: "dohtzadik198",
    storageBucket: "dohtzadik198.firebasestorage.app",
    messagingSenderId: "677113326537",
    appId: "1:677113326537:web:3872265f1bae4c8fddd618",
    measurementId: "G-0XBM3LNCKN"
  };
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to save a submission
export const saveSubmission = async (serialNumber, equipment1, equipment2, hasEquipment1, hasEquipment2) => {
    if (!serialNumber || !equipment1 || !equipment2) {
      console.error("Error: Serial number and equipment are required.");
      return;
    }
  
    try {
      await setDoc(doc(db, "submissions", serialNumber), {
        serialNumber,
        equipment1,  // Save Equipment 1 serial number
        equipment2,  // Save Equipment 2 serial number
        hasEquipment1,  // Checkbox for Equipment 1 ("יעת/cf")
        hasEquipment2,  // Checkbox for Equipment 2 ("מבן")
        timestamp: new Date(),  // Optional: to track when the data was submitted
      });
  
      console.log(`Data saved with ID: ${serialNumber}`);
    } catch (error) {
      console.error("Error saving document:", error);
    }
  };
  
  

// Function to fetch all submissions
export const getSubmissions = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "submissions"));
    return querySnapshot.docs.map((doc) => doc.data());
  } catch (error) {
    console.error("Error fetching documents:", error);
    return [];
  }
};

// Function to delete all submissions
export const clearAllSubmissions = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "submissions"));
    const deletePromises = querySnapshot.docs.map((doc) => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    console.log("All submissions deleted successfully.");
  } catch (error) {
    console.error("Error deleting documents:", error);
  }
};

export { db };
