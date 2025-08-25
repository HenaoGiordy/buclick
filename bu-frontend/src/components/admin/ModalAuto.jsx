import {Modal} from "antd"
import { useState } from "react"

export default function ModalAuto({children}){
  const [isOpenModal, setIsOpenModal] = useState(true)

  const handlerCancel = () => {setIsOpenModal(false)}
  
  return (
  <Modal 
  open={isOpenModal}
  onClose={handlerCancel}
  footer={null}
  >
    {children}
  </Modal>
  )
}