import { useNavigate } from 'react-router-dom';
import HeaderAdmin from '../../components/admin/HeaderAdmin';
import { Form, Input, Calendar, theme, ConfigProvider, Row, Col } from 'antd';
import SchedulingTable from '../../components/global/SchedulingTable';
import esES from 'antd/es/locale/es_ES';  // Importar el locale para español

const onPanelChange = (value, mode) => {
    console.log(value.format('YYYY-MM-DD'), mode);
};

const headers = ['Hora', 'Lugar de atencion', '(fecha seleccionada)'];
const rows = [
    ['1:00p.m', '205 bloque', ''],
    ['1:00p.m', '205 bloque', ''],
    ['1:00p.m', '205 bloque', ''],
];

const NursingAdmin = () => {

    const { token } = theme.useToken();

    const wrapperStyle = {
        border: `1px solid ${token.colorBorderSecondary}`,
        borderRadius: token.borderRadiusLG,
        padding: '16px',
        width: '70%', // Hacemos que el calendario ocupe el 100% de su contenedor
    };

    const containerStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap', // Para que los elementos se apilen en pantallas pequeñas
        marginTop: '20px',
    };

    const leftColumnStyle = {
        flex: '1',
        marginRight: '30px', // Espacio entre el calendario y la tabla
        minWidth: '300px', // Definir un ancho mínimo para pantallas pequeñas
    };

    const rightColumnStyle = {
        flex: '1',
        minWidth: '300px', // Definir un ancho mínimo para pantallas pequeñas
    };

    const formWrapperStyle = {
        marginBottom: '20px',
    };

    return (
        <>
            <HeaderAdmin />
            <main className="enfermeria-section" style={{ marginTop: '100px' }}>
                <h1 className="text-xl font-bold">Cita enfermería - Médico general</h1>

                {/* Formulario en la parte superior con distribución horizontal */}
                <Form layout="vertical" style={formWrapperStyle}>
                    <Row gutter={16}> {/* Configuración para colocar los campos de forma horizontal */}
                        <Col xs={24} sm={12} md={6}>
                            <Form.Item label="Nombre">
                                <Input placeholder="input placeholder" disabled />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <Form.Item label="Programa académico">
                                <Input placeholder="input placeholder" disabled />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <Form.Item label="Código">
                                <Input placeholder="input placeholder" disabled />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <Form.Item label="Correo">
                                <Input placeholder="input placeholder" disabled />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <Form.Item label="Teléfono">
                                <Input type="number" placeholder="input placeholder" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <Form.Item label="Eps">
                                <Input placeholder="input placeholder" />
                            </Form.Item>
                        </Col>

                        
                    </Row>
                </Form>

                <div style={containerStyle}>
                    {/* Columna izquierda - Calendario */}
                    <div style={leftColumnStyle}>
                        <ConfigProvider locale={esES}>  {/* Configuración del locale a español */}
                            <div style={wrapperStyle}>
                                <Calendar fullscreen={false} onPanelChange={onPanelChange} />
                            </div>
                        </ConfigProvider>
                    </div>

                    {/* Columna derecha - Tabla de programación */}
                    <div style={rightColumnStyle}>
                        <SchedulingTable headers={headers} rows={rows} />
                    </div>
                </div>
            </main>
        </>
    );
};

export default NursingAdmin;
