import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getCaseById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/cases/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching case by ID:", error);
    throw error;
  }
};

const deleteCase = async (id) => {
  return axios.delete(`${API_BASE_URL}/cases/${id}`);
};

const exportCase = (caseData, format) => {
  if (format === "json") return JSON.stringify(caseData, null, 2);
  else return Object.entries(caseData)
    .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
    .join("\n");
};

export default {
  getCaseById,
  deleteCase,
  exportCase,
};
