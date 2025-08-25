import { useEffect, useState } from "react";
import TopNavbar from "../../components/TopNavbar";
import ButtonTutorial from '../../components/global/ButtonTutorial.jsx';
import {
  Form,
  Input,
  Calendar,
  ConfigProvider,
  Row,
  Col,
  message,
  Button,
} from "antd";
import SchedulingTable from "../../components/global/SchedulingTable";
import esES from "antd/es/locale/es_ES";
import moment from "moment";
import api from "../../api.js";
import ReusableModal from "../../components/global/ReusableModal";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import FooterProfessionals from "../../components/global/FooterProfessionals.jsx";

const Psychologist = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(moment().format("YYYY-MM-DD"));
  const [availableDates, setAvailableDates] = useState([]);
  const [filteredDates, setFilteredDates] = useState([]);
  const [phone, setPhone] = useState("");
  const [semester, setSemester] = useState("");
  const [pendingAppointment, setPendingAppointment] = useState(null);
  const [isPhoneError, setIsPhoneError] = useState(false);
  const [isSemesterError, setIsSemesterError] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [actionType, setActionType] = useState("");
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [modalContent, setModalContent] = useState("");

  const userName = localStorage.getItem("userName");
  const userId = localStorage.getItem("userId");
  const userPlan = localStorage.getItem("userPlan");
  const lastName = localStorage.getItem("lastName");
  useEffect(() => {
    const storedPhone = localStorage.getItem("userPhone");
    const storedSemester = localStorage.getItem("userSemester");

    setPhone(storedPhone !== "null" && storedPhone ? storedPhone : "");
    setSemester(storedSemester !== "null" && storedSemester ? storedSemester : "");
  }, []);

  // Unificación de solicitudes en un solo useEffect
  useEffect(() => {
    const fetchUserData = async () => {
      const storedToken = localStorage.getItem("access");

      if (!storedToken || !userId) {
        console.error("ACCESS_TOKEN o userId no encontrados en localStorage");
        return;
      }

      try {
        const [appointmentsResponse, datesResponse] = await Promise.all([
          api.get(`/appointment-reservation/student/${userId}`, {
            headers: { Authorization: `Bearer ${storedToken}` },
          }),
          api.get(`/appointment/all-dates/${userId}?type=PSICOLOGIA`, {
            headers: { Authorization: `Bearer ${storedToken}` },
          }),
        ]);

        // Configurar citas pendientes
        const psychologyAppointment = appointmentsResponse.data.appointments.find(
          (appt) =>
            appt.availableDate.typeAppointment === "PSICOLOGIA" &&
            appt.pending === true
        );
        setPendingAppointment(psychologyAppointment || null);

        // Configurar fechas disponibles
        const availableDates = datesResponse.data.availableDates || [];
        setAvailableDates(availableDates);

        // Filtrar fechas
        filterDatesBySelectedDay(selectedDate, availableDates);
      } catch (error) {
        console.error("Error al obtener datos del usuario:", error);
        message.error("No se pudieron cargar los datos. Inténtalo nuevamente.");
      }
    };

    fetchUserData();
  }, [selectedDate, userId]);



  // const filterDatesBySelectedDay = (
  //   formattedSelectedDate,
  //   dates = availableDates
  // ) => {
  //   const filtered = dates
  //     .filter((item) => {
  //       const itemDate = moment(item.dateTime).format("YYYY-MM-DD");
  //       return itemDate === formattedSelectedDate && item.available === true;
  //     })
  //     .sort((a, b) => moment(a.dateTime).diff(moment(b.dateTime))); // Ordenar por hora

  //   setFilteredDates(filtered);
  // };

  const filterDatesBySelectedDay = (
    formattedSelectedDate,
    dates = availableDates
  ) => {
    const filtered = dates
      .filter((item) => {
        const itemDate = moment(item.dateTime);
        const currentDateTime = moment();
  
        // Filtramos solo las citas que no hayan pasado
        return (
          moment(itemDate).format("YYYY-MM-DD") === formattedSelectedDate &&
          item.available === true &&
          itemDate.isAfter(currentDateTime) // Aseguramos que la cita no haya pasado
        );
      })
      .sort((a, b) => moment(a.dateTime).diff(moment(b.dateTime))); // Ordenar por hora
  
    setFilteredDates(filtered);
  };
  
  const fetchPendingAppointment = async () => {
    const storedToken = localStorage.getItem("access");

    if (!storedToken || !userId) {
      console.error("ACCESS_TOKEN o userId no encontrados.");
      return;
    }

    try {
      const response = await api.get(`/appointment-reservation/student/${userId}`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });

      console.log("Response Data:", response.data);

      const psychologyAppointment = response.data.appointments.find(
        (appt) =>
          appt.availableDate.typeAppointment === "PSICOLOGIA" &&
          appt.pending === true
      );

      if (psychologyAppointment) {
        console.log("Psychology Appointment:", psychologyAppointment);
        setPendingAppointment(psychologyAppointment);
      } else {
        console.warn("No hay citas pendientes.");
        setPendingAppointment(null);
      }
    } catch (error) {
      console.error("Error al obtener las citas del estudiante:", error);
      message.error("Hubo un error al cargar las citas pendientes.");
    }
  };

  const fetchUserData = async () => {
    const storedToken = localStorage.getItem("access");

    if (!storedToken || !userId) {
      console.error("ACCESS_TOKEN o userId no encontrados en localStorage");
      return;
    }

    try {
      const datesResponse = await api.get(`/appointment/all-dates/${userId}?type=PSICOLOGIA`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });

      // Configurar fechas disponibles
      const availableDates = datesResponse.data.availableDates || [];
      setAvailableDates(availableDates);

      // Filtrar fechas
      filterDatesBySelectedDay(selectedDate, availableDates);

      // Obtener citas pendientes
      await fetchPendingAppointment();
    } catch (error) {
      console.error("Error al obtener datos del usuario:", error);
      message.error("No se pudieron cargar los datos. Inténtalo nuevamente.");
    }
  };

  const handleConfirmReserve = () => {
    if (isPhoneError || isSemesterError) return;

    const storedToken = localStorage.getItem("access");

    setConfirmLoading(true);

    api
      .post(
        "/appointment-reservation",
        {
          pacientId: userId,
          availableDateId: selectedAppointmentId,
          phone,
          semester,
        },
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then(async (response) => {
        message.success(response.data.message);

        localStorage.setItem("userPhone", phone);
        setPhone(phone);
        localStorage.setItem("userSemester", semester);
        setSemester(semester);

        // Actualizar citas pendientes
        await fetchPendingAppointment();

        // Volver a obtener las fechas disponibles
        const datesResponse = await api.get(
          `/appointment/all-dates/${userId}?type=PSICOLOGIA`,
          {
            headers: { Authorization: `Bearer ${storedToken}` },
          }
        );

        const updatedAvailableDates = datesResponse.data.availableDates || [];
        setAvailableDates(updatedAvailableDates);

        // Actualizar citas filtradas según la fecha seleccionada
        filterDatesBySelectedDay(selectedDate, updatedAvailableDates);
      })
      .catch((error) => {
        if (error.response && error.response.data?.message) {
          message.error(error.response.data.message);
        } else {
          console.error("Error inesperado:", error);
          message.error("Ocurrió un error inesperado. Intenta nuevamente.");
        }
      })
      .finally(() => {
        setConfirmLoading(false);
        setModalVisible(false);
      });
  };

  const onDateSelect = (date) => {
    if (date && date.isValid()) {
      const formattedDate = date.format("YYYY-MM-DD");
      setSelectedDate(formattedDate);
      filterDatesBySelectedDay(formattedDate);
    }
  };

  const disabledDate = (currentDate) => {
    if (!availableDates || availableDates.length === 0) {
      return true; // Deshabilita todas las fechas si no hay datos disponibles
    }

    const formattedDate = currentDate.format("YYYY-MM-DD");
    return !availableDates.some(
      (item) =>
        moment(item.dateTime).format("YYYY-MM-DD") === formattedDate &&
        item.available === true
    );
  };

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, ""); // Permitir solo números
    if (value.startsWith("0")) {
      value = value.substring(1); // Evitar que comience con 0
    }
    setPhone(value);
    setIsPhoneError(value.length !== 10);
  };

  const handleSemesterChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, ""); // Solo numeros
    const numericValue = parseInt(value, 10);
    // Validar que esté entre 1 y 11
    if (numericValue >= 1 && numericValue <= 11) {
      setSemester(numericValue);
      setIsSemesterError(false);
    } else {
      setSemester("");
      setIsSemesterError(true);
    }
  };

  const handleBack = () => {
    navigate("/estudiante/citas");
  };

  const showModal = (type, appointmentId = null) => {
    if (type === "reserve") {
      let hasError = false;

      if (phone.length !== 10) {
        setIsPhoneError(true);
        hasError = true;
      } else {
        setIsPhoneError(false);
      }

      if (!semester) {
        setIsSemesterError(true);
        hasError = true;
      } else {
        setIsSemesterError(false);
      }

      if (hasError) {
        message.error("Digita los campos teléfono y semestre.");
        return; // Detener la ejecución si hay errores
      }

      const selectedAppointment = availableDates.find(
        (date) => date.id === appointmentId
      );

      setActionType(type);
      setSelectedAppointmentId(appointmentId);
      setModalVisible(true);
      setModalContent(
        `¿Estás seguro de que deseas agendar tu cita para el día ${moment(
          selectedAppointment.dateTime
        ).format("DD/MM/YYYY [a las] hh:mm A")}?`
      );
    } else if (type === "cancel" && pendingAppointment) {
      setActionType(type);
      setModalVisible(true);
      setModalContent(
        `¿Estás seguro de que deseas cancelar tu cita agendada para el día ${moment(
          pendingAppointment.availableDate.dateTime
        ).format("DD/MM/YYYY [a las] hh:mm A")}?`
      );
    }
  };

  const handleConfirmCancel = () => {
    const storedToken = localStorage.getItem("access");

    // Validación para asegurarse de que pendingAppointment es válido
    if (!pendingAppointment || !pendingAppointment.reservationId) {
      console.error("Error: No hay una cita pendiente o falta el reservationId.");
      message.error("No se puede cancelar la cita. Intenta nuevamente.");
      return;
    }

    setConfirmLoading(true);

    // Llamada para cancelar la cita
    api
      .delete(
        `/appointment-reservation/cancel/${pendingAppointment.reservationId}`,
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        }
      )
      .then(async () => {
        message.success("Cita cancelada con éxito");

        // Limpiar la cita pendiente
        setPendingAppointment(null);

        // Volver a obtener las fechas disponibles
        const datesResponse = await api.get(
          `/appointment/all-dates/${userId}?type=PSICOLOGIA`,
          {
            headers: { Authorization: `Bearer ${storedToken}` },
          }
        );

        const updatedAvailableDates = datesResponse.data.availableDates || [];
        setAvailableDates(updatedAvailableDates);

        // Actualizar citas filtradas según la fecha seleccionada
        filterDatesBySelectedDay(selectedDate, updatedAvailableDates);
      })
      .catch((error) => {
        console.error("Error al cancelar la cita:", error);
        message.error("Hubo un error al cancelar la cita.");
      })
      .finally(() => {
        setConfirmLoading(false);
        setModalVisible(false);
      });
  };

  return (
    <>
      <TopNavbar />
      <main
        className="psicologia-section"
        style={{ marginTop: "100px", padding: "0 20px" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <Button
            type="default"
            icon={<ArrowLeftOutlined style={{ color: "#fff" }} />}
            className="button-save"
            onClick={handleBack}
            style={{
              marginRight: "10px",
              backgroundColor: "#b20000",
              border: "none",
              marginTop: "-30px",
            }}
          />
          <h1
            className="text-xl font-bold"
            style={{
              color: "#b20000",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Cita psicología
          </h1>
        </div>

        <ReusableModal
          visible={modalVisible}
          title={
            actionType === "cancel"
              ? "Confirmar Cancelación"
              : "Confirmar Reserva"
          }
          content={modalContent}
          cancelText="Cancelar"
          confirmText="Confirmar"
          onCancel={() => setModalVisible(false)}
          onConfirm={
            actionType === "cancel" ? handleConfirmCancel : handleConfirmReserve
          }
        />

        {userName && (
          <Form layout="vertical" style={{ marginBottom: "20px" }}>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={6}>
                <Form.Item label="Nombre y apellido">
                  <Input value={`${userName} ${lastName || ""}`.trim()} disabled />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={6}>
                <Form.Item label="Programa académico">
                  <Input value={userPlan || ""} disabled />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Form.Item
                  label="Número de celular"
                  validateStatus={isPhoneError ? "error" : ""}
                  help={
                    isPhoneError
                      ? "El campo celular debe tener 10 dígitos."
                      : ""
                  }
                >
                  <Input
                    type="text"
                    value={phone}
                    onChange={handlePhoneChange}
                    maxLength={10}
                    style={{ borderColor: isPhoneError ? "red" : "" }}
                    placeholder="Número de celular"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Form.Item
                  label="Semestre"
                  validateStatus={isSemesterError ? "error" : ""}
                  help={
                    isSemesterError ? "El semestre máximo es 11." : ""
                  }
                >
                  <Input
                    type="number"
                    value={semester}
                    onChange={handleSemesterChange}
                    style={{ borderColor: isSemesterError ? "red" : "" }}
                    placeholder="Ej: 1 - 11"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        )}

        <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
          <Col xs={24} md={12}>
            <ConfigProvider locale={esES}>
              <div
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "16px",
                }}
              >
                <Calendar
                  fullscreen={false}
                  onSelect={onDateSelect}
                  disabledDate={disabledDate}
                />
              </div>
            </ConfigProvider>
          </Col>
          <Col xs={24} md={12}>
            {filteredDates.length > 0 ? (
              <SchedulingTable
                headers={[
                  "Hora",
                  "Lugar de atención",
                  `Fecha: ${moment(selectedDate).format("YYYY-MM-DD")}`,
                ]}
                appointments={filteredDates}
                onReserve={(availableDateId) =>
                  showModal("reserve", availableDateId)
                }
                disableReserveButton={!!pendingAppointment}
                salon="Servicio de psicología, tercer piso, bloque A"
              />
            ) : (
              <p style={{ fontSize: "16px", textAlign: "center" }}>
                Selecciona una fecha para ver los horarios disponibles.
              </p>
            )}

            {pendingAppointment && (
              <div
                style={{
                  marginTop: "20px",
                  padding: "10px 20px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  textAlign: "center",
                  backgroundColor: "#f9f9f9",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  maxWidth: "100%",
                }}
              >
                <span
                  style={{
                    backgroundColor: "#d4edda",
                    color: "#155724",
                    padding: "5px 10px",
                    borderRadius: "5px",
                    marginBottom: "10px",
                    textAlign: "center",
                    width: "100%",
                    maxWidth: "300px",
                  }}
                >
                  Agendaste una cita con psicología para el día{" "}
                  {moment(pendingAppointment.availableDate.dateTime).format(
                    "DD/MM/YYYY [a las] hh:mm A"
                  )}
                </span>
                <Button
                  className="button-cancel"
                  style={{
                    marginTop: "10px",
                    maxWidth: "150px",
                    width: "100%",
                  }}
                  onClick={() => showModal("cancel")}
                >
                  Cancelar cita
                </Button>
              </div>
            )}
          </Col>
        </Row>
      </main>
      <ButtonTutorial role="student" />
      <FooterProfessionals />
    </>
  );
};

export default Psychologist;