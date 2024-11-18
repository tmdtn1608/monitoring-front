import React, { useEffect, useState, createContext } from 'react';
import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom';
import License from './Component/License';
import Device from './Component/Device';
import Process from './Component/Process';
import RealTime from './Component/RealTime';
import ErrorPage from './Component/Error';
import Log from './Component/Log';

function Router() {

    return (
        <BrowserRouter>
            <Routes>
                <Route exact path='/' element={<License />} />
                <Route path='/license' element={<License />} />
                <Route path='/device' element={<Device />} />
                <Route path='/realtime' element={<RealTime />} />
                <Route path='/process' element={<Process />} />
                <Route path='/log' element={<Log />} />
                <Route path="/error" element={<ErrorPage />} />
                {/* 잘못된 경로에 대한 처리 */}
                <Route path="*" element={<Navigate to="/error?redirectUrl=/&type=notfound" />} />
            </Routes>
        </BrowserRouter>
    );
}
export default Router;