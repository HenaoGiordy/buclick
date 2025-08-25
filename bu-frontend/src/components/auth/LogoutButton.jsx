import React, { useState } from 'react';
import { Button, Typography, Space } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import Modal from '../global/Modal';

const { Text } = Typography;

export default function LogoutButton() {
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isActive, setIsActive] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleLogout = () => {
        // Limpia el localStorage y redirige al usuario
        localStorage.clear();
        setLoading(true);
        // Redirige después de un breve retardo para permitir que se limpie el storage
        setTimeout(() => {
            setLoading(false);
            window.location.href = '/login';
        }, 1000);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const buttonStyle = {
        backgroundColor: (isHovered || isActive) ? 'white' : '#C20E1A',
        color: (isHovered || isActive) ? '#C20E1A' : 'white',
        borderRadius: '8px',
        border: 'none',
        padding: '10px 20px',
        cursor: 'pointer',
        transition: 'background-color 0.3s, color 0.3s',
        margin: '5px',
        fontFamily: 'Open Sans, sans-serif',
    };

    return (
        <>
            <button
                onClick={handleOpenModal}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onMouseDown={() => setIsActive(true)}
                onMouseUp={() => setIsActive(false)}
                style={buttonStyle}
            >
                <LogoutOutlined style={{ marginRight: '8px' }} />
                Cerrar Sesión
            </button>

            <Modal
                open={isModalOpen}
                onClose={handleCloseModal}
                modalTitle="Cerrar sesión"
            >
                <Text
                    type="secondary"
                    style={{
                        fontFamily: 'Open Sans, sans-serif',
                        minWidth: '500px',
                        display: 'block',
                        marginBottom: '16px',
                    }}
                >
                    ¿Está seguro que desea cerrar sesión?
                </Text>
                <Space direction="horizontal" style={{ width: '100%', justifyContent: 'flex-end' }}>
                    <Button
                        onClick={handleCloseModal}
                        style={{ fontFamily: 'Open Sans, sans-serif' }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="primary"
                        danger
                        loading={loading}
                        onClick={handleLogout}
                        style={{ fontFamily: 'Open Sans, sans-serif' }}
                    >
                        Salir
                    </Button>
                </Space>
            </Modal>
        </>
    );
}
