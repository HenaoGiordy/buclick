import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useParams } from "react-router-dom";
import { Badge, Descriptions, Card, Button } from "antd";
import { ArrowLeftOutlined } from '@ant-design/icons';
import HeaderNurse from "../../components/nurse/HeaderNurse";
import api from "../../api";

const HistoryDetail = () => {
    const { id } = useParams();
    const [activity, setActivity] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchActivityDetail = async () => {
            try {
                const response = await api.get(`/nursing-activities/activity/${id}`);
                setActivity(response.data);
            } catch (error) {
                console.error("Error fetching activity details:", error);
            }
        };

        fetchActivityDetail();
    }, [id]);

    if (!activity) {
        return <p>Cargando detalles de la actividad...</p>;
    }

    const handleBack = () => {
        navigate('/enfermeria/historial');
    };

    return (
        <>
            <HeaderNurse />
            <main className="becas-section" style={{ marginTop: '100px' }}>

                <div style={{ display: 'flex', marginLeft:'60px' , alignItems: 'center', width: '100%' }}> {/* Contenedor flexible */}
                    <Button
                        type="default"
                        icon={<ArrowLeftOutlined style={{ color: '#fff', fontSize: '16px' }} />} // Ajusta el tamaño del ícono si es necesario
                        className="button-save"
                        onClick={handleBack}
                        style={{
                            marginRight: '10px',
                            width: '32px',
                            height: '30px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: 0 // Para eliminar el padding interno
                        }}
                    >
                    </Button>
                </div>
                <h1 className="text-xl font-bold">Historial de Actividades</h1>
                <p>Aquí puede observar los detalles de la actividad que se realizo en el servicio.</p>
                <Card>
                    <Descriptions
                        title="Detalles del Historial"
                        bordered
                        size="middle"
                        layout="horizontal"
                        column={2}
                    >
                        <Descriptions.Item
                            label="Nombre"
                            labelStyle={{ textAlign: 'center', fontWeight: 'bold' }}
                        >
                            {activity.user.name}
                        </Descriptions.Item>
                        <Descriptions.Item
                            label="Apellidos"
                            labelStyle={{ textAlign: 'center', fontWeight: 'bold' }}
                        >
                            {activity.user.lastname}
                        </Descriptions.Item>
                        <Descriptions.Item
                            label="Código/Cédula"
                            labelStyle={{ textAlign: 'center', fontWeight: 'bold' }}
                        >
                            {activity.user.username}
                        </Descriptions.Item>
                        <Descriptions.Item
                            label="Plan/Área Dependencia"
                            labelStyle={{ textAlign: 'center', fontWeight: 'bold' }}
                        >
                            {activity.user.plan}
                        </Descriptions.Item>
                        <Descriptions.Item
                            label="Semestre"
                            labelStyle={{ textAlign: 'center', fontWeight: 'bold' }}
                        >
                            {activity.user.semester}
                        </Descriptions.Item>
                        <Descriptions.Item
                            label="Género"
                            labelStyle={{ textAlign: 'center', fontWeight: 'bold' }}
                        >
                            {activity.user.gender}
                        </Descriptions.Item>
                        <Descriptions.Item
                            label="Teléfono"
                            labelStyle={{ textAlign: 'center', fontWeight: 'bold' }}
                        >
                            {activity.user.phone}
                        </Descriptions.Item>
                        <Descriptions.Item
                            label="Fecha de Actividad"
                            labelStyle={{ textAlign: 'center', fontWeight: 'bold' }}
                        >
                            {activity.date}
                        </Descriptions.Item>
                        <Descriptions.Item
                            label="Diagnóstico"
                            labelStyle={{ textAlign: 'center', fontWeight: 'bold' }}
                        >
                            <Badge status="processing" text={activity.diagnostic} />
                        </Descriptions.Item>
                        <Descriptions.Item
                            label="Conducta"
                            labelStyle={{ textAlign: 'center', fontWeight: 'bold' }}
                        >
                            {activity.conduct}
                        </Descriptions.Item>
                    </Descriptions>
                </Card>
            </main >
        </>
    );
};


export default HistoryDetail;