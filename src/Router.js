import React, { useEffect, useState, createContext } from 'react';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import License from './Component/License';
import Device from './Component/Device';
import Process from './Component/Process';
import Header from './Header';

function Router() {

    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route exact path='/' element={<License />} />
                    <Route path='/device' element={<Device />} />
                    <Route path='/process' element={<Process />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}
export default Router;