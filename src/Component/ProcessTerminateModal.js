import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import '../CSS/EditModal.css';


function TerminateModal({data, show, close}) {

    const [visible, setVisible] = useState(false);
    const [ws, setWs] = useState(null);
    const [device, setDevice] = useState('');
    const [process, setProcess] = useState('');

    const handleClose = (reload) => {
        close(reload);
        setVisible(false);
    }

    const sendTerminate = (device, process) => {
        console.log("sendTerminate");
          let msg = {
            "from" : "web",
            "device" : device,
            "process" : process
          };
        ws.send(JSON.stringify(msg));
        // TODO : 히스토리 저장
    }

    const terminateProcess = () => {
        console.log(`Terminate : ${process} / ${device}`);
        sendTerminate(device, process);
        handleClose(true);
    }
    const handleWebSocketConnection = () => {
        const ws = new WebSocket('ws://localhost:5000/ws');
    
        // 웹소켓이 열렸을 때
        ws.onopen = () => {
          console.log('Connected to the WebSocket server');
        };
    
        // 웹소켓이 닫혔을 때
        ws.onclose = () => {
          console.log('Disconnected from the WebSocket server');
        };
    
        // 웹소켓이 에러를 발생했을 때
        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
        };
        setWs(ws);
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
        // if(data.device === '' || data.row === '') return;
        if(data !== null) {
            console.log(`${data.device} / ${data.row.name}`);
            if(data.device !== '' && data.row.name !== '') {
                setProcess(data.row.name);
                setDevice(data.device);
                handleWebSocketConnection();
            }
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