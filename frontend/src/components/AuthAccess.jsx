import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthentication } from '../auth';

function ProtectedRoute({children}) {
    const [isAUthorized] = useAuthentication();

    if (isAuthorized === null) {
        return <div>Loading... </div>
    }

    if (
        isAUthorized &&
        (windows.location.pathname === '/login' || window.location.pathname === '/register')
    ) {
        return <Navigate to='/' />;
    }

    return children;
}

export default ProtectedRoute;