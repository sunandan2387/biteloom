import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Tooltip } from "flowbite-react";
import { BsInfoCircleFill } from "react-icons/bs";


const CredentialsForm = ({ props }) => {
  const [verifying, setVerifying] = useState(false);
  const [bearerToken, setBearerToken] = useState();
  const [formData, setFormData] = useState({
    name: "",
    client_id: "",
    client_secret: "",
    tenant_id: "",
    subscription_id: "",
    partner_id: props.partnerId
  });

  useEffect(() => {
    setBearerToken(localStorage.getItem('authToken'))
  },[])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setVerifying(true)
    axios.post('https://sage.techfinna.com/techfinna/curd-workspace', formData, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${bearerToken}`
      }
    })
      .then(response => {
        if (response.data.success === true) {
          console.log(response.data.status);
          props.getWorkspace()
          console.log(formData)
          toast.success(response.data.status)
        } else {
          console.log('Failed to create Workspace');
          console.log(response.data.status);
          if (response.data.status === 'invalid_client') {
            toast.error("Incorrect client secret")
          }else if (response.data.status === 'unauthorized_client') {
            toast.error("Incorrect client id")
          }else if (response.data.status === 'invalid_request') {
            toast.error("Incorrect tenant id")
          } else {
            toast.error("Unexpected error")
          }
        }
      })
      .catch(error => {
        console.error('Error creating workspace:', error);
      });
      setVerifying(false)
      props.setOpenModal(false)
  };

  return (
<div className="space-y-4 p-4 bg-white">
  <div>
    <h1 className="text-3xl text-gray-900 font-bold text-center">
      Please enter your Azure credentials
    </h1>
    <p className="text-gray-600 italic text-center">
      "Your credentials are encrypted."
    </p>
  </div>
  <div className="border border-gray-300"></div>
  <form onSubmit={handleSubmit}>
    <label className="block">
      <span className="text-gray-800 font-semibold">
        Workspace Name
      </span>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
        className="w-full mt-1 p-2 border border-gray-300 rounded-md text-gray-900 bg-white"
        placeholder="Workspace Name"
      />
    </label>

    <label className="block mt-3">
      <span className="text-gray-800 font-semibold">
        Client Id
      </span>
      <input
        type="text"
        name="client_id"
        value={formData.client_id}
        onChange={handleChange}
        required
        className="w-full mt-1 p-2 border border-gray-300 rounded-md text-gray-900 bg-white"
        placeholder="Client Id"
      />
    </label>

    <label className="block mt-3">
      <span className="text-gray-800 font-semibold">
        Client Secret
      </span>
      <input
        type="password"
        name="client_secret"
        value={formData.client_secret}
        onChange={handleChange}
        required
        className="w-full mt-1 p-2 border border-gray-300 rounded-md text-gray-900 bg-white"
        placeholder="****************"
      />
    </label>

    <label className="block mt-3">
      <span className="text-gray-800 font-semibold">
        Tenant Id
      </span>
      <input
        type="text"
        name="tenant_id"
        value={formData.tenant_id}
        onChange={handleChange}
        required
        className="w-full mt-1 p-2 border border-gray-300 rounded-md text-gray-900 bg-white"
        placeholder="Tenant Id"
      />
    </label>

    <label className="block mt-3">
      <span className="text-gray-800 font-semibold">
        Subscription Id
      </span>
      <input
        type="text"
        name="subscription_id"
        value={formData.subscription_id}
        onChange={handleChange}
        required
        className="w-full mt-1 p-2 border border-gray-300 rounded-md text-gray-900 bg-white"
        placeholder="Subscription Id"
      />
    </label>

    <button
      type="submit"
      className="w-full bg-[#473e7d] hover:bg-[#2f256a] duration-200 flex items-center gap-3 justify-center text-white py-2 rounded-md font-semibold mt-10"
    >
      {verifying && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="animate-spin"
          width={30}
          height={30}
          viewBox="0 0 64 64"
          id="loading"
        >
          <path
            fill="#fff"
            d="M50.287 32A18.287 18.287 0 1 1 32 13.713a1.5 1.5 0 1 1 0 3A15.287 15.287 0 1 0 47.287 32a1.5 1.5 0 0 1 3 0Z"
          ></path>
        </svg>
      )}
      {verifying ? "Verifying" : "Verify"}
    </button>
  </form>
</div>

  );
};

export default CredentialsForm;
