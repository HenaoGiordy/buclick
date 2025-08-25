import styles from "../../styles/global/inputSmall.module.css"
import PropTypes from "prop-types"

export default function LabelAsteric({
  title = "",
  isRenderAsteric = false,
  labelClass = "",
  children
}){
  return (
  <>
    <label className={styles.labels}>
      <span className={labelClass}>{title} {isRenderAsteric ? <span className={styles.asteric}>*</span> : ""}</span>
      <br />
      {children}
    </label>
  </>
  )
}

LabelAsteric.propTypes = {
  title: PropTypes.string,
  isRenderAsteric: PropTypes.bool,
  labelClass: PropTypes.string
}