import React, { useState } from "react";
import { Checkbox, Grid, makeStyles, Typography } from "@material-ui/core";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import { Textfield } from "../components";

const useStyles = makeStyles((theme) => ({
  attributes: {
    margin: theme.spacing(5, 0, 0, 0),
  },
  svg: {
    "& .MuiSvgIcon-root": {
      fontSize: "2rem",
    },
  },
  h6: {
    margin: theme.spacing(0, 0, 1, 2),
    fontWeight: "600",
    letterSpacing: "0.5px",
  },
  inputs: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    margin: theme.spacing(1, 0),
  },
}));

const FileAttributes = (props = {}) => {
  const {
    attributes = [],
    handleRemoveAttribute = () => {},
    handleAttributeAdd = () => {},
  } = props;

  const [attribute, setAttribute] = useState({});
  const [checked, setChecked] = useState(false);

  const classes = useStyles();

  const handleAttributeChange = (e) => {
    const { name, value } = e.target || {};
    setAttribute((prevValues) => ({
      ...prevValues,
      [name]: value,
      file_attribute_required: checked,
    }));
  };

  const addAttribute = () => {
    handleAttributeAdd(attribute);
    setAttribute({});
    setChecked(false);
  };

  return (
    <div className={classes.attributes}>
      <Typography className={classes.h6}>File Attributes</Typography>
      <Grid
        container
        xs={12}
        style={{ display: "flex", justifyContent: "center" }}
      >
        <Grid item xs={6}>
          <Typography style={{ textAlign: "center", marginLeft: "-50px" }}>
            Attribute Name
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography style={{ textAlign: "start" }}>Required</Typography>
        </Grid>
      </Grid>

      {attributes.map((item, index) => (
        <Grid key={index} contaier xs={12} className={classes.inputs}>
          <Grid xs={4}>
            <Textfield
              name={item.file_attribute_name}
              value={item.file_attribute_name}
              disabled={true}
              onChange={handleAttributeChange}
            />
          </Grid>
          <Grid xs={4} container justifyContent="center">
            <Checkbox checked={item.file_attribute_required} disabled={true} />
          </Grid>
          <Grid xs={2} className={classes.svg}>
            <DeleteForeverIcon
              style={{ cursor: "pointer" }}
              onClick={() => handleRemoveAttribute(index)}
            />
          </Grid>
        </Grid>
      ))}
      <Grid contaier xs={12} className={classes.inputs}>
        <Grid xs={4}>
          <Textfield
            name="file_attribute_name"
            value={attribute.file_attribute_name}
            onChange={handleAttributeChange}
          />
        </Grid>
        <Grid xs={4} container justifyContent="center">
          <Checkbox
            checked={checked}
            onClick={() => {
              setChecked(!checked);
              setAttribute((prevValues) => ({
                ...prevValues,
                file_attribute_required: !checked,
              }));
            }}
          />
        </Grid>
        <Grid xs={2} className={classes.svg}>
          <AddCircleIcon style={{ cursor: "pointer" }} onClick={addAttribute} />
        </Grid>
      </Grid>
    </div>
  );
};
export default FileAttributes;
