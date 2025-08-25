import { LeftOutlined, RightOutlined } from '@ant-design/icons'; 
import { Flex } from "antd"

import ButtonEdit from './ButtonEdit.jsx';
import ButtonDelete from './ButtonDelete.jsx';

import PropTypes from 'prop-types';

export default function TablePaginationUsers({
    rows = [],
    columns = [],
    currentPage = 0,
    itemsPerPage = 10,
    totalItems = 0,
    enableDelete = false,
    enableEdit = false,
    nameActionsButtons = "Acciones",
    onPageChange = () => {},
    onDelete = () => {},
    onEdit = () => {}
}){
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    // Validación de rows
    const isRowNull = !Array.isArray(rows) || rows === null;
    const safeRows = isRowNull ? [] : rows;

    const headerStyle = {
        backgroundColor: '#CFCFCF',
        color: 'black',
        fontSize: '1.1rem',
        padding: '8px',
        textAlign: 'center',
    };

    const cellStyle = {
        border: '1px solid #ddd',
        padding: '8px',
        textAlign: 'center',
    };

    const buttonStyle = {
        backgroundColor: '#FFFFFF',
        color: '#B3B3B3',
        border: 'none',
        height: '30px',
        flex: 1,
        margin: '0 5px',
        borderRadius: '8px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    };

    const buttonHoverStyle = {
        backgroundColor: '#E3DEDE',
    };

    const pageIndicatorStyle = {
        backgroundColor: '#C20E1A',
        color: '#FFFFFF',
        padding: '5px 10px',
        borderRadius: '8px',
        display: 'inline-block',
    };

    const handlerGetRowEdit = row => onEdit(row);
    const handlerGetRowDelete = row => onDelete(row);

    const goToNextPage = () => {
        if (currentPage < totalPages - 1) {
            onPageChange(currentPage + 1);
        }
    };
    
    const goToPreviousPage = () => {
        if (currentPage > 0) {
            onPageChange(currentPage - 1);
        }
    };

    return (
        <div style={{ textAlign: 'center', margin: '20px 0', width: '100%' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                <thead>
                    <tr>
                        {columns.map((column, index) => (
                            <th
                                key={`header-${column.key || index}`}
                                style={{ ...headerStyle, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'normal' }}
                            >
                                {column.label}
                            </th>
                        ))}
                        <th style={{ ...headerStyle, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'normal' }}>
                            {nameActionsButtons}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {safeRows.length > 0 ? (
                        safeRows.map((row, rowIndex) => (
                            <tr key={`row-${rowIndex}`}>
                                {columns.map((column, colIndex) => (
                                    <td
                                        key={`cell-${rowIndex}-${colIndex}`}
                                        style={{
                                            ...cellStyle,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'normal'
                                        }}
                                    >
                                        {row[column.key]}
                                    </td>
                                ))}
                                <td style={{ ...cellStyle, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'normal' }}>
                                    <Flex justify='center' align='center'>
                                        {enableDelete && <ButtonDelete key={`delete${rowIndex}`} onClick={() => handlerGetRowDelete(row)} />}
                                        {enableEdit && <ButtonEdit key={`edit${rowIndex}`} onClick={() => handlerGetRowEdit(row)} />}
                                    </Flex>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={columns.length + 1} style={cellStyle}>
                                No hay datos disponibles
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
    
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 0}
                    style={{
                        ...buttonStyle,
                        ...(currentPage === 0 ? { pointerEvents: 'none', opacity: 0.5 } : {}),
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = buttonHoverStyle.backgroundColor}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = buttonStyle.backgroundColor}
                >
                    <LeftOutlined /> Anterior
                </button>
                <div style={pageIndicatorStyle}>Página {currentPage + 1} de {totalPages}</div>
                <button
                    onClick={goToNextPage}
                    disabled={currentPage >= (totalPages - 1)}
                    style={{
                        ...buttonStyle,
                        ...(currentPage >= (totalPages - 1) ? { pointerEvents: 'none', opacity: 0.5 } : {}),
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

TablePaginationUsers.propTypes = {
    rows: PropTypes.arrayOf(PropTypes.object), // Arreglo de objetos
    columns: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string.isRequired, // Clave que indica qué propiedad del objeto mostrar
        label: PropTypes.string.isRequired // Etiqueta que se muestra en la cabecera
    })).isRequired,
    keyEditButton: PropTypes.string,
    nameActionsButtons: PropTypes.string,
    currentPage: PropTypes.number,
    itemsPerPage: PropTypes.number,
    totalItems: PropTypes.number,
    enableDelete: PropTypes.bool,
    enableEdit: PropTypes.bool,
    onPageChange: PropTypes.func,
    onCellClick: PropTypes.func,
    onDelete: PropTypes.func,
    onEdit: PropTypes.func,
};
