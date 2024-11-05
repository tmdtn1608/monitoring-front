import React, { useEffect, useState, createContext } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function AddModal({show, close}) {

    const [visible, setVisible] = useState(false);
    const handleClose = () => {
        close()
        setVisible(false)
    }
    useEffect(() => {
        setVisible(show)
    }, [show]);
    
    return (
        <>
            <Modal show={visible} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Add Modal</Modal.Title>
                </Modal.Header>
                <Modal.Body>Woohoo, you are reading this text in a modal!</Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleClose}>
                    Save Changes
                </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default AddModal;