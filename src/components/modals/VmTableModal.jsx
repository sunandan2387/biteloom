import React, { useState } from 'react';
import { Modal } from "flowbite-react";
import { RxCross1 } from "react-icons/rx";
import { toast } from 'react-toastify';

export default function VmTableModal(props) {
    const [selectedRow, setSelectedRow] = useState(null);
    const [globalSearch, setGlobalSearch] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    const handleRowClick = (row) => {
        setSelectedRow(row);
    };

    const handleSubmit = () => {
        if (selectedRow) {
            props.setSelectedVm(selectedRow)
            props.setOpenVmModal(false)
        } else {
            toast.error("Please select a row first")
        }
    };

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const filteredData = props.vmList?.filter((row) => {
        const rowValues = [
            row.name,
            row.vCPUs,
            row.MemoryGB,
            row.MaxDataDiskCount,
            row.UncachedDiskIOPS,
            row.PremiumIO,
        ]
            .join(' ')
            .toLowerCase();
        return rowValues.includes(globalSearch.toLowerCase());
    });

    const sortedData = sortConfig.key
        ? [...filteredData].sort((a, b) => {
            const valA = a[sortConfig.key];
            const valB = b[sortConfig.key];

            if (typeof valA === 'string') {
                return sortConfig.direction === 'asc'
                    ? valA.localeCompare(valB)
                    : valB.localeCompare(valA);
            }

            if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
            if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        })
        : filteredData;

    const sortIcon = (key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === 'asc' ? '▲' : '▼';
        }
        return '↕';
    };

    return (
        <Modal size='7xl' className="border" show={props.openVmModal}>
            <div
                onClick={() => props.setOpenVmModal(false)}
                className="absolute cursor-pointer duration-300 hover:scale-110 hover:rotate-90 right-3 top-3"
            >
                <RxCross1 className="text-black" size={22} />
            </div>
            <Modal.Body className="pt-10">
                <div className="p-5 text-black">
                    <div className="mb-[10px] w-fit md:w-[400px]">
                        <input
                            type="text"
                            placeholder="Global Search"
                            value={globalSearch}
                            onChange={(e) => setGlobalSearch(e.target.value)}
                            className="w-full p-2 bg-white text-black border border-gray-300"
                        />
                    </div>
                    <div className='overflow-y-auto max-h-[600px]'>
                        <table className="w-full mb-[10px] bg-white text-black border border-gray-300">
                            <thead>
                                <tr>
                                    <TableHeader label="VM Size" onClick={() => handleSort('name')} sortIcon={sortIcon('name')} />
                                    <TableHeader label="vCPUs" onClick={() => handleSort('vCPUs')} sortIcon={sortIcon('vCPUs')} />
                                    <TableHeader label="RAM (GiB)" onClick={() => handleSort('MemoryGB')} sortIcon={sortIcon('MemoryGB')} />
                                    <TableHeader label="Data disks" onClick={() => handleSort('MaxDataDiskCount')} sortIcon={sortIcon('MaxDataDiskCount')} />
                                    <TableHeader label="Max IOPS" onClick={() => handleSort('UncachedDiskIOPS')} sortIcon={sortIcon('UncachedDiskIOPS')} />
                                    <TableHeader label="Premium disk" onClick={() => handleSort('PremiumIO')} sortIcon={sortIcon('PremiumIO')} />
                                </tr>
                            </thead>
                            <tbody>
                                {!sortedData || sortedData.length <= 0 ? (
                                    <tr><td colSpan="6" className="text-center p-4">Loading...</td></tr>
                                ) : (
                                    sortedData.map((row, index) => (
                                        <tr
                                            key={index}
                                            onClick={() => handleRowClick(row)}
                                            className={`border border-gray-300 cursor-pointer ${selectedRow === row ? 'bg-blue-100 font-semibold' : 'bg-white'
                                                }`}
                                        >
                                            <td className="p-2">{row.name}</td>
                                            <td className="p-2">{row.vCPUs}</td>
                                            <td className="p-2">{row.MemoryGB}</td>
                                            <td className="p-2">{row.MaxDataDiskCount}</td>
                                            <td className="p-2">{row.UncachedDiskIOPS}</td>
                                            <td className="p-2">{row.PremiumIO ? 'Supported' : 'Not supported'}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-between items-center mt-4">
                        <div>Rows: {sortedData?.length ?? 0}</div>
                        <button
                            onClick={handleSubmit}
                            className="py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded"
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
}

function TableHeader({ label, onClick, sortIcon }) {
    return (
        <th
            onClick={onClick}
            style={{
                border: '1px solid #ccc',
                padding: '8px',
                backgroundColor: '#f0f0f0',
                cursor: onClick ? 'pointer' : 'default',
                textAlign: 'left',
            }}
        >
            {label}
            {sortIcon && <span style={{ marginLeft: '6px' }}>{sortIcon}</span>}
        </th>
    );
}
