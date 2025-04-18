import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import Search from "@/components/compute/search";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import withAuth from "@/hoc/withAuth";
import { MdDelete } from "react-icons/md";
import Link from "next/link";
import Swal from 'sweetalert2'
import { Spinner } from "flowbite-react";

const Page = () => {
  const router = useRouter();
  const { workspaceName, id } = router.query;
  const [clusterData, setClusterData] = useState([]);
  const [bearerToken, setBearerToken] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleting,setIsDeleting] = useState(false)
  const intervalRef = useRef(null); 
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    const intervalDuration = 720000 / 99;

    const intervalId = setInterval(() => {
      setPercentage(prevPercentage => {
        if (prevPercentage >= 99) {
          clearInterval(intervalId);
          return 99;
        }
        return prevPercentage + 1;
      });
    }, intervalDuration);
    return () => clearInterval(intervalId);
  }, []);

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

      if (data && data.length > 0) {
        const pendingClusters = data.filter(
          (cluster) =>
            cluster.cluster_status !== "done" &&
            cluster.cluster_status !== "failed"
        );
        if (pendingClusters.length === 0 && intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      } else if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    } catch (error) {
      console.error("Error fetching workspace:", error);
    }
  };

  useEffect(() => {
    setBearerToken(localStorage.getItem("authToken"));
    getClusterData();

    intervalRef.current = setInterval(() => {
      getClusterData();
    }, 4 * 60 * 1000);

    return () => clearInterval(intervalRef.current);
  }, [id, bearerToken]);

  const deleteCompute = async (clusterId) => {
    Swal.fire({
      title: "Are you sure want to delete this Compute?",
      showDenyButton: true,
      confirmButtonText: "Delete",
      denyButtonText: `Cancel`
    }).then((result) => {
      if (result.isConfirmed) {
        setIsDeleting(true)
        try {
          const response = axios.post(
            "https://sage.techfinna.com/destroy-cluster",
            {
              data: {
                workspace_id: id,
                cluster_id: clusterId
              },
              headers: {
                Authorization: `Bearer ${bearerToken}`,
              },
            }
          )
          console.log("Delete successful:", response);
          if (response) {
            toast.success('Compute deleted')
            setIsDeleting(false)
            getClusterData()
          } else {
            toast.error('Something went wrong')
          }

        } catch (error) {
          console.error("Error deleting cluster:", error);
        }
      }
    });

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
      <div className="min-h-screen bg-white text-black flex flex-col items-center p-6 w-full">
        <div className="flex gap-2 text-base w-full text-left">
          <p className=" text-3xl font-semibold first-letter:uppercase">
            {workspaceName} Workspace
          </p>
        </div>
        <Search />
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-white text-black flex flex-col items-center p-6 w-full">
      <ToastContainer
        position="bottom-left"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="flex gap-2 text-base w-full text-left">
        <p className="text-3xl font-semibold first-letter:uppercase">
          {workspaceName} Workspace
        </p>
      </div>
      <Search id={id} setSearchTerm={setSearchTerm} bearer={bearerToken} searchTerm={searchTerm} />
      <div className="w-full overflow-x-auto border border-gray-200 bg-white text-black">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="px-4 py-2 border border-gray-200">Status</th>
              <th className="px-4 py-2 border border-gray-200">Name</th>
              <th className="px-4 py-2 border border-gray-200">Min workers</th>
              <th className="px-4 py-2 border border-gray-200">Max workers</th>
              <th className="px-4 py-2 border border-gray-200">VM Size</th>
              <th className="px-4 py-2 border border-gray-200">Created on</th>
              <th className="px-4 py-2 border border-gray-200">History Server</th>
              <th className="px-4 py-2 border border-gray-200">Airflow</th>
              <th className="px-4 py-2 border border-gray-200">Action</th>
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
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="px-4 py-4 border border-gray-200">
                      <div className="flex justify-center items-center">
                        {cluster.cluster_status === "failed" ? (
                          <span className="rounded-sm text-red-500 px-2 py-1 bg-red-50">
                            Failed
                          </span>
                        ) : cluster.cluster_status === "done" ? (
                          <span className="rounded-sm text-green-500 px-2 py-1 bg-green-50">
                            Completed
                          </span>
                          ) : (  
                            <svg className="animate-spin" height={30} width={30} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 21C10.5316 20.9987 9.08574 20.6382 7.78865 19.9498C6.49156 19.2614 5.38261 18.2661 4.55853 17.0507C3.73446 15.8353 3.22029 14.4368 3.06088 12.977C2.90147 11.5172 3.10167 10.0407 3.644 8.67604C4.18634 7.31142 5.05434 6.10024 6.17229 5.14813C7.29024 4.19603 8.62417 3.53194 10.0577 3.21378C11.4913 2.89563 12.9809 2.93307 14.3967 3.32286C15.8124 3.71264 17.1113 4.44292 18.18 5.45C18.3205 5.59062 18.3993 5.78125 18.3993 5.98C18.3993 6.17875 18.3205 6.36937 18.18 6.51C18.1111 6.58075 18.0286 6.63699 17.9376 6.67539C17.8466 6.71378 17.7488 6.73357 17.65 6.73357C17.5512 6.73357 17.4534 6.71378 17.3624 6.67539C17.2714 6.63699 17.189 6.58075 17.12 6.51C15.8591 5.33065 14.2303 4.62177 12.508 4.5027C10.7856 4.38362 9.07478 4.86163 7.66357 5.85624C6.25237 6.85085 5.22695 8.30132 4.75995 9.96345C4.29296 11.6256 4.41292 13.3979 5.09962 14.9819C5.78633 16.5659 6.99785 17.865 8.53021 18.6604C10.0626 19.4558 11.8222 19.6989 13.5128 19.3488C15.2034 18.9987 16.7218 18.0768 17.8123 16.7383C18.9028 15.3998 19.4988 13.7265 19.5 12C19.5 11.8011 19.579 11.6103 19.7197 11.4697C19.8603 11.329 20.0511 11.25 20.25 11.25C20.4489 11.25 20.6397 11.329 20.7803 11.4697C20.921 11.6103 21 11.8011 21 12C21 14.3869 20.0518 16.6761 18.364 18.364C16.6761 20.0518 14.387 21 12 21Z" fill="#c78800"></path> </g></svg>
                          )}
                      </div>
                    </td>
                    <td className="px-4 py-2 border border-gray-200">{cluster.name}</td>
                    <td className="px-4 py-2 border border-gray-200">{cluster.min_worker}</td>
                    <td className="px-4 py-2 border border-gray-200">{cluster.max_worker}</td>
                    <td className="px-4 py-2 border border-gray-200">{cluster.resource_name}</td>
                    <td className="px-4 py-2 border border-gray-200">{localDate}</td>
                    <td className="px-4 py-2 border border-gray-200">
                      {cluster.spark_server_ip ? (
                        <Link target="_blank" href={`http://${cluster.spark_server_ip}`}>
                          <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-1 px-4 rounded-sm">
                            Spark
                          </button>
                        </Link>
                      ) : (
                        <button
                          className="bg-gray-400 text-white font-bold py-1 px-4 rounded-sm cursor-not-allowed"
                          disabled
                        >
                          Spark
                        </button>
                      )}
                    </td>

                    <td className="px-4 py-2 border border-gray-200">
                      {cluster.airflow_external_ip ? (
                        <Link target="_blank" href={`http://${cluster.airflow_external_ip}`}>
                          <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-4 rounded-sm">
                            Airflow
                          </button>
                        </Link>
                      ) : (
                        <button
                          className="bg-gray-400 text-white font-bold py-1 px-4 rounded-sm cursor-not-allowed"
                          disabled
                        >
                          Airflow
                        </button>
                      )}
                    </td>

                    <td className="px-4 py-2 border border-gray-200">
                      <div
                        onClick={() => deleteCompute(cluster.id)}
                        className="flex justify-center items-center cursor-pointer"
                      >{
                          isDeleting ?
                          <Spinner aria-label="Spinner button example" size="md" />
                            :
                            <MdDelete size={"24px"} color="#ef4444" />
                      }
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="10" className="text-center py-4 text-gray-500">
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
