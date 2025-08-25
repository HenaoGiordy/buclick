import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

const TablePaginationR = ({
    rows = [],
    columns = [],
    currentPage = 1,
    itemsPerPage = 10,
    totalItems = 0,
    onPageChange = () => { },
    onRowClick = () => { },
}) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage); // Calculamos el número total de páginas

    // Estilos para el encabezado de la tabla
    const headerStyle = {
        backgroundColor: '#CFCFCF',
        color: 'black',
        fontSize: 'clamp(0.8rem, 2vw, 1rem)', // Tamaño de fuente un poco más pequeño
        padding: '0.5rem', // Usar rem para un mejor ajuste
        textAlign: 'center',
    };

    // Estilos para las celdas
    const cellStyle = {
        border: '1px solid #ddd',
        padding: '0.5rem', // Usar rem para un mejor ajuste
        textAlign: 'center',
        fontSize: 'clamp(0.8rem, 2vw, 1rem)', // Tamaño de fuente base
    };

    // Estilo de los botones de paginación
    const buttonStyle = {
        backgroundColor: '#FFFFFF',
        color: '#B3B3B3',
        border: 'none',
        height: '2rem', // Usar rem
        flex: 1,
        margin: '0 0.5rem', // Usar rem
        borderRadius: '8px',
        transition: 'background-color 0.3s',
        cursor: 'pointer',
    };

    // Estilo para hover en los botones
    const buttonHoverStyle = {
        backgroundColor: '#E3DEDE',
    };

    // Estilo del indicador de página
    const pageIndicatorStyle = {
        backgroundColor: '#C20E1A',
        color: '#FFFFFF',
        padding: '0.5rem 1rem', // Usar rem
        borderRadius: '8px',
        display: 'inline-block',
    };

    return (
        <div style={{ textAlign: 'center', margin: '20px 0' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        {columns.map((column, index) => (
                            <th key={index} style={headerStyle}>
                                {column}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.length > 0 ? (
                        rows.map((row, rowIndex) => (
                            <tr key={rowIndex} onClick={() => onRowClick(row)}>
                                {row.map((cell, cellIndex) => (
                                    <td key={cellIndex} style={cellStyle}>
                                        {cell}
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={columns.length} style={cellStyle}>
                                No hay datos disponibles
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Paginación */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    style={{
                        ...buttonStyle,
                        ...(currentPage === 1 ? { pointerEvents: 'none', opacity: 0.5 } : {}),
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = buttonHoverStyle.backgroundColor}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = buttonStyle.backgroundColor}
                >
                    <LeftOutlined /> Anterior
                </button>
                <div style={pageIndicatorStyle}> Página {currentPage} de {totalPages} </div>
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    style={{
                        ...buttonStyle,
                        ...(currentPage === totalPages ? { pointerEvents: 'none', opacity: 0.5 } : {}),
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = buttonHoverStyle.backgroundColor}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = buttonStyle.backgroundColor}
                >
                    Siguiente <RightOutlined />
                </button>
            </div>
        </div>
    );
};

TablePaginationR.propTypes = {
    rows: PropTypes.array,         // Filas de datos
    columns: PropTypes.array,      // Encabezados de columna
    currentPage: PropTypes.number, // Página actual
    itemsPerPage: PropTypes.number, // Cantidad de elementos por página
    totalItems: PropTypes.number,  // Total de elementos
    onPageChange: PropTypes.func,  // Función para manejar el cambio de página
    onRowClick: PropTypes.func     // Función opcional al hacer click en una fila
};

export default TablePaginationR;
