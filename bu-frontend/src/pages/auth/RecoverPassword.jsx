import React, { Fragment, useState } from "react";
import { Card, Input, Button, Space, message } from "antd";
import { useNavigate } from 'react-router-dom';
import Header from '../../components/auth/Header';
import api from '../../api';

export default function RecoverPassword() {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleRecoverPassword = async () => {
        if (!email.trim()) {
            // Validar si el campo está vacío
            message.error("El campo de correo electrónico es obligatorio.");
            return; // Salir de la función si el correo está vacío
        }
        
        try {
            const response = await api.post('/auth/email-reset', { email });
            message.success('Correo enviado correctamente.');
            // Optionally redirect or handle the response
        } catch (error) {
        if(error.response.data.Error) {
            message.error(error.response.data.Error);
        }
        if(error.response.data.message) {
            message.error(error.response.data.message);
        }
    };}

    const manejarClick = (e) => {
        e.preventDefault(); 
        navigate('/login'); 
      };

    return (
        <Fragment>
            <Header />
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
            }}>
                <Card
                    style={{
                        width: 400,
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                        borderRadius: '8px',
                    }}
                >
                    <h2 style={{
                        textAlign: 'center',
                        color: '#C20E1A',
                        marginBottom: '24px',
                        fontSize: '24px',
                    }}>
                        Restaurar contraseña
                    </h2>
                    <p style={{
                        textAlign: 'center',
                        marginBottom: '16px',
                    }}>
                        Ingresa tu correo electrónico
                    </p>
                    <Input
                        placeholder="Correo electrónico"
                        size="large"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ marginBottom: '16px' }}
                    />
                    <Space style={{ width: '100%', justifyContent: 'center' }}>
                        <Button type="primary" onClick={handleRecoverPassword} size="large" style={{ backgroundColor: '#C20E1A', borderColor: '#c41d7f' }}>
                            Aceptar
                        </Button>
                        <Button size="large" onClick={manejarClick}>
                            Cancelar
                        </Button>
                    </Space>
                </Card>
            </div>
        </Fragment>
    );
}
