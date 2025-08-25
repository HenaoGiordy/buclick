import HeaderPsych from "../../components/psychology/HeaderPsych";
import React, { useState } from "react";
import TablePagination from "../../components/global/TablePagination.jsx";
import StateUser from "../../components/global/StateUser.jsx";
import {
  Card,
  Space,
  Button,
  Descriptions,
  DatePicker,
  TimePicker,
  Row,
  Col,
  message,
} from "antd";
import api from "../../api.js";
import moment from "moment";
import TablePaginationR from "../../components/global/TablePaginationR.jsx";
import FooterProfessionals from "../../components/global/FooterProfessionals.jsx";
import SearchTracking from "../../components/psychology/SearchTracking.jsx";

const AssistanceIcon = ({ attended }) => (
  <div
    style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
  >
    <StateUser active={attended} />
  </div>
);

const Tracking = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [searchUsername, setSearchUsername] = useState("");
  const [totalItems, setTotalItems] = useState(0);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleTimeChange = (time) => {
    setSelectedTime(time);
  };

  const handleSearchClick = () => {
    if (!searchUsername.trim()) {
      message.warning("Ingrese el código o cédula de un usuario para buscar");
    } else {
      handleSearch(1); // Inicia la búsqueda en la primera página
    }
  };

  const handleSearch = async (page = 1) => {
    if (!searchUsername.trim()) {
      message.warning("Ingrese el código o cédula de un usuario para buscar");
      return;
    }

    try {
      const response = await api.get(
        `/appointment-reservation/by-username/${searchUsername}`,
        {
          params: {
            page: page - 1, // Para asegurarse de que el backend reciba el índice de página correcto
            size: itemsPerPage,
          },
        }
      );

      setUserInfo(response.data);
      setTotalItems(response.data.listReservation.page.totalElements);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching user data:", error);

      // Extrae el mensaje de error del backend si está disponible
      const errorMessage =
        error.response?.data?.message ||
        "Error al buscar la información del usuario.";
      message.error(errorMessage);

      setUserInfo(null); // Limpiar la información del usuario si ocurre un error
    }
  };

  const handlePageChange = (page) => {
    // Solicitar la página actualizada
    if (userInfo) {
      handleSearch(page);
    }
  };

  const handleSave = async () => {
    if (!selectedDate || !selectedTime) {
      message.error("Por favor, selecciona una fecha y hora.");
      return;
    }

    // Combinar la fecha y la hora seleccionadas en el formato exacto requerido por el backend
    const dateTime =
      selectedDate.format("YYYY-MM-DD") + "T" + selectedTime.format("HH:mm");

    // Obtener el `pacientId` del objeto `userInfo` (establecido en `handleSearch`)
    const pacientId = userInfo?.id;
    const professionalId = localStorage.getItem("userId");

    if (!pacientId || !professionalId) {
      message.error(
        "No se pudo agendar la cita debido a falta de información."
      );
      return;
    }

    try {
      // Realizar la solicitud POST al backend con los datos necesarios
      const response = await api.post("/appointment-reservation/follow-up", {
        pacientId,
        professionalId,
        dateTime,
      });

      // Mostrar el mensaje de éxito devuelto por el backend
      message.success(response.data.message);

      // Refrescar la información después de agendar
      handleSearch();
      // Limpiar los valores de TimePicker y DatePicker
    setSelectedDate(null);
    setSelectedTime(null);
    } catch (error) {
      console.error("Error saving appointment:", error);// Imprime los detalles de la respuesta de error para depuración

      // Obtener el mensaje de error específico del backend o mostrar un mensaje genérico
      const errorMessage =
        error.response?.data?.message || "Error al agendar la cita.";
      message.error(errorMessage);
    }
  };

  const handleCancel = () => {
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const disabledDate = (current) => {
    return current && current < moment().startOf("day");
  };

  const formatDateTime12Hour = (dateTime) => {
    const date = new Date(dateTime);
    return date.toLocaleString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const columns = ["Fecha y Hora", "Psicólogo(a)", "Asistencia"];
  const rows =
    userInfo?.listReservation?.content.map((reservation) => [
      formatDateTime12Hour(reservation.dateTime),
      reservation.namePycho,
      <AssistanceIcon attended={reservation.assistant} />,
    ]) || [];

  const handleRefresh = () => {
    setSearchUsername(""); // Limpia el campo de búsqueda
    setUserInfo(null); // Limpia la información del usuario
    setCurrentPage(1); // Reinicia la paginación
  };
  return (
    <>
      <HeaderPsych />

      <main className="becas-section" style={{ marginTop: "100px" }}>
        <h1 className="text-xl font-bold" style={{ marginBottom: "12px" }}>
          Seguimientos
        </h1>
        <p style={{ marginBottom: "6px" }}>
          Aquí puedes buscar a los pacientes con las citas que han solicitado
        </p>
        <Card bordered={true} style={styles.card}>
          <div style={styles.searchContainer}>
            <SearchTracking
              value={searchUsername}
              onChange={(e) => setSearchUsername(e.target.value)}
              onClick={() => handleSearch(1)}
              onRefresh={handleRefresh}
            />
          </div>
          <h3 style={styles.sectionTitle}>Información del paciente</h3>
          {userInfo && (
            <>
              <Descriptions bordered column={1} style={styles.descriptions}>
                <Descriptions.Item label="Nombre">
                  {userInfo.name}
                </Descriptions.Item>
                <Descriptions.Item label="Código/Cédula">
                  {userInfo.username}
                </Descriptions.Item>
                <Descriptions.Item label="Programa">
                  {userInfo.plan}
                </Descriptions.Item>
                <Descriptions.Item label="Semestre">
                  {userInfo.semester}
                </Descriptions.Item>
                <Descriptions.Item label="Teléfono">
                  {userInfo.phone}
                </Descriptions.Item>
                <Descriptions.Item label="Correo">
                  {userInfo.email}
                </Descriptions.Item>
              </Descriptions>

              <h3 style={styles.sectionTitle}>Agendar próxima cita</h3>
              <div style={styles.scheduleContainer}>
                <Row style={styles.headerRow} gutter={16}>
                  <Col span={12} style={styles.headerCell}>
                    Fecha
                  </Col>
                  <Col span={12} style={styles.headerCell}>
                    Hora
                  </Col>
                </Row>
                <Row gutter={16} style={styles.inputRow}>
                  <Col span={12}>
                    <DatePicker
                      onChange={handleDateChange}
                      value={selectedDate}
                      style={{ width: "100%" }}
                      placeholder="Fecha"
                      disabledDate={disabledDate}
                    />
                  </Col>
                  <Col span={12}>
                    <TimePicker
                      onChange={handleTimeChange}
                      value={selectedTime}
                      style={{ width: "100%" }}
                      placeholder="Hora"
                      format="HH:mm"
                      disabled={!selectedDate}
                    />
                  </Col>
                </Row>
                <Row
                  justify="center"
                  style={{ ...styles.buttonRow, marginBottom: "10px" }}
                >
                  <Space size={20}>
                    <Button
                      type="primary"
                      onClick={handleSave}
                      className="button-save"
                    >
                      Guardar
                    </Button>
                    <Button onClick={handleCancel} className="button-cancel">
                      Cancelar
                    </Button>
                  </Space>
                </Row>
              </div>
            </>
          )}

          <h3 style={styles.tableTitle}>Tabla de citas solicitadas</h3>
          <TablePaginationR
            rows={rows}
            columns={columns}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            totalItems={totalItems}
            onPageChange={handlePageChange}
          />
        </Card>
      </main>
      <FooterProfessionals />
    </>
  );
};

const styles = {
  card: {
    width: "100%",
    maxWidth: "700px",
    margin: "3px auto",
    justifyContent: "center",
  },
  searchContainer: {
    display: "flex",
    justifyContent: "center",
    marginTop: "20px",
  },
  sectionTitle: {
    fontSize: "16px",
    fontWeight: "bold",
    margin: "15px 0",
    textAlign: "center",
  },
  headerRow: {
    backgroundColor: "#e0e0e0",
    padding: "10px",
    fontWeight: "bold",
    textAlign: "center",
    borderTopLeftRadius: "8px",
    borderTopRightRadius: "8px",
  },
  headerCell: { textAlign: "center" },
  inputRow: { marginTop: "0px", padding: "10px" },
  buttonRow: { paddingTop: "10px", textAlign: "center" },
  scheduleContainer: {
    marginTop: "20px",
    border: "1px solid #d9d9d9",
    borderRadius: "8px",
    overflow: "hidden",
    backgroundColor: "white",
  },
  tableTitle: {
    fontSize: "16px",
    fontWeight: "bold",
    margin: "20px 0",
    textAlign: "left",
  },
};

export default Tracking;
