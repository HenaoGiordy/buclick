import { useState, useCallback } from 'react';
import HeaderDentist from "../../components/dentist/HeaderDentist";
import SearchPicker from '../../components/global/SearchPicker.jsx';
import ButtonRefresh from "../../components/admin/ButtonRefresh.jsx";
import TablePaginationR from '../../components/global/TablePaginationR.jsx';
import FooterProfessionals from "../../components/global/FooterProfessionals.jsx";
import { Card, Button, Modal, Descriptions, message } from 'antd';
import { EyeOutlined, DownloadOutlined } from '@ant-design/icons';
import api from '../../api';
import moment from 'moment';

const HistoryDentistry = () => {
    const [activities, setActivities] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0); // Estado para manejar el total de elementos
    const [totalPages, setTotalPages] = useState(1);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedVisit, setSelectedVisit] = useState(null);
    const [queryValue, setQueryValue] = useState("");
    const [rangeValue, setRangeValue] = useState([]);
    const [messageApi, contextHook] = message.useMessage();
    const itemsPerPage = 10;

    const fetchAllVisits = useCallback(async () => {
        try {
            let allActivities = [];
            let currentPage = 0;
            let totalPages = 1; // Inicialmente asumimos una sola página

            while (currentPage < totalPages) {
                const params = {
                    page: currentPage, // La API espera un índice base 0
                    size: itemsPerPage,
                };

                if (queryValue) params.username = queryValue;
                if (rangeValue.length === 2) {
                    params.startDate = rangeValue[0].format('YYYY-MM-DD');
                    params.endDate = rangeValue[1].format('YYYY-MM-DD');
                }

                const response = await api.get('/odontology-visits', { params });

                const formattedActivities = (response.data.list.content || []).map(activity => ({
                    ...activity,
                    date: activity.date ? moment(activity.date).format('DD/MM/YYYY') : 'Fecha no disponible',
                    fullName: `${activity.user?.name || 'Nombre no disponible'} ${activity.user?.lastName || 'Apellido no disponible'}`,
                    document: activity.user?.username || 'Documento no disponible',
                }));

                allActivities = [...allActivities, ...formattedActivities]; // Concatenamos los resultados
                totalPages = response.data.list.page.totalPages; // Actualizamos el total de páginas
                currentPage += 1; // Avanzamos a la siguiente página
            }

            // Ordenar por fecha (ascendente)
            const sortedActivities = allActivities.sort((a, b) => {
                const dateA = moment(a.date, 'DD/MM/YYYY');
                const dateB = moment(b.date, 'DD/MM/YYYY');
                return dateA - dateB; // Cambia a `dateB - dateA` para descendente
            });

            setActivities(sortedActivities); // Actualiza todas las actividades ordenadas
            setTotalItems(sortedActivities.length); // Actualiza el total de elementos
            setTotalPages(Math.ceil(sortedActivities.length / itemsPerPage)); // Actualiza el total de páginas
        } catch (err) {
            messageApi.error("Error al obtener los datos de visitas");
        }
    }, [queryValue, rangeValue, messageApi]);

    const handleDownload = async () => {
        try {
            const response = await api.get('/odontology-visits/download', {
                responseType: 'blob', // Para descargar como archivo binario
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'odontology_visits_report.xlsx'); // Nombre del archivo
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            messageApi.error("Error al descargar el archivo");
        }
    };

    const showVisitDetail = useCallback(async (visitId) => {
        if (!visitId) {
            messageApi.error("ID de la visita no válido");
            return;
        }

        try {
            const response = await api.get(`/odontology-visits/visit/${visitId}`);
            const visitDetails = {
                user: {
                    fullName: [
                        response.data.name || "Nombre no disponible",
                        response.data.lastName || "Apellido no disponible",
                    ].join(" ").trim(),
                    document: response.data.username || "Documento no disponible",
                },
                date: response.data.date
                    ? moment(response.data.date).format("DD/MM/YYYY")
                    : "Fecha no disponible",
                plan: response.data.plan || "Plan no disponible",
                reason: response.data.reason || "Razón no disponible",
                description: response.data.description || "Descripción no disponible",
            };

            setSelectedVisit(visitDetails);
            setIsModalVisible(true);
        } catch (error) {
            messageApi.error("Error al obtener los detalles de la visita");
        }
    }, [messageApi]);

    const handleModalClose = () => {
        setIsModalVisible(false);
        setSelectedVisit(null);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page); // Actualiza la página actual
        fetchVisits(page);    // Llama a la API para obtener los datos de la página seleccionada
    };


    const handleRefresh = () => {
        setQueryValue('');
        setRangeValue([]);
        setActivities([]);
        setTotalItems(0);
        setCurrentPage(1);
    };

    const handleSearch = () => {
        fetchAllVisits(); // Realiza la consulta y ordena globalmente
    };

    const paginatedActivities = activities.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const rows = paginatedActivities.map(visit => [
        visit.date,
        visit.fullName,
        visit.document,
        <Button
            key={visit.id}
            icon={<EyeOutlined />}
            style={{ backgroundColor: '#C20E1A', color: 'white', border: 'none' }}
            onClick={() => showVisitDetail(visit.id)}
        />
    ]);


    return (
        <>
            <HeaderDentist />
            {contextHook}
            <main className="becas-section" style={{ marginTop: '100px', textAlign: 'center' }}>
                <h1>Historial de visitas</h1>
                <p>Aquí se podrán buscar las visitas por paciente o fecha que se han realizado en el servicio.</p>
                <Card
                    bordered={true}
                    style={{
                        width: '100%',
                        maxWidth: '700px',
                        margin: '20px auto',
                        padding: '20px',
                        textAlign: 'left',
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px', gap: '10px' }}>
                        <SearchPicker
                            placeholder="Código/Cédula del paciente"
                            dateRangeValue={rangeValue}
                            queryValue={queryValue}
                            onQueryChange={value => setQueryValue(value)}
                            onDateRangeChange={value => setRangeValue(value)}
                            onSearch={handleSearch}
                        />
                        <ButtonRefresh onClick={handleRefresh} />
                        <Button
                            type="primary"
                            icon={<DownloadOutlined />}
                            style={{ backgroundColor: '#C20E1A', border: 'none' }}
                            onClick={handleDownload}
                        >
                            Descargar
                        </Button>
                    </div>
                    <p style={{ fontWeight: 'bold' }}>Tabla de visitas realizadas</p>
                    <TablePaginationR
                        columns={['Fecha cita', 'Nombre', 'Código/cédula', 'Detalles visita']}
                        rows={rows}
                        currentPage={currentPage}
                        itemsPerPage={itemsPerPage}
                        totalItems={totalItems} // Total de elementos global
                        onPageChange={handlePageChange}
                    />


                </Card>
                <Modal
                    title={
                        <div style={{ color: '#C20E1A', fontSize: '20px', textAlign: 'center', fontWeight: 'bold' }}>
                            Detalles de la visita
                        </div>
                    }
                    open={isModalVisible}
                    onCancel={handleModalClose}
                    footer={null}
                >
                    {selectedVisit ? (
                        <Descriptions bordered size="small" column={1}>
                            <Descriptions.Item label={<span style={{ fontWeight: 'bold' }}>Nombre</span>}>
                                {selectedVisit.user.fullName}
                            </Descriptions.Item>
                            <Descriptions.Item label={<span style={{ fontWeight: 'bold' }}>Código/cédula</span>}>
                                {selectedVisit.user.document}
                            </Descriptions.Item>
                            <Descriptions.Item label={<span style={{ fontWeight: 'bold' }}>Fecha de visita</span>}>
                                {selectedVisit.date}
                            </Descriptions.Item>
                            <Descriptions.Item label={<span style={{ fontWeight: 'bold' }}>Plan/área dependencia</span>}>
                                {selectedVisit.plan}
                            </Descriptions.Item>
                            <Descriptions.Item label={<span style={{ fontWeight: 'bold' }}>Motivo</span>}>
                                {selectedVisit.reason}
                            </Descriptions.Item>
                            <Descriptions.Item label={<span style={{ fontWeight: 'bold' }}>Descripción</span>}>
                                {selectedVisit.description}
                            </Descriptions.Item>
                        </Descriptions>
                    ) : (
                        <p>Cargando detalles de la visita...</p>
                    )}
                </Modal>
            </main>
            <FooterProfessionals />
        </>
    );
};

export default HistoryDentistry;
