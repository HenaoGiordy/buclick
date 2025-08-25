import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import HeaderNurse from "../../components/nurse/HeaderNurse.jsx";
import FooterProfessionals from "../../components/global/FooterProfessionals.jsx";
import DateSpanish from "../../components/global/DateSpanish.jsx";
import TimeSpanish from "../../components/global/TimeSpanish.jsx";
import ReusableModal from "../../components/global/ReusableModal.jsx";
import api from '../../api';
import { Flex, Button, message, Modal } from "antd";
import { InfoCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

const styles = {
  contentTitle: {
    textAlign: 'center',
    margin: '1.5rem 0',
    padding: '0 1rem',
  },
  tableWrapper: {
    margin: '1.5rem auto',
    padding: '0 1rem',
    width: '100%',
    maxWidth: '1200px',
    overflowX: 'auto',
  },
  cssTable: {
    width: '100%',
    minWidth: '320px',
    maxWidth: '800px',
    margin: '0 auto',
    borderCollapse: 'collapse',
    backgroundColor: 'white',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  tableCell: {
    padding: window.innerWidth <= 768 ? '0.5rem' : '0.8rem',
    border: 'none',
    verticalAlign: 'middle',
    textAlign: 'center',
    color: 'black',
    fontSize: window.innerWidth <= 768 ? '14px' : '16px',
  },
  tableHeader: {
    padding: window.innerWidth <= 768 ? '0.5rem' : '0.8rem',
    backgroundColor: 'var(--red)',
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: window.innerWidth <= 768 ? '14px' : '16px',
  },
  linkButton: {
    color: 'var(--red)',
    fontWeight: 'bold',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    padding: '0.5rem',
    whiteSpace: 'nowrap',
  },
  buttonContainer: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
    padding: '0 1rem',
  },
  timeContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    marginBottom: '0.5rem',
    flexWrap: 'wrap',
    flexDirection: window.innerWidth <= 768 ? 'column' : 'row',
  },
  dateContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    flexWrap: 'wrap',
    flexDirection: window.innerWidth <= 768 ? 'column' : 'row',
  },
  marginTopEdit: {
    marginTop: window.innerWidth <= 768 ? '1rem' : '2rem',
  },
  decorateText: {
    display: window.innerWidth <= 480 ? 'none' : 'inline',
  },
};

// Agregar estilos CSS globales
const globalStyles = `
  @media (max-width: 768px) {
    .ant-picker {
      width: 100% !important;
    }
    
    .ant-btn {
      font-size: 14px !important;
      padding: 4px 8px !important;
    }
    
    .button-save,
    .button-cancel {
      padding: 8px 16px !important;
      font-size: 14px !important;
    }
  }
`;

// Agregar los estilos globales al documento
const styleSheet = document.createElement('style');
styleSheet.type = 'text/css';
styleSheet.innerText = globalStyles;
document.head.appendChild(styleSheet);

dayjs.locale('es');

export default function SchedulesNurse() {
  const [scheduleData, setScheduleData] = useState([]);
  const [originalScheduleData, setOriginalScheduleData] = useState([]);
  const [isDeleteTimeModalVisible, setIsDeleteTimeModalVisible] = useState(false);
  const [isSaveChangesModalVisible, setIsSaveChangesModalVisible] = useState(false);
  const [modifiedScheduleData, setModifiedScheduleData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedDateIndex, setSelectedDateIndex] = useState(null);
  const [selectedTimeIndex, setSelectedTimeIndex] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [isLoading, setIsLoading] = useState(false);
  const userId = localStorage.getItem("userId");

  const showNotification = (type, content) => { messageApi[type]({ content, duration: 5 }); };

  const fetchAvailableDates = async () => {
    try {
      const response = await api.get(`/appointment/${userId}`);
      const fetchedData = response.data.availableDates || [];

      const now = dayjs();
      const scheduleDataFormatted = fetchedData.reduce((acc, item) => {
        const [date, time] = item.dateTime.split('T');
        const dateTime = dayjs(`${date}T${time}`);

        // Asegurarse de que solo incluimos horarios futuros
        if (dateTime.isAfter(now)) {
          const existingDate = acc.find(entry => entry.date === date);
          if (existingDate) {
            // Agregar el `id` a cada hora en el formato de `times`
            existingDate.times.push({ time, id: item.id, isNew: false });
          } else {
            acc.push({ id: item.id, date, times: [{ time, id: item.id, isNew: false }] });
          }
        }
        return acc;
      }, []);

      // Ordenar horarios de cada fecha
      scheduleDataFormatted.forEach(schedule => {
        schedule.times.sort((a, b) => dayjs(`1970-01-01T${a.time}`).diff(dayjs(`1970-01-01T${b.time}`)));
      });

      // Ordenar las fechas cronológicamente
      scheduleDataFormatted.sort((a, b) => dayjs(a.date).diff(dayjs(b.date)));

      setScheduleData(scheduleDataFormatted);
      setOriginalScheduleData(scheduleDataFormatted);
    } catch (error) {
      showNotification('error', 'Error al cargar los horarios. Intente nuevamente.');
    }
  };


  useEffect(() => {
    fetchAvailableDates();
  }, []);

  const handleCloseDeleteTimeModal = () => {
    setIsDeleteTimeModalVisible(false);
    setSelectedDateIndex(null);
    setSelectedTimeIndex(null);
  };

  const handleDeleteDate = async (date) => {
    // Mostrar un modal de confirmación para que el usuario confirme la eliminación
    Modal.confirm({
      title: "Confirmar Eliminación",
      content: "¿Está seguro de que desea eliminar todos los horarios de este día? Esta acción no se puede deshacer.",
      okText: "Sí, eliminar",
      cancelText: "Cancelar",
      onOk: async () => {
        // El usuario ha confirmado, procedemos a eliminar
        const formattedDate = dayjs(date).format('DD/MM/YYYY');
        try {
          const response = await api.delete("/appointment/delete-dates", {
            data: { date: formattedDate }
          });

          if (response.status === 204) {
            showNotification("success", "Todos los horarios de la fecha han sido eliminados correctamente.");

            // Recargar los datos desde el servidor después de eliminar la fecha completa
            await fetchAvailableDates();
          } else {
            showNotification("error", "Error al eliminar los horarios. Intente nuevamente.");
          }
        } catch (error) {
          showNotification("error", "Error al eliminar la fecha y sus horas. Intente nuevamente.");
        }
      },
      onCancel: () => {
        // El usuario ha cancelado la acción, no se hace nada
        showNotification("warning", "Eliminación cancelada.");
      },
    });
  };


  // Función de eliminar una hora
  const handleDeleteTime = async () => {
    if (selectedDateIndex === null || selectedTimeIndex === null) {
      showNotification('error', 'Índices de fecha u hora no definidos.');
      return;
    }

    const updatedSchedule = [...scheduleData];
    const updatedDate = updatedSchedule[selectedDateIndex];
    const timeIdToDelete = updatedDate.times[selectedTimeIndex]?.id;

    if (!timeIdToDelete) {
      showNotification('error', 'la hora no ha sido registrada previamente, no se puede eliminar.');
      handleCloseDeleteTimeModal();
      return;
    }

    try {
      await api.delete(`/appointment/${timeIdToDelete}`);
      showNotification('success', 'Hora eliminada correctamente.');

      // Recargar los datos desde el servidor después de eliminar una hora
      await fetchAvailableDates();
    } catch (error) {
      showNotification('error', 'Error al eliminar la hora. Intente nuevamente.');
    } finally {
      handleCloseDeleteTimeModal();
    }
  };

  // Función para eliminar timepicker vacío
  const handleRemoveEmptyTime = (dateIndex, timeIndex) => {
    // Si el tiempo está vacío, solo eliminamos el timepicker
    if (!scheduleData[dateIndex].times[timeIndex].time) {
      const newSchedule = [...scheduleData];
      newSchedule[dateIndex].times.splice(timeIndex, 1);

      // Si no quedan horarios en la fecha, agregar uno vacío
      if (newSchedule[dateIndex].times.length === 0) {
        newSchedule[dateIndex].times.push({ time: "", isNew: true });
      }

      setScheduleData(newSchedule);
      return;
    }

    // Si el tiempo tiene valor, procedemos con la eliminación normal
    setSelectedDateIndex(dateIndex);
    setSelectedTimeIndex(timeIndex);
    setIsDeleteTimeModalVisible(true);
  };

  const handleCloseSaveChangesModal = () => {
    setIsSaveChangesModalVisible(false);
  };

  // Llamar a `fetchAvailableDates` después de cada operación para actualizar el estado.
  const confirmSaveChanges = async () => {
    setIsLoading(true);

    try {
      const saved = await saveDataToBackend();
      if (saved) {
        showNotification('success', 'Los horarios fueron asignados con éxito.');
        setIsEditing(false);
        handleCloseSaveChangesModal();
        await fetchAvailableDates(); // Recargar datos
      } else {
        showNotification('error', 'No se pudieron guardar los horarios. Intente de nuevo.');
      }
    } catch (error) {
      showNotification('error', 'Hubo un error inesperado. Intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };


  const handlerEdit = () => setIsEditing(true);

  const handlerDontEdit = () => {
    setIsEditing(false);
    setScheduleData(originalScheduleData);
    setModifiedScheduleData([]);
  };

  const handlerCreateDate = () => {
    const lastDateEntry = scheduleData[scheduleData.length - 1];
    if (lastDateEntry && (!lastDateEntry.date || lastDateEntry.times.some(time => time.time === ""))) {
      showNotification('warning', 'Debe diligenciar la fecha y al menos una hora antes de agregar una nueva fecha.');
      return;
    }

    setScheduleData([...scheduleData, { date: "", times: [{ time: "", isNew: true }] }]);
  };

  const handlerCreateTime = (index) => {
    const timesArray = scheduleData[index].times;
    if (timesArray[timesArray.length - 1].time === "") {
      showNotification('warning', 'Debe diligenciar la hora anterior antes de agregar una nueva hora.');
      return;
    }

    const newSchedule = [...scheduleData];
    newSchedule[index].times.push({ time: "", isNew: true });
    setScheduleData(newSchedule);

    if (!modifiedScheduleData.some(mod => mod.id === scheduleData[index].id)) {
      setModifiedScheduleData([...modifiedScheduleData, scheduleData[index]]);
    }
  };

  const handlerDateChange = (date, index) => {
    const now = dayjs();
    const selectedDate = dayjs(date);

    if (selectedDate.isBefore(now, 'day')) {
      showNotification('warning', 'No se puede seleccionar una fecha anterior a la actual.');
      return;
    }

    const newSchedule = [...scheduleData];
    newSchedule[index].date = date;
    newSchedule[index].times.forEach(time => time.isNew = true);
    setScheduleData(newSchedule);

    if (!modifiedScheduleData.some(mod => mod.id === scheduleData[index].id)) {
      setModifiedScheduleData([...modifiedScheduleData, scheduleData[index]]);
    }
  };

  const getDisabledHours = () => {
    const disabledHours = [];
    for (let i = 0; i < 24; i++) {
      if (i < 8 || i > 22) {
        disabledHours.push(i); // Deshabilita antes de las 8 am y después de las 11 pm
      }
    }
    return disabledHours;
  };

  // Modificar la función handlerTimeChange para manejar bloques de horarios
  const handlerTimeChange = (newTime, dateIndex, timeIndex) => {
    const now = dayjs();
    const selectedDate = dayjs(scheduleData[dateIndex].date);
    const selectedTime = dayjs(`${scheduleData[dateIndex].date}T${newTime}`);

    // Validar que no sea una hora pasada en el día actual
    if (selectedDate.isSame(now, 'day') && selectedTime.isBefore(now)) {
      showNotification('warning', 'No se puede seleccionar una hora pasada en la fecha actual.');
      return;
    }

    // Obtener todos los horarios del mismo día ordenados
    const dayTimes = scheduleData[dateIndex].times
      .filter((t, idx) => idx !== timeIndex && t.time) // Excluir la hora actual y filtrar vacíos
      .map(t => dayjs(`${scheduleData[dateIndex].date}T${t.time}`))
      .sort((a, b) => a - b);

    if (dayTimes.length > 0) {
      // Encontrar el horario más cercano antes y después del seleccionado
      const previousTime = dayTimes.filter(t => t.isBefore(selectedTime)).pop();
      const nextTime = dayTimes.find(t => t.isAfter(selectedTime));

      // Si hay un horario previo, verificar la diferencia
      if (previousTime) {
        const diffWithPrevious = selectedTime.diff(previousTime, 'minute');

        // Si la diferencia es menor a 2 horas, debe mantener el mismo formato de minutos
        if (diffWithPrevious < 60) {
          const previousMinutes = previousTime.minute();
          const selectedMinutes = selectedTime.minute();

          if (previousMinutes !== selectedMinutes) {
            showNotification('warning', `Se debe establecer un horario mínimo de una hora de diferencia`);
            return;
          }

          // Verificar que haya al menos una hora de diferencia
          if (diffWithPrevious < 60) {
            showNotification('warning', 'Debe haber al menos una hora de diferencia con el horario anterior');
            return;
          }
        }
      }

      // Si hay un horario siguiente, verificar la diferencia
      if (nextTime) {
        const diffWithNext = nextTime.diff(selectedTime, 'minute');

        // Si la diferencia es menor a 2 horas, debe mantener el mismo formato de minutos
        if (diffWithNext < 60) {
          const nextMinutes = nextTime.minute();
          const selectedMinutes = selectedTime.minute();

          if (nextMinutes !== selectedMinutes) {
            showNotification('warning', `Se debe establecer un horario mínimo de una hora de diferencia`);
            return;
          }

          // Verificar que haya al menos una hora de diferencia
          if (diffWithNext < 60) {
            showNotification('warning', 'Debe haber al menos una hora de diferencia con el horario siguiente');
            return;
          }
        }
      }
    }

    // Verificar duplicados en toda la tabla
    const isDuplicateTime = scheduleData.some((schedule, sDateIndex) =>
      schedule.date === scheduleData[dateIndex].date &&
      schedule.times.some((time, sTimeIndex) =>
        (sDateIndex !== dateIndex || sTimeIndex !== timeIndex) &&
        time.time === newTime
      )
    );

    if (isDuplicateTime) {
      showNotification('warning', 'Esta hora ya existe en el calendario. Por favor, seleccione una hora diferente.');
      return;
    }

    const newSchedule = [...scheduleData];
    newSchedule[dateIndex].times[timeIndex] = { time: newTime, isNew: true };
    setScheduleData(newSchedule);

    if (!modifiedScheduleData.some(mod => mod.id === scheduleData[dateIndex].id)) {
      setModifiedScheduleData([...modifiedScheduleData, scheduleData[dateIndex]]);
    }
  };

  const saveDataToBackend = async () => {
    try {
      if (!userId) {
        showNotification('error', 'No se encontró el ID del profesional. Por favor, inicie sesión nuevamente.');
        return false;
      }

      // Verificar horarios duplicados en el mismo día antes de enviar
      for (const schedule of scheduleData) {
        const times = schedule.times.map(t => t.time).filter(t => t !== "");
        const uniqueTimes = new Set(times);
        if (times.length !== uniqueTimes.size) {
          showNotification('error', `Hay horarios duplicados en la fecha ${schedule.date}. Por favor, revise y corrija.`);
          return false;
        }
      }

      // Recolectar todas las fechas y horarios nuevos
      const availableDates = scheduleData.flatMap(schedule =>
        schedule.times
          .filter(time => time.isNew && time.time !== "") // Filtrar horarios vacíos
          .map(({ time }) => ({
            dateTime: `${schedule.date}T${time}`,
            professionalId: Number(userId),
            typeAppointment: "ENFERMERIA"
          }))
      );

      if (availableDates.length === 0) {
        showNotification('warning', 'No hay horarios nuevos para guardar.');
        return false;
      }

      setIsLoading(true);

      const response = await api.post("/appointment/create-date", {
        availableDates,
        professionalId: Number(userId)
      });

      if (response?.status === 200 || response?.status === 201) {
        const updatedScheduleData = scheduleData.map(schedule => ({
          ...schedule,
          times: schedule.times.map(time => ({
            ...time,
            isNew: false
          }))
        }));

        setScheduleData(updatedScheduleData);
        setOriginalScheduleData(updatedScheduleData);
        setModifiedScheduleData([]);

        await fetchAvailableDates();
        return true;
      } else {
        throw new Error('Error al guardar los horarios.');
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        showNotification('error', 'Algunos horarios ya existen. Por favor, verifique e intente nuevamente.');
      } else {
        showNotification('error', 'Hubo un error al guardar los horarios.');
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handlerBtnSave = () => {
    // Verificar si hay fechas nuevas para guardar
    const hasNewDates = scheduleData.some(schedule =>
      schedule.times.some(time => time.isNew && time.time !== "")
    );

    if (!hasNewDates) {
      showNotification('warning', 'No hay cambios nuevos para guardar.');
      return;
    }

    setIsSaveChangesModalVisible(true);
  };

  return (
    <>
      {contextHolder}
      <HeaderNurse />
      <div className="becas-section" style={{ marginTop: "100px" }}>
        {/* Modal para Guardar Cambios */}
        <ReusableModal
          visible={isSaveChangesModalVisible}
          title="Guardar Cambios"
          content="¿Desea guardar estos cambios?"
          cancelText="No"
          confirmText={isLoading ? 'Guardando...' : 'Sí'}
          onCancel={() => setIsSaveChangesModalVisible(false)}
          onConfirm={confirmSaveChanges}
        />

        {/* Modal para Eliminar Hora */}
        <ReusableModal
          visible={isDeleteTimeModalVisible}
          title="Confirmar Eliminación"
          content="¿Está seguro de que desea eliminar esta hora?"
          cancelText="No"
          confirmText="Sí"
          onCancel={() => setIsDeleteTimeModalVisible(false)}
          onConfirm={handleDeleteTime}
        />

        <div style={styles.contentTitle}>
          <h1>Definir Horarios</h1>
          <p>Aquí se puede definir el horario para citas disponibles</p>
        </div>

        <Flex justify="center" align="center" style={styles.tableWrapper}>
          <table style={styles.cssTable}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>Fecha</th>
                <th style={styles.tableHeader}>Horarios</th>
              </tr>
            </thead>
            <tbody>
              {scheduleData.length === 0 ? (
                <tr>
                  <td colSpan="2" style={{ color: 'black', textAlign: 'center', padding: '1rem' }}>
                    No hay horarios disponibles. Presiona "Agregar fecha" para comenzar.
                  </td>
                </tr>
              ) : (
                scheduleData.map((schedule, dateIndex) => (
                  <React.Fragment key={`fragment-${dateIndex}`}>
                    <tr key={`dateRow-${dateIndex}`}>
                      <td style={styles.tableCell}>
                        {isEditing ? (
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <DateSpanish
                              value={schedule.date}
                              onChange={(date) => handlerDateChange(date, dateIndex)}
                              disabledDate={(current) => current && current.isBefore(dayjs(), 'day')}
                              disabled={!isEditing || schedule.date !== ""} // Solo editable si está en modo edición y es una fecha nueva
                              style={{ width: '100%' }}
                            />
                            <Button
                              type="link"
                              onClick={() => handleDeleteDate(schedule.date)}
                              disabled={isLoading}
                              icon={<CloseCircleOutlined />}
                              danger
                            >
                              Eliminar
                            </Button>
                          </div>
                        ) : (
                          <span>{schedule.date}</span>
                        )}
                      </td>

                      <td style={styles.tableCell}>
                        {schedule.times.map((time, timeIndex) => (
                          <div key={`time-${dateIndex}-${timeIndex}`} style={{ display: 'flex', alignItems: 'center' }}>
                            {isEditing ? (
                              <>
                                <TimeSpanish
                                  value={time.time}
                                  onChange={(newTime) => handlerTimeChange(newTime, dateIndex, timeIndex)}
                                  disabled={!isEditing || !time.isNew}
                                  disabledHours={getDisabledHours}
                                  style={{ width: '100%', marginBottom: '0.5rem' }}
                                />
                                <Button
                                  type="link"
                                  icon={<CloseCircleOutlined />}
                                  danger
                                  onClick={() => handleRemoveEmptyTime(dateIndex, timeIndex)}
                                />
                              </>
                            ) : (
                              <span style={{ display: 'block', marginBottom: '0.5rem' }}>{time.time}</span>
                            )}
                          </div>
                        ))}
                        {isEditing && (
                          <Button
                            type="link"
                            style={styles.linkButton}
                            onClick={() => handlerCreateTime(dateIndex)}
                            disabled={isLoading}
                          >
                            +<span style={styles.decorateText}> Agregar hora</span>
                          </Button>
                        )}
                      </td>
                    </tr>

                    {dateIndex < scheduleData.length - 1 && (
                      <tr key={`separator-${dateIndex}`}>
                        <td colSpan={2} style={{ borderBottom: '2px solid #f0f0f0', height: '0.5rem' }}></td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
              {isEditing && (
                <tr>
                  <td colSpan="2" style={{ textAlign: 'center', padding: '0.5rem' }}>
                    <Button
                      type="link"
                      style={styles.linkButton}
                      onClick={handlerCreateDate}
                      disabled={isLoading}
                    >
                      +<span style={styles.decorateText}> Agregar fecha</span>
                    </Button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Flex>

        <Flex justify="center" align="center" style={styles.marginTopEdit} gap={30}>
          {!isEditing && (
            <button
              className="button-save"
              onClick={handlerEdit}
              disabled={isLoading}
            >
              Agregar fecha
            </button>
          )}
          {isEditing && (
            <>
              <button
                className="button-save"
                onClick={handlerBtnSave}
                disabled={isLoading}
              >
                {isLoading ? 'Guardando...' : 'Guardar'}
              </button>
              <button
                className="button-cancel"
                onClick={handlerDontEdit}
                disabled={isLoading}
              >
                Cancelar
              </button>
            </>
          )}
        </Flex>
      </div>

      <FooterProfessionals />
    </>
  );
}