import React,{useState} from "react";
import { MdDelete } from "react-icons/md";
import { MdCreateNewFolder } from "react-icons/md";
import axios from "axios";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import Swal from 'sweetalert2'
import Link from "next/link";

const search = ({ id }) => {
  const router = useRouter();

  const [isDeleting,setIsDeleting]=useState(false)

  const deleteWorkspace = async () => {
    Swal.fire({
      title: "Are you sure want to delete this workspace?",
      showDenyButton: true,
      confirmButtonText: "Delete",
      denyButtonText: `Cancel`
    }).then((result) => {
      if (result.isConfirmed) {
        setIsDeleting(true)
        axios.delete('https://sage.techfinna.com/techfinna/curd-workspace', {
          data: {
            workspace_id: id
          }
        })
            .then(response => {
              if (response.data.success === true) {
                toast.success('Workspace deleted')
                router.push("/workspace");
              } else {
                toast.warn(response.data.status)
              } 
            })
            .catch(error => {
              console.error('Error deleteing workspace:', error);
            });
      }
    }); 
  };

  return (
    <div className="w-full mx-auto flex gap-2 justify-start items-start border-b-2 border-gray-600 py-1.5 pb-4 my-4">
      <form className="min-w-[300px] ">
        <label
          htmlhtmlFor="default-search"
          className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
        >
          Search
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="search"
            id="default-search"
            className="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Filter compute ..."
          />
        </div>
      </form>
      <select className="block w-fit p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
        <option value="option1">Sort</option>
        <option value="option2">Sort 2</option>
      </select>
      <div className="ml-auto flex gap-5">
        <Link
          href={`${id}/new-compute`}
          className=" w-fit text-white flex items-center gap-2 bg-[#473f7b] focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 "
        >
          <MdCreateNewFolder size={'20px'} />
          Create New Compute
        </Link>
        <button onClick={()=>deleteWorkspace()} disabled={isDeleting} className=" disabled:cursor-not-allowed w-fit cursor-pointer flex items-center gap-2 text-white bg-[#E65B65] focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-1 text-center me-2 mb-2 ">
          {isDeleting ?
            <AiOutlineLoading3Quarters className="animate-spin" size={'20px'} />
            :
            <MdDelete size={'20px'} />
          }
          
          Delete Workspace
        </button>
      </div>
    </div>
  );
};

export default search;
