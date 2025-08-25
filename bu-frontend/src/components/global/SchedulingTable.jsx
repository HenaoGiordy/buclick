import React from "react";
import PropTypes from "prop-types";
import { Button } from "antd";
import moment from "moment";

const SchedulingTable = ({
  headers,
  appointments,
  onReserve,
  disableReserveButton,
  salon,
}) => {
  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
  };

  const headerStyle = {
    backgroundColor: "#D9D9D9",
    color: "#000000",
    fontSize: "19px",
    padding: "10px",
    textAlign: "center",
    border: "1px solid #CFCFCF",
  };

  const cellStyle = {
    padding: "10px",
    border: "1px solid #CFCFCF",
  };

  // Manejo del click del botón
  const handleSchedule = (appointment) => {
    if (!disableReserveButton && onReserve) {
      onReserve(appointment.id);
    }
  };

  return (
    <table style={tableStyle}>
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th key={index} style={headerStyle}>
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {appointments.map((appointment, rowIndex) => (
          <tr key={rowIndex}>
            <td style={cellStyle}>
              {moment(appointment.dateTime).format("hh:mm A")}
            </td>
            <td style={cellStyle}>{salon}</td>
            <td style={cellStyle}>
              <Button
                className="button-save"
                type="primary"
                onClick={() => handleSchedule(appointment)}
                disabled={!appointment.available || disableReserveButton}
              >
                {appointment.available ? "Agendar" : "No disponible"}
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

// Validación de las props
SchedulingTable.propTypes = {
  headers: PropTypes.arrayOf(PropTypes.string).isRequired,
  appointments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      dateTime: PropTypes.string.isRequired,
      available: PropTypes.bool.isRequired,
    })
  ).isRequired,
  onReserve: PropTypes.func.isRequired,
  disableReserveButton: PropTypes.bool.isRequired,
  salon: PropTypes.string.isRequired, // Asegúrate de definir salon aquí como prop obligatoria
};
export default SchedulingTable;
