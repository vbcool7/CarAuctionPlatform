
import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

const DASHBOARD_BY_ROLE = {
    buyer: '/buyer-dashboard',
    seller: '/seller-dashboard',
};

// Sirf allowedRole wale logged-in user ko andar jaane deta hai.
// Logged-out -> /login, galat role -> uska apna dashboard (unknown role -> /).
function RoleRoute({ allowedRole }) {
    const token = useAuthStore((s) => s.token);
    const user = useAuthStore((s) => s.user);

    if (!token || !user) return <Navigate to="/login" replace />;

    if (user.role !== allowedRole) {
        return <Navigate to={DASHBOARD_BY_ROLE[user.role] || '/'} replace />;
    }

    return <Outlet />;
}

export default RoleRoute;