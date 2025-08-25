import dayjs from "dayjs";
import axios from "../../api.js";

const errorForGet = new Map([
  [400, "Solicitud inválida"],
  [401, "No estas autorizado"],
  [403, "No tienes los permisos para solicitar este recurso"],
  [404, "Usuario no encontrado"],
  [500, "Error interno del servidor"]
])

export const searchBy = async ({name="", startDate = "", endDate = ""}) => {
  const baseUrl = "/nursing-activities"
  let queryParams = [];
  name = name.trim()

  if (name) {
    queryParams.push(`username=${name}`)
  }

  if (startDate && endDate) {
    const fStartDate = dayjs(startDate).format('YYYY-MM-DD')
    const fEndDate = dayjs(endDate).format('YYYY-MM-DD')
    queryParams.push(`startDate=${fStartDate}`)
    queryParams.push(`endDate=${fEndDate}`)
  }
  const finalUrl = queryParams.length > 0 ? `${baseUrl}?${queryParams.join('&')}` : baseUrl  
  
  try {
    const response = await axios.get(finalUrl)
    return response.data
  } catch (error) {
    const messageBackend = error.response.data.message    
    return {
      success: false,
      message: messageBackend.length !== 0 ?  error.response.data.message : errorForGet.get(error.response.status)
    }
  }
}
