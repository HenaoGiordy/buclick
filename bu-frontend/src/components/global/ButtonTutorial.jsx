import { FloatButton, ConfigProvider } from "antd"
import { QuestionCircleOutlined } from '@ant-design/icons';
import PropTypes from "prop-types"

export default function ButtonTutorial({role}){
  
  const URL_STUDENT = "https://drive.google.com/drive/folders/1r2CKKFPdwbryTmrKjWAuU8E_8VwjklOl?usp=sharing"
  
  const URL_FUNCIONARY = "https://drive.google.com/drive/folders/12oXensLIXnJ5fkfx71PDUq0lWjPgNg1j?usp=sharing"
  
  const handlerNewPage = () => {
    const isStudent = role === "student"
    const isFuncionary = role === "funcionary"
    if(isStudent){
      window.open(URL_STUDENT, "_blank")
    }else if(isFuncionary){
      window.open(URL_FUNCIONARY, "_blank")
    }else{
      console.error("Algo Falla en el flotante")
    }
  }
  return (
    <>
    <ConfigProvider
    theme={
      {
        token:{colorBgElevated:"var(--gray-dark)"}
      }
    }>
      <FloatButton
      icon={
      <QuestionCircleOutlined style={{color:"var(--white)"}}/>
      }      
      tooltip={<span>Aprenda a usar la página</span>}
      onClick={handlerNewPage}
      />
    </ConfigProvider>
    </>
  )
}

ButtonTutorial.propTypes = {
  role: PropTypes.string
}