import { Navigate, Outlet } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

function PrivateRoutes() {
    let [usuario, setUsuario] = useState(null);
    const auth = getAuth();

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUsuario(<Outlet/>);
            } else {
                setUsuario(<Navigate to="/" />);
            }
        })
    }, []);

    return (
       usuario
    )
}

export default PrivateRoutes;
