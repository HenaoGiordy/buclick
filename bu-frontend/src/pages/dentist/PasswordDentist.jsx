import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import HeaderDentist from "../../components/dentist/HeaderDentist";
import { Card, Space, Button, Form, Input, message } from 'antd';
import { InfoCircleOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import Modal from '../../components/global/Modal';
import FooterProfessionals from "../../components/global/FooterProfessionals.jsx";

const PasswordDentist = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false); // Estado para el modal
  const [confirmLoading, setConfirmLoading] = useState(false); // Estado para la carga del botón de confirmar
  const [cancelModalVisible, setCancelModalVisible] = useState(false); // Estado para el modal de cancelación
  const navigate = useNavigate();

  // Obtener el nombre de usuario del almacenamiento local
  const username = localStorage.getItem('username');

  // Función que se llama al confirmar el cambio de contraseña
  const handleConfirmChangePassword = async (values) => {
    try {
      setConfirmLoading(true);

      const response = await api.post('/users/changePassword', {
        username: username, // Incluir el nombre de usuario
        password: values.currentPassword,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      });

      message.success(response.data.message || 'Contraseña cambiada con éxito');
      form.resetFields();
    } catch (error) {
      message.error(error.response?.data?.message || 'Error al cambiar la contraseña');
    } finally {
      setConfirmLoading(false);
      setModalVisible(false); // Cierra el modal después de confirmar
    }
  };

  // Función que se llama al enviar el formulario
  const onFinish = (values) => {
    setModalVisible(true); // Mostrar modal de confirmación
  };

  // Nueva función para manejar la cancelación
  const handleCancel = () => {
    setCancelModalVisible(true); // Mostrar modal de confirmación de cancelación
  };

  const confirmCancel = () => {
    setCancelModalVisible(false);
    handleBack(); // Llama a la función de navegación
  };

  const handleBack = () => {
    navigate('/odontologia/ajustes');
  };

  return (
    <>
      <HeaderDentist />

      {/* Contenido principal */}
      <main style={styles.main}>


        <Button type="default" icon={<ArrowLeftOutlined style={{ color: '#fff' }} />} className="button-save"
          onClick={handleBack}>
        </Button>

        <Card bordered={true} style={styles.card}>
          {/* Título */}
          <Space style={styles.titleSpace}>
            <h1 className="titleCard"><strong>Cambiar contraseña</strong></h1>
          </Space>

          <p style={styles.paragraph}>La contraseña debe contener mínimo 8 caracteres.</p>

          {/* Formulario de cambio de contraseña */}
          <Form
            form={form}
            layout="vertical"
            style={styles.form}
            onFinish={onFinish}
          >
            {/* Campo Contraseña actual */}
            <Form.Item
              label="Contraseña actual"
              name="currentPassword"
              rules={[{ required: true, message: 'Ingresa tu contraseña actual' }]}
            >
              <Input.Password placeholder="Contraseña actual" />
            </Form.Item>

            {/* Campo Nueva contraseña */}
            <Form.Item
              label="Nueva contraseña"
              name="newPassword"
              rules={[{ required: true, message: 'Ingresa la nueva contraseña' }]}
            >
              <Input.Password placeholder="Nueva contraseña"
                onPaste={(e) => e.preventDefault()} // Evita pegar en el campo
              />
            </Form.Item>

            {/* Campo Confirmar nueva contraseña */}
            <Form.Item
              label="Confirmar nueva contraseña"
              name="confirmPassword"
              dependencies={['newPassword']}
              rules={[
                { required: true, message: 'Confirma tu nueva contraseña' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Las contraseñas no coinciden'));
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Confirmar nueva contraseña"
                onPaste={(e) => e.preventDefault()} // Evita pegar en el campo
              />
            </Form.Item>

            {/* Botones */}
            <div style={styles.buttonContainer}>
              {/* Botón Guardar */}
              <Button className="button-save" type="default" htmlType="submit" loading={loading} >
                Guardar
              </Button>

              {/* Botón Cancelar */}
              <Button className="button-cancel" type="default" htmlType="reset" onClick={handleCancel} >
                Cancelar
              </Button>
            </div>
          </Form>

          {/* Modal de confirmación */}
          <Modal
            open={modalVisible}
            onClose={() => setModalVisible(false)}
            modalTitle={
              <span>
                <InfoCircleOutlined style={{ color: '#faad14', marginRight: '8px', fontSize: '24px' }} /> {/* Icono con color de advertencia */}
                <span style={{ fontWeight: 'bold' }}>Confirmar cambio de contraseña</span> {/* Texto en negrita */}
              </span>
            }
          >
            <p style={{ textAlign: 'left', paddingLeft: '31px' }}>¿Estás seguro de cambiar la contraseña?</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <Button className="button-cancel" onClick={() => setModalVisible(false)}>Cancelar</Button>
              <Button
                className="button-save"
                type="primary"
                loading={confirmLoading}
                onClick={() => {
                  const values = form.getFieldsValue(); // Obtener los valores del formulario
                  handleConfirmChangePassword(values); // Llamar a la función para confirmar el cambio de contraseña
                }}
              >
                Guardar
              </Button>
            </div>
          </Modal>

          {/* Modal de confirmación de cancelación */}
          <Modal
            open={cancelModalVisible}
            onClose={() => setCancelModalVisible(false)}
            modalTitle={
              <span>
                <InfoCircleOutlined style={{ color: '#faad14', marginRight: '8px', fontSize: '24px' }} />
                <span style={{ fontWeight: 'bold' }}>Confirmar cancelación</span>
              </span>
            }
          >
            <p style={{ textAlign: 'left', paddingLeft: '31px' }}>¿Estás seguro de cancelar el cambio de contraseña?</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <Button className="button-cancel" onClick={() => setCancelModalVisible(false)}>Cancelar</Button>
              <Button
                className="button-save"
                type="primary"
                onClick={confirmCancel}
              >
                Confirmar
              </Button>
            </div>
          </Modal>
        </Card>
      </main>
      <FooterProfessionals />
    </>
  );
};

// Estilos en línea
const styles = {
  main: {
    marginTop: '100px',
    padding: '0 20px',
    display: 'flex',
    justifyContent: 'center',
  },
  card: {
    width: '100%',
    maxWidth: '500px',
    marginTop: '100px',
    margin: '3px auto',
    justifyContent: 'center',
  },
  titleSpace: {
    marginTop: '5px',
    alignItems: 'center',
  },
  paragraph: {
    textAlign: 'center',
    margin: '10px 0',
  },
  form: {
    marginTop: '8px',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    marginTop: '20px',
  },
};

export default PasswordDentist;