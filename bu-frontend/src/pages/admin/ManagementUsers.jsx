import { Divider, Flex, message } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import React, { useCallback, useEffect, useState, useRef } from 'react'

import ButtonRefresh from '../../components/admin/ButtonRefresh.jsx'
import HeaderAdmin from "../../components/admin/HeaderAdmin.jsx"
import MenuBecas from "../../components/global/MenuBecas.jsx"
import Modal from '../../components/global/Modal.jsx'
import Search  from '../../components/admin/SearchInput.jsx'
import StateUser from '../../components/global/StateUser.jsx'
import SmallInput from '../../components/global/SmallInput.jsx'
import TablePaginationUsers from '../../components/global/TablePaginationUsers.jsx'
import FooterProfessionals from "../../components/global/FooterProfessionals.jsx"

import styles from "../../styles/admin/managementUsers.module.css"

import { 
  createUser, 
  deleteBeneficiaries, 
  editUser, 
  importUsers, 
  listUsers,
  searchUser, 
  deleteBeneficiary 
} from "../../services/admin/management_user.js"

import { 
  validCode, 
  validEmail, 
  validGrant, 
  validLastname, 
  validName, 
  validPlan, 
  validRol,
  validStatus
} from '../../services/validations.js'
import deepEqual from '../../utils/functions/deep_equal.js'
import ReusableModal from '../../components/global/ReusableModal.jsx'
import SelectWithError from '../../components/global/SelectWithError.jsx'

export default function ManagementUsers(){
  //useStates
  const [changesDescription, setChangesDescription] = useState(1)
  const [objectSelected, setObjectSelected] = useState(null)
  const [objectSelectedClone, setObjectSelectedClone] = useState(null)
  const [rows, setRows] = useState(null)
  const [deviceType, setDeviceType] = useState("")
  const [savePressed, SetSavePressed] = useState(false)
  const [refreshFields, setRefreshFields] = useState(0)
  const [statusRolesGrantSelect, setStatusRolesGrantSelect] = useState(undefined)
  const [statusEstadoRolTipoBecaSelect, setStatusEstadoRolTipoBecaSelect] = useState(undefined)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalItems, setTotalItems] = useState(0)
  const [pressedSave, setPressedSave] = useState(false)
  const [pressedEdit, setPressedEdit] = useState(false)
  //Cargar archivo
  const [file, setFile] = useState(null)
  const hiddenFileInput = useRef(null)
  const [uploadStatus, setUploadStatus] = useState("ninguno")
  //nofity
  const [messageApi, contextHolder] = message.useMessage()
  //modals
  const [isModalImport, setIsModalImport] = useState(false)
  const [isModalEdit, setIsModalEdit] = useState(false)
  const [isModalAllDelete, setIsModalAllDelete] = useState(false)
  const [isModalDelete, setIsModalDelete] = useState(false)
  const defaultValidation = {
    username: "",
    name: "",
    lastName: "",
    email: "",
    plan: "",
    roles: "",
    grant: ""
  }
  const [okValidation, setOkValidation] = useState(defaultValidation)
  const [okValidationEdit, setOkValidationEdit] = useState(defaultValidation)
  //Datos
  const [codeUser, setCodeUser] = useState("")
  const initialUser = {
    username:"",
    name:"",
    lastName:"",
    email: "",
    plan:"",
    roles: "",
    grant: null
  }
  const [user, setUser] = useState(initialUser)
  //Predicados
  let isBeneficiary = changesDescription === 0
  let isStudent = changesDescription === 1
  let isFuncionary = changesDescription === 2
  let isMobile = deviceType === "mobile"
  let enableResponsive = isMobile || deviceType === "tablet"
  //Definicion de variables

  const fontSizeTitleModal = {fontSize:"1.5rem"}
  //Pestañas para cada usuario
  const buttons = [
    {type:"Beneficiarios",label:"Beneficiarios"},
    {type:"Estudiantes",label:"Estudiantes"},
    {type:"Funcionarios",label:"Funcionarios"}
  ]
  
  const descriptions = [
    {
      title:"Beneficiarios del sistema",
      description:"Aquí puedes agregar los estudiantes beneficiarios de las becas"
    },
    {
      title:"Estudiantes del sistema",
      description:"Aquí puedes agregar estudiantes del sistema"
    },
    {
      title:"Funcionarios del sistema",
      description:"Aquí puedes agregar personas con alguna dependencia en la universidad"
    }
  ]

  //Valores para el combobox o lista desplegable
  const cbxBeneficiaries = [
    {value:"Beneficiario almuerzo", label:"Beneficiario almuerzo"},
    {value:"Beneficiario refrigerio", label:"Beneficiario refrigerio"}
  ]
  
  const cbxFuncionary = isModalEdit ? [
    {value:"ADMINISTRADOR", label:"Administrador (a)"},
    {value:"ENFERMERO", label:"Enfermero (a)"},
    {value:"MONITOR", label:"Monitor (a)"},
    {value:"ESTUDIANTE", label:"Estudiante"},
    {value:"ODONTOLOGO", label:"Odontólogo (a)"},
    {value:"PSICOLOGO", label:"Psicólogo (a)"},
    {value:"FUNCIONARIO", label:"Funcionario (a)"},
    {value:"EXTERNO", label:"Externo (a)"}
  ] : [
    {value:"ADMINISTRADOR", label:"Administrador (a)"},
    {value:"ENFERMERO", label:"Enfermero (a)"},
    {value:"MONITOR", label:"Monitor (a)"},
    {value:"ODONTOLOGO", label:"Odontólogo (a)"},
    {value:"PSICOLOGO", label:"Psicólogo (a)"},
    {value:"FUNCIONARIO", label:"Funcionario (a)"}
  ]

  const cbxStatus = [
    {value:true, label:"Activo"},
    {value:false, label:"Inactivo"}    
  ]
  //-------------------------------------------
  /*
  Las porperties estan en inglés entonces es necesario que correctamente se encuentren 
  los valores para cada columna, así hay una key que contiene el nombre de la property 
  del objeto y luego esta relacionada con el nombre de la columna que es el label esto
  para filtrar las columnas que se debe mostrar
  */
  const headerTb = (!enableResponsive && !isBeneficiary) ? [
    {key: "username", label: isFuncionary ? "Cédula" : "Código"},
    {key: "name", label: "Nombre"},
    {key: "email", label: "Correo"},
    {key: "isActive", label: "Activo"}
  ] : (enableResponsive && isBeneficiary) ? [
    {key: "username", label: isFuncionary ? "Cédula" : "Código"},
    {key: "name", label: "Nombre"}
  ] : (!enableResponsive && isBeneficiary) ? [
    {key: "username", label: isFuncionary ? "Cédula" : "Código"},
    {key: "name", label: "Nombre"},
    {key: "email", label: "Correo"}
  ] : [
    {key: "username", label: isFuncionary ? "Cédula" : "Código"},
    {key: "name", label: "Nombre"},
    {key: "email", label: "Correo"},
    {key: "isActive", label: "Activo"}
  ]

  //functions 
  //Crea un mapa para asociar cada tipo de usuario a un número 
  const users = new Map(buttons.map( (obj, index) => [obj.type, index]))

  const tranformToStateUser = atribbute => <StateUser active={atribbute} />
  
  const getTypeUserCurrent = () => buttons[changesDescription].type.toLowerCase()
  
  const getArrObjInArrStr = arr => arr.map( obj => obj.name )

  const loadUsers = async () => {
  if (buttons[changesDescription]) {
    try {
      const result = await listUsers(getTypeUserCurrent(), currentPage, 10);
      if ("success" in result) {
        notifyError(result.message);
        return;
      }
      setRows(result.content.map(user => ({
        ...user,
        isActive: tranformToStateUser(user.isActive),
        roles: getArrObjInArrStr(user.roles),
        name: `${user.name}  ${ user.lastName === undefined || user.lastName === null ? "": user.lastName }`,
        email: user.email ?? "no tiene"
      })));
      setTotalItems(result.page.totalElements)
    } catch (error) {
        console.error(`Esto ocurre en loadUsers ${error}`);
        return { success: false, message: error.message };
    }
  }
  }

const handlePageChange = page => {
  setCurrentPage(page)
}

  const notifyError = message => {
    messageApi.open({
      type:"error",
      content: message
    })
  }

  const notifySuccess = message => {
    messageApi.open({
      type:"success",
      content: message
    })
  }

  const getStatusValue = (statusComponent) => {
    if (React.isValidElement(statusComponent)) {
      return statusComponent.props.active
    }
    return statusComponent
  };

  const getValueComplexSelectInModal = () => {
    if (isStudent) return objectSelected.isActive
    if (isFuncionary) {
      return objectSelected.roles.includes("MONITOR") ? "MONITOR" : objectSelected.roles[0]
    }
    if (isBeneficiary && objectSelected.lunchBeneficiary) {
      return "Beneficiario almuerzo"
    }
    if (isBeneficiary && objectSelected.snackBeneficiary) {
      return "Beneficiario refrigerio"
    }
  }

  const getOptionsComplexSelectInModal = () => {
    if(isStudent) return cbxStatus
    if(isFuncionary) return cbxFuncionary
    if(isBeneficiary) return cbxBeneficiaries
    console.error("no deberían existir más usuarios")
  }

  const setItemsInLocalStorage = () => localStorage.setItem("userManagementUser", JSON.stringify(user))

  //Handlers
  const handlerClick = type => setChangesDescription(users.get(type))

  
  //Manejadores de estado de modals
  const handlerOnlyIntegerPositive = e => {
    const allowedKeys = [
      'Backspace', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 'Delete', 'Home', 'End'
    ];
    // Permite combinaciones como Ctrl+V y Cmd+V
    if ((e.ctrlKey || e.metaKey) && (e.key === 'v' || e.key === 'c' || e.key === 'x')) {
      return; // Permite Ctrl+V, Ctrl+C, y Ctrl+X
    }
    // Evita la entrada de signos negativos y puntos
    if (!allowedKeys.includes(e.key) && !/^[0-9]$/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handlerTextOnlyInput= e => {
    const allowedKeys = [
      'Backspace', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 'Delete', 'Home', 'End'
    ];
    if (
      !allowedKeys.includes(e.key) && // Permitir teclas de navegación y edición
      !/^[a-zA-ZáéíóúÁÉÍÓÚüÜÑñ\s]$/.test(e.key)     // Permitir letras y espacios
    ) {
      e.preventDefault();
    }
  };
  
  const handlerTextAndIntegerPositve = e => { 
    const allowedKeys = ["Backspace", "ArrowLeft", "ArrowRight", "Delete", "Tab"];
    if (
      // Evitar "-", "." y ","
      e.key === "-" ||
      e.key === "." ||
      e.key === "," ||
    
      // Permitir solo teclas de navegación y edición, letras y espacios
      (!allowedKeys.includes(e.key) &&
        !/^[a-zA-ZáéíóúÁÉÍÓÚüÜ\s0-9]$/.test(e.key))
    ) {
      e.preventDefault();
    }
  }

  const handlerOpenModalImport = () => setIsModalImport(true)
  const handlerCloseModalImport = () => setIsModalImport(false)
  
  const handlerOpenModalEdit = row => {
    row.isActive = getStatusValue(row.isActive) //Quita el react.Element que contiene un symbol y no se puede clonarse
    const rowSelected = structuredClone(row)
    const [thisName,] = rowSelected.name.split("  ")
    rowSelected.name = thisName
    setObjectSelectedClone(structuredClone(rowSelected))//Para deshacer cambios
    row.isActive = tranformToStateUser(row.isActive)//Debe volver a ser un react.Element por tanto se establece denuevo el componente para no alterar la visibilidad de la fila
    setIsModalEdit(true)
    setObjectSelected(rowSelected)
  }  

  const handlerOpenModalDelete = row => {
    setIsModalDelete(true)
    setObjectSelected(row)
  }
  const handlerCloseModalDelete = () => setIsModalDelete(false)

  const handlerOpenModalAllDelete = () => setIsModalAllDelete(true)
  const handlerCloseModalAllDelete = () => setIsModalAllDelete(false)

  const handleResize = () => {
    const width = window.innerWidth;

    if (width <= 767) {
      setDeviceType('mobile');
    } else if (width >= 768 && width <= 1024) {
      setDeviceType('tablet');
    } else {
      setDeviceType('desktop');
    }
  };

  const handlerCreateUser = e => {
    const {name, value} = e.target
    setUser(prevUser => ({
      ...prevUser,
      [name]: value
    }))
  }

  const handlerEditUser = e => {
    const {name, value} = e.target;
  
    setObjectSelected(prev => ({
        ...prev,
        [name]: value
    }));    
  }

  const handlerSetSelectCreateUser = value => {
    setUser(prevUser => ({
      ...prevUser,
      grant: value
    }));
  }

  const handlerAddRoleUserCreate = value => {
    setUser(prevUser => ({
      ...prevUser,
      roles:[value]
    }))
  }

  const handlerRoleEditUser = value => {
    setObjectSelected(o => ({
      ...o,
      roles:[value]
    }));
}

  const handlerBlurSelect = (valid, fnState) => fnState((typeof valid === "string") ? "error" : "")

  const handlerOkValidation = ({name, value, fnState = () => {}, clear = false}) => {
    if(clear) {
      fnState(defaultValidation)
      setStatusEstadoRolTipoBecaSelect(undefined)
      setStatusRolesGrantSelect(undefined)
    }else{
      fnState( o => ({
        ...o,
        [name]: value === true ? true : value
    }))
    }    
  }

  const handlerCloseModalEdit = () => {
    setIsModalEdit(false)
    handlerOkValidation({clear: true})
    setObjectSelected(null)
    setObjectSelectedClone(null)
  }
  const handlerVerify = (user, isEdit = false) => {
    const fnState = isEdit ? setOkValidationEdit : setOkValidation;

    const validations = {
        username: validCode(user.username, !isFuncionary, isFuncionary),
        name: validName(user.name),
        lastName: validLastname(user.lastName),
        email: validEmail(user.email, isFuncionary, user.roles.includes("EXTERNO"),isModalEdit),
        plan: validPlan(user.plan),
        roles: validRol(user.roles),
        grant: !isBeneficiary ? true : validGrant(user.grant, isModalEdit)
    };

    // Actualiza el estado de validación de forma consistente
    fnState(validations);

    // Retorna true solo si todas las validaciones son correctas
    return Object.values(validations).every(result => result === true);
};


  const handlerSave = useCallback(async () => {
  try {
    const responseCreate = await createUser(user);
    if(responseCreate.success === false){
      notifyError(responseCreate.message)
      return false
    }
    
    const responseLoad = await loadUsers()
    if((responseLoad !== undefined) && ("success" in responseLoad)){
      notifyError(responseLoad.message)
    }
    notifySuccess(responseCreate)
    setRefreshFields(refreshFields + 1)
    return true
    } catch (error) {
      console.error(`Esto es en handlerSave ${error}`);
    }
  }, [user, changesDescription, users, refreshFields, messageApi, setRefreshFields]);

  const handlerHiddenClickInput = () => hiddenFileInput.current.click()
  
  const handlerLoadFile = event => {
    const fileSelected = event.target.files[0]
    
    if (!fileSelected){ //si es null o undefined
      setUploadStatus("fallido")
      return
    }  
    if(!['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'].includes(fileSelected.type)){
      setUploadStatus("fallaFormato")
      return
    }
    setFile(fileSelected)
    setUploadStatus("exitoso")     
  }

  const handlerSendFile = async () => {
    try {
      if(uploadStatus === "exitoso"){
        const responseImport = await importUsers((isBeneficiary || isStudent) ? "ESTUDIANTE" : "FUNCIONARIO" , file)
        if((responseImport !== undefined) && 
          ("success" in responseImport) && 
          (responseImport.success === false)){
          notifyError(responseImport.message)
          return
        }
        
        const responseLoad = await loadUsers()
        if((responseLoad !== undefined) &&
          ("success" in responseLoad) && 
          (responseLoad.success === false)){
          notifyError(responseLoad.message)
          return
        }

        if(responseImport !== undefined &&
          responseImport.success) {
            notifySuccess(responseImport.message)
          }
        if(responseLoad !== undefined && 
          responseLoad.success) {
            notifySuccess(responseLoad.message)
          }
      }
      return
    } catch (error) {
      console.error(`Ocurrio un error en handlerSendFile ${error}`);
    }
    
  }

  const handlerSearchUser = async () => {
    try{
      const userFound = await searchUser(codeUser, isFuncionary)
      if((userFound !== undefined) && ("success" in userFound)){
        notifyError(userFound.message)
        return
      }
      const arrayUserFound = []
      userFound.isActive = tranformToStateUser(userFound.isActive)
      userFound.roles = getArrObjInArrStr(userFound.roles)
      arrayUserFound.push(userFound)
      setRows(arrayUserFound)
      setTotalItems(1)
    }catch(error){
      console.error(`Esto ocurre en handlerSearchUser ${error}`)
    }
  }
  //---------------------------------------------------------

  const handlerSendUserEdited = async () => {
    try {
      objectSelected.isActive = getStatusValue(objectSelected.isActive)

      const responseEdit = await editUser(objectSelected)
      
      if((responseEdit !== undefined) && ("errorGet" in responseEdit)){
        console.error(responseEdit.errorGet)
      }
      if((responseEdit !== undefined) && (responseEdit.success === false)){
        notifyError(responseEdit.message)
        return
      }

      const responseLoad = await loadUsers()
      if((responseLoad !== undefined) && (responseLoad.success === false)){
        notifyError(responseLoad.message)
        return
      }

      if(responseEdit.success){
        notifySuccess(responseEdit.message)
        return
      }
    } catch (error) {
      console.error(`Esto sucede en handlerSendUserEdited ${error}`)
    }
  }

  const handlerDeleteUser = async () => {
    if(!isBeneficiary) return
    try {
      const responseDel = await deleteBeneficiary(objectSelected.username)
      await loadUsers()
      notifySuccess(responseDel.message)
    } catch (error) {
      console.error("Esto ocurre en handlerDeleteUser " + error.message)
    }
  }

  const handlerDeleteUsers = async () => {
    if(!isBeneficiary) return
    try {
      const responseAllDelete = await deleteBeneficiaries()
      if(!responseAllDelete.success){
        notifyError(responseAllDelete.message)
        return
      }
      await loadUsers()
      notifySuccess(responseAllDelete.message)
    } catch (error) {
      console.error("Esto ocurre en HandlerDeleteUsers " + error.message);
    }
  }

  const handlerClearFields = () => {
    setRefreshFields(refreshFields + 1)
    setStatusEstadoRolTipoBecaSelect(undefined)
    setStatusRolesGrantSelect(undefined)    
    setUser(initialUser)
    localStorage.setItem("userManagementUser", JSON.stringify(initialUser))
  }
  
  useEffect(() => {
    loadUsers();
  }, [currentPage]);
  
  useEffect(() => {
    handleResize();
    const dataLocalStorage = localStorage.getItem("userManagementUser")
    if(dataLocalStorage){
      setUser(JSON.parse(dataLocalStorage))
    }
    // Añade el event listener para cambios en el tamaño de la pantalla
    window.addEventListener('resize', handleResize);

    // Cleanup al desmontar el componente
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  },[])
  
  useEffect(() => {
    loadUsers()
    localStorage.setItem("userManagementUser", JSON.stringify(initialUser))
    setCodeUser("")
  }, [changesDescription])

  // Para cada campo en `user`, agrega un useEffect similar al siguiente
useEffect(() => {
  setItemsInLocalStorage()
  if (pressedSave) {
      handlerOkValidation({
          name: "name",
          value: validName(user.name),
          fnState: setOkValidation
      });
  }
}, [user.name, pressedSave]);

useEffect(() => {
  setItemsInLocalStorage()
  if (pressedSave) {
      handlerOkValidation({
          name: "lastName",
          value: validLastname(user.lastName),
          fnState: setOkValidation
      });
  }
}, [user.lastName, pressedSave]);

useEffect(() => {
  setItemsInLocalStorage()
  if (pressedSave) {
      handlerOkValidation({
          name: "email",
          value: validEmail(user.email, isFuncionary, false,isModalEdit),
          fnState: setOkValidation
      });
  }
}, [user.email, pressedSave]);

useEffect(() => {
  setItemsInLocalStorage()
  if (pressedSave) {
      handlerOkValidation({
          name: "username",
          value: validCode(user.username, !isFuncionary, isFuncionary),
          fnState: setOkValidation
      });
  }
}, [user.username, pressedSave]);

useEffect(() => {
  setItemsInLocalStorage()
  if (pressedSave) {
      handlerOkValidation({
          name: "plan",
          value: validPlan(user.plan),
          fnState: setOkValidation
      });
  }
}, [user.plan, pressedSave]);

useEffect(() => {
  setItemsInLocalStorage()
  if (pressedSave) {
      handlerOkValidation({
          name: "roles",
          value: validRol(user.roles),
          fnState: setOkValidation
      });
  }
}, [user.roles, pressedSave]);

useEffect(() => {
  setItemsInLocalStorage()
  if (pressedSave) {
      handlerOkValidation({
          name: "grant",
          value: validGrant(user.grant, isModalEdit),
          fnState: setOkValidation
      });
  }
}, [user.grant, pressedSave]);

useEffect(() => {
  if (pressedEdit && objectSelected) {
      handlerOkValidation({
          name: "name",
          value: validName(objectSelected.name),
          fnState: setOkValidationEdit
      });
  }
}, [pressedEdit, objectSelected?.name]);

// Validación del campo "lastname"
useEffect(() => {
  if (pressedEdit && objectSelected) {
      handlerOkValidation({
          name: "lastname",
          value: validLastname(objectSelected.lastName),
          fnState: setOkValidationEdit
      });
  }
}, [pressedEdit, objectSelected?.lastName]);

// Validación del campo "email"
useEffect(() => {
  if (pressedEdit && objectSelected) {
      handlerOkValidation({
          name: "email",
          value: validEmail(objectSelected.email, isFuncionary, objectSelected.roles.includes("EXTERNO"),isModalEdit),
          fnState: setOkValidationEdit
      });
  }
}, [pressedEdit, objectSelected?.email]);

// Validación del campo "username"
useEffect(() => {
  if (pressedEdit && objectSelected) {
      handlerOkValidation({
          name: "username",
          value: validCode(objectSelected.username, !isFuncionary, isFuncionary),
          fnState: setOkValidationEdit
      });
  }
}, [pressedEdit, objectSelected?.username]);

// Validación del campo "plan"
useEffect(() => {
  if (pressedEdit && objectSelected) {
      handlerOkValidation({
          name: "plan",
          value: validPlan(objectSelected.plan),
          fnState: setOkValidationEdit
      });
  }
}, [pressedEdit, objectSelected?.plan]);

// Validación del campo "roles"
useEffect(() => {
  if (pressedEdit && objectSelected) {
      handlerOkValidation({
          name: "roles",
          value: validRol(objectSelected.roles),
          fnState: setOkValidationEdit
      });
  }
}, [pressedEdit, objectSelected?.roles]);

// Validación del campo "grant"
useEffect(() => {
  if (pressedEdit && objectSelected) {
      handlerOkValidation({
          name: "grant",
          value: validGrant(objectSelected.grant, isModalEdit),
          fnState: setOkValidationEdit
      });
  }
}, [pressedEdit, objectSelected?.grant]);
  return (
    <>
      <HeaderAdmin/>
      <main className={styles.menuGrant}>
      {/* Modal import */}
      {isModalImport && (
      <Modal 
        open={isModalImport}
        footer={null}
        onClose={handlerCloseModalImport}>
        <Flex vertical align='center' justify='center'>
          <span style={fontSizeTitleModal}>Importar {isStudent ? "estudiantes" : isFuncionary ? "funcionarios" : "beneficiarios"}</span>
          <p>Descarga la plantilla <a href={`../../../public/importar_${getTypeUserCurrent()}.csv`}>aquí</a> y selecciona el archivo modificado</p>
        <Flex align="flex-start" justify='space-around'>
          <button 
          className={styles.buttonLoad}
          onClick={handlerHiddenClickInput}>
            <UploadOutlined/> Selecciona archivo
          </button>
          <input 
          type="file" 
          className={styles.displayNone}
          ref={hiddenFileInput} 
          onChange={handlerLoadFile}
          />
          {uploadStatus === "fallido" ? <span>Error al cargar el archivo</span> : 
          uploadStatus === "exitoso" ?  <span>{file.name}</span>: 
          uploadStatus === "fallaFormato" ? <p>    La extensión del archivo no es correcta debe ser un archivo con extensión csv</p> :
          uploadStatus === "ninguno" ? <span>    Cargue un archivo csv</span> : ""}
        </Flex>
        <Flex align='center' justify='center' gap={25}>
          <button 
          className={`button-cancel ${styles.buttons}`}
          onClick={handlerCloseModalImport}>
            Cancelar
          </button>
          <button 
          className={`button-save ${styles.buttons}`}
          onClick={() => {
            if(uploadStatus === "exitoso"){
              handlerSendFile()
              handlerCloseModalImport()
              setFile(null)
              setUploadStatus("ninguno")
            }}}
          >
            Enviar
          </button>
        </Flex>
        </Flex>
      </Modal> )}
      {/* Modal edit table */}
      {isModalEdit && (
      <Modal
      open={isModalEdit}
      onClose={handlerCloseModalEdit}>
        <Flex vertical justify='space-around' align='center' gap={20}>
        <span style={fontSizeTitleModal}>Editar {isStudent ? "estudiantes" : isFuncionary ? "funcionarios" : "beneficiarios"}</span>
        <Flex gap={29} vertical={isMobile}>
          <SmallInput title='Nombre'
            isRenderAsteric={false}
            name="name"
            value={objectSelected.name}
            maxLength={50}
            errorMessage={okValidationEdit.name}
            required
            className={styles.inputWidthModal}
            onChange={e => handlerEditUser(e)}
            onKeyDown={handlerTextOnlyInput}
            />
          <SmallInput title='Apellidos'
            isRenderAsteric={false}
            name="lastName"
            value={objectSelected.lastName}
            maxLength={50}
            errorMessage={okValidationEdit.lastName}
            required
            className={styles.inputWidthModal}
            onChange={e => handlerEditUser(e)}
            onKeyDown={handlerTextOnlyInput}
            />
        </Flex>

        <Flex gap={29} vertical={isMobile}>
          <SmallInput title={isFuncionary ? "Cédula/código estudiantil" : "Código estudiantil"}
            name="username"
            min={10000000}
            max={9999999999}
            errorMessage={okValidationEdit.username}
            required
            isRenderAsteric={false}
            className={styles.inputWidthModal}
            value={objectSelected.username}
            onChange={e => handlerEditUser(e)}
            onKeyDown={handlerOnlyIntegerPositive}
            />
          <SmallInput title={isFuncionary ? "Área dependiente/plan":"Plan"}
            isRenderAsteric={false}
            type={isFuncionary ? "text" : "number"}
            name="plan"
            value={objectSelected.plan}
            errorMessage={okValidationEdit.plan}
            required
            className={styles.inputWidthModal}
            onChange={e => handlerEditUser(e)}
            onKeyDown={e => isFuncionary ? handlerTextAndIntegerPositve(e) : handlerOnlyIntegerPositive(e)}
            />
        </Flex>
          
        <Flex gap={29} vertical={isMobile}>
          <SmallInput title='Correo electrónico'
            value={objectSelected.email}
            isRenderAsteric={false}
            errorMessage={okValidationEdit.email}
            name="email"
            type="email"
            required
            className={styles.inputWidthModal}
            onChange={e => handlerEditUser(e)}
            />
          <SelectWithError title={isStudent ? "Estado" 
            : isFuncionary ? "Rol"
            : "Tipo de beneficio"}
            isRenderAsteric={!isModalEdit}
            style={{width:"11.5rem"}}
            errorMessage={isStudent ? okValidationEdit.status : isFuncionary ? okValidationEdit.roles : okValidationEdit.grant} 
            value={getValueComplexSelectInModal()}
            status={statusEstadoRolTipoBecaSelect}
            options={getOptionsComplexSelectInModal()}
            onSelect={ (value, option) => {
              const selected = option.value
              if(isStudent) handlerEditUser({target:{name:"isActive", value:selected}})
              if(isBeneficiary) {
                handlerEditUser({target:{name:"lunchBeneficiary", value:selected}})
              }
              if(isFuncionary) handlerRoleEditUser(selected)
            }}
            onChange={value => {
              if(isStudent) handlerBlurSelect(validStatus(value), setStatusEstadoRolTipoBecaSelect)
              if(isBeneficiary) handlerBlurSelect(validGrant(value), setStatusEstadoRolTipoBecaSelect)
              if(isFuncionary) handlerBlurSelect(validRol(value), setStatusEstadoRolTipoBecaSelect)
            }}
            />
        </Flex>

        {isFuncionary && <Flex align='center' justify='flex-start'>
        <SelectWithError title='Estado'
          errorMessage={okValidationEdit.status}
          placeholder="Selecciona"
          value={objectSelected.isActive}
          style={{width:"11.5rem"}}
          options={cbxStatus}
          onSelect={ (value, option) => handlerEditUser({target:{name:"isActive", value:option.value}})}
          onChange={value => handlerBlurSelect(validStatus(value), setStatusEstadoRolTipoBecaSelect)}
          />
        </Flex>
        }
        </Flex>
        <Flex
        align='center'
        style={{gap: "1.7rem"}}
        justify='center'>
          <button 
          className={`button-save ${styles.buttons}`}
          onClick={() => {
            if(deepEqual(objectSelected, objectSelectedClone)){
              notifyError("No hay cambios")
            }else{
              setPressedEdit(true)
              if(handlerVerify(objectSelected, isModalEdit)){
                if(objectSelected.roles.includes("MONITOR") && !objectSelected.roles.includes("ESTUDIANTE")){
                  objectSelected.roles[1] = "ESTUDIANTE"
                }
                handlerSendUserEdited()
                .then( () => {
                  setObjectSelectedClone(null)
                  handlerCloseModalEdit(false)
                  setObjectSelected(null)
                })
              }
            }
            }}>
            Guardar
          </button>
          <button className={`button-cancel ${styles.buttons}`}
          onClick={() => {
            setObjectSelected(objectSelectedClone)
            handlerOkValidation({clear: true, fnState: setOkValidationEdit})
            setPressedEdit(false)
            // setIsModalEdit(false)
          }}>Cancelar</button>
        </Flex>
      </Modal>) }
      {isModalAllDelete && (
        <ReusableModal 
        title='Eliminar beneficiarios' 
        content='¿Desea eliminar todos los beneficiarios actuales de la plataforma?'
        cancelText='No'
        confirmText='Si'
        visible={isModalAllDelete}
        onCancel={handlerCloseModalAllDelete}
        onConfirm={() => {
          handlerDeleteUsers()
          .then(() => handlerCloseModalAllDelete())
          .catch( error => console.error("Ocurre en confirm de modal delete " + error))
        }}/>)}
      {isModalDelete && (
        <ReusableModal 
        title='Eliminar beneficiario'
        content='¿Desea eliminar el beneficiario de la plataforma?'
        cancelText='No'
        confirmText='Si'
        visible={isModalDelete}
        onCancel={handlerCloseModalDelete}
        onConfirm={() => {
          handlerDeleteUser()
          .then(handlerCloseModalDelete())
          .catch()
        }}
        />
      ) }
      {contextHolder}
        <MenuBecas 
          buttons={buttons}
          onSelect={type => {
            handlerClick(type)
            setCurrentPage(0)
            handlerOkValidation({clear: true, fnState: setOkValidation})
            setPressedSave(false)
            localStorage.setItem("userManagementUser", JSON.stringify(initialUser))
            setUser(initialUser)
          }}
          defaultSelected={buttons[1].type}>
            <button 
            className={styles.buttonImport} 
            onClick={handlerOpenModalImport}>
              Importar
            </button>
            <div className={styles.contentTitles}>
              <h3>{descriptions[changesDescription].title}</h3>
              <p>{descriptions[changesDescription].description}</p>
            </div>

        <Flex
          align='center'
          justify='center'
          wrap
          gap={30}
          >          
            <Flex 
            gap={29} 
            vertical={isMobile}>
              <SmallInput title='Nombre'
                key={`name${changesDescription}${refreshFields}`}                
                placeholder={`Nombre(s) ${isFuncionary ? "de la persona" : "del estudiante"}`}
                maxLength={50}
                autoComplete="off"
                errorMessage={pressedSave ? okValidation.name : ""}
                name="name"
                value={user.name}
                required
                onChange={e => handlerCreateUser(e)}
                onKeyDown={handlerTextOnlyInput}
                />
              <SmallInput title='Apellidos'
                key={`lastName${changesDescription}${refreshFields}`}
                placeholder={`Apellidos ${isFuncionary ? "de la persona" : "del estudiante"}`}
                maxLength={50}
                autoComplete="off"
                errorMessage={pressedSave ? okValidation.lastName : ""}
                value={user.lastName}
                required
                name="lastName"
                onChange={e => handlerCreateUser(e)}
                onKeyDown={handlerTextOnlyInput}
                />
            </Flex>

          <Flex 
          gap={29}
          vertical={isMobile}
          >
            <SmallInput title={isFuncionary ? "Cédula/código estudiantil" : "Código estudiantil"}
              key={`username${changesDescription}${refreshFields}`}              
              placeholder={isFuncionary ? "Cédula de la persona":"Ej: 202412345"}
              type="number"
              errorMessage={pressedSave ? okValidation.username : ""}
              autoComplete="off"
              min={10000000}
              max={99999999}
              value={user.username}
              required
              name="username"
              onChange={handlerCreateUser}
              onKeyDown={handlerOnlyIntegerPositive}
              />
            <SmallInput title={isFuncionary ? "Área dependiente/plan":"Plan"}
              key={`plan${changesDescription}${refreshFields}`}
              type={isFuncionary ? "text" : "number"} 
              placeholder={ isFuncionary ? "Área de la persona":"Ej: 1234"}
              min={isFuncionary ? undefined : 1000}
              max={isFuncionary ? undefined : 9999}
              errorMessage={pressedSave ? okValidation.plan : ""}
              value={user.plan}
              required
              autoComplete="off"
              name="plan"
              onChange={e => handlerCreateUser(e)}
              onKeyDown={e =>  isFuncionary ? handlerTextAndIntegerPositve(e) : handlerOnlyIntegerPositive(e)}
              />
          </Flex>

          <Flex 
          gap={29}
          vertical={isMobile}
          >
            <SmallInput title='Correo electrónico'
              key={`email${changesDescription}${refreshFields}`}              
              placeholder={isFuncionary ? 'Correo de la persona':'Correo del estudiante'}
              errorMessage={pressedSave ? okValidation.email : ""}
              value={user.email}
              required
              autoComplete="off"
              type="email"              
              name="email"
              onChange={e => handlerCreateUser(e)}
            />
          {(!isStudent || !enableResponsive) && 
            <SelectWithError title={isFuncionary ? "Rol" : "Tipo de beneficio"}
              isRenderAsteric={isBeneficiary || isFuncionary}
              name={isBeneficiary ? "grant" : "roles"}
              key={`SelectImportant${changesDescription}${refreshFields}`}
              placeholder="Selecciona"
              classContainer={`${isStudent ? "visibility-hidden" :""}`}
              status={statusRolesGrantSelect}
              options={isFuncionary ? cbxFuncionary : cbxBeneficiaries}
              errorMessage={(isFuncionary && pressedSave) ? okValidation.roles : okValidation.grant}
              value={isFuncionary ? user.roles[0] : user.grant}
              onSelect={(value, option) => {
                
                if(isBeneficiary) {
                  handlerSetSelectCreateUser(option.value)
                  return
                } 

                if(isFuncionary) {
                  handlerAddRoleUserCreate(option.value)
                  return
                }
              }}
              />}
          </Flex>
        </Flex>

        <Flex
        align='center'
        style={{gap: "1.7rem"}}
        justify='center'
        
        >
          <button className={`button-save ${styles.buttons}`} 
          onClick={async () => {
            setPressedSave(true)
            if(isStudent || isBeneficiary) user.roles = ["ESTUDIANTE"]
            if(user.roles.includes("MONITOR")) user.roles[1] = "ESTUDIANTE"
            if(handlerVerify(user)){
              SetSavePressed(!savePressed)
              const evalResult = await handlerSave()
              if(!evalResult) {
                return
              }
              handlerClearFields()
              handlerOkValidation({clear:true, fnState: setOkValidation})
              setPressedSave(false)
            }
          }}>Guardar</button>
          <button className={`button-cancel ${styles.buttons}`}
          onClick={() => {
            handlerClearFields()
            setPressedSave(false)
            handlerOkValidation({clear: true, fnState: setOkValidation})
          }}
          >Cancelar</button>
        </Flex>
        <Divider/>
        <Flex 
        wrap
        justify='center'
        gap={11}
        >
          <Search
            placeholder={ isFuncionary ? 'Cédula de la persona':'Código estudiantil'}
            value={codeUser}
            onChange={e => setCodeUser(e.target.value)}
            onClick ={handlerSearchUser}
            onKeyDown={handlerOnlyIntegerPositive}
            onPaste={e => {
              const pasteData = e.clipboardData.getData('text'); // Obtiene el texto pegado
            
              // Verifica si el texto pegado contiene solo números
              if (!/^[0-9]+$/.test(pasteData)) {
                e.preventDefault(); // Evita pegar si no son solo números
                notifyError("El campo sólo permite números")
              }
            }}
            />
          {isBeneficiary && 
          <button 
          className={styles.buttonDeleteBen}
          onClick={handlerOpenModalAllDelete}>
            Borrar los
            <br />
            beneficiarios
          </button>}
        </Flex>
        <Flex vertical>
          <Flex 
          justify='space-between'
          >
            <p style={{fontWeight:"bold", fontSize:"1.25rem"}} className={styles.marginTable}>
            {`Tabla de ${
            isFuncionary ? "funcionarios y externos registrados": 
              isStudent ? "estudiantes registrados" : 
                "beneficiarios registrados"}`}
            </p>
            <ButtonRefresh 
            className={styles.flexEnd}
            onClick = {() => {
              setCodeUser("")
              loadUsers()}}
            />
          </Flex>
          <Flex align='center' justify='center' wrap>
            <TablePaginationUsers
              columns={headerTb}
              rows={rows}
              enableDelete={isBeneficiary}
              enableEdit
              nameActionsButtons={isBeneficiary ? "Acciones":"Editar"}
              currentPage={currentPage}
              totalItems={totalItems}
              onPageChange={handlePageChange}
              onEdit={handlerOpenModalEdit}
              onDelete={isBeneficiary ? handlerOpenModalDelete:undefined}
              />
          </Flex>
        </Flex>        
        </MenuBecas>
      </main>
      <FooterProfessionals/>
    </>
  )
}
