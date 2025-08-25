import { useState } from 'react';
import { Card } from 'antd';
import PropTypes from 'prop-types';

const MenuBecas = ({ buttons, children, onSelect, selectedType, defaultSelected }) => {
  // Usar defaultSelected para establecer el valor inicial de selected
  const [selected, setSelected] = useState(defaultSelected || buttons[0].type);

  const handleClick = (type) => {
    setSelected(type);
    onSelect(type);
  };

  // Estilo base para los botones
  const buttonStyle = {
    padding: '10px 20px',
    margin: '0 5px',
    backgroundColor: '#C20E1A',
    color: 'white',
    border: '2px solid #C20E1A',
    cursor: 'pointer',
    transition: 'background-color 0.3s, color 0.3s',
    borderTopLeftRadius: '8px',
    borderTopRightRadius: '8px',
  };

  // Estilo para el botón activo
  const activeStyle = {
    backgroundColor: 'white',
    color: '#C20E1A',
    border: '2px solid white',
  };

  // Estilo base del contenedor
  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  };

  // Estilo del contenedor de los botones (que cambia en móviles)
  const buttonContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: '10px',
    width: '100%',
  };

  // Estilo para la Card (ancho variable dependiendo del tamaño de la pantalla)
  const cardStyle = {
    width: '100%',
    maxWidth: '600px',
    marginTop: '0',
    padding: '10px',
  };

  return (
    <div style={containerStyle}>
      {/* Botones */}
      <div style={buttonContainerStyle}>
        {buttons.map((button) => (
          <button
            key={button.type}
            style={{ ...buttonStyle, ...(selected === button.type ? activeStyle : {}) }}
            onClick={() => handleClick(button.type)}
          >
            {button.label}
          </button>
        ))}
      </div>

      {/* Card */}
      <Card
        title={selectedType}
        bordered
        style={cardStyle}
      >
        {children}
      </Card>
    </div>
  );
};

MenuBecas.propTypes = {
  buttons: PropTypes.array.isRequired,
  children: PropTypes.node,
  onSelect: PropTypes.func.isRequired,
  selectedType: PropTypes.string,
  defaultSelected: PropTypes.string, // Prop para establecer el menú activo por defecto
};

export default MenuBecas;

