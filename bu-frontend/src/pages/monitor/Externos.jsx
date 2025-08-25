import HeaderMonitor from "../../components/monitor/HeaderMonitor";

import React, { useState, useEffect, useRef } from 'react';
import FooterProfessionals from "../../components/global/FooterProfessionals.jsx";
import { Button, Col, Form, Card, Space, Row, Input, Select, message } from 'antd';
import api from '../../api';
import SearchInputR from '../../components/global/SearchInputR';

const Externos = () => {

  const [becas, setBecas] = useState('');
  const [cedula, setCedula] = useState('');
  const [externoData, setExternoData] = useState(null);

  const [availability, setAvailability] = useState(0);
  const [availabilityType, setAvailabilityType] = useState(''); // Agregado para tipo de disponibilidad
  const availabilityTypeRef = useRef(''); // Referencia para sincronizar availabilityType

  const [settings, setSettings] = useState(null);  // Estado para almacenar las configuraciones de becas

  const [form] = Form.useForm();


  const becasOptions = [
    { value: 'Almuerzo', label: 'Almuerzo' },
    { value: 'Refrigerio', label: 'Refrigerio' }
  ];

  const handleCedulaChange = (e) => {
    setCedula(e.target.value);
  };

  // Función para validar si la hora seleccionada está dentro de un rango
  const isTimeInRange = (selectedTime, startTime, endTime) => {
    const selectedHour = selectedTime.getHours();
    const selectedMinutes = selectedTime.getMinutes();

    const [startHour, startMinutes] = startTime.split(':').map(Number);
    const [endHour, endMinutes] = endTime.split(':').map(Number);

    return (
      (selectedHour > startHour || (selectedHour === startHour && selectedMinutes >= startMinutes)) &&
      (selectedHour < endHour || (selectedHour === endHour && selectedMinutes <= endMinutes))
    );
  };


  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      // Validación de si los ajustes de horas y cantidad de becas están definidos
      if (!settings.starLunch || !settings.endLunch || !settings.starSnack || !settings.endSnack) {
        message.error('Aún no hay reservas disponibles, por favor configure los horarios y la cantidad de becas.');
        return;
      }

      // Validación de si la reserva está dentro del rango permitido
      const currentTime = new Date();
      const startLunch = new Date(`${currentTime.toISOString().split('T')[0]}T${settings.starLunch}`);
      const endLunch = new Date(`${currentTime.toISOString().split('T')[0]}T${settings.endLunch}`);
      const startSnack = new Date(`${currentTime.toISOString().split('T')[0]}T${settings.starSnack}`);
      const endSnack = new Date(`${currentTime.toISOString().split('T')[0]}T${settings.endSnack}`);

      const selectedTime = currentTime;

      //Almuezo
      if (becas === 'Almuerzo') {
        if (!isTimeInRange(selectedTime, settings.starLunch, settings.endLunch)) {
          message.error('No está en el rango de hora para realizar la reserva de almuerzo');
          return;
        }
      }

      // Refrigerio
      if (becas === 'Refrigerio') {
        if (!isTimeInRange(selectedTime, settings.starSnack, settings.endSnack)) {
          message.error('No está en el rango de hora para realizar la reserva de refrigerio');
          return;
        }
      }

      // Validación de disponibilidad
      if (becas === 'Almuerzo' && availability <= 0) {
        message.error('No hay almuerzos disponibles');
        return;
      }

      if (becas === 'Refrigerio' && availability <= 0) {
        message.error('No hay refrigerios disponibles');
        return;
      }


      const requestPayload = {
        username: values.cedula,
        name: values.name,
        lastName: values.lastname,
        plan: values.dependencia,
        email: values.email,
        lunch: becas === 'Almuerzo',
        snack: becas === 'Refrigerio'
      };

      const response = await api.post('/reservations/create-extern', requestPayload);

      if (response.status === 201) {
        message.success('Reserva realizada con éxito.');
        form.resetFields();
        setBecas('');
      } else {
        message.error('Error al realizar la reserva.');
      }
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;

        // Función para obtener el mensaje de error
        const getErrorMessage = (data) => {
          if (typeof data === "string") {
            return data; // Si data es un string, lo usamos directamente
          } else if (data && data.message) {
            return data.message; // Si data tiene un campo message, lo usamos
          }
          return "Ocurrió un error desconocido."; // Mensaje por defecto
        };

        // Manejo de errores según el código de estado
        switch (status) {
          case 400:
            message.error(getErrorMessage(data) || "Solicitud incorrecta. Verifica los datos enviados.");
            break;
          case 401:
            message.error(getErrorMessage(data) || "No autorizado. Verifica tus credenciales.");
            break;
          case 403:
            message.error(getErrorMessage(data) || "Acceso denegado. No tienes permisos para realizar esta acción.");
            break;
          case 404:
            message.error(getErrorMessage(data) || "Recurso no encontrado. Verifica el endpoint.");
            break;
          case 409:
            message.error(getErrorMessage(data) || "Conflicto. La operación no pudo completarse.");
            break;
          case 500:
            message.error(getErrorMessage(data) || "Error interno del servidor. Inténtalo más tarde.");
            break;
          default:
            message.error(getErrorMessage(data) || "Ocurrió un error desconocido.");
            break;
        }
      } else {
        message.error("Verifique la información suministrada.");
      }
    }
  };

  const handleBecasChange = (value) => {
    setBecas(value);
  };


  const handleSearch = async () => {
    if (!cedula.trim()) {
      message.warning("Ingrese la cédula de un usuario para buscar.");
      return;
    }
    try {
      const response = await api.get(`/reservations/extern/${cedula}`);
      const externoData = response.data;

      // Rellenar los campos del formulario con los datos obtenidos
      form.setFieldsValue({
        username: externoData.cedula,
        name: externoData.name,
        lastname: externoData.lastName,
        dependencia: externoData.plan,
        email: externoData.email,
      });

      message.success('Usuario encontrado');
    } catch (error) {
      console.error("Error al buscar el usuario externo:", error);
      form.resetFields();
      message.error('Usuario no encontrado');
    }
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

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get('/setting');
        setSettings(response.data[0]?.settingRequest || {}); // Almacena el objeto de configuración, si no existe se establece como un objeto vacío
      } catch (error) {
        console.error('Error al obtener las configuraciones', error);
      }
    };

    fetchSettings();
  }, []);


  const formatTime = (timeString) => {
    const currentDate = new Date().toISOString().split('T')[0]; // Solo la fecha actual (YYYY-MM-DD)
    const formattedTimeString = `${currentDate}T${timeString}`;

    const date = new Date(formattedTimeString);

    if (isNaN(date)) {
      return 'Hora por definir';
    }

    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    const hour12 = hours % 12 || 12;
    const ampm = hours >= 12 ? 'PM' : 'AM';

    const formattedTime = `${hour12}:${String(minutes).padStart(2, '0')} ${ampm}`;
    return formattedTime;
  };


  return (
    <>
      <HeaderMonitor />
      <main className="becas-section" style={{ marginTop: '100px' }}>
        <h1 className="text-xl font-bold" style={{ marginBottom: '12px' }}>Reserva para externos</h1>
        <p style={{ marginBottom: '6px' }}>Aquí se podrán registrar las reservas para usuarios externos.</p>


        <Card
          bordered={true}
          style={{
            width: '100%',
            maxWidth: '700px',
            marginTop: '100px',
            margin: '3px auto',
            justifyContent:
              'center'
          }}>

          {settings && (
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderRadius: '8px' }}>
              <div style={{ flex: 1, textAlign: 'center', padding: '10px', borderRight: '2px solid #ddd' }}>
                Reserva almuerzo entre <strong>{formatTime(settings.starLunch)}</strong> y <strong>{formatTime(settings.endLunch)}</strong>
              </div>
              <div style={{ flex: 1, textAlign: 'center', padding: '10px' }}>
                Reserva refrigerio entre <strong>{formatTime(settings.starSnack)}</strong> y <strong>{formatTime(settings.endSnack)}</strong>
              </div>
            </div>
          )}

          <Space style={{ marginTop: '20px', alignItems: 'center' }}>
            <p style={{ fontWeight: 'bold' }}>
              Reservas disponibles {availabilityType.toLowerCase()}: {availability} {/* Muestra el tipo y la disponibilidad */}
            </p>
          </Space>

          <Space direction="vertical" size={16} style={{ width: '95%' }}>
            <Form form={form} layout="vertical"> {/* Aquí se conecta la instancia de formulario */}
              <Row gutter={40}>
                <Col span={12}>
                  <Form.Item label="Cédula" labelAlign="left" name="cedula" rules={[
                    { required: true, message: 'Por favor ingrese el número de cédula' },
                    { pattern: /^[1-9]\d*$/, message: 'Solo se permiten números positivos' },
                  ]}>
                    <SearchInputR
                      onSearch={handleSearch}
                      value={cedula}
                      onChange={handleCedulaChange}
                      placeholder="Ingrese la cédula"
                    />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item label="Nombre" labelAlign="left" name="name" rules={[
                    { required: true, message: 'Por favor ingrese el nombre' },]}>
                    <Input placeholder="Ingrese el nombre"
                      onKeyPress={(e) => {
                        const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
                        if (!regex.test(e.key)) {
                          e.preventDefault(); // Evita el ingreso de caracteres no permitidos
                        }
                      }}
                    />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item label="Apellido" labelAlign="left" name="lastname" rules={[
                    { required: true, message: 'Por favor ingrese el apellido' },
                  ]}>
                    <Input placeholder="Ingrese el apellido"
                      onKeyPress={(e) => {
                        const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
                        if (!regex.test(e.key)) {
                          e.preventDefault(); // Evita el ingreso de caracteres no permitidos
                        }
                      }}
                    />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item label="Área dependencia" labelAlign="left" name="dependencia" rules={[
                    { required: true, message: 'Por favor ingrese el área de dependencia' },
                  ]}>
                    <Input placeholder="Ingrese el área de dependencia"
                      onKeyPress={(e) => {
                        const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
                        if (!regex.test(e.key)) {
                          e.preventDefault(); // Evita el ingreso de caracteres no permitidos
                        }
                      }}
                    />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    label="Correo"
                    labelAlign="left"
                    name="email"
                    required
                    rules={[
                      { required: true, message: 'Por favor ingrese el correo electrónico' },
                      { type: 'email', message: 'Por favor ingrese un correo electrónico válido ej: uv@gmail.com' }
                    ]}
                  >
                    <Input type="email" placeholder="Ingrese el correo" />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item label={<span>Tipo de beneficio</span>}
                    name="becas" labelAlign="left"
                    rules={[
                      { required: true, message: 'Por favor ingrese el tipo de beneficio' },
                    ]}
                  >
                    <Select
                      value={becas}
                      options={becasOptions}
                      onChange={handleBecasChange}
                      placeholder="Seleccione tipo de beneficio"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Space>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
            <Button className="button-save" onClick={handleSave}>Reservar</Button>
            <Button className="button-cancel" onClick={() => {
              form.resetFields(); // Limpia los campos del formulario
              setCedula(''); // Limpia el estado de búsqueda
            }}>Cancelar</Button>
          </div>
        </Card>
      </main >
      <FooterProfessionals />
    </>
  );
};

export default Externos;