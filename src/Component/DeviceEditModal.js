import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import '../CSS/EditModal.css';

function EditModal({data, show, close}) {

    const [visible, setVisible] = useState(false);
    const [rowData, setRowData] = useState(null);
    
    const [idx , setIdx] = useState(-1);

    const IsUsedRef = useRef(null);
    const NickRef = useRef(null);

    // 폼 제출 핸들러
    const handleSubmit = (e) => {
        e.preventDefault(); // 기본 제출 동작 방지 (페이지 리로드 방지)
        let changedIdx = idx;
        let param = { 
            "mac" : rowData.mac, 
            "isUsed" : IsUsedRef.current.checked, 
            "nick" : NickRef.current.value
        };
        console.log(JSON.stringify(param));
        axios.put('http://localhost:5000/device',param)
        .then((result) => {
            console.log(`chk put result ${result}`);
        }).catch((error) => {
            console.error(error);
        });
        console.log(changedIdx);

        handleClose(true);
    };

    const handleClose = (reload) => {
        close(reload);
        setIdx(-1);
        setVisible(false);
    }
    useEffect(() => {
        if(data !== null) {
            console.log(JSON.stringify(data));
            setRowData(data);
            setIdx(data.Idx);
        }
        setVisible(show);
    }, [show]);
    
/*

{"Idx":1,"mac":"60:3e:5f:4d:23:11","IsUsed":0,"Nick":null}
*/


    return (
        <>
            <Modal show={visible} onHide={() => handleClose(false)}>
                <Modal.Header closeButton>
                <Modal.Title>Edit Modal</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                    <Form>
                        <Form.Group className="d-flex align-items-center mb-3">
                            <Form.Label className="Edit-Modal-Label">Device name</Form.Label>
                            <Form.Control 
                                name="macInput" type="text" defaultValue={''}
                                value={rowData === null ? '' : rowData.mac} disabled/>
                        </Form.Group>
                        <Form.Group className="d-flex align-items-center mb-3">
                            <Form.Label className="Edit-Modal-Label">Usage</Form.Label>
                            <Form.Check 
                                name="IsUsedInput" type="checkbox" 
                                defaultChecked={rowData === null ? false : rowData.IsUsed === 1} 
                                ref={IsUsedRef}
                                />
                        </Form.Group>
                        <Form.Group className="d-flex align-items-center mb-3">
                            <Form.Label className="Edit-Modal-Label">Nick</Form.Label>
                            <Form.Control 
                                name="NickInput" type="text" 
                                defaultValue={rowData === null ? '' : rowData.Nick} 
                                ref={NickRef}
                                />
                        </Form.Group>
                        
                    </Form>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={() => handleClose(false)}>
                    Close
                </Button>
                <Button variant="primary" type="submit" onClick={handleSubmit}>
                    Save Changes
                </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default EditModal;