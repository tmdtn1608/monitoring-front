import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import '../CSS/EditModal.css';


function TerminateModal({data, show, close}) {

    const [visible, setVisible] = useState(false);

    const [device, setDevice] = useState('');
    const [process, setProcess] = useState('');

    const handleClose = (reload) => {
        close(reload);
        setVisible(false);
    }

    const terminateProcess = () => {
        console.log(`Terminate : ${process} / ${device}`);
        // TODO : 웹소켓 접속 후 terminate 메시지 전송

        // 웹소켓 연결
        const ws = new WebSocket('ws://localhost:5000/ws');
    
        // 웹소켓이 열렸을 때
        ws.onopen = () => {
          console.log('Connected to the WebSocket server');
          ws.send('Hello Server!');  // 서버로 메시지 전송
          ws.close();
        };
    
        // 웹소켓이 닫혔을 때
        ws.onclose = () => {
          console.log('Disconnected from the WebSocket server');
        };
    
        // 웹소켓이 에러를 발생했을 때
        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
        };
    }
    /*

{device: '60:3e:5f:4d:23:11', 
row:{
    "pid": 0,
    "name": "kernel_task",
    "status": "running",
    "cpu_percent": null,
    "memory_percent": null
    }
}
    */
    useEffect(() => {
        console.log(data);
        setVisible(show);
        if(data !== null) {
            console.log(`${data.device} / ${data.row.name}`);
            setProcess(data.row.name);
            setDevice(data.device);
        }
    }, [show]);

    return (
        <Modal show={visible} onHide={() => handleClose(false)}>                <Modal.Header closeButton>
            <Modal.Title>Modal title</Modal.Title>
            </Modal.Header>
    
            <Modal.Body>
            <p>Are you sure you want to terminate this process?</p>
            <p>Device : {device}</p>
            <p>Process : {process}</p>
            <p></p>
            </Modal.Body>
    
            <Modal.Footer>
            <Button variant="secondary" onClick={() => handleClose(false)}>Close</Button>
            <Button variant="primary" onClick={terminateProcess}>Terminate</Button>
            </Modal.Footer>
        </Modal>
      );
}

export default TerminateModal;