import { Navigate } from "react-router-dom";
import { ReactNode, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

interface Props {
    children?: ReactNode
}

function RequireAuth({ children }: Props) {
    const { user, userData } = useContext( AuthContext );
    if (user == null || userData == null)
        return <Navigate to='/login' />;
    
    return children
}
export default RequireAuth