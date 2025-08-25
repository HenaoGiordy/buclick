import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { useState } from "react";
import ReusableModal from "../../components/global/ReusableModal.jsx";
import api from "../../api.js";
import styles from "../../styles/psychology/agendaPsych.module.css";

function AssistanceButtons({ appointmentId, onReload, notifySuccess = () => {}}) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);

  const handleOpenModal = (status) => {
    setSelectedStatus(status); // Guarda el estado seleccionado (true o false)
    setIsModalVisible(true);   // Muestra el modal de confirmación

  };

  const handleConfirm = async () => {
    try {      
      notifySuccess(`${selectedStatus ? "A" : "Ina"}sistencia confirmada`)
      const token = localStorage.getItem("access");
      await api.post(
        "/appointment-reservation/asistencia",
        {
          appointmentId: appointmentId,
          status: selectedStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Llamar a la función de recarga después de un éxito
      if (onReload) {
        onReload();
      }
    } catch (error) {
      console.error("Error en la solicitud:", error.message);
    } finally {
      setIsModalVisible(false); // Cierra el modal después de la confirmación
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false); // Cierra el modal sin realizar la acción
  };

  return (
    <>
      {/* Modal de confirmación */}
      <ReusableModal
        visible={isModalVisible}
        title={selectedStatus ? "Confirmar asistencia" : "Confirmar inasistencia"} // Cambia dinámicamente el título
        content={
          selectedStatus
            ? "¿Estás seguro de confirmar la asistencia?"
            : "¿Estás seguro de confirmar la inasistencia?" // Cambia dinámicamente el contenido
        }
        cancelText="Cancelar"
        confirmText="Guardar"
        onCancel={handleCancel}
        onConfirm={handleConfirm}
      />
      <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
        <button
          className={styles.buttonCheck}
          onClick={() => handleOpenModal(true)} // Abre el modal con `true` para confirmar asistencia
          style={{ background: "transparent", border: "none", cursor: "pointer" }}
        >
          <CheckCircleOutlined style={{ color: "green", fontSize: "20px" }} />
        </button>
        <button
          className={styles.buttonCross}
          onClick={() => handleOpenModal(false)} // Abre el modal con `false` para confirmar inasistencia
          style={{ background: "transparent", border: "none", cursor: "pointer" }}
        >
          <CloseCircleOutlined style={{ color: "red", fontSize: "20px" }} />
        </button>
      </div>
    </>
  );
}

export default AssistanceButtons;