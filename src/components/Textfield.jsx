import React from "react";
import { TextField, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiOutlinedInput-input": {
      padding: theme.spacing(1, 2),
    },
  },
}));

const Textfield = (props = {}) => {
  const {
    variant = "outlined",
    name = "",
    label = "Text",
    onChange = () => {},
    fullWidth = false,
    disabled = false,
    value = "",
    onFocus = () => {},
    id = "",
  } = props;

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <TextField
        id={id}
        className={classes.text}
        variant={variant}
        name={name}
        onChange={onChange}
        fullWidth={fullWidth}
        disabled={disabled}
        value={value}
        onFocus={onFocus}
      />
    </div>
  );
};

export default Textfield;
