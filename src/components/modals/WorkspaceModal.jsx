
import { Modal } from "flowbite-react";
import CredentialsForm from "../credentials/CredentialsForm";
import { RxCross1 } from "react-icons/rx";

export function WorkspaceModal(props) {
     return (
        <>
            <Modal className="border bg-opacity-80 " show={props.openModal}>
                <div onClick={() => props.setOpenModal(false)} className="absolute cursor-pointer duration-300 hover:scale-110 hover:rotate-90 right-3 top-3">
                <RxCross1 className="dark:text-white" size={22}/>
                </div>
                <Modal.Body className="">
                    <CredentialsForm getWorkspace={props.getWorkspace} props={props} />
                </Modal.Body>
            </Modal>
        </>
    );
}
