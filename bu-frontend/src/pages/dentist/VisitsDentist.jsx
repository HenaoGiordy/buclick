import React, { useState } from "react";
import { DatePicker, Form, Card, Space, Input, Select, Row, Col, Button, message } from "antd";
import esLocale from "antd/es/date-picker/locale/es_ES";
import HeaderDentist from "../../components/dentist/HeaderDentist";
import SearchInputR from '../../components/global/SearchInputR.jsx';
import FooterProfessionals from "../../components/global/FooterProfessionals.jsx";
import api from '../../api';

const VisitsDentist = () => {
  const [fecha, setFecha] = useState(null);
  const [codigoCedula, setCodigoCedula] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [planArea, setPlanArea] = useState("");
  const [motivo, setMotivo] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const [form] = Form.useForm();

  const motivoOptions = [
    { value: "AYUDAS_DIAGNOSTICAS", label: "Ayudas diagnósticas" },
    { value: "FORMULACION_DE_MEDICAMENTOS", label: "Formulación de medicamentos" },
    { value: "HIGIENE_ORAL", label: "Higiene oral" },
    { value: "REMISION_A_OTRAS_DEPENDENCIAS", label: "Remisión a otras dependencias" },
    { value: "RESINA_DE_FOTOCURADO", label: "Resina de fotocurado" },
    { value: "REVALORACION", label: "Revaloración" },
    { value: "URGENCIA_ODONTOLOGICA", label: "Urgencia odontológica" },
    { value: "VALORACION_PRIMERA_VEZ", label: "Valoración primera vez" }
  ];

  const handleSearchUser = async () => {
    try {
      const { data } = await api.get(`/odontology-visits/search/${codigoCedula}`);
      setNombre(data.name);
      setApellido(data.lastName);
      setPlanArea(data.plan);
      message.success("Usuario encontrado");
  
      form.setFieldsValue({
        nombre: data.name,
        apellido: data.lastName,
        planArea: data.plan,
      });
    } catch (error) {
      message.error("Usuario no registrado. Realice el registro para crearlo.");
    }
  };
  
  const handleRegisterVisit = async () => {
    form.validateFields()
      .then(async () => {
        const payload = {
          date: fecha ? fecha.format("YYYY-MM-DD") : null,
          time: "00:00:00",
          username: codigoCedula,
          name: nombre,
          lastname: apellido,
          plan: planArea,
          reason: motivo,
          description: descripcion,
        };

        try {
          await api.post("/odontology-visits/register", payload);
          message.success("Visita registrada exitosamente");
          resetFields();
        } catch (error) {
          message.error("Ocurrió un error al registrar la visita.");
        }
      })
      .catch(() => {
        message.error("Por favor, complete todos los campos obligatorios.");
      });
  };

  const resetFields = () => {
    setFecha(null);
    setCodigoCedula("");
    setNombre("");
    setApellido("");
    setPlanArea("");
    setMotivo("");
    setDescripcion("");
    form.resetFields();
  };

  // Función para deshabilitar fechas futuras
  const disableFutureDates = (current) => {
    return current && current.isAfter(new Date());  // Deshabilita fechas futuras
  };


  return (
    <>
      <HeaderDentist />
      <main className="becas-section" style={{ marginTop: "100px" }}>
        <h1>Registro de visitas</h1>
        <p style={{ textAlign: "center", color: "#555", fontSize: "16px", marginBottom: "20px" }}>
          Aquí se podrán registrar las visitas de usuarios al servicio
        </p>
        <Card bordered style={{ width: "100%", maxWidth: "700px", margin: "0 auto" }}>
          <Space direction="vertical" size={16} style={{ width: "100%" }}>
            <Form form={form} layout="vertical">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item 
                    label="Fecha" 
                    name="fecha" 
                    rules={[{ required: true, message: "La fecha es obligatoria" }]}
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
                  <Form.Item label="Código/cédula" name="codigoCedula" rules={[{ required: true, message: "El código/cédula es obligatorio" }]}>
                    <SearchInputR 
                      value={codigoCedula} 
                      onSearch={handleSearchUser} 
                      onChange={(e) => setCodigoCedula(e.target.value)} 
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item 
                    label="Nombre" 
                    name="nombre" 
                    rules={[
                      { required: true, message: "El nombre es obligatorio" },
                      { pattern: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, message: "El nombre solo puede contener letras y tildes" }
                    ]}
                  >
                    <Input
                      placeholder="Nombre del paciente"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item 
                    label="Apellido" 
                    name="apellido" 
                    rules={[
                      { required: true, message: "El apellido es obligatorio" },
                      { pattern: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, message: "El apellido solo puede contener letras y tildes" }
                    ]}
                  >
                    <Input
                      placeholder="Apellido del paciente"
                      value={apellido}
                      onChange={(e) => setApellido(e.target.value)}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item 
                    label="Plan/área dependencia" 
                    name="planArea" 
                    rules={[
                      { required: true, message: "El plan de dependencia es obligatorio" },
                      { pattern: /^[A-Za-z0-9\s]+$/, message: "El plan/área no puede contener símbolos" }
                    ]}
                  >
                    <Input
                      placeholder="Plan o área de dependencia"
                      value={planArea}
                      onChange={(e) => setPlanArea(e.target.value)}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Motivo" name="motivo" rules={[{ required: true, message: "El motivo es obligatorio" }]}>
                    <Select
                      value={motivo}
                      onChange={(value) => setMotivo(value)}
                      options={motivoOptions}
                    />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Descripción de la visita" name="descripcion">
                    <Input.TextArea
                      placeholder="Descripción de la visita"
                      value={descripcion}
                      onChange={(e) => setDescripcion(e.target.value)}
                      rows={4}
                      maxLength={200}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Space>
          <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "20px" }}>
            <Button type="primary" className='button-save'onClick={handleRegisterVisit}>Guardar</Button>
            <Button className='button-cancel' onClick={resetFields}>Cancelar</Button>
          </div>
        </Card>
      </main>
      <FooterProfessionals/>
    </>
  );
};

export default VisitsDentist;