import TopNavbar from '../../components/TopNavbar';
import BecasReservation from '../../components/global/BecasReservation';
import FooterProfessionals from "../../components/global/FooterProfessionals.jsx";
import ButtonTutorial from '../../components/global/ButtonTutorial.jsx';
const Becas = () => {

  return (
    <>
      <TopNavbar />
      <BecasReservation />
      <ButtonTutorial role="student"/>
      <FooterProfessionals />
    </>
  );
};


export default Becas;