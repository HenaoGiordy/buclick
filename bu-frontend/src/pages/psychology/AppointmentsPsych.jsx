import HeaderPsych from "../../components/psychology/HeaderPsych";
import { useNavigate } from 'react-router-dom';
import AppointmentMenu from '../../components/global/AppointmentMenu';
import FooterProfessionals from "../../components/global/FooterProfessionals.jsx";
import enfermeriaImage from '../../assets/enfermeria.png';
import odontologiaImage from '../../assets/odontologia.jpg';

const AppointmentsPsych = () => {
  const navigate = useNavigate(); // Inicializa el hook useNavigate

  // Función para manejar el clic
  const handleNavigation = (path) => {
    navigate(path); // Cambia la ruta
  };

  return (
    <>
      <HeaderPsych />
      
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
            justifyContent: 'center', 
            gap: '60px', 
            marginTop: '20px', 
            flexWrap: 'wrap'  // Permitir que las tarjetas se envuelvan
          }}
        >
          

          {/* Opción 2: Enfermería - Médico general */}
          <article 
            style={{ width: 'calc(33.33% - 20px)', minWidth: '300px' }} 
            onClick={() => handleNavigation('/psicologo/enfermeria')} // Manejo de clic para redirigir
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
            onClick={() => handleNavigation('/psicologo/odontologia')} // Manejo de clic para redirigir
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

export default AppointmentsPsych;