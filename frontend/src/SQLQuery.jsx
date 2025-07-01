// SQLQuery.jsx
import React, { useState } from 'react';
import { Database, Play } from 'lucide-react';

const SQLQuery = ({ setQueryResults, setQueryExecuted }) => {
  const [sqlQuery, setSqlQuery] = useState('');

  const executeQuery = () => {
    if (!sqlQuery.trim()) return;

    const mockResults = [
      { id: 1, name: 'John Doe', email: 'john@example.com', department: 'Engineering', salary: 75000 },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', department: 'Marketing', salary: 68000 },
      { id: 3, name: 'Bob Johnson', email: 'bob@example.com', department: 'Sales', salary: 72000 },
      { id: 4, name: 'Alice Brown', email: 'alice@example.com', department: 'HR', salary: 65000 },
      { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', department: 'Engineering', salary: 80000 }
    ];

    setQueryResults(mockResults);
    setQueryExecuted(true);
  };

  const clearResults = () => {
    setQueryResults([]);
    setQueryExecuted(false);
    setSqlQuery('');
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
          <label className="block text-sm font-semibold text-gray-700 mb-2">Write your SQL query</label>
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
