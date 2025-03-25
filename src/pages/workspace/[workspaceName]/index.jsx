import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Search from "@/components/compute/search";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import withAuth from "@/hoc/withAuth";

const page = () => {
  const router = useRouter();
  const { workspaceName, id } = router.query;
  const [clusterData, setClusterData] = useState()
  const [bearerToken, setBearerToken] = useState();

  const getClusterData = async () => {
    axios.get(`https://sage.techfinna.com/techfinna/crud-cluster?workspace_id=${id}`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${bearerToken}`
      }
    })
      .then(response => {
        console.log(response.data.data)
        setClusterData(response.data.data)
      })
      .catch(error => {
        console.error('Error fetching workspace:', error);
      });
  };

  useEffect(() => {
    setBearerToken(localStorage.getItem('authToken'))
    getClusterData()
  }, [])

    const deleteCompute = async (id) => {
      try {
        const response = await axios.delete('https://sage.techfinna.com/techfinna/crud-cluster', {
          data: { cluster_id: id },
          headers: {
            'Authorization': `Bearer ${bearerToken}`
          }
        });
        console.log('Delete successful:', response.data);
        router.reload();
      } catch (error) {
        console.error('Error deleting cluster:', error);
      }
  }

  if (!id) return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6 w-full">
      <div className="flex gap-2 text-base w-full text-left">
        <p className=" text-3xl font-semibold first-letter:uppercase">{workspaceName} Workspace</p>
      </div>
      <Search />
      Loading...
    </div>
  );
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6 w-full">
      <ToastContainer
        position="bottom-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <div className="flex gap-2 text-base w-full text-left">
        <p className=" text-3xl font-semibold first-letter:uppercase">{workspaceName} Workspace</p>
      </div>
      <Search id={id} />
      <table className="min-w-full border border-gray-700 bg-gray-900 text-white">
        <thead>
          <tr className="bg-gray-800 text-left">
            <th className="px-4 py-2 border border-gray-700">Status</th>
            <th className="px-4 py-2 border border-gray-700">Name</th>
            <th className="px-4 py-2 border border-gray-700">Min workers</th>
            <th className="px-4 py-2 border border-gray-700">max workers</th>
            <th className="px-4 py-2 border border-gray-700">Github repository</th>
            <th className="px-4 py-2 border border-gray-700">Created on</th>
            <th className="px-4 py-2 border border-gray-700">Created at</th>
            <th className="px-4 py-2 border border-gray-700">Spark</th>
            <th className="px-4 py-2 border border-gray-700">Airflow</th>
            <th className="px-4 py-2 border border-gray-700">Action</th>
          </tr>
        </thead>
        <tbody>
          {clusterData && clusterData.length > 0 ? (
            clusterData.map((cluster, index) => {
              let localDate = "";
              let localTime = "";
              if (cluster.created_at) {
                const dateObj = new Date(cluster.created_at);
                localDate = dateObj.toLocaleDateString();
                localTime = dateObj.toLocaleTimeString();
              }

              return (
                <tr key={index} className="hover:bg-gray-700">
                  <td className="px-4 py-2 border border-gray-700 flex justify-center items-center">
                    {cluster.cluster_status}
                  </td>
                  <td className="px-4 py-2 border border-gray-700">{cluster.name}</td>
                  <td className="px-4 py-2 border border-gray-700">{cluster.min_worker}</td>
                  <td className="px-4 py-2 border border-gray-700">{cluster.max_worker}</td>
                  <td className="px-4 py-2 border border-gray-700">{cluster.git_repo}</td>
                  <td className="px-4 py-2 border border-gray-700">{localDate}</td>
                  <td className="px-4 py-2 border border-gray-700">{localTime}</td>
                  <td className="px-4 py-2 border border-gray-700">
                    <button className="bg-[#E25A1C] hover:bg-[#e2471c] text-white font-bold py-1 px-4 rounded-sm">
                      Spark
                    </button>
                  </td>
                  <td className="px-4 py-2 border border-gray-700">
                    <button className="bg-[#017CEE] hover:bg-blue-700 text-white font-bold py-1 px-4 rounded-sm">
                      Airflow
                    </button>
                  </td>
                  <td className="px-4 py-2 border border-gray-700">
                    <button onClick={()=>deleteCompute(cluster.id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-4 rounded-sm">
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="8" className="text-center py-4 text-gray-400">
                No clusters found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default withAuth(page);
