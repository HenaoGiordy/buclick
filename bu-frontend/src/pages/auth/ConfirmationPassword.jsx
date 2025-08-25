import React, { useEffect, useState } from "react";
import { Fragment } from "react";
import { Card, Input, Button, Space, message } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import Header from '../../components/auth/Header'
import api from '../../api';

export default function ConfirmationPassword() {
    const location = useLocation();
    const navigate = useNavigate();
    const [isTokenValid, setIsTokenValid] = useState(false);
    const [loading, setLoading] = useState(true);
    const [password, setNewPassword] = useState("");
    const [passwordConfirmation, setConfirmPassword] = useState("");
    const [token, setToken] = useState("");

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const tokenFromUrl = searchParams.get("token");
        if (tokenFromUrl) {
            setToken(tokenFromUrl);
            api.post('/auth/reset-token', null, { params: { token: tokenFromUrl } })
                .then(response => {
                    if (response.data) {
                        setIsTokenValid(true);
                    } else {
                        navigate('/login');
                    }
                })
                .catch((error) => {
                    message.error("Token inválido o expirado");
                    navigate('/login');
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            navigate('/login');
        }
    }, [location, navigate]);

    const handlePasswordChange = (e) => {
        setNewPassword(e.target.value);
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== passwordConfirmation) {
            message.error("Las contraseñas no coinciden");
            return;
        }

        // Validaciones de campos requeridos
        if (!password || !passwordConfirmation) {
            message.error("Todos los campos son obligatorios.");
            return;
        }

        // Validación de longitud mínima de la contraseña
        if (password.length < 8) {
            message.error("La contraseña debe tener al menos 8 caracteres.");
            return;
        }

        try {
            setLoading(true);
            const resetPasswordRequest = {
                password: password,
                passwordConfirmation: passwordConfirmation
            };
            await api.post('/auth/reset-password', resetPasswordRequest, {
                params: { token: token },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            message.success("Contraseña actualizada con éxito");    
            navigate('/login');
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                message.error(error.response.data.message);
            } else {
                message.error("Error al actualizar la contraseña. Por favor, inténtelo de nuevo.");
            }
        } finally {
            setLoading(false);
        }
    };
    

    const handleCancelar = (e) => {
        e.preventDefault();
        navigate('/login');
    };

    if (loading) {
        return <div>Cargando...</div>;
    }

    if (!isTokenValid) {
        return null;
    }

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
                    body={{ padding: '24px' }}
                >
                    <h2 style={{
                        textAlign: 'center',
                        color: '#C20E1A',
                        marginBottom: '24px',
                        fontSize: '20px',
                        fontWeight: 'normal',
                    }}>
                        Restaurar contraseña
                    </h2>
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '16px' }}>
                            <label>Nueva contraseña:</label>
                            <Input.Password
                                placeholder="Nueva contraseña"
                                size="large"
                                style={{ marginTop: '8px' }}
                                value={password}
                                onChange={handlePasswordChange}
                                required
                            />
                        </div>
                        <div style={{ marginBottom: '24px' }}>
                            <label>Confirmar contraseña:</label>
                            <Input.Password
                                placeholder="Confirmar contraseña"
                                size="large"
                                style={{ marginTop: '8px' }}
                                value={passwordConfirmation}
                                onChange={handleConfirmPasswordChange}
                                required
                            />
                        </div>
                        <Space style={{ width: '100%', justifyContent: 'center' }}>
                            <Button type="primary" size="large" style={{ backgroundColor: '#C20E1A', borderColor: '#C20E1A' }} htmlType="submit" disabled={loading}>
                                {loading ? 'Procesando...' : 'Aceptar'}
                            </Button>
                            <Button size="large" onClick={handleCancelar} disabled={loading}>
                                Cancelar
                            </Button>
                        </Space>
                    </form>
                </Card>
            </div>
        </Fragment>
    );
}