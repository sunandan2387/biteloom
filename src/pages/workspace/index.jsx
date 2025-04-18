"use client";

import React, { useEffect, useState } from "react";
import Header from "@/components/header/Header";
import { WorkspaceModal } from "@/components/modals/WorkspaceModal";
import { SideNav } from "@/components/sidebar/SideNav";
import { ToastContainer } from "react-toastify";
import { IoAdd } from "react-icons/io5";
import axios from "axios";
import Link from "next/link";
import { MdEdit } from "react-icons/md";
import { useAuth } from "@/context/SessionProvider";
import withAuth from "@/hoc/withAuth";
import EditWorkspaceModal from "@/components/modals/EditWorkspaceModal";

const Workspace = () => {
  const [openModal, setOpenModal] = useState(false);
  const [workspaces, setWorkspaces] = useState([]);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [bearerToken, setBearerToken] = useState();
  const [editData, setEditData] = useState();

  const { user, loading, logout } = useAuth();

  useEffect(() => {
    getWorkspace();
  }, [bearerToken]);

  useEffect(() => {
    setBearerToken(localStorage.getItem("authToken"));
  }, [user]);

  const editClicked = (e, workspaceData) => {
    e.preventDefault();
    e.stopPropagation();
    setEditData(workspaceData);
    setOpenEditModal(true);
  };

  const getWorkspace = async () => {
    if (bearerToken) {
      axios
        .get("https://sage.techfinna.com/techfinna/curd-workspace", {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${bearerToken}`,
          },
        })
        .then((response) => {
          setWorkspaces(response.data.data);
        })
        .catch((error) => {
          console.error("Error fetching workspace:", error);
        });
    }
  };

  return (
<div className="min-h-screen bg-white text-gray-900 flex flex-col items-center p-6 w-full">
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

  <WorkspaceModal
    openModal={openModal}
    setOpenModal={setOpenModal}
    partnerId={user && user.id}
    getWorkspace={getWorkspace}
  />

  <EditWorkspaceModal
    openEditModal={openEditModal}
    setOpenEditModal={setOpenEditModal}
    getWorkspace={getWorkspace}
    editData={editData}
  />

  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 p-3 md:p-6 w-full">
    {/* Add New Workspace Card */}
    <div
      onClick={() => setOpenModal(true)}
      className="border border-dashed border-gray-300 p-6 rounded-lg bg-gray-100 cursor-pointer hover:scale-105 duration-200 group shadow-md flex items-center justify-center sm:h-[200px] w-full h-48"
    >
      <IoAdd
        className="text-gray-400 group-hover:bg-gray-200 group-hover:text-gray-800 duration-200 ease-in-out rounded-full"
        size={60}
      />
    </div>

    {/* Existing Workspaces */}
    {workspaces &&
      workspaces.map((workspaceData, index) => (
        <Link
          key={index}
          href={{
            pathname: `/workspace/${workspaceData.name}`,
            query: { id: workspaceData.id },
          }}
        >
          <div className="border border-dashed relative border-gray-300 z-10 p-6 rounded-lg bg-gray-100 flex flex-col justify-between group shadow-md cursor-pointer hover:scale-105 duration-200 sm:h-[200px] w-full h-48">
            <MdEdit
              onClick={(e) => editClicked(e, workspaceData)}
              size={"20px"}
              className="hover:scale-110 absolute top-2 right-2 duration-150 text-gray-600"
            />
            <span className="text-2xl font-bold first-letter:uppercase text-center text-gray-800 mb-3">
              {workspaceData.name}
            </span>
            <span className="text-sm text-center text-gray-600">
              Created on:{" "}
              {new Date(workspaceData.created_at).toLocaleDateString()}
            </span>
          </div>
        </Link>
      ))}
  </div>
</div>

  );
};

export default withAuth(Workspace);
