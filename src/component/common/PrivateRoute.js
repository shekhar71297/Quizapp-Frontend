import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const navigate = useNavigate();
    const accessToken = sessionStorage.getItem("accessToken");
    const role = sessionStorage.getItem("role");

    useEffect(() => {
        if (!accessToken) {
            // If access token is not present, redirect to login page
            navigate('/');
        } else if (["teacher", "counsellor"].includes(role)) {
            // If user role is one of the restricted roles
            // Restrict access to certain modules, redirect to homepage
            // Here, you can check for specific routes and redirect accordingly
            const restrictedRoutes = ["/dashboard/user", "/dashboard/staff"];
            if (restrictedRoutes.includes(window.location.pathname)) {
                navigate('/');
            }

        } else if (["student", "intern"].includes(role)) {
            // If user role is one of the restricted roles
            // Restrict access to certain modules, redirect to homepage
            // Here, you can check for specific routes and redirect accordingly
            const restrictedRoutes = ["/dashboard/user", "/dashboard/staff", "/dashboard/exam", "/dashboard/voucher", "/dashboard/result", "/dashboard/question", "/dashboard/feedback"];
            if (restrictedRoutes.includes(window.location.pathname)) {
                navigate('/');
            }

        }
    }, [accessToken, role, navigate]);

    return <>{children}</>;
};

export default PrivateRoute;
