import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavbar from '../../components/TopNavbar';
import { Button, Form, Input, message, Card } from 'antd';
import FooterProfessionals from "../../components/global/FooterProfessionals.jsx";
import ButtonTutorial from '../../components/global/ButtonTutorial.jsx';
import api from '../../api';

const Settings = () => {
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState(null);

    const fetchProfileData = async () => {
        try {
            const username = localStorage.getItem('username');
            if (username) {
                const response = await api.get(`/users/${username}`);
                setProfileData(response.data); // Guardar los datos del perfil
            }
        } catch (error) {
            message.error('Error al cargar el perfil del usuario.');
        }
    };

    useEffect(() => {
        fetchProfileData();
    }, []);

    const handleChangePasswordClick = () => {
        navigate('/estudiante/contrasena');
    };

    return (
        <>
            <TopNavbar />
            <main style={{ marginTop: '100px', padding: '0 20px', display: 'flex', justifyContent: 'center' }}>
                <Card
                    bordered={false}
                    style={{ width: '100%', maxWidth: '600px' }}
                >
                    {profileData ? (
                        <Form layout="vertical">
                            <h1 className="titleCard"><strong>Perfil</strong></h1>
                            <Form.Item label={<span style={{ color: 'black', }}>Nombres</span>}>
                                <Input value={profileData.name} disabled style={{ color: '#767676' }} />
                            </Form.Item>
                            <Form.Item label={<span style={{ color: 'black' }}>Apellidos</span>}>
                                <Input value={profileData.lastName} disabled style={{ color: '#767676' }} />
                            </Form.Item>
                            <Form.Item label={<span style={{ color: 'black' }}>Correo</span>}>
                                <Input value={profileData.email} disabled style={{ color: '#767676' }} />
                            </Form.Item>
                            <Form.Item label={<span style={{ color: 'black' }}>Tipo de beneficio</span>}>
                                <Input
                                    value={profileData.benefitType === 'Sin beneficios' ? 'Venta libre' : profileData.benefitType}
                                    disabled
                                    style={{ color: '#767676' }}
                                />
                            </Form.Item>
                            <div style={{ display: 'flex', justifyContent: 'left', marginTop: '20px' }}>
                                <Button
                                    className="button-save"
                                    style={{ width: '180px' }}
                                    type="primary"
                                    onClick={handleChangePasswordClick}
                                >
                                    Cambiar contraseña
                                </Button>
                            </div>
                        </Form>
                    ) : (
                        <p>Por favor selecciona una opción de perfil para ver los datos.</p>
                    )}
                </Card>
                <ButtonTutorial role="student" />
            </main>
            <FooterProfessionals />
        </>
    );
};

export default Settings;