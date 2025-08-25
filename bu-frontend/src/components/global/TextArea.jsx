import LabelAsteric from "./LabelAsteric.jsx"
import PropTypes from "prop-types"

import { Input } from "antd"

export default function TextArea({
  title = "",
  labelClass = "",
  isRenderAsteric = false,
  ...props
}){
  return (
    <LabelAsteric
    title={title}
    labelClass={labelClass}
    isRenderAsteric={isRenderAsteric}
    >
      <Input.TextArea {...props}/>
    </LabelAsteric>
  )
}

TextArea.propTypes = {
  title: PropTypes.string,
  labelClass: PropTypes.string,
  isRenderAsteric: PropTypes.bool
}
