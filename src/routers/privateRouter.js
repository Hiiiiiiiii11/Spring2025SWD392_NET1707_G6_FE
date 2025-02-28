import { Navigate } from "react-router-dom";

const PrivateRoute = ({ element, allowedRoles }) => {
    const role = sessionStorage.getItem("role");

    if (!role) {
        return <Navigate to="/login" replace />;
    }

    if (!allowedRoles.includes(role)) {
        return <Navigate to="/" replace />;
    }

    return element;
};

export default PrivateRoute;
