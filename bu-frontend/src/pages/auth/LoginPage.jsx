import React, { Fragment, useState, useEffect } from "react";
import { Card, Input, Button, message } from "antd";
import {
  UserOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "../../styles/background.css";
import Header from "../../components/auth/Header";
import api from "../../api";
import { ACCESS_TOKEN } from "../../constants";
import "../../styles/HomePage.css";
import FooterProfessionals from "../../components/global/FooterProfessionals.jsx";
import LogoBienestar from "../../assets/logo_bienestar.svg";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.clear();
  }, []);

  const roleToRouteMap = {
    ADMINISTRADOR: "/admin/usuarios",
    MONITOR: "/monitor/becas",
    ESTUDIANTE: "/estudiante/citas",
    PSICOLOGO: "/psicologo/cita",
    ENFERMERO: "/enfermeria/citas",
    ODONTOLOGO: "/odontologia/citas",
    FUNCIONARIO: "/funcionario/citas",
  };

  const manejarClick = (e) => {
    e.preventDefault();
    navigate("/reestablecercontrasena");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/auth/login", { username, password });
      
      if (response.data && response.data.token) {
        const token = response.data.token;
        const userResponse = response.data.userResponse;
        const roles = userResponse.roles.map((role) => role.name);

       

        // Guardar token y datos en localStorage
        localStorage.setItem(ACCESS_TOKEN, token);
        localStorage.setItem("username", username);
        localStorage.setItem("userId", userResponse.id);
        localStorage.setItem("userName", userResponse.name);
        localStorage.setItem("userEmail", userResponse.email);
        localStorage.setItem("userPlan", userResponse.plan);
        localStorage.setItem("userEPS", userResponse.eps);
        localStorage.setItem("userPhone", userResponse.phone);
        localStorage.setItem("userSemester", userResponse.semester);
        localStorage.setItem("lastName", userResponse.lastName);

        // Redireccionar basado en el rol
        const userRole = roles.includes("MONITOR") ? "MONITOR" : roles[0];
        localStorage.setItem("userRole", userRole);
        const route = roleToRouteMap[userRole];

        if (route) {
          navigate(route);
        } else {
          message.error(
            "No se encontró una ruta correspondiente al rol del usuario"
          );
        }
      } else {
        throw new Error("Token no recibido");
      }
    } catch (error) {
      console.error("Error durante el inicio de sesión:", error);

      if (error.response?.status === 400) {
        message.error("Usuario o contraseña incorrectos.");
      } else {
        const errorMessage =
          error.response?.data?.message ||
          "Error en el inicio de sesión. Por favor, intente de nuevo.";
        message.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = username !== "" && password !== "";

  return (
    <Fragment>
      <Header />

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#F5F5F5",
        }}
      >
        <Card
          hoverable
          title={
            <div
              style={{
                display: "flex",
                flexDirection: "column", // Cambiar a columna para apilar el logo y el título
                justifyContent: "center",
                alignItems: "center",
                padding: "5px 0", // Reducir el padding superior e inferior
              }}
            >
              {/* Imagen del logo */}
              <img
                src={LogoBienestar}
                alt="Logo Universidad del Valle"
                style={{
                  height: "90px",
                  marginBottom: "0px", // Espacio entre el logo y el título
                }}
              />

              {/* Título BUclick */}
              <h1
                className="welcome-title"
                style={{ margin: 0, textAlign: "center" }}
              >
                BUclick
              </h1>
            </div>
          }
          style={{
            width: 401,
            height: "auto",
            boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
          }}
        >
          <form onSubmit={handleLogin}>
            <Input
              placeholder="Código/cédula"
              prefix={<UserOutlined />}
              style={{ height: 33, width: "100%", marginBottom: 20 }}
              value={username}
              onChange={(e) => setUsername(e.target.value.replace(/\s/g, ""))}
            />

            <Input.Password
              placeholder="Contraseña"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              style={{ height: 33, width: "100%", marginBottom: 20 }}
              value={password}
              onChange={(e) => setPassword(e.target.value.replace(/\s/g, ""))}
            />

            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              disabled={!isFormValid}
              style={{
                width: "100%",
                height: 33,
                backgroundColor: isFormValid ? "#C20E1A" : "#D64545",
                borderColor: isFormValid ? "#C20E1A" : "#D64545",
              }}
            >
              Iniciar sesión
            </Button>

            <div style={{ textAlign: "center", marginTop: 16 }}>
              <a onClick={manejarClick} style={{ color: "#C20E1A" }}>
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          </form>
        </Card>
      </div>
      <FooterProfessionals />
    </Fragment>
  );
}
