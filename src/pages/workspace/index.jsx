"use client";

import React, { useEffect } from "react";
import { useState } from "react";
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
  const [editData, setEditData] = useState()

  const { user, loading, logout } = useAuth();

  useEffect(() => {
    setBearerToken(localStorage.getItem('authToken'))
    getWorkspace()
  }, []);



  const editClicked = (e, workspaceData) => {
    e.preventDefault();
    e.stopPropagation();
    setEditData(workspaceData)
    setOpenEditModal(true)
  }

  const getWorkspace = async () => {
    axios.get('https://sage.techfinna.com/techfinna/curd-workspace', {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${bearerToken}`
      }
    })
      .then(response => {
        setWorkspaces(response.data.data)
      })
      .catch(error => {
        console.error('Error fetching workspace:', error);
      });
  };

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

      <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-5 p-6 ">
        <div
          onClick={() => setOpenModal(true)}
          className="border border-dashed border-gray-600 p-6 rounded-lg bg-gray-600 bg-opacity-20 cursor-pointer hover:scale-105 duration-200 group shadow-md  flex items-center justify-center w-[250px] h-[200px]"
        >
          <IoAdd
            className="opacity-30 group-hover:bg-black group-hover:text-white duration-200 ease-in-out rounded-full"
            size={60}
          />
        </div>

        {workspaces && workspaces.map((workspaceData, index) => (
          <Link
            key={index}
            href={{
              pathname: `/workspace/${workspaceData.name}`,
              query: { id: workspaceData.id }
            }}
          >
            <div className="border border-dashed relative border-gray-600 z-10 p-6 rounded-lg bg-gray-600 bg-opacity-20 flex flex-col justify-between group shadow-md cursor-pointer hover:scale-105 duration-200 w-[250px] h-[200px]">
              <MdEdit
                onClick={(e) => {
                  editClicked(e, workspaceData)
                }}
                size={'20px'}
                className="hover:scale-110 absolute top-2 right-2 duration-150"
              />
              <span className="text-2xl font-bold first-letter:uppercase text-center text-white mb-3">
                {workspaceData.name}
              </span>
              <span className="text-sm text-center text-gray-200">
                Created on: {new Date(workspaceData.created_at).toLocaleDateString()}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default withAuth(Workspace);
