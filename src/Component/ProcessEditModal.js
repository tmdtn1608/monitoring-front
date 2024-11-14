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

    const DeviceRef = useRef(null);
    const BlackRef = useRef(null);
    const AutoRef = useRef(null);
    const MemoRef = useRef(null);

/* 
processName -> rowData.ProcessName
IsBlack
IsAuto
Memo
*/
    // 폼 제출 핸들러
    const handleSubmit = (e) => {
        e.preventDefault(); // 기본 제출 동작 방지 (페이지 리로드 방지)
        let changedIdx = idx;
        let param = {
            "processName" : rowData.ProcessName,
            "device" : DeviceRef.current.value,
            "IsBlack" : BlackRef.current.checked,
            "IsAuto" : AutoRef.current.checked,
            "Memo" : MemoRef.current.value
        };
        console.log(JSON.stringify(param));
        axios.put('http://localhost:5000/process',param)
        .then((res) => {
            console.log(`put result : ${res}`);
        }).catch((error) => {
            console.error(error);
        })
        
        console.log(changedIdx);
        
        handleClose(true);
    };

    const handleClose = (reload) => {
        close(reload);
        setIdx(-1);
        setVisible(false);
    }
    useEffect(() => {
        console.log(JSON.stringify(data));
        if(data !== null) {
            setRowData(data);
            setIdx(data.Idx);
        }
        console.log(`idx chk : ${idx}`);
        setVisible(show);
    }, [show]);
    
/*

{"Idx":1,"ProcessName":"abc",
"IsBlack":1,
"RegDate":"2024-11-05T10:25:06.000Z",
"IsAuto":0,
"Memo":""}
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
                            <Form.Label className="Edit-Modal-Label">Process name</Form.Label>
                            <Form.Control 
                                name="processInput" type="text" defaultValue={''} 
                                value={rowData === null ? '' : rowData.ProcessName} disabled/>
                        </Form.Group>
                        <Form.Group className="d-flex align-items-center mb-3">
                            <Form.Label className="Edit-Modal-Label">Device</Form.Label>
                            <Form.Control 
                                name="DeviceInput" type="text" ref={DeviceRef}
                                defaultValue={rowData === null ? '' : rowData.Device} />
                        </Form.Group>
                        <Form.Group className="d-flex align-items-center mb-3">
                            <Form.Label className="Edit-Modal-Label">Black</Form.Label>
                            <Form.Check 
                                name="BlackInput" type="checkbox" ref={BlackRef}
                                defaultChecked={rowData === null ? false : rowData.IsBlack === 1} />
                        </Form.Group>
                        <Form.Group className="d-flex align-items-center mb-3">
                            <Form.Label className="Edit-Modal-Label">Auto</Form.Label>
                            <Form.Check 
                                name="AutoInput" type="checkbox" ref={AutoRef}
                                defaultChecked={rowData === null ? false : rowData.IsAuto === 1} />
                        </Form.Group>
                        <Form.Group className="d-flex align-items-center mb-3">
                            <Form.Label className="Edit-Modal-Label">Memo</Form.Label>
                            <Form.Control 
                                name="MemoInput" type="text" ref={MemoRef}
                                defaultValue={rowData === null ? '' : rowData.Memo} />
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