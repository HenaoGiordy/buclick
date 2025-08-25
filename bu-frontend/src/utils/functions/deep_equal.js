//Esta funcion compara a profundidad sí un objeto es igual a otro en todo sentido

export default function deepEqual(obj1, obj2) {
  // Si son estrictamente iguales, retorna true.
  if (obj1 === obj2) return true;

  // Verifica si son objetos, de lo contrario retorna false.
  if (typeof obj1 !== "object" || obj1 === null || 
      typeof obj2 !== "object" || obj2 === null) {
      return false;
  }

  // Obtiene las claves de ambos objetos.
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  // Si tienen diferente cantidad de claves, no son iguales.
  if (keys1.length !== keys2.length) return false;

  // Compara cada clave y valor de ambos objetos.
  for (let key of keys1) {
      // Si el valor es un objeto, realiza una comparación recursiva.
      if (!deepEqual(obj1[key], obj2[key])) {
          return false;
      }
  }

  return true;
}