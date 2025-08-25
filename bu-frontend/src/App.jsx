import { Routes, Route } from "react-router-dom";
import RecoverPassword from "./pages/auth/RecoverPassword";
import ConfirmationPassword from "./pages/auth/ConfirmationPassword";
import HomePage from "./pages/HomePage";
import "antd/dist/reset.css";
import LoginPage from "./pages/auth/LoginPage";
import Becas from "./pages/student/Becas";
import Appointments from "./pages/student/Appointments";
import ManagementUsers from "./pages/admin/ManagementUsers";
import Informs from "./pages/admin/Informs";
import ViewInforms from "./pages/admin/ViewInforms";
import Menu from "./pages/admin/Menu";
import Reservations from "./pages/admin/Reservations";
import Settings from "./pages/student/Settings";
import Psychologist from "./pages/student/Psychologist";
import Nursing from "./pages/student/Nursing";
import Dentist from "./pages/student/Dentist";
import NursingAdmin from "./pages/admin/NursingAdmin";
import PsychologistAdmin from "./pages/admin/PsychologistAdmin";
import DentistAdmin from "./pages/admin/DentistAdmin";
import AppointmentsAdmin from "./pages/admin/AppointmentsAdmin";
import SettingsAdmin from "./pages/admin/SettingsAdmin";
import PasswordAdmin from "./pages/admin/PasswordAdmin";
import AppointmentsPsych from "./pages/psychology/AppointmentsPsych";
import SchedulesPsych from "./pages/psychology/SchedulesPsych";
import AgendaPsych from "./pages/psychology/AgendaPsych";
import PasswordPysch from "./pages/psychology/PasswordPysch";
import SettingPysch from "./pages/psychology/SettingPsych";
import Tracking from "./pages/psychology/Tracking";
import { MenuProvider } from "./utils/MenuContext"; // Importar el MenuProvider>
import { SettingsProvider } from "./utils/SettingsContext";
import AgendaNurse from "./pages/nurse/AgendaNurse";
import SettingNurse from "./pages/nurse/SettingNurse";
import AppointmentsNurse from "./pages/nurse/AppointmentsNurse";
import HistoryNurse from "./pages/nurse/HistoryNurse";
import InformNurse from "./pages/nurse/InformNurse";
import ViewNursingReport from "./pages/nurse/ViewInformsNurse";
import SchedulesNurse from "./pages/nurse/SchedulesNurse";
import VisitsNurse from "./pages/nurse/VisitsNurse";
import PasswordNurse from "./pages/nurse/PasswordNurse";
import AppointmentDentist from "./pages/dentist/AppointmentDentist";
import SchedulesDentist from "./pages/dentist/SchedulesDentist";
import AgendaDentist from "./pages/dentist/AgendaDentist";
import VisitsDentist from "./pages/dentist/VisitsDentist";
import HistoryDentist from "./pages/dentist/HistoryDentist";
import SettingDentist from "./pages/dentist/SetttingDentist";
import BecasMonitor from "./pages/monitor/BecasMonitor";
import AppointmentMonitor from "./pages/monitor/AppointmentMonitor";
import Reservation from "./pages/monitor/Reservation";
import MenuMonitor from "./pages/monitor/MenuMonitor";
import SettingMonitor from "./pages/monitor/SettingMonitor";
import PasswordMonitor from "./pages/monitor/PasswordMonitor";
import AppointmentsWorker from "./pages/worker/AppointmentsWorker"
import DentistWorker from "./pages/worker/DentistWorker"
import NursingWorker from "./pages/worker/NursingWorker"
import PsychologistWorker from "./pages/worker/PsychologistWorker"
import SettingWorker from "./pages/worker/SettingWorker"
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { Outlet } from "react-router-dom";
import PasswordStudent from "./pages/student/PasswordStudent";
import PasswordWorker from "./pages/worker/PasswordWorker";
import PasswordDentist from "./pages/dentist/PasswordDentist";
import ExternosAdmin from "./pages/admin/ExternosAdm";
import Externos from "./pages/monitor/Externos"
import NursePsych from "./pages/psychology/NursePsych";
import DentistPsych from "./pages/psychology/DentistPsych";
import PsychologistDent from "./pages/dentist/PsychologistDent";
import NursingDent from "./pages/dentist/NursingDent";
import PsychologistNurse from "./pages/nurse/PsychologistNurse";
import DentistNurse from "./pages/nurse/DentistNurse";
import PsychologistMonitor from "./pages/monitor/PsychologistMonitor";
import NursingMonitor from "./pages/monitor/NursingMonitor";
import DentistMonitor from "./pages/monitor/DentistMonitor";

function App() {
  return (
    
    <MenuProvider>
      {" "}
      {/* proveedor del contexto */}
      <SettingsProvider>
        <Routes>

          <Route path="/" element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="reestablecercontrasena" element={<RecoverPassword />} />
          <Route path="confirmarcontrasena" element={<ConfirmationPassword />} />

          
        <Route path="/admin" element={<ProtectedRoute allowedRoles={["ADMINISTRADOR"]}><Outlet /></ProtectedRoute>}>
        {/* Rutas hijas de administrador */}
        <Route path="usuarios" element={<ManagementUsers />} />
        <Route path="informes" element={<Informs />} />
        <Route path="VerInforme/:id" element={<ViewInforms />} />
        <Route path="menu" element={<Menu />} />
        <Route path="externos" element={<ExternosAdmin />} />
        <Route path="citasAdm" element={<AppointmentsAdmin />} />
        <Route path="reservas" element={<Reservations />} />
        <Route path="enfermeriaAdmin" element={<NursingAdmin />} />
        <Route path="psicologiaAdmin" element={<PsychologistAdmin />} />
        <Route path="odontologiaAdmin" element={<DentistAdmin />} />
        <Route path="perfilAdmin" element={<SettingsAdmin />} />
        <Route path="contrasenaAdmin" element={<PasswordAdmin />} />

        </Route>

        <Route path="/estudiante" element={<ProtectedRoute allowedRoles={["ESTUDIANTE"]}><Outlet /></ProtectedRoute>}>
        {/* Rutas hijas de estudiante */}
        <Route path="becas" element={<Becas />} />
        <Route path="citas" element={<Appointments />} />
        <Route path="ajustes" element={<Settings />} />
        <Route path="contrasena" element={<PasswordStudent />} />
        <Route path="psicologia" element={<Psychologist />} />
        <Route path="enfermeria" element={<Nursing />} />
        <Route path="odontologia" element={<Dentist />} />

        </Route>

        <Route path="/psicologo" element={<ProtectedRoute allowedRoles={["PSICOLOGO"]}><Outlet /></ProtectedRoute>}>
        {/* Rutas hijas de psicólogo */}
        <Route path="cita" element={<AppointmentsPsych />} />
        <Route path="enfermeria" element={<NursePsych />} />
        <Route path="odontologia" element={<DentistPsych />} />
        <Route path="horario" element={<SchedulesPsych />} />
        <Route path="agenda" element={<AgendaPsych />} />
        <Route path="seguimiento" element={<Tracking />} />
        <Route path="ajustes" element={<SettingPysch />} />
        <Route path="contrasena" element={<PasswordPysch />} />

        </Route>

        <Route path="/enfermeria" element={<ProtectedRoute allowedRoles={["ENFERMERO"]}><Outlet /></ProtectedRoute>}>
        {/* Rutas hijas de enfermería */}
        <Route path="citas" element={<AppointmentsNurse />} />
        <Route path="psicologia" element={<PsychologistNurse />} />
        <Route path="odontologia" element={<DentistNurse />} />
        <Route path="horarios" element={<SchedulesNurse />} />
        <Route path="agendas" element={<AgendaNurse />} />
        <Route path="actividades" element={<VisitsNurse />} />
        <Route path="historial" element={<HistoryNurse />} />
        <Route path="informe" element={<InformNurse />} />
        <Route path="VerInforme/:id" element={<ViewNursingReport/>}/>
        <Route path="ajuste" element={<SettingNurse />} />
        <Route path="contrasena" element={<PasswordNurse />} />

        </Route>

        <Route path="/odontologia" element={<ProtectedRoute allowedRoles={["ODONTOLOGO"]}><Outlet /></ProtectedRoute>}>
        {/* Rutas hijas de odontología */}
        <Route path="citas" element={<AppointmentDentist />} />
        <Route path="psicologia" element={<PsychologistDent />} />
        <Route path="enfermeria" element={<NursingDent />} />
        <Route path="horarios" element={<SchedulesDentist />} />
        <Route path="agenda" element={<AgendaDentist />} />
        <Route path="visitas" element={<VisitsDentist />} />
        <Route path="historial" element={<HistoryDentist />} />
        <Route path="ajustes" element={<SettingDentist />} />
        <Route path="contrasena" element={<PasswordDentist />} />
        </Route>

        <Route path="/monitor" element={<ProtectedRoute allowedRoles={["MONITOR"]}><Outlet /></ProtectedRoute>}>
        {/* Rutas hijas de monitor */}
        <Route path="becas" element={<BecasMonitor />} />
        <Route path="citas" element={<AppointmentMonitor />} />
        <Route path="psicologia" element={<PsychologistMonitor />} />
        <Route path="enfermeria" element={<NursingMonitor />} />
        <Route path="odontologia" element={<DentistMonitor />} />
        <Route path="reservas" element={<Reservation />} />
        <Route path="menu" element={<MenuMonitor />} />
        <Route path="ajustes" element={<SettingMonitor />} />
        <Route path="externos" element={<Externos />} />
        <Route path="contrasena" element={<PasswordMonitor />} />
        </Route>

        <Route path="/funcionario" element={<ProtectedRoute allowedRoles={["FUNCIONARIO"]}><Outlet /></ProtectedRoute>}>
        {/* Rutas hijas de funcionario */}
        <Route path="citas" element={<AppointmentsWorker />} />
        <Route path="ajustes" element={<SettingWorker />} />
        <Route path="contrasena" element={<PasswordWorker />} />
        <Route path="psicologia" element={<PsychologistWorker />} />
        <Route path="enfermeria" element={<NursingWorker />} />
        <Route path="odontologia" element={<DentistWorker />} />
        </Route>

        

        </Routes>
      </SettingsProvider>
    </MenuProvider>
  );
}

export default App;
