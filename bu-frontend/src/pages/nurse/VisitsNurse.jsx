import React, { useState } from "react";
import HeaderNurse from "../../components/nurse/HeaderNurse.jsx";
import esLocale from "antd/es/date-picker/locale/es_ES";
import SearchInputR from "../../components/global/SearchInputR.jsx";
import FooterProfessionals from "../../components/global/FooterProfessionals.jsx";
import moment from "moment";
import {
  DatePicker,
  Form,
  Card,
  Space,
  Input,
  InputNumber,
  Select,
  Row,
  Col,
  Button,
  message,
} from "antd";
import api from "../../api";

const VisitsNurse = () => {
  const [fecha, setFecha] = useState(null);
  const [username, setUsername] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [telefono, setTelefono] = useState("");
  const [planDependencia, setPlanDependencia] = useState("");
  const [semestre, setSemestre] = useState("");
  const [genero, setGenero] = useState("");
  const [conducta, setConducta] = useState("");
  const [diagnostico, setDiagnostico] = useState("");
  const [isPhoneError, setIsPhoneError] = useState(false);
  const [telefonoModificado, setTelefonoModificado] = useState(false);

  const [form] = Form.useForm();


  const genderOptions = ["MASCULINO", "FEMENINO", "OTRO", "NO_RESPONDE"];

  // Función para transformar las opciones
  const formatOptions = (options) => {
    return options.map((option) => {
      // Reemplazar guiones bajos por espacios y hacer la primera letra mayúscula
      return option
        .replace(/_/g, " ") // Reemplaza el guión bajo por espacio
        .toLowerCase() // Convierte todo a minúscula
        .replace(/^\w/, (c) => c.toUpperCase()); // Convierte la primera letra en mayúscula
    });
  };

  // Aplicamos la función a las listas
  const diagnosticMapping = {
    "Cólicos menstruales": "COLICOS_MENSTRUALES",
    "Curación": "CURACION",
    "Dolor de cabeza": "DOLOR_DE_CABEZA",
    "Dolor estomacal": "DOLOR_ESTOMACAL",
    "Dolor muscular": "DOLOR_MUSCULAR",
    "Malestar general": "MALESTAR_GENERAL",
    "Mareos desmayos": "MAREOS_DESMAYOS",
    "Preservativos": "PRESERVATIVOS",
    "Otro": "OTRO",
  };

  // Obtener las opciones para el Select
  const diagnosticOptions = Object.keys(diagnosticMapping).map((label) => ({
    label: label, // Lo que se muestra en la UI
    value: diagnosticMapping[label], // Lo que se enviará al backend
  }));

  const formattedGenderOptions = formatOptions(genderOptions);

  const handleSearchUser = async () => {
    if (!username.trim()) {
      message.warning("Ingrese el código o cédula de un usuario para buscar.");
      return;
    }
    try {
      const { data } = await api.get(`/nursing-activities/search/${username}`);
      setUsername(data.username);
      setNombre(data.name);
      setApellido(data.lastname);
      setTelefono(data.phone);
      setPlanDependencia(data.plan);
      setSemestre(data.semester);
      setGenero(data.gender);

      // Actualizar los valores del formulario con los datos encontrados
      form.setFieldsValue({
        username: data.username,
        nombre: data.name,
        apellido: data.lastname,
        telefono: data.phone,
        planDependencia: data.plan,
        semestre: data.semester,
        genero: data.gender,
      });
      message.success("Usuario encontrado");
    } catch {
      // Limpiar el formulario antes de buscar
      resetFields();
      message.error("Usuario no registrado. Realice el registro para crearlo");
    }
  };

  const handleRegisterActivity = async () => {
    // Validar campos requeridos
    form
      .validateFields()
      .then(async () => {
        const payload = {
          date: fecha,
          username: username.trim(),
          name: nombre,
          lastname: apellido,
          phone: telefono,
          plan: planDependencia,
          semester: semestre,
          gender: genero.toUpperCase(),
          diagnostic: diagnostico,
          conduct: conducta,
        };
        try {
          await api.post("/nursing-activities/register", payload);
          message.success("Actividad registrada exitosamente");
          resetFields();
        } catch {
          message.error("Ocurrió un error al registrar la actividad");
        }
      })
      .catch(() => {
        message.error("Por favor, complete todos los campos obligatorios");
      });
  };

  const resetFields = () => {
    setFecha(null);
    setUsername("");
    setNombre("");
    setApellido("");
    setTelefono("");
    setPlanDependencia("");
    setSemestre("");
    setGenero("");
    setConducta("");
    setDiagnostico("");
    setTelefono(""); // Restablece el teléfono a un valor vacío o a un valor por defecto
    setIsPhoneError(false);
    setTelefonoModificado(false);
    form.resetFields(); // Resetear el formulario de Ant Design
  };

  // Función para deshabilitar fechas futuras
  const disableFutureDates = (current) => {
    return current && current.isAfter(new Date());  // Deshabilita fechas futuras
  };

  // Esta función se ejecuta cuando el usuario escribe en el campo
  const handleChange = (e) => {
    const value = e.target.value.slice(0, 10); // Limita a 10 dígitos
    setTelefono(value);

    // Marca que el teléfono ha sido modificado por el usuario
    setTelefonoModificado(true);
    setIsPhoneError(value.length !== 10);
  };

  return (
    <>
      <HeaderNurse />
      <main className="becas-section" style={{ marginTop: "100px" }}>
        <h1 className="text-xl font-bold" style={{ marginBottom: "12px" }}>
          Registro de actividades
        </h1>
        <p style={{ marginBottom: "6px" }}>
          Aquí se podrán registrar las actividades de los usuarios en el
          servicio.
        </p>
        <Card
          bordered
          style={{ width: "100%", maxWidth: "700px", margin: "3px auto" }}
        >
          <Space direction="vertical" size={16} style={{ width: "95%" }}>
            <Form form={form} layout="vertical">
              <Row gutter={40}>
                <Col span={12}>
                  <Form.Item
                    label="Fecha"
                    name="fecha"
                    required
                    rules={[
                      { required: true, message: "La fecha es obligatoria" },
                    ]}
                  >
                    <DatePicker
                      locale={esLocale}
                      onChange={(date) => setFecha(date)}
                      value={fecha}
                      style={{ width: "100%" }}
                      allowClear={false} // Evita que se borre el contenido al escribir
                      inputReadOnly // Previene entrada manual en el input de fecha
                      disabledDate={disableFutureDates} // Deshabilita fechas futuras
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Código/cédula"
                    name="username"
                    required
                    rules={[
                      {
                        required: true,
                        message: "El código/cédula es obligatorio",
                      },
                    ]}
                  >
                    <SearchInputR
                      value={username}
                      onSearch={() => handleSearchUser()}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Nombre"
                    name="nombre"
                    required
                    rules={[
                      { required: true, message: "El nombre es obligatorio" },
                    ]}
                  >
                    <Input
                      placeholder="Nombre"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
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
                    label="Apellido"
                    name="apellido"
                    required
                    rules={[
                      { required: true, message: "El apellido es obligatorio" },
                    ]}
                  >
                    <Input
                      placeholder="Apellido"
                      value={apellido}
                      onChange={(e) => setApellido(e.target.value)}
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
                    label="Celular"
                    name="telefono"
                    required
                    rules={[
                      { required: true, message: "El celular es obligatorio" },
                      {
                        validator: (_, value) => {
                          if (telefonoModificado && (value.length !== 10)) {
                            return Promise.reject(new Error("El número de celular debe tener 10 dígitos"));
                          }
                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <Input
                      type="text"
                      placeholder="Celular"
                      value={telefono}
                      onKeyPress={(e) => {
                        if (!/[0-9]/.test(e.key)) {
                          e.preventDefault(); // Previene la entrada de cualquier carácter que no sea un número
                        }
                      }}
                      onChange={handleChange}
                      maxLength={10}
                      style={{ borderColor: isPhoneError ? "red" : "" }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Plan/área dependencia"
                    name="planDependencia"
                    rules={[
                      {
                        required: true,
                        message: "El plan o área dependencia es obligatorio.",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Plan o área de dependencia"
                      value={planDependencia}
                      onChange={(e) => setPlanDependencia(e.target.value)}
                      onKeyPress={(e) => {
                        const regex = /^[a-zA-Z0-9\s]+$/; // Permite letras, números y espacios
                        if (!regex.test(e.key)) {
                          e.preventDefault(); // Bloquea la entrada si no coincide con el patrón
                        }
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Semestre">
                    <Input
                      placeholder="Valor numérico entre 1 y 11"
                      value={semestre}
                      onChange={(e) => setSemestre(e.target.value)}
                      onKeyPress={(e) => {
                        const key = e.key;
                        const currentValue = e.target.value;
                        const newValue = currentValue + key;

                        // Permitir solo números entre 1 y 11
                        if (!/^[1-9]$|^10$|^11$/.test(newValue)) {
                          e.preventDefault();
                        }
                      }}
                    />                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Género"
                    name="genero"
                    required
                    rules={[
                      { required: true, message: "El género es obligatorio" },
                    ]}
                  >
                    <Select
                      value={genero}
                      onChange={setGenero}
                      options={formattedGenderOptions.map((option) => ({
                        value: option.toUpperCase().replace(/ /g, "_"), // valor que se enviará al backend
                        label: option,
                      }))}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Diagnóstico"
                    name="diagnostico"
                    required
                    rules={[
                      {
                        required: true,
                        message: "El diagnóstico es obligatorio",
                      },
                    ]}
                  >
                    <Select
                      value={diagnostico}
                      onChange={(value) => {                
                        setDiagnostico(value);
                      }}
                      options={diagnosticOptions}
                    />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Conducta">
                    <Input.TextArea
                      placeholder="Descripción de la conducta"
                      value={conducta}
                      onChange={(e) => setConducta(e.target.value)}
                      rows={4}
                      maxLength={200}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Space>
          <div
            style={{ display: "flex", justifyContent: "center", gap: "10px" }}
          >
            <Button
              type="primary"
              className="button-save"
              onClick={handleRegisterActivity}
            >
              Guardar
            </Button>
            <Button className="button-cancel" onClick={resetFields}>
              Cancelar
            </Button>
          </div>
        </Card>
      </main>
      <FooterProfessionals />
    </>
  );
};

export default VisitsNurse;
