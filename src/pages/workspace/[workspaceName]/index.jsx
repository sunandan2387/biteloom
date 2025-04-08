import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import Search from "@/components/compute/search";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import withAuth from "@/hoc/withAuth";
import { MdDelete } from "react-icons/md";

const Page = () => {
  const router = useRouter();
  const { workspaceName, id } = router.query;
  const [clusterData, setClusterData] = useState([]);
  const [bearerToken, setBearerToken] = useState();
  const [searchTerm, setSearchTerm] = useState("");

  const intervalRef = useRef(null);

  const getClusterData = async () => {
    try {
      const response = await axios.get(
        `https://sage.techfinna.com/techfinna/crud-cluster?workspace_id=${id}`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${bearerToken}`,
          },
        }
      );
      const data = response.data.data;
      setClusterData(data);

      // Check if any cluster has a status other than "done" or "failed"
      if (data && data.length > 0) {
        const pendingClusters = data.filter(
          (cluster) =>
            cluster.cluster_status !== "done" &&
            cluster.cluster_status !== "failed"
        );
        // If there are no pending clusters, clear the interval.
        if (pendingClusters.length === 0 && intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      } else if (intervalRef.current) {
        // If no clusters are found, clear the interval as well.
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    } catch (error) {
      console.error("Error fetching workspace:", error);
    }
  };

  useEffect(() => {
    // Retrieve token and fetch initial data.
    setBearerToken(localStorage.getItem("authToken"));
    getClusterData();

    // Start interval refresh every 4 minutes.
    intervalRef.current = setInterval(() => {
      getClusterData();
    }, 4 * 60 * 1000);

    // Clear interval on component unmount.
    return () => clearInterval(intervalRef.current);
  }, [id, bearerToken]);

  const deleteCompute = async (clusterId) => {
    try {
      const response = await axios.post(
        "https://sage.techfinna.com/destroy-cluster",
        {
          data: {
            // workspace_id: id,
            cluster_id: clusterId
          },
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
        }
      )
      console.log("Delete successful:", response.data);
    } catch (error) {
      console.error("Error deleting cluster:", error);
    }
  };

  const filteredClusters =
    clusterData &&
    clusterData.filter((cluster) => {
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return (
        (cluster.name && cluster.name.toLowerCase().includes(term))
      );
    });

  if (!id)
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6 w-full">
        <div className="flex gap-2 text-base w-full text-left">
          <p className=" text-3xl font-semibold first-letter:uppercase">
            {workspaceName} Workspace
          </p>
        </div>
        <Search/>
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
        <p className=" text-3xl font-semibold first-letter:uppercase">
          {workspaceName} Workspace
        </p>
      </div>
      <Search id={id} setSearchTerm={setSearchTerm} bearer={bearerToken} searchTerm={searchTerm} />
      <div className="w-full overflow-x-auto border border-gray-700 bg-gray-900 text-white">
      <table className="min-w-full ">
        <thead>
          <tr className="bg-gray-800 text-left">
            <th className="px-4 py-2 border border-gray-700">Status</th>
            <th className="px-4 py-2 border border-gray-700">Name</th>
            <th className="px-4 py-2 border border-gray-700">Min workers</th>
            <th className="px-4 py-2 border border-gray-700">max workers</th>
            {/* <th className="px-4 py-2 border border-gray-700">
              DAGs repository
            </th> */}
            <th className="px-4 py-2 border border-gray-700">VM Size</th>
            <th className="px-4 py-2 border border-gray-700">Created on</th>
            <th className="px-4 py-2 border border-gray-700">History Server</th>
            <th className="px-4 py-2 border border-gray-700">Airflow</th>
            <th className="px-4 py-2 border border-gray-700">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredClusters && filteredClusters.length > 0 ? (
            filteredClusters.map((cluster, index) => {
              let localDate = "";
              let localTime = "";
              if (cluster.created_at) {
                const dateObj = new Date(cluster.created_at);
                localDate = dateObj.toLocaleDateString();
                localTime = dateObj.toLocaleTimeString();
              }
              return (
                <tr key={index} className="hover:bg-gray-700">
                  <td className="px-4 py-4 border border-gray-700">
                    <div className="flex justify-center items-center">
                      {cluster.cluster_status === "failed" ? (
                        <span className="w-3 h-3 rounded-full bg-red-500" />
                      ) : cluster.cluster_status === "done" ? (
                        <span className="w-3 h-3 rounded-full bg-green-500" />
                      ) : (
                        <span className="w-3 h-3 rounded-full bg-yellow-500" />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-2 border border-gray-700">
                    {cluster.name}
                  </td>
                  <td className="px-4 py-2 border border-gray-700">
                    {cluster.min_worker}
                  </td>
                  <td className="px-4 py-2 border border-gray-700">
                    {cluster.max_worker}
                  </td>
                  {/* <td className="px-4 py-2 border border-gray-700">
                    {cluster.git_repo}
                  </td> */}
                  <td className="px-4 py-2 border border-gray-700">
                    {cluster.resource_name}
                  </td>
                  <td className="px-4 py-2 border border-gray-700">
                    {localDate}
                  </td>
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
                    <div
                      onClick={() => deleteCompute(cluster.id)}
                      className="flex justify-center items-center cursor-pointer"
                    >
                      <MdDelete size={"24px"} color="#ef4444" />
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="10" className="text-center py-4 text-gray-400">
                No clusters found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default withAuth(Page);
