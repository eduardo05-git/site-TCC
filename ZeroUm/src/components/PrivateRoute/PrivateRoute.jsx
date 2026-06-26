import { Navigate } from 'react-router-dom';

function PrivateRoute({ children, role }) {
    const userRaw = localStorage.getItem('user');
    if (!userRaw) return <Navigate to="/welcome" replace />;

    if (role) {
        const user = JSON.parse(userRaw);
        if (user.nivelAcesso !== role) return <Navigate to="/welcome" replace />;
    }

    return children;
}

export default PrivateRoute;
