import PropTypes from "prop-types";

const Tables = ({ 
  rows = [[]], 
  columns = []
}) => {
  const headerStyle = {
    backgroundColor: '#CFCFCF', // Fondo gris oscuro
    color: 'black', // Texto negro
    fontSize: '1.1rem', // Tamaño de texto
    padding: '8px',
    textAlign: 'center',
  };

  const cellStyle = {
    border: '1px solid #ddd',
    padding: '8px',
    textAlign: 'center',
    textOverflow: 'ellipsis', // Añade "..." si el contenido es muy largo
  };

  const tableStyle = {
    width:"100%",
    borderCollapse: 'collapse' // Distribuye el ancho de manera uniforme sin desbordar
  };

  return (
    <div style={{ margin: '0'}}>
      <table style={tableStyle}>
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
              <tr key={rowIndex}>
                {columns.map((_, cellIndex) => (
                  <td key={cellIndex} style={cellStyle}>
                    {row[cellIndex]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} style={cellStyle}>
                No hay citas pendientes
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

Tables.propTypes = {
  rows: PropTypes.arrayOf(PropTypes.array),
  columns: PropTypes.array,
};

export default Tables;
