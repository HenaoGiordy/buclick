import React, { useState, useContext, useEffect } from "react";
import { MenuContext } from "../../utils/MenuContext"; // Importar el contexto
import { Button, Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import HeaderMonitor from "../../components/monitor/HeaderMonitor.jsx";
import MenuBecas from "../../components/global/MenuBecas.jsx";
import api from "../../api.js";
import { ACCESS_TOKEN } from "../../constants";
import FooterProfessionals from "../../components/global/FooterProfessionals.jsx";

const { TextArea } = Input;

const MenuMonitor = () => {
  const navigate = useNavigate();
  const { menuData, setMenuData } = useContext(MenuContext); // Acceder a datos del contexto
  const [selectedType, setSelectedType] = useState("Almuerzo");
  const [isEditable, setIsEditable] = useState({
    Almuerzo: false,
    Refrigerio: false,
  });

  // Estado temporal para manejar los datos durante la edición, incluyendo `link`
  const [tempMenuData, setTempMenuData] = useState({
    Almuerzo: { link: "" },
    Refrigerio: { link: "" },
  });

  // Estado para errores de validación en campos obligatorios
  const [validationErrors, setValidationErrors] = useState({
    mainDish: false,
    drink: false,
    price: false,
  });

  useEffect(() => {
    // Realiza la solicitud GET para obtener los datos del menú desde el backend
    const fetchMenuData = async () => {
      try {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (!token) {
          message.error("Por favor, inicie sesión nuevamente");
          navigate("/login");
          return;
        }

        const response = await api.get("/menu", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const menus = response.data;

        const almuerzoMenu = menus.find((menu) => menu.id === 1) || {};
        const refrigerioMenu = menus.find((menu) => menu.id === 2) || {};

        setMenuData({
          Almuerzo: almuerzoMenu,
          Refrigerio: refrigerioMenu,
        });

        setTempMenuData({
          Almuerzo: almuerzoMenu,
          Refrigerio: refrigerioMenu,
        });
      } catch (error) {
        message.error("Error al obtener los datos del menú");
        console.error(error);
      }
    };

    fetchMenuData(); // Llama a la función para obtener los datos al cargar el componente
  }, [navigate, setMenuData]);

  // Modificación de la expresión regular para permitir letras, tildes, comas y puntos
  const validTextRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s,\.]*$/;

  const handleInputChange = (field, value) => {
    // Validar solo para campos de texto (plato principal, bebida, postre)
    if (field === "mainDish" || field === "drink" || field === "dessert") {
      // Validar solo letras, espacios, comas y puntos
      if (!validTextRegex.test(value)) {
        return; // No permitir el valor si no cumple con la expresión regular
      }
    }

    setTempMenuData((prevData) => ({
      ...prevData,
      [selectedType]: {
        ...prevData[selectedType],
        [field]: value,
      },
    }));

    // Si el campo se llena, eliminar el error de validación para ese campo
    if (value) {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        [field]: false,
      }));
    }
  };

  const saveMenu = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    const menuTypeData = tempMenuData[selectedType]; // Usar datos temporales para guardar

    if (!token) {
      message.error("Por favor, inicie sesión nuevamente");
      navigate("/login");
      return;
    }

    // Validación de campos requeridos
    const errors = {
      mainDish: !menuTypeData.mainDish,
      drink: !menuTypeData.drink,
      price: !menuTypeData.price,
    };

    setValidationErrors(errors);

    // Si alguno de los campos está vacío, mostrar mensaje y detener el guardado
    if (Object.values(errors).some((error) => error)) {
      message.error("Complete los campos obligatorios.");
      return;
    }

    try {
      let response;

      // Verifica si ya existe un id para determinar si es PUT (actualización) o POST (creación)
      if (menuData[selectedType] && menuData[selectedType].id) {
        // Actualización usando PUT
        response = await api.put(
          "/menu",
          {
            id: menuData[selectedType].id,
            note: menuTypeData.note,
            mainDish: menuTypeData.mainDish,
            drink: menuTypeData.drink,
            dessert: menuTypeData.dessert,
            price: menuTypeData.price,
            link: menuTypeData.link,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        message.success("Menú actualizado exitosamente");
      } else {
        // Si no hay menú previo (es decir, no hay ID), hacer una solicitud POST
        response = await api.post(
          "/menu",
          {
            note: menuTypeData.note,
            mainDish: menuTypeData.mainDish,
            drink: menuTypeData.drink,
            dessert: menuTypeData.dessert,
            price: menuTypeData.price,
            link: menuTypeData.link,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        message.success("Menú creado exitosamente");
      }

      // Actualizar los datos en el contexto solo después de guardar
      setMenuData((prevMenuData) => ({
        ...prevMenuData,
        [selectedType]: response.data,
      }));

      // Deshabilitar la edición después de guardar
      setIsEditable({ ...isEditable, [selectedType]: false });
    } catch (error) {
      if (error.response && error.response.status === 409) {
        message.error(
          "Conflicto al guardar el menú: el recurso ya existe o hay un problema con los datos."
        );
      } else if (error.response && error.response.status === 401) {
        message.error("Sesión expirada. Por favor, inicie sesión nuevamente");
        navigate("/login");
      } else {
        message.error("Error al guardar el menú. Por favor, intente de nuevo");
      }
      console.error("Error al guardar el menú:", error);
    }
  };

  const handleEdit = () => {
    setTempMenuData(menuData); // Copiar los datos actuales a tempMenuData
    setIsEditable((prevEditable) => ({
      ...prevEditable,
      [selectedType]: true,
    }));
  };

  const handleCreateClick = () => {
    // Inicia la edición para crear un nuevo menú
    setIsEditable((prevEditable) => ({
      ...prevEditable,
      [selectedType]: true,
    }));

    // Inicializa los datos temporales para un nuevo menú vacío
    setTempMenuData((prevData) => ({
      ...prevData,
      [selectedType]: {
        note: "",
        mainDish: "",
        appetizer: "",
        drink: "",
        dessert: "",
        price: 0,
        link: "",
      },
    }));
  };

  const handleCancel = () => {
    // Restaurar el estado editable a false
    setIsEditable((prevEditable) => ({
      ...prevEditable,
      [selectedType]: false,
    }));

    // Restaurar los datos temporales con los valores originales
    setTempMenuData(menuData);

    // Limpiar los errores de validación
    setValidationErrors({
      mainDish: false,
      drink: false,
      price: false,
    });
  };

  const isLunch = selectedType === "Almuerzo";
  const mainDishLabel = isLunch ? "Plato principal" : "Aperitivo";
  const mainDishPlaceholder = isLunch
    ? "Describe el plato principal"
    : "Describe el aperitivo";

  const buttons = [
    { type: "Almuerzo", label: "Almuerzo" },
    { type: "Refrigerio", label: "Refrigerio" },
  ];

  const formatPrice = (value) => {
    if (value === undefined || value === null) return ""; // Retorna una cadena vacía si el valor no está definido
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
    <>
      <HeaderMonitor />
      <div className="becas-section">
        <MenuBecas
          onSelect={setSelectedType}
          buttons={buttons}
          selectedType={selectedType}
        >
          {/* TextArea para Nota */}
          <div
            style={{
              width: "100%",
              marginBottom: "12px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <label
              style={{
                marginRight: "12px",
                textAlign: "left",
                width: "50px",
              }}
            >
              Nota
            </label>
            <TextArea
              placeholder="Añade una nota"
              autoSize
              style={{ width: "100%" }}
              value={tempMenuData[selectedType].note}
              onChange={(e) => handleInputChange("note", e.target.value)}
              disabled={!isEditable[selectedType]}
            />
          </div>
          <p
            style={{
              textAlign: "center",
              margin: "4px 0 12px 0",
              fontSize: "16px",
            }}
          >
            Diligencia los datos para el {selectedType} -{" "}
            {new Date().toLocaleDateString()}
          </p>
          {/* TextArea para el plato principal o aperitivo */}
          <div style={{ width: "100%", marginBottom: "12px" }}>
            <label
              style={{
                marginBottom: "6px",
                textAlign: "left",
                display: "block",
              }}
            >
              {mainDishLabel} <span style={{ color: "red" }}>*</span>
            </label>
            <TextArea
              placeholder={mainDishPlaceholder}
              autoSize
              style={{
                width: "100%",
                borderColor: validationErrors.mainDish ? "red" : undefined,
              }}
              value={tempMenuData[selectedType].mainDish}
              onChange={(e) => handleInputChange("mainDish", e.target.value)}
              disabled={!isEditable[selectedType]}
            />
          </div>

          {/* TextArea para Bebida */}
          <div style={{ width: "100%", marginBottom: "12px" }}>
            <label
              style={{
                marginBottom: "6px",
                textAlign: "left",
                display: "block",
              }}
            >
              Bebida <span style={{ color: "red" }}>*</span>
            </label>
            <TextArea
              placeholder="Describe la bebida"
              autoSize
              style={{
                width: "100%",
                borderColor: validationErrors.drink ? "red" : undefined,
              }}
              value={tempMenuData[selectedType].drink}
              onChange={(e) => handleInputChange("drink", e.target.value)}
              disabled={!isEditable[selectedType]}
            />
          </div>

          {/* TextArea para Postre */}
          {isLunch && (
            <div style={{ width: "100%", marginBottom: "12px" }}>
              <label
                style={{
                  marginBottom: "6px",
                  textAlign: "left",
                  display: "block",
                }}
              >
                Postre
              </label>
              <TextArea
                placeholder="Describe el postre"
                autoSize
                style={{ width: "100%" }}
                value={tempMenuData[selectedType].dessert}
                onChange={(e) => handleInputChange("dessert", e.target.value)}
                disabled={!isEditable[selectedType]}
              />
            </div>
          )}

          {/* Input para el precio */}
          <div style={{ width: "100%", marginBottom: "12px" }}>
            <label
              style={{
                marginBottom: "6px",
                textAlign: "left",
                display: "block",
              }}
            >
              Precio <span style={{ color: "red" }}>*</span>
            </label>
            <Input
              type="text"
              placeholder="Ingresa el precio"
              value={
                tempMenuData[selectedType].price === 0
                  ? ""
                  : formatPrice(tempMenuData[selectedType].price)
              }
              onChange={(e) => {
                const value = e.target.value.replace(/\./g, "");
                const validatedValue = value.replace(/[^0-9]/g, "");
                handleInputChange(
                  "price",
                  validatedValue === "" ? 0 : parseInt(validatedValue, 10)
                );
              }}
              style={{
                width: "100%",
                borderColor: validationErrors.price ? "red" : undefined,
              }}
              disabled={!isEditable[selectedType]}
            />
          </div>

          {/* Input para el enlace (link) */}
          <div style={{ width: "100%", marginBottom: "12px" }}>
            <label
              style={{
                marginBottom: "6px",
                textAlign: "left",
                display: "block",
              }}
            >
              Enlace de encuesta de satisfacción
            </label>
            <Input
              type="text"
              placeholder="Ingresa un enlace"
              value={tempMenuData[selectedType].link || ""}
              onChange={(e) => handleInputChange("link", e.target.value)}
              style={{ width: "100%" }}
              disabled={!isEditable[selectedType]}
            />
          </div>

          {/* Botones Crear, Editar, Guardar y Cancelar */}
          <div style={{ margin: "24px 0" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "10px",
                marginTop: "10px",
              }}
            >
              {!isEditable[selectedType] ? (
                !menuData[selectedType] || !menuData[selectedType].id ? (
                  <Button
                    type="default"
                    style={{
                      backgroundColor: "#C20E1A",
                      color: "#FFFFFF",
                      border: "none",
                      height: "30px",
                      width: "149px",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#841F1C";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#C20E1A";
                    }}
                    onClick={handleCreateClick}
                  >
                    Crear
                  </Button>
                ) : (
                  <Button
                    type="default"
                    style={{
                      backgroundColor: "#C20E1A",
                      color: "#FFFFFF",
                      border: "none",
                      height: "30px",
                      width: "149px",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#841F1C";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#C20E1A";
                    }}
                    onClick={handleEdit}
                  >
                    Editar
                  </Button>
                )
              ) : (
                <>
                  <Button
                    type="default"
                    className="button-save"
                    onClick={saveMenu}
                  >
                    Guardar
                  </Button>

                  <Button
                    type="default"
                    className="button-cancel"
                    onClick={handleCancel}
                  >
                    Cancelar
                  </Button>
                </>
              )}
            </div>
          </div>
        </MenuBecas>
      </div>
      <FooterProfessionals />
    </>
  );
};

export default MenuMonitor;
