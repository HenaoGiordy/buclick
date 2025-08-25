import { ReloadOutlined } from "@ant-design/icons"
import styles from "../../styles/global/buttonEdit.module.css"


export default function ButtonRefresh(props){
  return (
    <button {...props} 
    className={`${styles.buttonEdit} ${props.className || ""}`}>
      <ReloadOutlined/>
    </button>
  )
}