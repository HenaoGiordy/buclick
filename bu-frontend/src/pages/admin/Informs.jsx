import React, { useState, useEffect, useCallback } from 'react';
import { Button, Input, message, DatePicker, Divider } from 'antd';
import { EyeOutlined, DownloadOutlined, DeleteOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import HeaderAdmin from "../../components/admin/HeaderAdmin.jsx";
import FooterProfessionals from "../../components/global/FooterProfessionals.jsx";
import MenuBecas from "../../components/global/MenuBecas.jsx";
import TablePaginationR from '../../components/global/TablePaginationR.jsx';
import Modal from '../../components/global/Modal.jsx';
import api from '../../api';
import { useNavigate } from 'react-router-dom';

const CombinedReports = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [reports, setReports] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState("Diarios");
  const [selectedBeca, setSelectedBeca] = useState(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [reportToDelete, setReportToDelete] = useState(null);
  const [semesterInput, setSemesterInput] = useState(''); // Para el input de semestre al generar informe
  const [searchTermInput, setSearchTermInput] = useState(''); // Para el input de búsqueda
  const [dateSearch, setDateSearch] = useState(null);
  const [noResults, setNoResults] = useState(false); // Estado para controlar si hay resultados o no

  const itemsPerPage = 10;
  const buttons = [
    { type: "Diarios", label: "Diarios" },
    { type: "Semestrales", label: "Semestrales" },
  ];
  const columnsDaily = ['Fecha generado', 'Beca', 'Acciones'];
  const columnsSemestral = ['Beca', 'Semestre', 'Acciones'];

  const fetchReports = useCallback(async () => {
    try {
      const filter = selectedType === "Diarios" ? "diario" : "semester";
      const response = await api.get(`/report/list?filter=${filter}&page=${currentPage - 1}&size=${itemsPerPage}&search=${searchTermInput}`);

      if (response.data && Array.isArray(response.data.content)) {
        setReports(response.data.content);
        setTotalItems(response.data.page.totalElements);
        setCurrentPage(response.data.page.number + 1);
        setNoResults(response.data.content.length === 0); // Verifica si no hay resultados
      } else {
        message.error('Error en la estructura de datos recibida');
      }
    } catch (error) {
      message.error('No se pudieron cargar los informes');
      setNoResults(true); // En caso de error, también mostramos el mensaje de no resultados
    }
  }, [selectedType, currentPage, searchTermInput]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  useEffect(() => {
    setSelectedBeca(null);
    setSemesterInput('');
    setSearchTermInput('');
    setCurrentPage(1);
  }, [selectedType]);

  const generateReport = useCallback(async (beca) => {
    if (selectedType === "Semestrales" && !semesterInput) {
      message.warning('Por favor, ingrese un semestre antes de generar el informe.');
      return;
    }

    setSelectedBeca(beca);

    try {
      const reportRequest = {
        semester: selectedType === "Semestrales" ? semesterInput : null,
        beca: beca,
        users: []
      };

      await api.post('/report', reportRequest);
      message.success('Informe generado exitosamente');
      fetchReports();
    } catch (error) {
      message.error(`No se pudo generar el informe: ${error.response?.data?.message || error.message}`);
    }
  }, [selectedType, semesterInput, fetchReports]);

  const showDeleteConfirm = (reportId) => {
    setReportToDelete(reportId);
    setIsDeleteModalVisible(true);
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalVisible(false);
    setReportToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/report/delete/${reportToDelete}`);
      message.success('Informe eliminado correctamente');
      setIsDeleteModalVisible(false);
      setReportToDelete(null);
      fetchReports();
    } catch (error) {
      message.error(`No se pudo eliminar el informe: ${error.response?.data?.message || error.message}`);
    }
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
      message.error(`No se pudo descargar el informe: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleViewReport = (reportId) => {
    navigate(`/admin/VerInforme/${reportId}`);
  };

  const renderActions = (reportId) => (
    <span>
      <Button
        icon={<EyeOutlined />}
        style={{ backgroundColor: '#C20E1A', color: 'white', marginRight: 8, border: 'none' }}
        onClick={() => handleViewReport(reportId)}
      />
      <Button
        icon={<DownloadOutlined />}
        style={{ backgroundColor: '#C20E1A', color: 'white', marginRight: 8, border: 'none' }}
        onClick={() => handleDownload(reportId)}
      />
      <Button
        icon={<DeleteOutlined />}
        style={{ backgroundColor: '#C20E1A', color: 'white', border: 'none' }}
        onClick={() => showDeleteConfirm(reportId)}
      />
    </span>
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleCustomSearch = async () => {
    try {
      let endpoint;
      let searchValue;

      if (selectedType === "Diarios") {
        if (!dateSearch) {
          message.warning('Por favor, seleccione una fecha para buscar.');
          return;
        }
        searchValue = dateSearch.format('YYYY-MM-DD');
        endpoint = `/report/date/${searchValue}`;
      } else {
        if (!searchTermInput) {
          message.warning('Por favor, ingrese un semestre para buscar.');
          return;
        }
        searchValue = searchTermInput;
        endpoint = `/report/semester/${searchValue}`;
      }

      const response = await api.get(endpoint);

      // Validar si hay datos disponibles
      if (response.data.length === 0) {
        message.error('No hay informes en esa fecha'); // Notificación de error
        return; // Salimos sin actualizar la tabla
      }

      // Actualizar datos si se encontraron resultados
      setReports(response.data);
      setTotalItems(response.data.length);
      setNoResults(false); // Reinicia el estado de no resultados
    } catch (error) {
      message.error(`No se pudo realizar la búsqueda: ${error.response?.data?.message || error.message}`);
      setNoResults(true); // Indicar que no hay resultados disponibles
    }
  };

  const handleReloadTable = () => {
    // Restablecer búsqueda y recargar todos los informes
    setSemesterInput('');
    setSearchTermInput('');
    setDateSearch(null);
    setCurrentPage(1);
    setNoResults(false);
    fetchReports(); // Recargar todos los informes
  };

  const formatReportData = (report) => {
    if (selectedType === "Diarios") {
      return [report.date, report.beca, renderActions(report.id)];
    } else {
      return [report.beca, report.semester, renderActions(report.id)];
    }
  };

  return (
    <>
      <HeaderAdmin />
      <div className="becas-section">
        <MenuBecas
          onSelect={setSelectedType}
          buttons={buttons}
          selectedType={selectedType}
        >
          <h2 style={{ color: '#C20E1A', marginBottom: 16, textAlign: 'center' }}>
            Informes {selectedType === "Diarios" ? "diarios" : "semestrales"}
          </h2>

          {selectedType === "Diarios" ? (
            <>
              <p style={{ textAlign: 'center' }}>
                Para generar los informes diarios, selecciona la beca correspondiente que desees
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                <Button
                  style={{
                    marginRight: '10px',
                    backgroundColor: selectedBeca === 'Almuerzo' ? '#C20E1A' : 'white',
                    color: selectedBeca === 'Almuerzo' ? 'white' : '#C20E1A',
                    border: '1px solid #C20E1A',
                  }}
                  onClick={() => generateReport('almuerzo')}
                >
                  Almuerzo
                </Button>
                <Button
                  style={{
                    backgroundColor: selectedBeca === 'Refrigerio' ? '#C20E1A' : 'white',
                    color: selectedBeca === 'Refrigerio' ? 'white' : '#C20E1A',
                    border: '1px solid #C20E1A',
                  }}
                  onClick={() => generateReport('refrigerio')}
                >
                  Refrigerio
                </Button>
              </div>

              <Divider style={{ borderColor: 'grey' }} />

              <p style={{ textAlign: 'center' }}>
                Busca los informes diarios generados
              </p>

              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                <DatePicker
                  style={{ marginRight: '10px' }}
                  onChange={(date) => setDateSearch(date)}
                />
                <Button
                  icon={<SearchOutlined />}
                  style={{
                    backgroundColor: '#C20E1A',
                    color: 'white',
                    border: 'none',
                  }}
                  onClick={handleCustomSearch}
                />
              </div>
              
            </>
          ) : (
            <>
              <p style={{ textAlign: 'center' }}>
                Para generar los informes debes ingresar el semestre y seleccionar el tipo de beca que desees
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                <Input
                  placeholder="Semestre informe ej: 2024-1"
                  style={{ width: 200, marginRight: '10px' }}
                  value={semesterInput}
                  onChange={(e) => setSemesterInput(e.target.value)}
                />
                <Button
                  style={{
                    marginRight: '10px',
                    backgroundColor: selectedBeca === 'Almuerzo' ? '#C20E1A' : 'white',
                    color: selectedBeca === 'Almuerzo' ? 'white' : '#C20E1A',
                    border: '1px solid #C20E1A',
                  }}
                  onClick={() => generateReport('Almuerzo')}
                >
                  Almuerzo
                </Button>
                <Button
                  style={{
                    backgroundColor: selectedBeca === 'Refrigerio' ? '#C20E1A' : 'white',
                    color: selectedBeca === 'Refrigerio' ? 'white' : '#C20E1A',
                    border: '1px solid #C20E1A',
                  }}
                  onClick={() => generateReport('Refrigerio')}
                >
                  Refrigerio
                </Button>
              </div>

              <Divider style={{ borderColor: 'grey' }} />

              <p style={{ textAlign: 'center' }}>
                Busca los informes semestrales generados
              </p>

              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                <Input
                  placeholder="Buscar por semestre ej: 2024-2"
                  style={{ width: 200, marginRight: '10px' }}
                  value={searchTermInput}
                  onChange={(e) => setSearchTermInput(e.target.value)}
                />
                <Button
                  icon={<SearchOutlined />}
                  style={{
                    backgroundColor: '#C20E1A',
                    color: 'white',
                    border: 'none',
                  }}
                  onClick={handleCustomSearch}
                />
              </div>
            </>
          )}

          {/* Contenedor para tabla y botón de recargar */}
          <div style={{ position: 'relative', marginTop: '20px' }}>
            {/* Botón de recargar */}
            <Button
              icon={<ReloadOutlined />}
              onClick={handleReloadTable}
              style={{
                position: 'absolute',
                top: '-40px',
                right: '0',
                backgroundColor: '#C20E1A',
                color: 'white',
                border: 'none',
              }}
            />

            {/* Tabla */}
            <TablePaginationR
              rows={reports.map(formatReportData)}
              columns={selectedType === "Diarios" ? columnsDaily : columnsSemestral}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              totalItems={totalItems}
              onPageChange={handlePageChange}
            />

            <Modal
              open={isDeleteModalVisible}
              onClose={handleDeleteCancel}
              modalTitle="Confirmar eliminación"
            >
              <p>¿Desea eliminar el informe {selectedType === "Diarios" ? "diario" : "semestral"} seleccionado?</p>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                <Button onClick={handleDeleteCancel} style={{ marginRight: '10px' }}>
                  Cancelar
                </Button>
                <Button type="primary" danger onClick={handleDeleteConfirm}>
                  Aceptar
                </Button>
              </div>
            </Modal>
          </div>
        </MenuBecas>
      </div>
      <FooterProfessionals />
    </>
  );
};

export default CombinedReports;
