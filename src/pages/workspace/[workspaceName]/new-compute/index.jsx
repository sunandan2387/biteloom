import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import VmTableModal from "@/components/modals/VmTableModal";
import { BsCheckLg } from "react-icons/bs";
import withAuth from "@/hoc/withAuth";
import { MdOutlineChangeCircle } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";

const WorkspaceDetail = () => {
  const [spotInstance, setSpotInstance] = useState(false);
  const [gitRepo, setGitRepo] = useState("");
  const [branch, setBranch] = useState("");
  const [subpath, setSubpath] = useState("");
  const [minutesToTerminate, setMinutesToTerminate] = useState(120);
  const [minWorker, setMinWorker] = useState("");
  const [clusterName, setClusterName] = useState("");
  const [maxWorker, setMaxWorker] = useState("");
  const [workspaceId, setWorkspaceId] = useState();
  const [selectedRegion, setSelectedRegion] = useState();
  const [allRegions, setAllRegions] = useState();
  const [vmList, setVmList] = useState();
  const [selectedVm, setSelectedVm] = useState();
  const [openVmModal, setOpenVmModal] = useState(false);
  const [bearerToken, setBearerToken] = useState();

  const router = useRouter();

  useEffect(() => {
    setBearerToken(localStorage.getItem("authToken"));
  }, [gitRepo, vmList]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const path = window.location.pathname;
      const parts = path.split("/");
      if (parts.length >= 3) {
        setWorkspaceId(parseInt(parts[2]));
      }
    }
  }, []);

  console.log(selectedVm);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const min = Number(minWorker);
    const max = Number(maxWorker);

    if (min <= 0 || max <= 0) {
      toast.error('Workers value cannot be 0 or less')
      return;
    }

    if (min > max) {
      toast.error("Min workers cannot be more than max workers");
      return;
    }

    if (!selectedRegion ) {
      toast.error("Please select region");
      return;
    }

    if (!selectedVm ) {
      toast.error("Please select Vm Size");
      return;
    }

    const payload = {
      name: clusterName,
      git_repo: gitRepo,
      workspace_id: workspaceId,
      minutes_to_terminate: Number(minutesToTerminate),
      min_worker: min,
      max_worker: max,
      location: selectedRegion,
      spot_instance: spotInstance, //binary
      selected_vm: selectedVm, //json
    };

    console.log(payload); 

    try {
      const response = await fetch("https://sage.techfinna.com/create-cluster/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${bearerToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log("Success:", data);
      router.push("/workspace");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchRegions = async () => {
    try {
      axios
        .get(`https://sage.techfinna.com/azure/get_regions/${workspaceId}`, {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
        })
        .then((res) => {
          console.log(res.data);
          setAllRegions(res.data.regions);
        });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  console.log("selected region:" + selectedRegion);

  useEffect(() => {
    if (bearerToken) {
      fetchRegions();
    }
  }, [bearerToken]);

  const fetchVm = async () => {
    if (selectedRegion) {
      try {
        axios
          .get(`https://sage.techfinna.com/azure/get_vm_skus/${workspaceId}?region=${selectedRegion}`, {
            headers: {
              Authorization: `Bearer ${bearerToken}`,
            },
          })
          .then((res) => {
            setVmList(res.data.available_vm_skus);
            console.log(res.data.available_vm_skus);
          });
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };
  useEffect(() => {
    fetchVm();
  }, [selectedRegion]);

  console.log("vm list:" + vmList);

  return (
    <>
      <VmTableModal
        openVmModal={openVmModal}
        setOpenVmModal={setOpenVmModal}
        setSelectedVm={setSelectedVm}
        vmList={vmList}
      />
      <div className="min-h-screen bg-gray-900 dark:text-white flex flex-col items-center p-6 pt-0 w-full overflow-y-auto pb-[80px]">
        <div className="w-full mx-auto flex items-end border-b-2 border-gray-600 py-2 pb-4 my-4">
          <h2 className="text-2xl">Create new cluster</h2>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col w-full ">
          <div className="flex w-full flex-col md:flex-row overflow-y-auto h-[560px] px-6">
            <div className="flex flex-col gap-2 md:w-1/2">
              <h2 className="text-2xl font-semibold mt-2">Cluster Name</h2>
              <input
                type="text"
                name="name"
                id="name"
                required
                value={clusterName}
                onChange={(e) => setClusterName(e.target.value)}
                className="border border-dashed border-gray-600 placeholder-gray-200 bg-gray-600 dark:text-white px-4 py-2 rounded-sm text-base text-gray-900 focus:outline-none sm:text-sm/6"
                placeholder="Cluster Name"
              />
              <h2 className="text-2xl font-semibold mt-2">Spark Job</h2>
              <p className="font-semibold flex gap-2 items-center mt-1">
                DAGs Information
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15px"
                  height="15px"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <g clipPath="url(#clip0_429_11160)">
                    <circle
                      cx="12"
                      cy="11.9999"
                      r="9"
                      stroke="#fff"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <rect
                      x="12"
                      y="8"
                      width="0.01"
                      height="0.01"
                      stroke="#fff"
                      strokeWidth="3.75"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 12V16"
                      stroke="#fff"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_429_11160">
                      <rect width="24" height="24" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </p>
              <input
                type="text"
                name="github"
                id="github"
                value={gitRepo}
                required
                onChange={(e) => setGitRepo(e.target.value)}
                className="border border-dashed border-gray-600 placeholder-gray-200 bg-gray-600 dark:text-white px-4 py-2 rounded-sm text-base text-gray-900 focus:outline-none sm:text-sm/6"
                placeholder="DAGs Repository"
              />
              <input
                type="text"
                name="branch"
                id="branch"
                value={branch}
                required
                onChange={(e) => setBranch(e.target.value)}
                className="border border-dashed border-gray-600 placeholder-gray-200 bg-gray-600 dark:text-white px-4 py-2 rounded-sm text-base text-gray-900 focus:outline-none sm:text-sm/6"
                placeholder="Branch"
              />
              <input
                type="text"
                name="subpath"
                id="subpath"
                value={subpath}
                onChange={(e) => setSubpath(e.target.value)}
                className="border border-dashed border-gray-600 placeholder-gray-200 bg-gray-600 dark:text-white px-4 py-2 rounded-sm text-base text-gray-900 focus:outline-none sm:text-sm/6"
                placeholder="Sub-path, if required"
              />
              <h2 className="text-2xl font-semibold mt-3">Performance</h2>
              <div className="flex gap-2 flex-col mt-1">
                <p className="font-semibold flex gap-2 items-center">Region</p>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="border border-dashed border-gray-600 bg-gray-600 dark:text-white px-4 py-2 rounded-sm text-base text-gray-900 focus:outline-none sm:text-sm"
                >
                  <option value="">Select a Region</option>
                  {allRegions &&
                    allRegions.map((region, index) => (
                      <option key={index} value={region.name}>
                        {region.displayName}
                      </option>
                    ))}
                </select>
              </div>
              <div className="flex gap-2 flex-col mt-3">
                <p className="font-semibold flex gap-2 items-center">
                  Type of Compute
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="15px"
                    height="15px"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <g clipPath="url(#clip0_429_11160)">
                      <circle
                        cx="12"
                        cy="11.9999"
                        r="9"
                        stroke="#fff"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <rect
                        x="12"
                        y="8"
                        width="0.01"
                        height="0.01"
                        stroke="#fff"
                        strokeWidth="3.75"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 12V16"
                        stroke="#fff"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_429_11160">
                        <rect width="24" height="24" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </p>
                {!selectedVm ?
                                  <div
                                  onClick={() => setOpenVmModal(true)}
                                  disabled={!selectedRegion}
                                  className="bg-gray-300 disabled:cursor-not-allowed cursor-pointer hover:bg-gray-400 w-fit text-gray-800 font-bold py-2 px-4 rounded items-center"
                                >
                                  <span>Select VM Size</span>
                  </div>
                  :
                  <div className="flex gap-5 items-center">
                    {selectedVm.name}
                    <MdOutlineChangeCircle size={'28px'} onClick={() => setOpenVmModal(true)}/>
                  </div>
                }

              </div>
              <p className="font-semibold flex gap-2 items-center mt-3">
                Worker type
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15px"
                  height="15px"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <g clipPath="url(#clip0_429_11160)">
                    <circle
                      cx="12"
                      cy="11.9999"
                      r="9"
                      stroke="#fff"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <rect
                      x="12"
                      y="8"
                      width="0.01"
                      height="0.01"
                      stroke="#fff"
                      strokeWidth="3.75"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 12V16"
                      stroke="#fff"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_429_11160">
                      <rect width="24" height="24" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </p>
              <div className="flex gap-4 md:gap-2 flex-col md:flex-row md:items-center px-4">
              <div className="flex gap-2">
                <p className="font-semibold mr-2">Min workers</p>
                <input
                  type="number"
                  name="minWorker"
                  id="minWorker"
                  value={minWorker}
                  onChange={(e) => setMinWorker(e.target.value)}
                  className="border border-dashed border-gray-600 placeholder-gray-200 bg-gray-600 px-3 py-2 rounded-sm text-base w-[70px] text-gray-900 focus:outline-none sm:text-sm/6"
                  placeholder="2"
                  />
                </div>
                <div className="flex gap-2">
                <p className="font-semibold mr-2">Max workers</p>
                <input
                  type="number"
                  name="maxWorker"
                  id="maxWorker"
                  value={maxWorker}
                  onChange={(e) => setMaxWorker(e.target.value)}
                  className="border border-dashed border-gray-600 placeholder-gray-200 dark:text-white bg-gray-600 px-3 py-2 rounded-sm text-base w-[90px] text-gray-900 focus:outline-none sm:text-sm/6"
                  placeholder="8"
                  />
                  </div>
                <div className="flex gap-2">
                <input
                  type="checkbox"
                  name="spotInstance"
                  checked={spotInstance}
                  onChange={(e) => setSpotInstance(e.target.checked)}
                  className="ml-4 border border-dashed border-gray-600 placeholder-gray-200 bg-gray-600"
                />
                <p className="font-semibold mr-2 flex gap-2 items-center">
                  Spot Instances
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="15px"
                    height="15px"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <g clipPath="url(#clip0_429_11160)">
                      <circle
                        cx="12"
                        cy="11.9999"
                        r="9"
                        stroke="#fff"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <rect
                        x="12"
                        y="8"
                        width="0.01"
                        height="0.01"
                        stroke="#fff"
                        strokeWidth="3.75"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 12V16"
                        stroke="#fff"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_429_11160">
                        <rect width="24" height="24" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                  </p>
                  </div>
              </div>
            </div>
            <div className="flex flex-col mt-5 md:mt-0 md:justify-start md:items-end gap-2 md:w-1/2 ">
              <div className="flex flex-col gap-1 bg-gray-600 min-w-[380px] rounded-[6px] py-6 px-8">
                <h3 className="dark:text-white text-2xl font-semibold">Summary</h3>
                <div className="flex flex-col gap-1 dark:text-white mt-4">
                  <div className="flex">
                    <p className="w-1/2">VM Size</p>
                    <p className="w-1/2">
                      {selectedVm ? selectedVm.name : "--"}
                    </p>
                  </div>
                  <div className="flex">
                    <p className="w-1/2">vCPUs</p>
                    <p className="w-1/2">{selectedVm ? selectedVm.vCPUs : "--"}</p>
                  </div>
                  <div className="flex">
                    <p className="w-1/2">RAM (GiB)</p>
                    <p className="w-1/2">{selectedVm ? selectedVm.MemoryGB : "--"}</p>
                  </div>
                  <div className="flex">
                    <p className="w-1/2">Data disks</p>
                    <p className="w-1/2">{selectedVm ? selectedVm.MaxDataDiskCount : "--"}</p>
                  </div>
                  <div className="flex">
                    <p className="w-1/2">Max IOPS</p>
                    <p className="w-1/2">{selectedVm ? selectedVm.UncachedDiskIOPS : "--"}</p>
                  </div>
                  <div className="flex">
                    <p className="w-1/2">Premium disk</p>
                    <p className="w-1/2">{selectedVm ? (selectedVm.PremiumIO?"Supported":"Not Supported") :  "--"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full mt-5 border-gray-100  border-t-2">
          <button
            type="submit"
            className="flex w-fit mt-5 dark:text-white bg-[#473f7b] focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          >
            Create Compute
            </button>
            </div>
        </form>
      </div>
    </>
  );
};

export default withAuth(WorkspaceDetail);
