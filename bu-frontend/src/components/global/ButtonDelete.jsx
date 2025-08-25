import {buttonEdit, color} from "../../styles/global/buttonEdit.module.css"
import { DeleteOutlined } from "@ant-design/icons"
import PropTypes from "prop-types"

export default function ButtonDelete({onClick,...props}){
  return (
    <button className={buttonEdit} onClick={onClick} {...props}>
      <DeleteOutlined className={color}></DeleteOutlined>
    </button>
  )
}

ButtonDelete.propTypes = {
  onClick : PropTypes.func
}