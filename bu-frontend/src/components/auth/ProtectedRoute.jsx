import React, { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import api from "../../api"; // Tu instancia de Axios
import { ACCESS_TOKEN } from "../../constants";
import { message } from "antd";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const [isAuthorized, setIsAuthorized] = useState(null); // Estado para autorización
  const [loading, setLoading] = useState(true); // Estado para mostrar loading
  const location = useLocation();
  const token = localStorage.getItem(ACCESS_TOKEN);
  const userRole = localStorage.getItem("userRole"); // Obtener el rol almacenado en localStorage

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setIsAuthorized(false);
        setLoading(false);
        return;
      }

      try {
        const response = await api.post("/auth/verify-token", { token });

        if (response.data && response.data.message === "Verified") {
          // Verificamos que el rol del usuario esté permitido para esta ruta
          if (allowedRoles.includes(userRole)) {
            setIsAuthorized(true);
          } else {
            setIsAuthorized(false);
          }
        } else {
          setIsAuthorized(false);
          message.error("Token no válido o expirado.");
        }
      } catch (error) {
        console.error("Error al verificar el token:", error);
        setIsAuthorized(false);
        message.error("Error al verificar el token.");
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token, allowedRoles, userRole]);

  if (loading) {
    return <div>Cargando...</div>; // Mostrar un indicador de carga
  }

  return isAuthorized ? children : <Navigate to="/login" state={{ from: location }} replace />;
};

export default ProtectedRoute;