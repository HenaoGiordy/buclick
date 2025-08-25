import { useState, useCallback } from 'react';
import HeaderNurse from "../../components/nurse/HeaderNurse";
import SearchPicker from '../../components/global/SearchPicker.jsx';
import ButtonRefresh from "../../components/admin/ButtonRefresh.jsx"
import TablePaginationR from '../../components/global/TablePaginationR.jsx';
import { Card, Button, Modal, Descriptions, Badge, message} from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import api from '../../api';
import { searchBy } from '../../services/nurse/historyNurse.js';


const HistoryNurse = () => {
    const [activities, setActivities] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [queryValue, setQueryValue] = useState("")
    const [rangeValue, setRangeValue] = useState([])
    const [messageApi, contextHook] = message.useMessage()
    const itemsPerPage = 10;
    
    const filterInfo = useCallback(async () => {
        try{
        let response;
        let existQuery = queryValue.length !== 0
        let existRange = rangeValue && rangeValue.length === 2

        if(existQuery && existRange){
            setRangeValue(rangeValue)
            response = await searchBy({
                name: queryValue,
                startDate: rangeValue[0],
                endDate: rangeValue[1]
            })
        } else if(existRange){
            setRangeValue(rangeValue)
            response = await searchBy({
                startDate: rangeValue[0],
                endDate: rangeValue[1]
            })
        } else if(existQuery){
            response = await searchBy({name: queryValue})
        } else {
            response = await searchBy({
                name: queryValue,
                startDate: rangeValue[0],
                endDate: rangeValue[1]
            })
        }
        if("success" in response && !response.success){
            messageApi.error(response.message)
            return
        }
        setActivities(response)
        }catch(err){
        console.error("Esto ocurre en filter Info " + err);
        }
    }, [queryValue, rangeValue])

    const showActivityDetail = async (activityId) => {
        try {
            const response = await api.get(`/nursing-activities/activity/${activityId}`);
            setSelectedActivity(response.data);
            setIsModalVisible(true); // Abre el modal
        } catch (error) {
            console.error("Error fetching activity details:", error);
        }
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
        setSelectedActivity(null); // Limpia la actividad seleccionada
    };
    const paginatedActivities = activities.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const rows = paginatedActivities.map(activity => [
        activity.date,
        `${activity.user.name} ${activity.user.lastname}`,
        activity.user.username,
        <Button
            key={activity.user.id}
            icon={<EyeOutlined />}
            style={{ backgroundColor: '#C20E1A', color: 'white', marginRight: 8, border: 'none' }}
            onClick={() => showActivityDetail(activity.id)}
            />
        ]);

        const handlePageChange = (page) => {
            setCurrentPage(page);
        };

        return (
            <>
                <HeaderNurse />
                {contextHook}
                <main className="becas-section" style={{ marginTop: '100px' }}>
                    <h1 className="text-xl font-bold">Historial de actividades</h1>
                    <p>Aquí se podrán buscar las actividades por paciente o fecha que se han realizado en el servicio.</p>
                    <Card bordered={true}
                        style={{
                            width: '100%', maxWidth: '700px', marginTop: '100px', margin: '3px auto', justifyContent: 'center'
                        }}>
                        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                            <SearchPicker
                            placeholder='Código/cédula del paciente'
                            dateRangeValue={rangeValue}
                            queryValue={queryValue}
                            onQueryChange={value => setQueryValue(value)}
                            onDateRangeChange={value => setRangeValue(value)}
                            onSearch={filterInfo}
                            />
                            <ButtonRefresh
                            onClick={() => {
                                setQueryValue('')
                                setRangeValue([])
                                setActivities([])
                            }}
                            />
                        </div>
                        <p style={{fontSize: "1.25rem", fontWeight: "bold", marginBottom: 0, marginTop:"1.875rem"}}>Tabla de actividades realizadas</p>                        
                        <TablePaginationR
                            columns={['Fecha cita', 'Nombre', 'Código/cédula', 'Detalles actividad']}
                            rows={rows}
                            currentPage={currentPage}
                            itemsPerPage={itemsPerPage}
                            totalItems={activities.length}
                            onPageChange={handlePageChange}
                        />
                    </Card>
                    {/* Modal para mostrar los detalles de la actividad */}
                <Modal
                    title={
                        <div style={{ color: '#C20E1A', fontSize: '20px', textAlign: 'center', fontWeight: 'bold' }}>
                            Detalles de la actividad
                        </div>
                    }
                    open={isModalVisible}
                    onCancel={handleModalClose}
                    footer={null}
                >
                    {selectedActivity ? (
                        <Descriptions bordered size="small" column={1}>
                            <Descriptions.Item label={<span style={{ fontWeight: 'bold' }}>Nombre</span>} className="descriptions-item">
                                {selectedActivity.user.name}
                            </Descriptions.Item>
                            <Descriptions.Item label={<span style={{ fontWeight: 'bold' }}>Apellido</span>} className="descriptions-item">
                                {selectedActivity.user.lastname}
                            </Descriptions.Item>
                            <Descriptions.Item label={<span style={{ fontWeight: 'bold' }}>Código/cédula</span>} className="descriptions-item">
                                {selectedActivity.user.username}
                            </Descriptions.Item>
                            <Descriptions.Item label={<span style={{ fontWeight: 'bold' }}>Plan/área dependencia</span>} className="descriptions-item">
                                {selectedActivity.user.plan}
                            </Descriptions.Item>
                            <Descriptions.Item label={<span style={{ fontWeight: 'bold' }}>Semestre</span>} className="descriptions-item">
                                {selectedActivity.user.semester}
                            </Descriptions.Item>
                            <Descriptions.Item label={<span style={{ fontWeight: 'bold' }}>Género</span>} className="descriptions-item">
                                {selectedActivity.user.gender}
                            </Descriptions.Item>
                            <Descriptions.Item label={<span style={{ fontWeight: 'bold' }}>Teléfono</span>} className="descriptions-item">
                                {selectedActivity.user.phone}
                            </Descriptions.Item>
                            <Descriptions.Item label={<span style={{ fontWeight: 'bold' }}>Fecha de actividad</span>} className="descriptions-item">
                                {selectedActivity.date}
                            </Descriptions.Item>
                            <Descriptions.Item label={<span style={{ fontWeight: 'bold' }}>Diagnóstico</span>} className="descriptions-item">
                                <Badge status="processing" text={selectedActivity.diagnostic} />
                            </Descriptions.Item>
                            <Descriptions.Item label={<span style={{ fontWeight: 'bold' }}>Conducta</span>} className="descriptions-item">
                                {selectedActivity.conduct}
                            </Descriptions.Item>
                        </Descriptions>
                    ) : (
                        <p>Cargando detalles de la actividad...</p>
                    )}
                </Modal>
            </main >
        </>
    );
};

export default HistoryNurse;
