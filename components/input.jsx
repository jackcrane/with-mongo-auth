import styles from "../styles/Input.component.module.less";
import { useState } from "react";
import classNames from "classnames";

const Input = (props) => {
  const [inputEmpty, setInputEmpty] = useState(true);
  const [valid, setValid] = useState(null);
  const [length, setLength] = useState(0);

  const HandleInput = (e) => {
    setLength(e.target.value.length);
    if (e.target.value === "") {
      setInputEmpty(true);
    } else {
      setInputEmpty(false);
    }
    if (props.verify) {
      setValid(props.verify(e.target.value));
    }
    props.onInput(e);
  };

  return (
    <div
      className={classNames(
        styles.input__container,
        inputEmpty ? styles.empty : null,
        props.classNames
      )}
    >
      <label htmlFor="email" className={styles.label}>
        {props.placeholder}
      </label>
      <input
        type={props.type}
        className={classNames(
          styles.input,
          props.verify && length > 0 && (valid ? styles.valid : styles.invalid)
        )}
        onInput={HandleInput}
        name={props.name}
      />
      {props.verify && length > 0 && !valid ? (
        <span className={styles.invalidMessage}>{props.invalidMessage}</span>
      ) : null}
    </div>
  );
};

export default Input;
