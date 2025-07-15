import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { RootState } from '../../store';

const B2BProtectedRoute: React.FC = () => {
    const { currentUser } = useSelector((state: RootState) => state.auth);

    if (!currentUser) {
        return <Navigate to="/SignupPopup" replace />;
    }

    if (currentUser.role !== 'B2B' || currentUser.status !== 'APPROVED') {
        return <Navigate to="/" replace />;
    }
    return <Outlet />;
};

export default B2BProtectedRoute;