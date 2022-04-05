import React, { memo, useEffect, useState } from "react";
import { Grid, Typography } from "@material-ui/core";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import EditIcon from "@material-ui/icons/Edit";
import { Textfield } from "../components";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  h6: {
    margin: theme.spacing(0, 0, 1, 2),
    fontWeight: "600",
    letterSpacing: "0.5px",
  },
  inputsContainer: {
    // width: "80%",
  },
  inputs: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    margin: theme.spacing(1, 0),
  },
  svg: {
    "& .MuiSvgIcon-root": {
      fontSize: "2rem",
    },
  },
}));

const FileProperties = (props = {}) => {
  const {
    properties = [],
    handleConfigPropertiesChange = () => {},
    handleEditProperty = () => {},
    handleRemoveProperty = () => {},
    handleAddProperties = () => {},
    editIndex,
  } = props;

  const [property, setProperty] = useState({});

  const [fileProperties, setFileProperties] = useState(properties);

  const classes = useStyles();

  const handleChange = (e) => {
    const { name, value } = e.target || {};
    setProperty((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const addProperties = () => {
    handleAddProperties(property);
    setProperty({});
  };

  const handleConfigChange = (e) => {};

  useEffect(() => {
    setFileProperties(properties);
  }, [properties]);

  return (
    <div className={classes.inputsContainer}>
      {/* properties */}
      <Typography className={classes.h6}>File Properties</Typography>
      <Grid
        container
        xs={12}
        style={{ display: "flex", justifyContent: "center" }}
      >
        <Grid item xs={4}>
          <Typography style={{ textAlign: "start" }}>Key</Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography style={{ textAlign: "start" }}>Value</Typography>
        </Grid>
      </Grid>
      {fileProperties.map((item, index) => (
        <Grid key={index} contaier xs={12} className={classes.inputs}>
          <Grid xs={4}>
            <Textfield
              id={index}
              name={item.key}
              value={item.key}
              disabled={true}
            />
          </Grid>
          <Grid xs={4}>
            <Textfield
              id={index}
              name={item.value}
              onChange={handleConfigPropertiesChange}
              value={item.value}
              disabled={editIndex != index}
              className={classes.propertyInput}
              style={{
                borderRadius: `${editIndex == index ? "4px" : "none"}`,
                boxShadow: `${editIndex == index ? "0 0 0 1px blue " : "none"}`,
              }}
            />
          </Grid>
          <Grid xs={2} className={classes.svg}>
            <EditIcon
              onClick={() => handleEditProperty(index)}
              style={{ cursor: "pointer" }}
            />
            <DeleteForeverIcon
              onClick={() => handleRemoveProperty(index)}
              style={{ cursor: "pointer" }}
            />
          </Grid>
          {editIndex == index && (
            <span
              style={{
                position: "absolute",
                left: "70%",
                color: "rgba(255,0,0,0.8)",
                textTransform: "capitalize",
                fontSize: "0.8rem",
              }}
            >
              you need to click on <b>save</b> to save the changes
            </span>
          )}
        </Grid>
      ))}
      <Grid contaier xs={12} className={classes.inputs}>
        <Grid xs={4}>
          <Textfield name="key" onChange={handleChange} value={property.key} />
        </Grid>
        <Grid xs={4}>
          <Textfield
            name="value"
            onChange={handleChange}
            value={property.value}
          />
        </Grid>
        <Grid xs={2} className={classes.svg}>
          <AddCircleIcon
            style={{ cursor: "pointer" }}
            onClick={addProperties}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default memo(FileProperties);
