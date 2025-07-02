import axios from "axios";

const API_BASE = "http://localhost:5000";


export const uploadFile = async (formData) => {
  return await axios.post(`${API_BASE}/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};


// Run SQL query
export const runSQLQuery = async (sql) => {
  return await axios.post(
    `${API_BASE}/query`,
    { sql },
    {
      responseType: "blob", // if downloading CSV result
    }
  );
};

// LLM Chat
export const askLLM = async (question) => {
  const response = await axios.post(`${API_BASE}/chat`, { question });
  return response.data.answer;
};
