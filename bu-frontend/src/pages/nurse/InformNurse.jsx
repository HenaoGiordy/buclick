import { useState, useEffect, useCallback } from 'react';
import { Card, Button, Input, message, Modal } from 'antd';
import { EyeOutlined, DownloadOutlined, DeleteOutlined, SearchOutlined, ExclamationCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import HeaderNurse from "../../components/nurse/HeaderNurse";
import api from '../../api';
import { useNavigate } from 'react-router-dom';
import TablePaginationR from '../../components/global/TablePaginationR';
import FooterProfessionals from "../../components/global/FooterProfessionals.jsx";

export default function InformNurse() {
  const [trimesterInput, setTrimesterInput] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [reports, setReports] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [noResults, setNoResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false); // Nuevo estado para verificar si se está realizando una búsqueda

  const itemsPerPage = 10;
  const navigate = useNavigate();

  const parseTrimesterInput = (input) => {
    const regex = /^(\d{4})-(\d)$/;
    const match = input.match(regex);
    return match ? { year: parseInt(match[1], 10), trimester: parseInt(match[2], 10) } : null;
  };

  const generateReport = async () => {
    const parsedData = parseTrimesterInput(trimesterInput);
    if (!parsedData) {
      message.error('Por favor, ingrese un trimestre en el formato correcto (ej: 2024-2).');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post('/nursing-report', parsedData);
      if (response.status === 201 || response.status === 200) {
        message.success('Informe generado exitosamente');
        setTrimesterInput('');
        fetchReports(1);
      }
    } catch (error) {
      message.error(`Error: ${error.response?.data?.message || 'Error al generar el informe'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const searchReportByTrimester = async () => {
    const parsedData = parseTrimesterInput(searchInput);
    if (!parsedData) {
      message.warning('Por favor, ingrese el trimestre en el formato correcto (ej: 2024-1).');
      return;
    }

    setIsLoading(true);
    setIsSearching(true); // Indica que se está realizando una búsqueda específica
    try {
      const response = await api.get('/nursing-report/search', {
        params: {
          year: parsedData.year,
          trimester: parsedData.trimester,
        },
      });

      if (response.data && response.data.length > 0) {
        setReports(response.data);
        setTotalItems(response.data.length);
        setNoResults(false);
        message.success('Informe(s) cargado(s) exitosamente.');
      } else {
        setReports([]);
        setTotalItems(0);
        setNoResults(true); // Indica que no hubo resultados en la búsqueda
        message.warning('No se encontró ningún informe para el trimestre especificado.');
      }
    } catch (error) {
      message.error(`Error al realizar la búsqueda: ${error.response?.data?.message || error.message}`);
      setNoResults(true);
    } finally {
      setIsLoading(false);
    }
  };



  const fetchReports = useCallback(async (page = 1) => {
    setIsLoading(true);
    setIsSearching(false); // Resetea la búsqueda cuando se recargan todos los informes
    try {
      const response = await api.get('/nursing-report/list', {
        params: {
          page: page - 1,
          size: itemsPerPage
        }
      });

      if (response.data && response.data.page) {
        setReports(response.data.content);
        setTotalItems(response.data.page.totalElements);
        setNoResults(response.data.content.length === 0);
      } else {
        message.error('Error en la estructura de datos recibida');
      }
    } catch (error) {
      message.error('No se pudieron cargar los informes');
      setNoResults(true);
    } finally {
      setIsLoading(false);
    }
  }, []);


  useEffect(() => {
    fetchReports(currentPage);
  }, [fetchReports, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchReports(page);
  };

  const handleSearch = () => {
    if (!searchInput) {
      message.warning('Por favor, ingrese el trimestre para buscar en el formato correcto (ej: 2024-1).');
      return;
    }
    setCurrentPage(1);
    searchReportByTrimester();
  };


  const handleReloadTable = async () => {
    setTrimesterInput('');
    setSearchInput('');
    setCurrentPage(1);
    setNoResults(false);

    const response = await fetchReports(1);

    if (response && response.data.content.length === 0) {
      Modal.info({
        title: 'Sin elementos creados',
        content: 'No hay elementos creados en este momento.',
        okText: 'Aceptar',
      });
    }
  };

  const downloadReport = async (id) => {
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

      message.success('Informe descargado exitosamente');
    } catch (error) {
      message.error(`No se pudo descargar el informe: ${error.response?.data?.message || error.message}`);
    }
  };

  const deleteReport = async (id) => {
    try {
      const response = await api.delete(`/nursing-report/delete/${id}`);

      if (response.status === 200) {
        message.success('Informe de enfermería eliminado correctamente');
        fetchReports(currentPage);
      } else {
        message.error('No se pudo eliminar el informe');
      }
    } catch (error) {
      message.error(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  const showDeleteConfirm = (record) => {
    Modal.confirm({
      title: 'Confirmar',
      icon: <ExclamationCircleOutlined />,
      content: `¿Desea eliminar el informe trimestral ${record.year}-${record.trimester}?`,
      okText: 'Aceptar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk() {
        deleteReport(record.id);
      },
      okButtonProps: {
        style: { backgroundColor: '#C20E1A', color: 'white', border: 'none' },
      },
      cancelButtonProps: {
        style: { borderColor: '#C20E1A', color: '#C20E1A' },
      },
    });
  };

  const rows = reports.map(report => [
    `${report.year}-${report.trimester}`,
    <span>
      <Button
        icon={<EyeOutlined />}
        style={{ backgroundColor: '#C20E1A', color: 'white', marginRight: 8, border: 'none' }}
        onClick={() => navigate(`/enfermeria/VerInforme/${report.id}`)}
      />
      <Button
        icon={<DownloadOutlined />}
        style={{ backgroundColor: '#C20E1A', color: 'white', marginRight: 8, border: 'none' }}
        onClick={() => downloadReport(report.id)}
      />
      <Button
        icon={<DeleteOutlined />}
        style={{ backgroundColor: '#C20E1A', color: 'white', border: 'none' }}
        onClick={() => showDeleteConfirm(report)}
      />
    </span>
  ]);

  return (
    <>
      <HeaderNurse />
      <main className="becas-section" style={{ marginTop: '100px', padding: '0 20px' }}>
        <h1 style={{ color: '#C20E1A', textAlign: 'center', marginBottom: 20 }}>Informes</h1>
        <p style={{ textAlign: 'center' }}>Para generar los informes debes ingresar el trimestre.</p>

        <Card bordered={true} style={{ width: '100%', maxWidth: '700px', margin: '20px auto', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <Input
              placeholder="Trimestre informe ej: 2024-2"
              style={{ width: '70%', marginRight: '10px' }}
              value={trimesterInput}
              onChange={(e) => setTrimesterInput(e.target.value)}
            />
            <Button
              style={{ backgroundColor: '#C20E1A', color: 'white', border: 'none' }}
              onClick={generateReport}
            >
              Generar
            </Button>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #ddd', margin: '20px 0' }} />
          <p style={{ textAlign: 'center', marginBottom: '20px' }}>
            Aquí puedes buscar los informes generados por trimestre.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <Input
              placeholder="trimestre"
              style={{ width: '70%', marginRight: '10px' }}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              prefix={<SearchOutlined />}
            />
            <Button
              style={{ backgroundColor: '#C20E1A', color: 'white', border: 'none' }}
              onClick={handleSearch}
            >
              <SearchOutlined />
            </Button>
          </div>

          {noResults && isSearching ? (
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: 'red' }}>No se encontró ningún informe con el trimestre especificado.</p>
              <Button
                icon={<ReloadOutlined />}
                onClick={handleReloadTable}
                style={{ backgroundColor: '#C20E1A', color: 'white' }}
              >
                Recargar tabla
              </Button>
            </div>
          ) : noResults && !isSearching ? (
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: 'red' }}>No hay reportes creados actualmente.</p>
            </div>
          ) : (
            <TablePaginationR
              columns={['Trimestre', 'Acciones']}
              rows={rows}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              totalItems={totalItems}
              onPageChange={handlePageChange}
            />
          )}
        </Card>
      </main>
      <FooterProfessionals/>
    </>
  );
}
