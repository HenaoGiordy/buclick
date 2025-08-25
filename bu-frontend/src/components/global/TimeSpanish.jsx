// TimeSpanish.jsx
import React from 'react';
import { TimePicker } from 'antd';
import dayjs from 'dayjs';

const timePickerStyle = {
  width: '100%',
};

const TimeSpanish = ({ value, onChange, disabled, placeholder, disabledHours }) => {
  const timeValue = value ? dayjs(value, 'HH:mm') : null;

  const handleChange = (time) => {
    const timeString = time ? time.format('HH:mm') : '';
    onChange(timeString);
  };

  return (
    <TimePicker
      value={timeValue}
      onChange={handleChange}
      disabled={disabled}
      placeholder={placeholder || "Seleccione hora"}
      format="HH:mm"
      style={timePickerStyle}
      disabledHours={disabledHours} // Aplica la lógica para deshabilitar horas
    />
  );
};

export default TimeSpanish;
