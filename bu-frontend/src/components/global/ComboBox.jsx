import LabelAsteric from "./LabelAsteric.jsx";
import {Select} from "antd";
import PropTypes from "prop-types"


export default function ComboBox({
  title = "title",
  isRenderAsteric = false,
  labelClass = "",
  ...props
}){
  return (<>
    <LabelAsteric
    title={title}
    isRenderAsteric={isRenderAsteric}
    labelClass={labelClass}
    >
      <Select {...props}/>
    </LabelAsteric>
  </>)
}

ComboBox.propTypes = {
  title: PropTypes.string,
  isRenderAsteric: PropTypes.bool,
  labelClass: PropTypes.string
}