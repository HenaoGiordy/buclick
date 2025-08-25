import { useNavigate, useLocation } from "react-router-dom";
import LogoUnivalleLight from "../../assets/logo_univalle_light.svg";
import "../../styles/TopNavbar.css";
import LogoutButton from "../auth/LogoutButton";
import React, { useState, useEffect } from "react";
import { Drawer, Button } from "antd";
import { MenuOutlined, CloseOutlined } from "@ant-design/icons"; 

export default function HeaderAdmin(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false); // Controla si el menú hamburguesa está abierto
  const [drawerOpen, setDrawerOpen] = useState(false); // Controla si el drawer está visible
  const [isMobile, setIsMobile] = useState(false); // Controla si es un dispositivo móvil

  // Detectar el tamaño de la pantalla
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); 
    };

    handleResize(); // Ejecutar al cargar
    window.addEventListener("resize", handleResize); // Escuchar cambios de tamaño de pantalla

    return () => {
      window.removeEventListener("resize", handleResize); // Limpiar evento al desmontar componente
    };
  }, []);

  // Función para abrir el drawer en móviles
  const showDrawer = () => {
    setDrawerOpen(true);
  };

  // Función para cerrar el drawer en móviles
  const closeDrawer = () => {
    setDrawerOpen(false);
  };

  // Función para manejar clic en los botones y navegar
  const handleButtonClick = (path) => {
    navigate(path);
    setMenuOpen(false); 
    closeDrawer();
  };

  return (
    <header id="univalle-logo-header">
      <div className="logo-container">
        <img
          src={LogoUnivalleLight}
          alt="Logo Universidad del Valle"
          className="logo"
        />
      </div>

      {isMobile ? (
        <>
          {/* Ícono del menú hamburguesa solo en dispositivos móviles */}
          <Button
            type="primary"
            onClick={drawerOpen ? closeDrawer : showDrawer}
            className="hamburger-menu-button"
          >
            {drawerOpen ? (
              <CloseOutlined style={{ fontSize: "24px", color: "white" }} />
            ) : (
              <MenuOutlined style={{ fontSize: "24px", color: "white" }} />
            )}
          </Button>

          <Drawer
            title="Menú"
            placement="left" // Drawer desde la izquierda
            onClose={closeDrawer}
            open={drawerOpen} 
            styles={{ body: { paddingBottom: 80 } }} 
          >
            <ul className="drawer-menu">
              <li
                onClick={() => handleButtonClick("/admin/usuarios")}
                className={location.pathname === "/admin/usuarios" ? "active" : ""}
              >
                Gestión de usuarios
              </li>
              <li
                onClick={() => handleButtonClick("/admin/informes")}
                className={location.pathname === "/admin/informes" ? "active" : ""}
              >
                Informes
              </li>
              <li
                onClick={() => handleButtonClick("/admin/menu")}
                className={location.pathname === "/admin/menu" ? "active" : ""}
              >
                Menú del día
              </li>
              
              <li
                onClick={() => handleButtonClick("/admin/reservas")}
                className={location.pathname === "/admin/reservas" ? "active" : ""}
              >
                Reservas
              </li>
              <li
                onClick={() => handleButtonClick("/admin/externos")}
                className={location.pathname === "/admin/externos" ? "active" : ""}
              >
                Externos
              </li>
              <li
                onClick={() => handleButtonClick("/admin/perfilAdmin")}
                className={location.pathname === "/admin/perfilAdmin" ? "active" : ""}
              >
                Ajustes
              </li>
            </ul>

            {/* Botón de cerrar sesión en la parte inferior del Drawer */}
            <div className="drawer-footer">
              <LogoutButton />
            </div>
          </Drawer>
        </>
      ) : (
        <>
          {/* Menú normal para pantallas grandes */}
          <nav className={`menu ${menuOpen ? "open" : ""}`}>
            <ul>
              <li
                onClick={() => handleButtonClick("/admin/usuarios")}
                className={location.pathname === "/admin/usuarios" ? "active" : ""}
              >
                Usuarios
              </li>
              <li
                onClick={() => handleButtonClick("/admin/informes")}
                className={location.pathname === "/admin/informes" ? "active" : ""}
              >
                Informes
              </li>
              <li
                onClick={() => handleButtonClick("/admin/menu")}
                className={location.pathname === "/admin/menu" ? "active" : ""}
              >
                Menú
              </li>
              
              <li
                onClick={() => handleButtonClick("/admin/reservas")}
                className={location.pathname === "/admin/reservas" ? "active" : ""}
              >
                Reservas
              </li>
              <li
                onClick={() => handleButtonClick("/admin/externos")}
                className={location.pathname === "/admin/externos" ? "active" : ""}
              >
                Externos
              </li>
              <li
                onClick={() => handleButtonClick("/admin/perfilAdmin")}
                className={location.pathname === "/admin/perfilAdmin" ? "active" : ""}
              >
                Ajustes
              </li>
            </ul>
          </nav>

          
          <div className="logout-container">
            <div className="logout-button">
              <LogoutButton />
            </div>
          </div>
        </>
      )}
    </header>
  );
}
