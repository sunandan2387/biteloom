
import { Modal } from "flowbite-react";
import { RxCross1 } from "react-icons/rx";
import EditCredentialsForm from "../credentials/EditCredentialsForm";

const EditWorkspaceModal = (props) => {
    console.log(props)
    return (
        <>
            <Modal className="border bg-black bg-opacity-80 " show={props.openEditModal}>
                <div onClick={() => props.setOpenEditModal(false)} className="absolute cursor-pointer duration-300 hover:scale-110 hover:rotate-90 right-3 top-3">
                    <RxCross1 className="dark:text-white" size={22} />
                </div>
                <Modal.Body className="">
                    <EditCredentialsForm getWorkspace={props.getWorkspace} setOpenEditModal={props.setOpenEditModal} editData={props.editData} />
                </Modal.Body>
            </Modal>
        </>
    )
}

export default EditWorkspaceModal

