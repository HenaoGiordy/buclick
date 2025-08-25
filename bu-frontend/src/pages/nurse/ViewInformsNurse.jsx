import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, message, Spin, Card, Table } from 'antd';
import { LeftOutlined, DownloadOutlined } from '@ant-design/icons';
import HeaderNurse from "../../components/nurse/HeaderNurse";
import api from '../../api';

const ViewNursingReport = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  // Cargar informe al montar el componente
  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/nursing-report/${id}`);
        const reportData = response.data;
  
        // Transformar diagnosticCount en un array de objetos para la tabla
        const details = Object.entries(reportData.diagnosticCount || {}).map(([reason, count]) => ({
          reason: diagnosticMapping[reason] || reason, // Mapea el texto legible o usa el original si no existe en el mapeo
          count,
        }));
  
        // Calcular el total de todas las cantidades
        const totalCount = details.reduce((sum, item) => sum + item.count, 0);
  
        // Agregar la fila de total al final de los detalles
        details.push({
          reason: 'Total', // Título de la fila de total
          count: totalCount,
          isTotal: true, // Marcar la fila como total para aplicar estilos
        });
  
        setReport({ ...reportData, details }); // Agregar details al reporte
      } catch (error) {
        console.error('Error al cargar informe:', error);
        message.error('No se pudo cargar el informe.');
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id]);  

  // Función para descargar el informe
  const handleDownload = async () => {
    try {
      const response = await api.get(`/nursing-report/download/${id}`, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report_nursing_${id}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      message.success('Informe descargado exitosamente.');
    } catch (error) {
      console.error('Error al descargar informe:', error);
      message.error(`No se pudo descargar el informe: ${error.response?.data?.message || error.message}`);
    }
  };

  const diagnosticMapping = {
    "COLICOS_MENSTRUALES": "Cólicos menstruales",
    "CURACION": "Curación",
    "DOLOR_DE_CABEZA": "Dolor de cabeza",
    "DOLOR_ESTOMACAL": "Dolor estomacal",
    "DOLOR_MUSCULAR": "Dolor muscular",
    "MALESTAR_GENERAL": "Malestar general",
    "MAREOS_DESMAYOS": "Mareos desmayos",
    "PRESERVATIVOS": "Preservativos",
    "OTRO": "Otro",
  };

  // Definición de las columnas de la tabla
  const columns = [
    {
      title: 'Motivos',
      dataIndex: 'reason',
      key: 'reason',
      align: 'center',
    },
    {
      title: 'Cantidad',
      dataIndex: 'count',
      key: 'count',
      align: 'center',
    },
  ];

  if (loading) {
    return <Spin size="large" style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }} />;
  }

  if (!report) {
    return <div>No se pudo cargar el informe. Por favor, intente de nuevo más tarde.</div>;
  }

  return (
    <div>
      {/* Encabezado del enfermero */}
      <HeaderNurse />

      {/* Contenido Principal */}
      <div style={{ padding: '20px', maxWidth: '1000px', margin: 'auto', marginTop: '60px' }}>
        <Card
          title={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Button
                icon={<LeftOutlined />}
                onClick={() => navigate(-1)}
                style={{ border: 'none', backgroundColor: '#C20E1A', color: 'white' }}
              >
              </Button>
              <span style={{ fontSize: '20px', color: '#C20E1A' }}>Informe trimestral</span>
              <Button
                icon={<DownloadOutlined />}
                onClick={handleDownload}
                style={{ backgroundColor: '#C20E1A', color: 'white', border: 'none' }}
              >
                Descargar
              </Button>
            </div>
          }
          style={{ marginBottom: '20px', borderRadius: '8px', overflow: 'hidden' }}
        >
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <p style={{ fontSize: '16px' }}><strong>Trimestre:</strong> {report.year}-{report.trimester}</p>
          </div>

          <Table
            dataSource={report.details || []}
            columns={columns}
            pagination={false}
            rowKey="reason"
            bordered
            style={{ marginTop: '20px' }}
            rowClassName={(record) => record.isTotal ? 'total-row' : ''} // Estilo para la fila de total
          />
        </Card>
      </div>

      <style>{`
  .total-row {
    font-weight: bold;
    background-color: #f0f0f0;
  }
`}</style>
    </div>
  );
};

export default ViewNursingReport;
