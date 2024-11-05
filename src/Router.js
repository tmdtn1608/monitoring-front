import React, { useEffect, useState, createContext } from 'react';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import License from './Component/License';
import Device from './Component/Device';
import Process from './Component/Process';
import RealTime from './Component/RealTime';

function Router() {

    return (
        <BrowserRouter>
            <Routes>
                <Route exact path='/' element={<License />} />
                <Route path='/license' element={<License />} />
                <Route path='/device' element={<Device />} />
                <Route path='/realtime' element={<RealTime />} />
                <Route path='/process' element={<Process />} />
            </Routes>
        </BrowserRouter>
    );
}
export default Router;