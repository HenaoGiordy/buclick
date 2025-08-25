import React, { useState, useEffect } from 'react';
import { useSettings } from '../../utils/SettingsContext';  // Importar el contexto
import { useNavigate } from 'react-router-dom';
import HeaderAdmin from '../../components/admin/HeaderAdmin';
import MenuBecas from '../../components/global/MenuBecas';
import ReusableModal from '../../components/global/ReusableModal';
import FooterProfessionals from "../../components/global/FooterProfessionals.jsx";
import esES from 'antd/es/locale/es_ES';
import { Button, Form, Input, Space, DatePicker, TimePicker, ConfigProvider, message } from 'antd';
import api from '../../api';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const SettingsAdmin = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [selectedType, setSelectedType] = useState('Perfil');
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState(null);  // Nuevo estado para el perfil

    const [settingId, setSettingId] = useState(null);
    const [settingData, setSettingData] = useState({
        startSemester: '',
        endSemester: '',
        numLunch: '',
        numSnack: '',
        starSnack: '',
        endSnack: ''
    });

    // Cargar datos del localStorage si existen
    useEffect(() => {
        const savedSettings = JSON.parse(localStorage.getItem('becaSettings'));
        if (savedSettings) {
            setSettingData(savedSettings);
        }
    }, []);

    // Guardar en localStorage cada vez que el settingData cambie
    useEffect(() => {
        localStorage.setItem('becaSettings', JSON.stringify(settingData));
    }, [settingData]);
    const [initialSettingData, setInitialSettingData] = useState({}); // Estado para los datos originales

    const [confirmSettings, setConfirmSettings] = useState(false); // Estado para la carga del botón de confirmar
    const [cancelModalVisible, setCancelModalVisible] = useState(false); // Estado para el modal de cancelación

    const [errors, setErrors] = useState({
        semester: '',
        numLunch: '',
        numSnack: '',
        starBeneficiaryLunch: '',
        endBeneficiaryLunch: '',
        starLunch: '',
        endLunch: '',
        starBeneficiarySnack: '',
        endBeneficiarySnack: '',
        starSnack: '',
        endSnack: ''
    });

    useEffect(() => {
        fetchSetting();
    }, []);

    const fetchSetting = async () => {
        try {
            const response = await api.get('/setting');
            const settingsList = response.data;

            if (settingsList.length === 0) {
                // No hay ajustes
                setSettingId(null);
                const defaultData = {
                    id: null,
                    startSemester: null,
                    endSemester: null,
                    numLunch: null,
                    numSnack: null,
                    starBeneficiaryLunch: null,
                    endBeneficiaryLunch: null,
                    starLunch: null,
                    endLunch: null,
                    starBeneficiarySnack: null,
                    endBeneficiarySnack: null,
                    starSnack: null,
                    endSnack: null,
                };
                setSettingData(defaultData);
                setInitialSettingData(defaultData); // También actualiza el estado inicial
            } else if (settingsList.length === 1) {
                const setting = settingsList[0];
                setSettingId(setting.id);
                const fetchedData = setting.settingRequest;
                setSettingData(fetchedData);
                setInitialSettingData(fetchedData); // Guardar los datos originales
            } else {
                console.log('Unexpected number of settings:');
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
            // Manejo de error
        }
    };


    const fetchProfileData = async () => {
        try {
            const username = localStorage.getItem('username');
            if (username) {
                const response = await api.get(`/users/${username}`); // Asegúrate de que las comillas sean correctas
                setProfileData(response.data); // Guardar los datos del perfil
            }
        } catch (error) {
            message.error('Error al cargar el perfil del usuario.');
        }
    };

    useEffect(() => {
        if (selectedType === 'Perfil') {
            fetchProfileData(); // Llamar a la función cuando el tipo seleccionado es 'Perfil'
        }
    }, [selectedType]); // Solo vuelve a ejecutar si selectedType cambia


    const handleCancelClick = () => {
        setSettingData(initialSettingData); // Restablece los datos al original
        setErrors({}); // Limpia los mensajes de error
        setIsEditing(false); // Cambia a modo no edición
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCreateClick = () => {
        setIsEditing(true);
        setSettingData({
            id: null,
            startSemester: null,
            endSemester: null,
            numLunch: null,
            numSnack: null,
            starBeneficiaryLunch: null,
            endBeneficiaryLunch: null,
            starLunch: null,
            endLunch: null,
            starBeneficiarySnack: null,
            endBeneficiarySnack: null,
            starSnack: null,
            endSnack: null,
        });
    };

    const handleSaveClick = async () => {
        const newErrors = {};
        let hasError = false;

        // Validaciones de campos obligatorios
        if (!settingData.startSemester || !settingData.endSemester) {
            newErrors.semester = 'La duración del semestre es obligatoria.';
            hasError = true;
        }
        if (!settingData.numLunch) {
            newErrors.numLunch = 'El número de becas de almuerzo es obligatorio.';
            hasError = true;
        }
        if (!settingData.numSnack) {
            newErrors.numSnack = 'El número de becas de refrigerio es obligatorio.';
            hasError = true;
        }

        if (!settingData.starBeneficiaryLunch || !settingData.endBeneficiaryLunch) {
            newErrors.beneficiaryLunch = 'Los horarios de almuerzo son obligatorios.'; // Mensaje único
            hasError = true;
        }
        if (!settingData.starLunch || !settingData.endLunch) {
            newErrors.Lunch = 'Los horarios de almuerzo son obligatorios.';
            hasError = true;
        }
        if (!settingData.starBeneficiarySnack || !settingData.endBeneficiarySnack) {
            newErrors.BeneficiarySnack = 'Los horarios refrigerio son obligatorios.';
            hasError = true;
        }
        if (!settingData.starSnack || !settingData.endSnack) {
            newErrors.Snack = 'Los horarios de refrigerio son obligatorios.';
            hasError = true;
        }

        // Si hay errores, actualizar el estado y salir
        if (hasError) {
            setErrors(newErrors);
            return;
        }
        try {
            if (settingId) {
                // Actualiza un ajuste existente
                await api.put('/setting', { ...settingData, id: settingId });
                message.success('Ajustes guardados exitosamente.');
            } else {
                // Crea un nuevo ajuste
                const response = await api.post('/setting', settingData);
                setSettingId(response.data.id);
                setSettingData(response.data.settingRequest);
                message.success('Ajustes creados exitosamente.');
            }
            // Actualiza initialSettingData para reflejar los datos guardados
            setInitialSettingData(settingData);
            setIsEditing(false); // Cambia a modo no edición
        } catch (error) {
            if (error.response) {
                const { status, data } = error.response;

                if (status === 400 && data.message) {
                    // Mostrar mensaje de error específico del backend
                    message.error(data.message, 10);
                } else if (status === 500) {
                    // Error de servidor
                    message.error('Error del servidor. Inténtalo de nuevo más tarde.', 10);
                } else {
                    message.error('Ocurrió un error desconocido.', 10);
                }
            } else {
                // Error de red
                message.error('No se pudo conectar con el servidor. Verifica tu conexión.', 10);
            }
        }
    };

    //Modal guardar ajuste de becas
    const handleSaveSetting = () => {
        setConfirmSettings(true); // Abre el modal de cancelación
    };

    // Función para cerrar el modal de cancelar ajustes sin confirmar
    const handleSaveSettings = () => {
        setConfirmSettings(false); // Cierra el modal al cancelar
    };

    // Función para confirmar la cancelación de los ajustes
    const handleConfirmSaveSettings = () => {
        handleSaveClick()
        setConfirmSettings(false); // Cierra el modal después de confirmar
    };



    //Modal cancelar ajustes de becas
    const handleCancelSetting = () => {
        setCancelModalVisible(true); // Abre el modal de cancelación
    };

    // Función para cerrar el modal de cancelar ajustes sin confirmar
    const handleCancelSettings = () => {
        setCancelModalVisible(false); // Cierra el modal al cancelar
    };

    // Función para confirmar la cancelación de los ajustes
    const handleConfirmCancelSettings = () => {
        handleCancelClick()
        setCancelModalVisible(false); // Cierra el modal después de confirmar
    };


    const handleChangePasswordClick = () => {
        navigate('/admin/contrasenaAdmin');
    };


    const buttons = [
        { type: 'Perfil', label: 'Perfil' },
        { type: 'Ajustes becas', label: 'Becas' },
    ];

    return (
        <ConfigProvider locale={esES}> {/* Establece la localización en español */}

            <HeaderAdmin />
            <main style={{ marginTop: '100px', padding: '0 20px', display: 'flex', justifyContent: 'center' }}>
                <MenuBecas onSelect={setSelectedType} buttons={buttons} selectedType={selectedType}>

                    {selectedType === 'Perfil' && profileData ? (
                        <Form layout="vertical" style={{ marginTop: '8px' }}>
                            <Form.Item label={<span style={{ color: 'black', }}>Nombres</span>}>
                                <Input value={profileData.name} disabled style={{ color: '#767676' }} />
                            </Form.Item>
                            <Form.Item label={<span style={{ color: 'black' }}>Apellidos</span>}>
                                <Input value={profileData.lastName} disabled style={{ color: '#767676' }} />
                            </Form.Item>
                            <Form.Item label={<span style={{ color: 'black' }}>Correo</span>}>
                                <Input value={profileData.email} disabled style={{ color: '#767676' }} />
                            </Form.Item>
                            <div style={{ display: 'flex', justifyContent: 'left', marginTop: '20px' }}>
                                <Button className="button-save" style={{ width: '180px' }} type="primary" onClick={handleChangePasswordClick}>
                                    Cambiar contraseña
                                </Button>
                            </div>
                        </Form>
                    ) : (
                        <div style={{ marginBottom: '10px', textAlign: 'left' }}>
                            <p>Aquí hay ajustes adicionales relacionados a las becas de alimentación.</p>
                            <Space direction="vertical" size={12}>
                                <label style={{ display: 'block' }}><span style={{ color: 'red' }}>*</span> Duración del semestre</label>
                                <RangePicker
                                    style={{
                                        width: '100%',
                                        borderColor: errors.semester ? 'red' : undefined, // Cambia el borde a rojo si hay un error
                                        borderWidth: errors.semester ? '1px' : undefined, // Asegúrate de que el borde esté visible
                                        borderStyle: 'solid' // Estilo de borde sólido
                                    }}
                                    disabled={!isEditing}
                                    value={[
                                        settingData?.startSemester ? dayjs(settingData.startSemester) : null,
                                        settingData?.endSemester ? dayjs(settingData.endSemester) : null,
                                    ]}
                                    onChange={(dates) => {
                                        if (dates) {
                                            setSettingData((prev) => ({
                                                ...prev,
                                                startSemester: dates[0] ? dates[0].format('YYYY-MM-DD') : null,
                                                endSemester: dates[1] ? dates[1].format('YYYY-MM-DD') : null,
                                            }));
                                            // Limpiar el mensaje de error si se seleccionan fechas
                                            setErrors((prevErrors) => ({
                                                ...prevErrors,
                                                semester: '', // Asumiendo que tienes un campo 'semester' en los errores
                                            }));
                                        } else {
                                            setSettingData((prev) => ({
                                                ...prev,
                                                startSemester: null,
                                                endSemester: null,
                                            }));
                                        }
                                    }}
                                    allowEmpty={[true, true]}
                                />
                                {errors.semester && <span style={{ color: 'red' }}>{errors.semester}</span>}
                            </Space>
                            <div style={{ marginTop: '20px' }}>
                                <div style={{ display: 'flex', marginBottom: '12px' }}>
                                    <div style={{ width: '38%', marginRight: '20px' }}>
                                        <label style={{ display: 'block', marginBottom: '4px' }}><span style={{ color: 'red' }}>*</span> No. Becas almuerzo </label>
                                        <Input
                                            type="number"
                                            placeholder="Número de almuerzos"
                                            disabled={!isEditing}
                                            value={settingData?.numLunch || ''}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                if (value >= 0 || value === '') {
                                                    setSettingData((prev) => ({
                                                        ...prev,
                                                        numLunch: value,
                                                    }));
                                                    // Limpiar el mensaje de error si el campo es corregido
                                                    if (errors.numLunch) {
                                                        setErrors((prevErrors) => ({
                                                            ...prevErrors,
                                                            numLunch: '',
                                                        }));
                                                    }
                                                }
                                            }}
                                        />
                                        {errors.numLunch && <span style={{ color: 'red' }}>{errors.numLunch}</span>}
                                    </div>
                                    <div style={{ width: '38%' }}>
                                        <label style={{ display: 'block', marginBottom: '4px' }}><span style={{ color: 'red' }}>*</span> No. Becas refrigerio</label>
                                        <Input
                                            type="number"
                                            placeholder="Número de refrigerios"
                                            disabled={!isEditing}
                                            value={settingData?.numSnack || ''}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                if (value >= 0 || value === '') {
                                                    setSettingData((prev) => ({
                                                        ...prev,
                                                        numSnack: value,
                                                    }));
                                                    // Limpiar el mensaje de error si el campo es corregido
                                                    if (errors.numSnack) {
                                                        setErrors((prevErrors) => ({
                                                            ...prevErrors,
                                                            numSnack: '',
                                                        }));
                                                    }
                                                }
                                            }}
                                        />
                                        {errors.numSnack && <span style={{ color: 'red' }}>{errors.numSnack}</span>}
                                    </div>
                                </div>
                                {/* Accesos y horarios */}
                                {/* Acceso para beneficiarios almuerzo */}
                                <p style={{ marginTop: '20px', textAlign: 'left', marginBottom: '4px' }}><span style={{ color: 'red' }}>*</span> Acceso para beneficiarios almuerzo</p>
                                <Space direction="horizontal" size={12} style={{ width: '100%' }}>
                                    <TimePicker
                                        placeholder="Inicio"
                                        style={{ width: '78%', borderColor: errors.beneficiaryLunch ? 'red' : undefined }}
                                        format="HH:mm"
                                        disabled={!isEditing}
                                        value={settingData?.starBeneficiaryLunch ? dayjs(settingData.starBeneficiaryLunch, 'HH:mm') : null}
                                        onChange={(time) => {
                                            setSettingData((prev) => ({
                                                ...prev,
                                                starBeneficiaryLunch: time ? time.format('HH:mm') : null,
                                            }));
                                            // Limpia el error si se selecciona un tiempo válido
                                            if (time) {
                                                setErrors((prevErrors) => ({
                                                    ...prevErrors,
                                                    beneficiaryLunch: '', // Limpia el mensaje de error
                                                }));
                                            }
                                        }}
                                    />
                                    <TimePicker
                                        placeholder="Fin"
                                        style={{ width: '78%', borderColor: errors.beneficiaryLunch ? 'red' : undefined }}
                                        format="HH:mm"
                                        disabled={!isEditing}
                                        value={settingData?.endBeneficiaryLunch ? dayjs(settingData.endBeneficiaryLunch, 'HH:mm') : null}
                                        onChange={(time) => {
                                            setSettingData((prev) => ({
                                                ...prev,
                                                endBeneficiaryLunch: time ? time.format('HH:mm') : null,
                                            }));
                                            // Limpia el error si se selecciona un tiempo válido
                                            if (time) {
                                                setErrors((prevErrors) => ({
                                                    ...prevErrors,
                                                    beneficiaryLunch: '', // Limpia el mensaje de error
                                                }));
                                            }
                                        }}
                                    />
                                </Space>
                                {errors.beneficiaryLunch && <span style={{ color: 'red' }}>{errors.beneficiaryLunch}</span>}

                                {/* Acceso para venta libre almuerzo */}
                                <p style={{ marginTop: '20px', textAlign: 'left', marginBottom: '4px' }}><span style={{ color: 'red' }}>*</span> Acceso para venta libre almuerzo</p>
                                <Space direction="horizontal" size={12} style={{ width: '100%' }}>
                                    <TimePicker
                                        placeholder="Inicio"
                                        style={{ width: '78%', borderColor: errors.Lunch ? 'red' : undefined }}
                                        format="HH:mm"
                                        disabled={!isEditing}
                                        value={settingData?.starLunch ? dayjs(settingData.starLunch, 'HH:mm') : null}
                                        onChange={(time) => {
                                            setSettingData((prev) => ({
                                                ...prev,
                                                starLunch: time ? time.format('HH:mm') : null,
                                            }));
                                            // Limpia el error si se selecciona un tiempo válido
                                            if (time) {
                                                setErrors((prevErrors) => ({
                                                    ...prevErrors,
                                                    Lunch: '', // Limpia el mensaje de error
                                                }));
                                            }
                                        }}
                                    />

                                    <TimePicker
                                        placeholder="Fin"
                                        style={{ width: '78%', borderColor: errors.Lunch ? 'red' : undefined }}
                                        format="HH:mm"
                                        disabled={!isEditing}
                                        value={settingData?.endLunch ? dayjs(settingData.endLunch, 'HH:mm') : null}
                                        onChange={(time) => {
                                            setSettingData((prev) => ({
                                                ...prev,
                                                endLunch: time ? time.format('HH:mm') : null,
                                            }));
                                            // Limpia el error si se selecciona un tiempo válido
                                            if (time) {
                                                setErrors((prevErrors) => ({
                                                    ...prevErrors,
                                                    Lunch: '', // Limpia el mensaje de error
                                                }));
                                            }
                                        }}
                                    />
                                </Space>
                                {errors.Lunch && <span style={{ color: 'red' }}>{errors.Lunch}</span>}

                                {/* Acceso para beneficiarios refrigerio */}
                                <p style={{ marginTop: '20px', textAlign: 'left', marginBottom: '4px' }}><span style={{ color: 'red' }}>*</span> Acceso para beneficiarios refrigerio</p>
                                <Space direction="horizontal" size={12} style={{ width: '100%' }}>
                                    <TimePicker
                                        placeholder="Inicio"
                                        style={{ width: '78%', borderColor: errors.BeneficiarySnack ? 'red' : undefined }}
                                        format="HH:mm"
                                        disabled={!isEditing}
                                        value={settingData?.starBeneficiarySnack ? dayjs(settingData.starBeneficiarySnack, 'HH:mm') : null}
                                        onChange={(time) => {
                                            setSettingData((prev) => ({
                                                ...prev,
                                                starBeneficiarySnack: time ? time.format('HH:mm') : null,
                                            }))
                                            // Limpia el error si se selecciona un tiempo válido
                                            if (time) {
                                                setErrors((prevErrors) => ({
                                                    ...prevErrors,
                                                    BeneficiarySnack: '', // Limpia el mensaje de error
                                                }));
                                            }
                                        }}
                                    />

                                    <TimePicker
                                        placeholder="Fin"
                                        style={{ width: '78%', borderColor: errors.BeneficiarySnack ? 'red' : undefined }}
                                        format="HH:mm"
                                        disabled={!isEditing}
                                        value={settingData?.endBeneficiarySnack ? dayjs(settingData.endBeneficiarySnack, 'HH:mm') : null}
                                        onChange={(time) => {
                                            setSettingData((prev) => ({
                                                ...prev,
                                                endBeneficiarySnack: time ? time.format('HH:mm') : null,
                                            }));
                                            // Limpia el error si se selecciona un tiempo válido
                                            if (time) {
                                                setErrors((prevErrors) => ({
                                                    ...prevErrors,
                                                    BeneficiarySnack: '', // Limpia el mensaje de error
                                                }));
                                            }
                                        }}
                                    />
                                </Space>
                                {errors.BeneficiarySnack && <span style={{ color: 'red' }}>{errors.BeneficiarySnack}</span>}

                                {/* Acceso para venta libre refrigerio */}
                                <p style={{ marginTop: '20px', textAlign: 'left', marginBottom: '4px' }}><span style={{ color: 'red' }}>*</span> Acceso para venta libre refrigerio</p>
                                <Space direction="horizontal" size={12} style={{ width: '100%' }}>
                                    <TimePicker
                                        placeholder="Inicio"
                                        style={{ width: '78%', borderColor: errors.Snack ? 'red' : undefined }}
                                        format="HH:mm"
                                        disabled={!isEditing}
                                        value={settingData?.starSnack ? dayjs(settingData.starSnack, 'HH:mm') : null}
                                        onChange={(time) => {
                                            setSettingData((prev) => ({
                                                ...prev,
                                                starSnack: time ? time.format('HH:mm') : null,
                                            }));
                                            // Limpia el error si se selecciona un tiempo válido
                                            if (time) {
                                                setErrors((prevErrors) => ({
                                                    ...prevErrors,
                                                    Snack: '', // Limpia el mensaje de error
                                                }));
                                            }
                                        }}
                                    />

                                    <TimePicker
                                        placeholder="Fin"
                                        style={{ width: '78%', borderColor: errors.Snack ? 'red' : undefined }}
                                        format="HH:mm"
                                        disabled={!isEditing}
                                        value={settingData?.endSnack ? dayjs(settingData.endSnack, 'HH:mm') : null}
                                        onChange={(time) => {
                                            setSettingData((prev) => ({
                                                ...prev,
                                                endSnack: time ? time.format('HH:mm') : null,
                                            }));
                                            // Limpia el error si se selecciona un tiempo válido
                                            if (time) {
                                                setErrors((prevErrors) => ({
                                                    ...prevErrors,
                                                    Snack: '', // Limpia el mensaje de error
                                                }));
                                            }
                                        }}
                                    />
                                </Space>
                                {errors.Snack && <span style={{ color: 'red' }}>{errors.Snack}</span>}

                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '15px' }}>
                                {isEditing ? (
                                    <>

                                        {/* Mostrar "Guardar" cuando esté en modo de edición */}
                                        <Button className="button-save" type="primary" onClick={handleSaveSetting} disabled={!isEditing}>
                                            Guardar
                                        </Button>

                                        <ReusableModal
                                            visible={confirmSettings}
                                            title="Confirmación guardar ajustes becas"
                                            content={`¿Estás seguro de guardar los ajustes de becas?`}
                                            cancelText="Cancelar"
                                            confirmText="Confirmar"
                                            onCancel={handleSaveSettings}
                                            onConfirm={handleConfirmSaveSettings}
                                        />

                                        {/* Mostrar "Cancelar" cuando esté en modo de edición */}
                                        <Button className="button-cancel" onClick={handleCancelSetting}>
                                            Cancelar
                                        </Button>
                                        {/* Modal para confirmar la cancelación de ajustes de becas */}
                                        <ReusableModal
                                            visible={cancelModalVisible}
                                            title="Confirmar cancelación de ajustes becas"
                                            content={`¿Estás seguro de cancelar los ajustes de becas?`}
                                            cancelText="Cancelar"
                                            confirmText="Confirmar"
                                            onCancel={handleCancelSettings}
                                            onConfirm={handleConfirmCancelSettings}
                                        />
                                    </>
                                ) : (
                                    <>
                                        {/* Mostrar "Crear" si no hay un settingId y no se está editando */}
                                        {!settingId && (
                                            <Button className="button-save" onClick={handleCreateClick}>
                                                Crear
                                            </Button>
                                        )}
                                        {/* Mostrar "Editar" si ya hay un setting creado */}
                                        {settingId && (
                                            <Button className="button-save" type="primary" onClick={handleEditClick}>
                                                Editar
                                            </Button>

                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </MenuBecas>
            </main>
            <FooterProfessionals />
        </ConfigProvider>
    );
};

export default SettingsAdmin;