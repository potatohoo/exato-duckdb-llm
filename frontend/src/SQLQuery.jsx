// SQLQuery.jsx
import React, { useState } from "react";
import { Database, Play } from "lucide-react";
import { runSQLQuery } from "./api/api";

const SQLQuery = ({ setQueryResults, setQueryExecuted }) => {
  const [sqlQuery, setSqlQuery] = useState("");

  const executeQuery = async () => {
    if (!sqlQuery.trim()) return;

    try {
      const res = await runSQLQuery(sqlQuery); // Get CSV blob from backend

      const text = await res.data.text(); // Convert blob to string
      const lines = text.trim().split("\n");
      const [headerLine, ...rowLines] = lines;

      const headers = headerLine.split(",");
      const rows = rowLines.map((line) => {
        const values = line.split(",");
        return Object.fromEntries(headers.map((h, i) => [h, values[i]]));
      });

      setQueryResults(rows);
      setQueryExecuted(true);
    } catch (err) {
      console.error("Query failed:", err);
      alert("Query failed. Check SQL syntax or uploaded data.");
    }
  };

  const clearResults = () => {
    setQueryResults([]);
    setQueryExecuted(false);
    setSqlQuery("");
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border p-6">
      <div className="flex items-center mb-6">
        <div className="p-2 bg-green-100 rounded-lg mr-3">
          <Database className="h-6 w-6 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">SQL Query</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Write your SQL query
          </label>
          <textarea
            value={sqlQuery}
            onChange={(e) => setSqlQuery(e.target.value)}
            placeholder="SELECT * FROM users WHERE department = 'Engineering';"
            className="w-full h-40 p-4 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-sm resize-none"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={executeQuery}
            className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            <Play className="h-4 w-4 mr-2" />
            Execute Query
          </button>
          <button
            onClick={clearResults}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default SQLQuery;
