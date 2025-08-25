import { useState } from 'react';
import { Button, Input } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import PropTypes from "prop-types";

const SearchTracking = ({ 
  placeholder = "Código/cédula", 
  onClick = () => {}, 
  onChange = () => {}, 
  onRefresh = () => {},  
  ...props 
}) => {
  const [hover, setHover] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e) => {
    const value = e.target.value;
    // Permitir solo números positivos
    if (/^\d*$/.test(value)) {
      setInputValue(value); // Actualiza el estado si es válido
      onChange(e); // Llama a la función onChange proporcionada
    }
  };

  const handleKeyPress = (e) => {
    // Prevenir letras y caracteres especiales
    if (!/^\d$/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handleRefresh = () => {
    setInputValue(""); // Limpia el input
    onRefresh(); // Llama a la función onRefresh proporcionada
  };

  return (
    <div style={styles.container}>
      <Input
        value={inputValue}
        placeholder={placeholder}
        style={styles.input}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress} // Valida al presionar teclas
        {...props}
      />
      <Button
        type="primary"
        icon={<SearchOutlined style={{ color: 'white' }} />}
        style={{
          ...styles.button,
          backgroundColor: hover ? '#841F1C' : '#C20E1A',
          borderColor: hover ? '#841F1C' : '#C20E1A'
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={onClick}
      />
      <Button
        type="default"
        icon={<ReloadOutlined />}
        style={{
          ...styles.button,
          backgroundColor: hover ? '#841F1C' : '#C20E1A',
          borderColor: hover ? '#841F1C' : '#C20E1A',
          marginLeft: '10px',
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={handleRefresh}
      />
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  input: {
    flex: 1,
    maxWidth: '300px',
    marginRight: '10px',
  },
  button: {
    color: 'white',
  },
};

SearchTracking.propTypes = {
  placeholder: PropTypes.string,
  onClick: PropTypes.func,
  onChange: PropTypes.func,
  onRefresh: PropTypes.func,
};

export default SearchTracking;
