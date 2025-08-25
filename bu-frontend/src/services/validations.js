import dayjs from "dayjs"

const LIMITS_NAMES = 50;
const EMPTY_FIELD = "El campo está vacío";

// Función para verificar si el campo está vacío
const validEmptyField = (text) => {
  if ( text === null || text === "" || text.length === 0) {
    return EMPTY_FIELD;
  }
  return true; // Si no está vacío, retorna true
};

// Validación de nombres
export const validName = (name) => {
  name = name.trim();
  if (name.length > LIMITS_NAMES) return "Los nombres son muy largos";
  
  // Llama a validEmptyField y retorna su resultado si es un mensaje de error
  const isEmpty = validEmptyField(name);
  if (isEmpty !== true) return isEmpty;

  return true;
};

// Validación de apellidos
export const validLastname = (lastname) => {
  lastname = lastname.trim();
  if (lastname.length > LIMITS_NAMES) return "Los apellidos son muy largos";
  
  // Llama a validEmptyField y retorna su resultado si es un mensaje de error
  const isEmpty = validEmptyField(lastname);
  if (isEmpty !== true) return isEmpty;

  return true;
};

const forCode = code => {
  // Verifica si el código es una cadena de exactamente 9 dígitos
  code = String(code)
  validEmptyField(code)
  if (!( /^\d{9}$/.test(code) )) {
    return "El código no es válido, debe tener 9 dígitos. Ej: 202059431"
  }

  const c = Number(code)
  const limitTop = (dayjs().year() * 100000) + 99999 // ej: año 2024 -> 202499999
  return (c >= 195000000) && (c <= limitTop) 
    ? true 
    : `El código no es válido, debe ser máximo ${limitTop}`
};

const forNuip = nuip => (nuip !== undefined) && (nuip.length >= 8) ? true : "Debe tener mínimo 8 digitos"

const forPlan = plan => /^\d{4}$/.test(plan) ? true : "Debe ingresar sólo 4 digitos"

const forArea = area => /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]+$/.test(area) ? true : "El área debe por ejemplo ser administrativa, psicología, etc"

const forEmailFuncionary = email => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.trim()) ? true : "Dirección de correo inválida"

const forEmailStudent = email => /^[a-zA-Z]+(\.[a-zA-Z]+){1,2}@correounivalle\.edu\.co$/.test(email.trim()) ? true : "La dirección de correo electrónico no corresponde a ningún estudiante"

export const validCode = (code, isCode) => {
  if(isCode){
    return forCode(code)
  }
  return forNuip(code)
}

export const validPlan = plan => {
  const hasLetters = /[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]+/.test(plan)
  const hasNumbers = /\d+/.test(plan)

  if( hasLetters && hasNumbers) return "No mezcle letras y números por favor"
  
  if(hasNumbers) return forPlan(plan)
  
  if(hasLetters) return forArea(plan)

  return EMPTY_FIELD
}

export const validEmail = (email, funcionary, isExtern, edit) => {
  if(funcionary){
    return edit && isExtern ? validEmptyField(email) : forEmailFuncionary(email)
  }
  return forEmailStudent(email)
}

export const validRol = (rol) => {
  
  if(rol === null || rol.length === 0) return "Debe elegir un rol"

  return true
}

export const validGrant = (grant, isEdit) => {
  if(isEdit) return true
  
  if((grant === "Beneficiario almuerzo") ||
    (grant === "Beneficiario refrigerio")){
    return true
  } else{
    return "Debe elegir un tipo de beca"
  }
}

export const validStatus = status => (typeof status === "boolean") ? true : "Debe seleccionar un estado"
/********************************************************************************************************/

//Pensado para Registro de actividades enfermería
export const validFullName = name => name.length <= (LIMITS_NAMES * 2) ? true : "El nombre es demasiado largo"

export const validDate = date => {
  if( !(date.isValid()) ) return "El dato ingresado no es una fecha válida"

  const FORMAT = "YYYY-MM-DD"
  const now = dayjs().startOf("day")
  date = date.startOf("day")

  return date >= now ? true 
          : `La fecha ${date.format(FORMAT)} es anterior a la fecha de hoy ${now.format(FORMAT)}`  
}

export const validPhone = phone => {
  if(isNaN(phone)){
    return "Ingrese un número de celular válido"
  }

  const exampleNumber = 3130000000 + Math.round(Math.random() * 10000000)
  return phone.length === 10 ? true : `El número de celular debe contener 10 digitos Ej: ${exampleNumber}`
}

export const validSemester = semester => {
  if(isNaN(semester)){
    return "El dato ingresado no es un número"
  }
  
  return parseInt(semester) <= 11 ? true 
  :"Una carrera tecnológica dura de 6 a 7 semestres y una carrera profesional de 10 a 11 semestres" 
}

export const validCodeOrNuip = value => {
  const isCode = forCode(value)
  const isNuip = forNuip(value)

  if((typeof isCode === "boolean") && (typeof isNuip === "boolean")){
    return true
  }

  if((typeof isCode === "string") && (typeof isNuip === "string")){
    return `${isCode} \n ${isNuip}`
  }

  return (typeof isCode === "string") ? isCode : isNuip
}

export const validPlanOrArea = value => {
  const isPlan = forPlan(value)
  const isArea = forArea(value)

  if((typeof isPlan === "boolean") && (typeof isArea === "boolean")){
    return true
  }

  if((typeof isPlan === "string") && (typeof isArea === "string")){
    return `${isPlan} \n ${isArea}`
  }

  return (typeof isPlan === "string") ? isPlan : isArea
}

export const validListEmpty = (listObj, optionSelected, message) => {
  const include = listObj.find( obj => obj.value === optionSelected )
  
  return include === undefined ? message : true
}