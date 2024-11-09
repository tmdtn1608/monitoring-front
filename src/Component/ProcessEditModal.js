import React, { useEffect, useState, createContext } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import '../CSS/EditModal.css';

function EditModal({data, show, close}) {

    const [visible, setVisible] = useState(false);
    const [rowData, setRowData] = useState(null);
    // TODO : form입력값
    const [formData, setFormData] = useState({
        MemoInput: '',
        BlackInput: false,
        AutoInput: false,
    });

    // 텍스트와 체크박스 값 변경 핸들러
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevData) => ({
        ...prevData,
        [name]: type === 'checkbox' ? checked : value,
        }));
    };

    // 폼 제출 핸들러
    const handleSubmit = (e) => {
        e.preventDefault(); // 기본 제출 동작 방지 (페이지 리로드 방지)
        console.log(formData); // 폼 데이터 출력
    };

    const handleClose = () => {
        close()
        setVisible(false)
    }
    useEffect(() => {
        console.log(JSON.stringify(data));
        setRowData(data);
        setVisible(show)
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
            <Modal show={visible} onHide={handleClose}>
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
                            <Form.Label className="Edit-Modal-Label">Black</Form.Label>
                            <Form.Check 
                                name="BlackInput" type="checkbox" defaultChecked={false}
                                checked={rowData === null ? false : rowData.IsBlack === 1}/>
                        </Form.Group>
                        <Form.Group className="d-flex align-items-center mb-3">
                            <Form.Label className="Edit-Modal-Label">Auto</Form.Label>
                            <Form.Check 
                                name="AutoInput" type="checkbox" defaultChecked={false}
                                value={rowData === null ? false : rowData.IsAuto === 1}/>
                        </Form.Group>
                        <Form.Group className="d-flex align-items-center mb-3">
                            <Form.Label className="Edit-Modal-Label">Memo</Form.Label>
                            <Form.Control 
                                name="MemoInput" type="text" defaultValue={''}
                                value={rowData === null ? '' : rowData.Memo}/>
                        </Form.Group>
                        
                    </Form>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" type="submit" onClick={handleClose}>
                    Save Changes
                </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default EditModal;