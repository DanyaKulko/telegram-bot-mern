import React from 'react';
import {useSelector} from "react-redux";
import {Navigate, Outlet} from "react-router-dom";

const ProtectedRoute = () => {
    const user = useSelector(state => state.userReducer);
    return (user.isLoggedIn) ? <Outlet /> : <Navigate to="/login" replace={true}/>;
};

export default ProtectedRoute