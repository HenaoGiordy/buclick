import HeaderMonitor from "../../components/monitor/HeaderMonitor";

import React, { useEffect, useState, useRef } from 'react';
import api from '../../api';
import { ReloadOutlined } from '@ant-design/icons';
import FooterProfessionals from "../../components/global/FooterProfessionals.jsx";
import SearchReservantions from "../../components/admin/SearchReservantions.jsx";
import TablePaginationR from '../../components/global/TablePaginationR.jsx';
import ReusableModal from '../../components/global/ReusableModal.jsx';

import { Card, Space, Descriptions, Button, message } from 'antd';

const Reservation = () => {
    const [reservationData, setReservationData] = useState(null);
    const [tableData, setTableData] = useState([]); // Para guardar los datos de la tabla
    const [currentPage, setCurrentPage] = useState(1); // Página actual
    const [totalItems, setTotalItems] = useState(0); // Total de items (para paginación)
    const itemsPerPage = 10; // Elementos por página
    const [availability, setAvailability] = useState(0);
    const [availabilityType, setAvailabilityType] = useState(''); // Agregado para tipo de disponibilidad
    const [modalVisible, setModalVisible] = useState(false);
    const [cancelModalVisible, setCancelModalVisible] = useState(false);
    const availabilityTypeRef = useRef(''); // Referencia para sincronizar availabilityType

    const handleSearch = async (username) => {
        if (!username.trim()) {
            message.warning("Ingrese el código o cédula de un usuario para buscar.", 5);
            return;
        }
        try {
            const response = await api.get(`/reservations/by-username/${username}`);
            setReservationData(response.data[0]); // Aquí traes la respuesta
        } catch (error) {
            message.error('No se pudo encontrar la reserva para el usuario.');
            setReservationData(null); // Limpiar si no hay resultados
        }
    };

    // Función para registrar el pago
    const handlePayment = async () => {
        if (!reservationData) {
            console.log("No hay datos de reserva disponibles.");
            return;
        }

        try {
            const paymentRequest = {
                username: reservationData.username, // Enviar el nombre de usuario
                paid: true, // Indicar que se ha pagado
            };

            const response = await api.put('/reservations/register-payment', paymentRequest);

            // Mostrar mensaje de éxito
            message.success(response.data.message);

            // Limpiar los datos de la reserva después de registrar el pago
            setReservationData(null);
            await fetchReservations();
        } catch (error) {
            // Muestra el error si algo sale mal
            console.error("Error al intentar registrar el pago:", error);
            message.error('No se pudo registrar el pago.');
        }
    };

    const handleCancel = async () => {
        if (!reservationData) {
            console.log("No hay datos de reserva disponibles para cancelar.");
            return;
        }

        try {
            const response = await api.delete(`/reservations/cancel/${reservationData.reservationId}`);

            // Mostrar mensaje de éxito
            message.success(response.data.message);

            // Limpiar los datos de la reserva después de cancelar
            setReservationData(null);
            await fetchReservations();
        } catch (error) {
            // Muestra el error si algo sale mal
            console.error("Error al intentar cancelar la reserva:", error);
            message.error('No se pudo cancelar la reserva.');
        }
    };
    // Función para formatear la hora en formato 12 horas
    const formatTime = (timeString) => {
        const currentDate = new Date().toISOString().split('T')[0]; // Solo la fecha actual (YYYY-MM-DD)
        const formattedTimeString = `${currentDate}T${timeString}`;

        const date = new Date(formattedTimeString);

        if (isNaN(date)) {
            console.error('Fecha inválida:', formattedTimeString);
            return 'Hora inválida';
        }

        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();

        const hour12 = hours % 12 || 12;
        const ampm = hours >= 12 ? 'PM' : 'AM';

        const formattedTime = `${hour12}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')} ${ampm}`;
        return formattedTime;
    };

    // Función para formatear la fecha
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-CA'); // Formato YYYY-MM-DD (ISO)
    };


    // Agrega esta función para obtener las reservas
    const fetchReservations = async () => {
        try {
            const response = await api.get(`/reservations/all?page=${currentPage - 1}&size=${itemsPerPage}`);
            setTableData(response.data.content);
            setTotalItems(response.data.page.totalElements); // Total de reservas
            setCurrentPage(response.data.page.number + 1); // Página actual (ajusta para que sea 1-indexed)
        } catch (error) {
            console.error("Error al obtener las reservas:", error);
            message.error('No se pudieron cargar las reservas.');
        }
    };

    // Usa un efecto para cargar las reservas iniciales
    useEffect(() => {
        fetchReservations();
    }, [currentPage]);

    // Manejador para cambiar de página
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Llama al endpoint para obtener la disponibilidad por hora

    const fetchAvailability = async () => {
        try {
            const response = await api.get('/reservations/availability-per-hour');
            setAvailability(response.data.availability || 0);
            setAvailabilityType(response.data.type || ''); // Actualiza el tipo de disponibilidad
        } catch (error) {
            console.error('Error al obtener la disponibilidad de reservas:', error.response?.data || error.message);
            message.error('No se pudo obtener la disponibilidad.');
            setAvailability(0);
            setAvailabilityType(''); // Resetea el tipo en caso de error
        }
    };

    useEffect(() => {
        const fetchInitialData = async () => {
            try {

                const response = await api.get('/reservations/availability-per-hour');

                setAvailability(response.data.availability || 0);
                setAvailabilityType(response.data.type || '');
                availabilityTypeRef.current = response.data.type || ''; // Actualizar referencia

            } catch (error) {
                console.error("Error al obtener la disponibilidad de reservas:", error.response?.data || error.message);
                message.error('No se pudo cargar la disponibilidad.');
                setAvailability(0);
                setAvailabilityType('');
                availabilityTypeRef.current = ''; // Restablecer referencia
            }
        };

        fetchInitialData(); // Cargar datos iniciales

        const socket = new WebSocket(window.env.WEB_SOCKET);

        socket.onopen = () => {
            console.log("Conexión WebSocket establecida");
        };

        socket.onmessage = (event) => {

            try {
                const data = JSON.parse(event.data);

                if (data.availability !== undefined && data.type !== undefined) {
                    // Manejar formato de disponibilidad por hora
                    setAvailability(data.availability);
                    setAvailabilityType(data.type);
                    availabilityTypeRef.current = data.type; // Actualizar referencia

                } else if (data.remainingSlotsLunch !== undefined && data.remainingSlotsSnack !== undefined) {
                    // Manejar formato de disponibilidad general
                    if (availabilityTypeRef.current === "Almuerzo") {
                        setAvailability(data.remainingSlotsLunch);

                    } else if (availabilityTypeRef.current === "Refrigerio") {
                        setAvailability(data.remainingSlotsSnack);
                    }
                } else {
                    console.warn("Mensaje recibido con datos desconocidos o incompletos:", data);
                }
            } catch (error) {
                console.error("Error al procesar el mensaje del servidor:", error);
            }
        };

        socket.onclose = () => {
            console.log("Conexión WebSocket cerrada");
        };

        socket.onerror = (error) => {
            console.error("Error en la conexión WebSocket:", error);
        };

        // Cleanup al desmontar el componente
        return () => {
            socket.close();
        };
    }, []);



    // Estilos personalizados para los botones
    const styles = {
        buttonContainer: {
            display: 'flex',
            justifyContent: 'center',
            marginTop: '20px',
        },
        payButton: {
            marginRight: '10px',
        },
    };

    // Función para mostrar el modal de confirmación de pago
    const showPaymentConfirmationModal = () => {
        setModalVisible(true);
    };

    // Función para manejar la confirmación en el modal
    const handleConfirmPayment = () => {
        setModalVisible(false);
        handlePayment(); // Ejecuta el pago cuando se confirma
    };

    // Mostrar modal de cancelación
    const showCancelConfirmationModal = () => {
        setCancelModalVisible(true);
    };

    // Ocultar modal de cancelación
    const handleConfirmCancel = () => {
        setCancelModalVisible(false);
        handleCancel(); // Ejecuta la cancelación cuando se confirma
    };

    return (
        <>
            <HeaderMonitor />
            <main
                style={{
                    marginTop: '100px',
                    padding: '0 20px',
                    display: 'flex',
                    justifyContent: 'center'
                }}
            >
                <Card
                    bordered={true}
                    style={{
                        width: '100%',
                        maxWidth: '700px',
                        marginTop: '100px',
                        margin: '3px auto',
                        justifyContent: 'center'
                    }}
                >
                    <Space style={{ marginTop: '5px', alignItems: 'center' }}>
                        <h1 className="titleCard"><strong>Reservas realizadas</strong></h1>
                    </Space>

                    <p>Aquí puedes buscar las personas que han reservado la beca de alimentación.</p>

                    <div
                        style={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            marginTop: '20px'
                        }}
                    >
                        <SearchReservantions onSearch={handleSearch} placeholder="Ingrese el código/cédula" />
                    </div>

                    <Space style={{ marginTop: '20px', alignItems: 'center' }}>
                        <p style={{ fontWeight: 'bold' }}>
                            Reservas disponibles de {availabilityType.toLowerCase()}: {availability} {/* Muestra el tipo y la disponibilidad */}
                        </p>
                    </Space>


                    {/* Información de la persona con Descriptions */}
                    {reservationData && (
                        <>
                            <Descriptions
                                title="Información de la persona"
                                className="descriptions-title"
                                bordered
                                column={1}
                                style={{
                                    marginTop: '15px',
                                    width: '100%',
                                    margin: 'auto'
                                }}
                            >
                                <Descriptions.Item label={<span style={{ fontWeight: 'bold' }}>Nombre</span>} className="descriptions-item">
                                    {`${reservationData.name} ${reservationData.lastName}`}
                                </Descriptions.Item>

                                <Descriptions.Item label={<span style={{ fontWeight: 'bold' }}>Código</span>} className="descriptions-item">
                                    {reservationData.username}
                                </Descriptions.Item>

                                <Descriptions.Item label={<span style={{ fontWeight: 'bold' }}>Fecha y hora de la reserva</span>} className="descriptions-item">
                                    {`${formatDate(reservationData.date)} ${formatTime(reservationData.time)}`}
                                </Descriptions.Item>

                                <Descriptions.Item label={<span style={{ fontWeight: 'bold' }}>Tipo beca</span>} className="descriptions-item">
                                    {reservationData.lunch && reservationData.snack
                                        ? "Almuerzo y Refrigerio"
                                        : reservationData.lunch
                                            ? "Almuerzo"
                                            : reservationData.snack
                                                ? "Refrigerio"
                                                : "Sin beneficio"}
                                </Descriptions.Item>
                            </Descriptions>

                            {/* Botones */}
                            <div style={styles.buttonContainer}>
                                <Button type="primary" className="button-pay" style={styles.payButton} onClick={showPaymentConfirmationModal} >
                                    Pagar
                                </Button>
                                <Button type="default" htmlType="reset" className="button-cancel" onClick={showCancelConfirmationModal}>
                                    Cancelar reserva
                                </Button>
                            </div>

                            {/* Modal de confirmación de pago */}
                            <ReusableModal
                                title="Confirmación de pago"
                                content={`¿Está seguro de realizar el pago a ${reservationData.name} ${reservationData.lastName}?`}
                                cancelText="Cancelar"
                                confirmText="Confirmar"
                                onCancel={() => setModalVisible(false)}
                                onConfirm={handleConfirmPayment}
                                visible={modalVisible} // Controla la visibilidad del modal
                            />
                            {/* Modal de confirmación de cancelación */}
                            <ReusableModal
                                title="Confirmación cancelación de reserva"
                                content={`¿Está seguro de cancelar la reserva de ${reservationData.name} ${reservationData.lastName}?`}
                                cancelText="Cancelar"
                                confirmText="Confirmar"
                                onCancel={() => setCancelModalVisible(false)}
                                onConfirm={handleConfirmCancel}
                                visible={cancelModalVisible} // Controla la visibilidad del modal de cancelación
                            />

                        </>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <div style={{ flexGrow: 1 }}></div>
                        <Button
                            icon={<ReloadOutlined />}
                            className="button-save"
                            style={{ backgroundColor: '#C20E1A', color: 'white', border: 'none' }}
                            onClick={fetchReservations}
                        />
                    </div>

                    {/* Componente de Tabla con Paginación */}
                    <TablePaginationR
                        rows={tableData.map(reservation => [
                            <span onClick={() => handleSearch(reservation.username)} style={{ cursor: 'pointer', color: 'blue' }}>
                                {reservation.username}
                            </span>,
                            `${reservation.name} ${reservation.lastName}`,
                            `${formatDate(reservation.data)} ${formatTime(reservation.time)}`
                        ])}
                        columns={['Código/cédula', 'Nombre', 'Fecha y hora de reserva']}
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

export default Reservation;