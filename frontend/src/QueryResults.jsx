// QueryResults.jsx
import React from 'react';

const QueryResults = ({ queryResults }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg border p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-900">Query Results</h3>
        <div className="text-sm text-gray-600">
          {queryResults.length} rows returned
        </div>
      </div>

      {queryResults.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                {Object.keys(queryResults[0]).map((column) => (
                  <th
                    key={column}
                    className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {queryResults.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  {Object.values(row).map((value, cellIndex) => (
                    <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No results to display
        </div>
      )}
    </div>
  );
};

export default QueryResults;
