import "../styles/HomePage.css";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="background-image">
      <div className="welcome-box">
        <h1 className="welcome-title">Te damos la bienvenida</h1>
        <Link to="/login">
          <button className="welcome-button">BUclick</button>
        </Link>
        <p className="welcome-text">
        Con BUclick, gestiona tus becas de alimentación y reserva tus citas 
        en los servicios de bienestar. Bienestar en un solo click. ¡Todo en 
        un solo lugar para ahorrarte tiempo y estrés!
        </p>
      </div>
    </div>
  );
}
