import { Select } from "antd";
import PropTypes, { oneOfType } from "prop-types";
import {
    labels as labelsCSS,
    message as messageCSS,
    asteric as astericCSS
} from "../../styles/global/inputSmall.module.css"; // Asegúrate de que este archivo tenga los estilos definidos
import styles from "../../styles/global/select.module.css";

export default function SelectWithError({
    title = "Select",
    errorMessage = "",
    isRenderAsteric = false,
    options = [],
    classContainer = "",
    ...props
}) {
    const waitBoolOrString = (data) => {
        if (typeof data === "boolean") return "";
        if (typeof data === "string") return data;
        throw new Error("Property errorMessage debe ser un booleano o string");
    };

    const errorText = waitBoolOrString(errorMessage);
    const hasError = Boolean(errorText);

    return (
        <div className={`${styles.container} ${hasError ? styles.containerError : ""} ${classContainer}`}>
            <label className={labelsCSS}>
                <span style={{display:"block"}}>
                    {title} {isRenderAsteric ? <span className={astericCSS}>*</span> : ""}
                </span>
                <Select
                    {...props}
                    options={options}
                    className={styles.select}
                    style={{
                        borderColor: hasError ? 'red' : '', // Aplica borde rojo si hay error
                        borderWidth: hasError ? '1px' : '',
                        borderStyle: hasError ? 'solid' : '',
                        borderRadius: '.5rem',
                        ...props.style
                    }}
                />
            </label>
            {hasError && <span className={messageCSS}>{errorText}</span>}
        </div>
    );
}

SelectWithError.propTypes = {
    title: PropTypes.string,
    errorMessage: oneOfType([PropTypes.string, PropTypes.bool]),
    options: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string,
            value: PropTypes.any,
        })
    ),
    isRenderAsteric: PropTypes.bool,
    className: PropTypes.string,
    classContainer: PropTypes.string
};
