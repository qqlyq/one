import React from "react";
import { Navigate } from "react-router-dom";
import { AuthContext} from "./context/AuthContext";

const ProtectedRoute = ({ children }) => {
    const { auth } = React.useContext(AuthContext);

    if (!auth.isLoggedIn) {
        return <Navigate to="/login" />;
    }

    return children;
}

export default ProtectedRoute;
