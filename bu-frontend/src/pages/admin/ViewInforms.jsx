import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, message, Spin, Card, Table } from 'antd';
import { LeftOutlined, DownloadOutlined } from '@ant-design/icons';
import HeaderAdmin from "../../components/admin/HeaderAdmin.jsx";
import api from '../../api';

const VerInforme = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/report/viewReport/${id}`);
        setReport(response.data);
      } catch (error) {
        console.error('Error fetching report:', error);
        message.error('No se pudo cargar el informe');
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id]);

  const handleBack = () => {
    navigate('/admin/Informes');
  };

  const handleDownload = async (reportId) => {
    try {
      const response = await api.get(`/report/download/${reportId}`, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report_${reportId}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      message.success('Informe descargado exitosamente');
    } catch (error) {
      console.error('Error al descargar informe:', error);
      message.error(`No se pudo descargar el informe: ${error.response?.data?.message || error.message}`);
    }
  };

  if (loading) {
    return <Spin size="large" />;
  }

  if (!report) {
    return <div>No se pudo cargar el informe. Por favor, intente de nuevo más tarde.</div>;
  }

  const isDailyReport = !report.semester;

  const beneficiariesColumns = isDailyReport
    ? [
        { title: '#', dataIndex: 'index', key: 'index' },
        { title: 'Código', dataIndex: 'code', key: 'code' },
        { title: 'Nombre', dataIndex: 'name', key: 'name' },
        { title: 'Plan', dataIndex: 'plan', key: 'plan' },
        { title: 'Correo', dataIndex: 'email', key: 'email' },
      ]
    : [
        { title: 'Código', dataIndex: 'code', key: 'code' },
        { title: 'Nombre', dataIndex: 'name', key: 'name' },
        { title: 'Plan', dataIndex: 'plan', key: 'plan' },
        { title: 'Correo', dataIndex: 'email', key: 'email' },
        { title: 'Cant.', dataIndex: 'quantity', key: 'quantity' },
      ];

  const freeSellingColumns = isDailyReport
    ? [
        { title: '#', dataIndex: 'index', key: 'index' },
        { title: 'Código/Cédula', dataIndex: 'code', key: 'code' },
        { title: 'Nombre', dataIndex: 'name', key: 'name' },
        { title: 'Plan/Área', dataIndex: 'plan', key: 'plan' },
        { title: 'Correo', dataIndex: 'email', key: 'email' },
      ]
    : [
        { title: 'Código/Cédula', dataIndex: 'code', key: 'code' },
        { title: 'Nombre', dataIndex: 'name', key: 'name' },
        { title: 'Plan/Área', dataIndex: 'plan', key: 'plan' },
        { title: 'Correo', dataIndex: 'email', key: 'email' },
        { title: 'Cant.', dataIndex: 'quantity', key: 'quantity' },
      ];

  const beneficiariesData = report.users
    .filter(user => user.lunchBeneficiary || user.snackBeneficiary)
    .map((user, index) => ({
      key: index,
      index: index + 1,
      code: user.username,
      name: user.name,
      plan: user.plan,
      email: user.email,
      quantity: user.quantity,
    }));

  const freeSellingData = report.users
    .filter(user => !user.lunchBeneficiary && !user.snackBeneficiary)
    .map((user, index) => ({
      key: index,
      index: index + 1,
      code: user.username,
      name: user.name,
      plan: user.plan,
      email: user.email,
      quantity: user.quantity,
    }));

  return (
    <div>
      <HeaderAdmin />
      <div style={{ padding: '20px', marginTop: '60px'}}>
        <Card
          title={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Button icon={<LeftOutlined />} onClick={handleBack} style={{ backgroundColor: '#C20E1A', color:'white', border: 'none', boxShadow: 'none' }}>
              </Button>
              <span style={{color:'#C20E1A'}}>{isDailyReport ? 'Informe diario' : 'Informe semestral'}</span>
              <Button 
                icon={<DownloadOutlined/>} 
                onClick={() =>handleDownload(report.id)}
                style={{ backgroundColor: '#C20E1A', borderColor: '#C20E1A', color: 'white' }}
              >
                Descargar
              </Button>
            </div>
          }
          style={{ marginBottom: '20px' }}
        >
          <div style={{display:'flex', justifyContent: 'center', columnGap:'2rem'}}>
            <p><strong>{isDailyReport ? 'Fecha' : 'Semestre'}:</strong> {isDailyReport ? report.date : report.semester}</p>
            <p><strong>Beca:</strong> {report.beca}</p>
          </div>
          <h3 style={{color:'#C20E1A'}}>Beneficiarios</h3>
          <Table 
            columns={beneficiariesColumns} 
            dataSource={beneficiariesData} 
            pagination={false}
            size="small"
          />
          
          <h3 style={{ color:'#C20E1A', marginTop: '20px' }}>Venta libre</h3>
          <Table 
            columns={freeSellingColumns} 
            dataSource={freeSellingData} 
            pagination={false}
            size="small"
          />
        </Card>
      </div>
    </div>
  );
};

export default VerInforme;