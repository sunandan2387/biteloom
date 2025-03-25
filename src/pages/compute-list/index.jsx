"use client";
import Search from "@/components/compute/search";

const ComputeDetails = () => {


  const clusters = [
    {
      user_id: 1,
      name: "Chandan Sharma's Cluster",
      runtime: "15.4",
      github: "-",
      activeCores: "-",
      activeDBU: "0.5",
      source: "UI",
      creator: "Chandan Sharma",
    },
    {
      user_id: 1,
      name: "DataSage Cluster",
      runtime: "14.6",
      github: "-",
      activeCores: "-",
      activeDBU: "2.5",
      source: "UI",
      creator: "Chandan Sharma",
    },
    {
      user_id: 2,
      name: "Chandan Sharma's Cluster",
      runtime: "15.4",
      github: "-",
      activeCores: "-",
      activeDBU: "0.5",
      source: "UI",
      creator: "Vishal",
    },
  ];


  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6 w-full">
      <div className="flex gap-2 text-base w-full text-left">
        <p className=" text-3xl font-semibold">Compute </p>
      </div>
      <Search />
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
                  <td className="px-4 py-2 border border-gray-700">
                    {cluster.name}
                  </td>
                  <td className="px-4 py-2 border border-gray-700">
                    {cluster.runtime}
                  </td>
                  <td className="px-4 py-2 border border-gray-700">
                    {cluster.activeCores}
                  </td>
                  <td className="px-4 py-2 border border-gray-700">
                    {cluster.activeDBU}
                  </td>
                  <td className="px-4 py-2 border border-gray-700">
                    {cluster.source}
                  </td>
                  <td className="px-4 py-2 border border-gray-700">
                    {cluster.creator}
                  </td>
                  <td className="px-4 py-2 border border-gray-700">
                    {cluster.github}
                  </td>
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
    </div>
  );
};

export default ComputeDetails;
