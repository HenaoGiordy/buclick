import { Link } from 'react-router-dom';
import LogoUnivalleLight from '../../assets/logo_univalle_light.svg';
import '../../styles/TopNavbar.css';
import LogoBienestar from '../../assets/logo_bienestar.svg';

export default function TopNavbar(props) {
  const session = props.session ? 'session' : 'top-navbar';

  return (
    <header 
    id="univalle-logo-header" 
    className={session}
    style={{
      backgroundColor: '#C20E1A',
      width: '100vw', // Asegurarte de que ocupe toda la ventana
      height: '90px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      margin: 0,
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 1000,
      boxSizing: 'border-box',
      overflowX: 'hidden', // Ocultar posibles scrolls horizontales
    }}
  >
    <Link to="/" style={{ marginRight: 'auto' }}>
      <img 
        src={LogoUnivalleLight} 
        alt="Logo Universidad del Valle" 
        style={{ height: '60px' }} 
      />
    </Link>
    
    {/* <div style={{ marginLeft: 'auto' }}>
      <img 
        src={LogoBienestar} 
        alt="Logo Bienestar" 
        style={{ height: '90px', marginRight: 0 }} 
      />
    </div> */}
  </header>
  
  );
}