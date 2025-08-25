import { useNavigate } from 'react-router-dom';
import HeaderAdmin from '../../components/admin/HeaderAdmin';
import AppointmentMenu from '../../components/global/AppointmentMenu';
import psicologiaImage from '../../assets/psicologia.jpg';
import enfermeriaImage from '../../assets/enfermeria.png';
import odontologiaImage from '../../assets/odontologia.jpg';
import FooterProfessionals from "../../components/global/FooterProfessionals.jsx";

const AppointmentsAdmin = () => {
  const navigate = useNavigate(); // Inicializa el hook useNavigate

  // Función para manejar el clic
  const handleNavigation = (path) => {
    navigate(path); // Cambia la ruta
  };

  return (
    <>
      <HeaderAdmin />

      {/* Contenido principal */}
      <main className="citas-section" style={{ marginTop: '100px', padding: '0 20px' }}>

        {/* Título principal */}
        <header>
          <h1 className="text-xl font-bold" style={{ color: '#C20E1A', textAlign: 'center' }}>
            Área de citas
          </h1>
        </header>

        {/* Sección de opciones de citas */}
        <section
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: '20px',
            marginTop: '20px',
            flexWrap: 'wrap'  // Permitir que las tarjetas se envuelvan
          }}
        >

          {/* Opción 1: Psicología */}
          <article
            style={{ width: 'calc(33.33% - 20px)', minWidth: '300px' }}
            onClick={() => handleNavigation('/admin/psicologiaAdmin')} // Manejo de clic para redirigir
          >
            <AppointmentMenu
              image={psicologiaImage}
              title="Psicología"
              style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                width: '100%', // Ajusta el ancho al contenedor
                marginBottom: '20px',
                cursor: 'pointer', // Cambia el cursor a pointer para indicar clic
              }}
            />
          </article>

          {/* Opción 2: Enfermería - Médico general */}
          <article
            style={{ width: 'calc(33.33% - 20px)', minWidth: '300px' }}
            onClick={() => handleNavigation('/admin/enfermeriaAdmin')} // Manejo de clic para redirigir
          >
            <AppointmentMenu
              image={enfermeriaImage}
              title="Enfermería - Médico general"
              style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                width: '100%',
                marginBottom: '20px',
                cursor: 'pointer', // Cambia el cursor a pointer para indicar clic
              }}
            />
          </article>

          {/* Opción 3: Odontología */}
          <article
            style={{ width: 'calc(33.33% - 20px)', minWidth: '300px' }}
            onClick={() => handleNavigation('/admin/odontologiaAdmin')} // Manejo de clic para redirigir
          >
            <AppointmentMenu
              image={odontologiaImage}
              title="Odontología"
              style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                width: '100%',
                marginBottom: '20px',
                cursor: 'pointer', // Cambia el cursor a pointer para indicar clic
              }}
            />
          </article>

        </section>
      </main>
      <FooterProfessionals />
    </>
  );
};

export default AppointmentsAdmin;
