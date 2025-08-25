import { useNavigate, useLocation } from 'react-router-dom';
import LogoUnivalleLight from '../../assets/logo_univalle_light.svg';
import '../../styles/TopNavbar.css';
import LogoutButton from '../auth/LogoutButton';
import React, { useState, useEffect } from 'react';
import { Drawer, Button } from 'antd';
import { MenuOutlined, CloseOutlined } from '@ant-design/icons'; 

export default function HeaderPsych(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false); // Controla si el drawer está visible
  const [isMobile, setIsMobile] = useState(false); // Controla si es un dispositivo móvil

  // Detectar el tamaño de la pantalla para saber si es móvil
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); 
    };

    handleResize(); // Ejecutar al cargar
    window.addEventListener('resize', handleResize); // Escuchar cambios de tamaño de pantalla

    return () => {
      window.removeEventListener('resize', handleResize); // Limpiar evento al desmontar componente
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

  // Función para manejar el clic en los botones y navegar
  const handleButtonClick = (path) => {
    navigate(path);
    closeDrawer(); // Cierra el drawer después de seleccionar una opción
  };

  return (
    <header
      id='univalle-logo-header'
      style={{
        backgroundColor: '#C20E1A',
        width: '100vw',
        height: '90px',
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1000,
      }}
    >
      <div style={{ marginRight: 'auto' }}>
        <img
          src={LogoUnivalleLight}
          alt="Logo Universidad del Valle"
          style={{ height: '60px' }}
        />
      </div>

      {isMobile ? (
        <>
          {/* Ícono del menú hamburguesa solo en dispositivos móviles */}
          <Button type="primary" onClick={drawerOpen ? closeDrawer : showDrawer} className="hamburger-menu-button">
            {drawerOpen ? <CloseOutlined style={{ fontSize: '24px', color: 'white' }} /> : <MenuOutlined style={{ fontSize: '24px', color: 'white' }} />}
          </Button>

          <Drawer
            title="Menú"
            placement="left" // Drawer desde la izquierda
            onClose={closeDrawer}
            open={drawerOpen} // Cambiado de "visible" a "open"
            styles={{ body: { paddingBottom: 80 } }} // Cambiado de "bodyStyle" a "styles.body"
          >
            <ul className="drawer-menu">
             
              <li onClick={() => handleButtonClick("/psicologo/cita")} className={location.pathname === "/psicologo/cita" ? "active" : ""}>Citas</li>
              <li onClick={() => handleButtonClick("/psicologo/horario")} className={location.pathname === "/psicologo/horario" ? "active" : ""}>Horarios</li>
              <li onClick={() => handleButtonClick("/psicologo/agenda")} className={location.pathname === "/psicologo/agenda" ? "active" : ""}>Agenda</li>
              <li onClick={() => handleButtonClick("/psicologo/seguimiento")} className={location.pathname === "/psicologo/seguimiento" ? "active" : ""}>Seguimiento</li>
              <li onClick={() => handleButtonClick("/psicologo/ajustes")} className={location.pathname === "/psicologo/ajustes" ? "active" : ""}>Ajustes</li>
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
          <nav className={`menu`}>
            <ul>

              <li onClick={() => handleButtonClick("/psicologo/cita")} className={location.pathname === "/psicologo/cita" ? "active" : ""}>Citas</li>
              <li onClick={() => handleButtonClick("/psicologo/horario")} className={location.pathname === "/psicologo/horario" ? "active" : ""}>Horarios</li>
              <li onClick={() => handleButtonClick("/psicologo/agenda")} className={location.pathname === "/psicologo/agenda" ? "active" : ""}>Agenda</li>
              <li onClick={() => handleButtonClick("/psicologo/seguimiento")} className={location.pathname === "/psicologo/seguimiento" ? "active" : ""}>Seguimiento</li>
              <li onClick={() => handleButtonClick("/psicologo/ajustes")} className={location.pathname === "/psicologo/ajustes" ? "active" : ""}>Ajustes</li>
            </ul>
          </nav>

          {/* Botón de Cerrar Sesión siempre visible en pantallas grandes */}
          <LogoutButton />
        </>
      )}
    </header>
  );
}
