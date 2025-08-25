import axios from "../../api.js"

const errorForGet = new Map([
  [400, "Solicitud inválida"],
  [401, "No estas autorizado"],
  [403, "No tienes los permisos para solicitar este recurso"],
  [404, "Usuario no encontrado"],
  [500, "Error interno del servidor"]
])

export const appointmentsProfessionals = async (id) => {  
  try {
    const response = await axios.get(`/appointment-reservation/professional/pending/${id}`)
    console.log("Datos"+response.data)
  } catch (error) {
    return error
  }
}


export const downloadAppointmentById = async (id) => {
  try {
    const response = await axios.get(`/appointment-reservation/download/${id}`, {
      responseType: 'blob',
    })    
    const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', "citas realizadas.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      return {
        success:true,
        message:"Actividades realizadas descargadas exitosamente"
      }
  } catch (error) {
    const messageBackend = error.response.message
    return {
      success: false,
      message: messageBackend !== "" ? messageBackend : errorForGet(error.response.status)
    }
  }
}