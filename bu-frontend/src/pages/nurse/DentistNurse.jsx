import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Calendar,
  theme,
  ConfigProvider,
  Row,
  Col,
  message,
  Typography,
  Button,
} from "antd";
import SchedulingTable from "../../components/global/SchedulingTable";
import esES from "antd/es/locale/es_ES";
import moment from "moment";
import api from "../../api.js";
import ReusableModal from "../../components/global/ReusableModal"; // Importar el modal reutilizable
import { useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
const { Text } = Typography;
import FooterProfessionals from "../../components/global/FooterProfessionals.jsx";
import HeaderNurse from "../../components/nurse/HeaderNurse.jsx";

const DentistNurse = () => {
  const { token } = theme.useToken();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(
    moment().format("YYYY-MM-DD")
  );
  const [availableDates, setAvailableDates] = useState([]);
  const [filteredDates, setFilteredDates] = useState([]);
  const [pendingAppointment, setPendingAppointment] = useState(null);

  const [isSemesterError, setIsSemesterError] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [actionType, setActionType] = useState(""); // 'cancel' o 'reserve'
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [modalContent, setModalContent] = useState(""); // Estado para el contenido dinámico del modal

  const username = localStorage.getItem("username");
  const userName = localStorage.getItem("userName");
  const userId = localStorage.getItem("userId");
  const userPlan = localStorage.getItem("userPlan");
  const lastName = localStorage.getItem("lastName");

  useEffect(() => {
    fetchPendingAppointment();
  }, [userId]);

  const fetchPendingAppointment = () => {
    const storedToken = localStorage.getItem("ACCESS_TOKEN");

    api
      .get(`/appointment-reservation/student/${userId}`, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      })
      .then((response) => {
        const dentistAppointment = response.data.appointments.find(
          (appt) =>
            appt.availableDate.typeAppointment === "ODONTOLOGIA" &&
            appt.pending === true
        );
        setPendingAppointment(dentistAppointment || null);
      })
      .catch((error) => {
        console.error("Error al obtener las citas del estudiante:", error);
      });
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("ACCESS_TOKEN");

    api
      .get(`/appointment/all-dates/${userId}?type=ODONTOLOGIA`, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      })
      .then((response) => {
        setAvailableDates(response.data.availableDates);
        filterDatesBySelectedDay(
          moment().format("YYYY-MM-DD"),
          response.data.availableDates
        );
      })
      .catch((error) => {
        console.error("Error al obtener los horarios:", error);
      });
  }, []);

  const showModal = (type, appointmentId = null) => {
    if (type === "reserve") {
      let hasError = false;

      // Encuentra la fecha y hora de la cita seleccionada para mostrar en el modal
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
      // Muestra la fecha y hora de la cita pendiente en el modal de cancelación
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
    const storedToken = localStorage.getItem("ACCESS_TOKEN");
  
    setConfirmLoading(true);
    if (pendingAppointment) {
      api
        .delete(
          `/appointment-reservation/cancel/${pendingAppointment.reservationId}`,
          {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          }
        )
        .then(() => {
          message.success("Cita cancelada con éxito");
  
          // Actualizar las citas pendientes y las citas disponibles
          setPendingAppointment(null);
          fetchAvailableDates(); // Actualizar inmediatamente las citas disponibles
          filterDatesBySelectedDay(selectedDate);
        })
        .catch((error) => {
          console.error("Error al cancelar la cita:", error);
          message.error("Hubo un error al cancelar la cita.");
        })
        .finally(() => {
          setConfirmLoading(false);
          setModalVisible(false);
        });
    }
  };
  

  // Nueva función para obtener y actualizar las citas disponibles
  const fetchAvailableDates = () => {
    const storedToken = localStorage.getItem("ACCESS_TOKEN");
    const userId = localStorage.getItem("userId");
  
    if (!userId) {
      console.error("Error: userId no encontrado en localStorage");
      return;
    }
  
    api
      .get(`/appointment/all-dates/${userId}?type=ODONTOLOGIA`, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      })
      .then((response) => {
        const availableDates = response.data.availableDates;
        setAvailableDates(availableDates);
        filterDatesBySelectedDay(selectedDate, availableDates);
      })
      .catch((error) => {
        console.error("Error al obtener los horarios:", error);
      });
  };
  
  const handleConfirmReserve = () => {
    const storedToken = localStorage.getItem("ACCESS_TOKEN");
  
    setConfirmLoading(true);
    api
      .post(
        "/appointment-reservation",
        {
          pacientId: userId,
          availableDateId: selectedAppointmentId,
        },
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        // Mostrar mensaje de éxito proporcionado por el backend
        message.success(response.data.message);
  
        // Actualizar las citas pendientes y las citas disponibles
        fetchPendingAppointment();
        fetchAvailableDates(); // Actualizar inmediatamente las citas disponibles
        setFilteredDates((prevDates) =>
          prevDates.filter((date) => date.id !== selectedAppointmentId)
        );
      })
      .catch((error) => {
        if (error.response && error.response.data?.message) {
          // Mostrar únicamente el mensaje devuelto por el backend
          message.error(error.response.data.message);
        } else {
          console.error("Error inesperado:", error);
        }
      })
      .finally(() => {
        setConfirmLoading(false);
        setModalVisible(false);
      });
  };
  

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
  
  const onDateSelect = (date) => {
    if (date && date.isValid()) {
      const formattedDate = date.format("YYYY-MM-DD");
      setSelectedDate(formattedDate);
      filterDatesBySelectedDay(formattedDate);
    }
  };

  const disabledDate = (currentDate) => {
    const formattedDate = currentDate.format("YYYY-MM-DD");
    return !availableDates.some(
      (item) =>
        moment(item.dateTime).format("YYYY-MM-DD") === formattedDate &&
        item.available === true
    );
  };

  const handleBack = () => {
    navigate("/enfermeria/citas");
  };

  return (
    <>
      <HeaderNurse />
      <main
        className="odontologia-section"
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
            Cita odontología
          </h1>
        </div>

        {/* ReusableModal para confirmación de acciones */}
        <ReusableModal
          visible={modalVisible}
          title={
            actionType === "cancel"
              ? "Confirmar Cancelación"
              : "Confirmar Reserva"
          }
          content={modalContent} // Aquí usamos modalContent
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
                <Form.Item label="Cédula">
                  <Input value={username || ""} disabled />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Form.Item label="Área dependencia">
                  <Input value={userPlan || ""} disabled />
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
                salon="Servicio de odontología, segundo piso, bloque A"
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
                  Agendaste una cita con odontología para el día{" "}
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
      <FooterProfessionals />
    </>
  );
};

export default DentistNurse;
