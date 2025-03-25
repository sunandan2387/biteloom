import React from "react";

const Clusters = ({ clusters }) => {
  
  // Filter clusters based on user_id
  console.log("clusters inside clusters.jsx",clusters);
  return (
    <div className="overflow-x-auto w-full rounded-sm">
      <table className="min-w-full border border-gray-700 bg-gray-900 text-white">
        <thead>
          <tr className="bg-gray-800 text-left">
            <th className="px-4 py-2 border border-gray-700">State</th>
            <th className="px-4 py-2 border border-gray-700">Name</th>
            <th className="px-4 py-2 border border-gray-700">Runtime</th>
            <th className="px-4 py-2 border border-gray-700">Active Cores</th>
            <th className="px-4 py-2 border border-gray-700">Active DBU</th>
            <th className="px-4 py-2 border border-gray-700">Source</th>
            <th className="px-4 py-2 border border-gray-700">Creator</th>
            <th className="px-4 py-2 border border-gray-700">Github Repo</th>
          </tr>
        </thead>
        <tbody>
          {clusters.length > 0 ? (
            clusters.map((cluster, index) => (
              <tr key={index} className="hover:bg-gray-700">
                <td className="px-4 py-2 border border-gray-700 flex justify-center items-center">
                  <span className="text-green-400 mx-auto">●</span>
                </td>
                <td className="px-4 py-2 border border-gray-700">{cluster.name}</td>
                <td className="px-4 py-2 border border-gray-700">{cluster.runtime}</td>
                <td className="px-4 py-2 border border-gray-700">{cluster.activeCores}</td>
                <td className="px-4 py-2 border border-gray-700">{cluster.activeDBU}</td>
                <td className="px-4 py-2 border border-gray-700">{cluster.source}</td>
                <td className="px-4 py-2 border border-gray-700">{cluster.creator}</td>
                <td className="px-4 py-2 border border-gray-700">{cluster.github}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center py-4 text-gray-400">
                No clusters found for this user.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Clusters;
