import React, { memo, useState } from "react";
import { Grid, Typography, makeStyles } from "@material-ui/core";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import EditIcon from "@material-ui/icons/Edit";
import { Textfield } from "../components";

const useStyles = makeStyles((theme) => ({
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
  svg: {
    "& .MuiSvgIcon-root": {
      fontSize: "2rem",
    },
  },
}));

const UserModifiedSchema = (props = {}) => {
  const {
    renamedSavedData = [],
    editRename,
    handleAttributeRenameChange = () => {},
    handleEditRename = () => {},
    handleNameAndRenameDelete = () => {},
    setEditRename,
    setEditIndex,
    handleAddNameAndRename = () => {},
  } = props;

  const [attributeVal, setAttributeVal] = useState({});

  const classes = useStyles();

  const handleAttributeNameAndRenameChange = (e) => {
    const { name, value } = e.target || {};
    setAttributeVal((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const addNameAndRename = () => {
    handleAddNameAndRename(attributeVal);
    setAttributeVal({});
  };

  return (
    <>
      <Typography className={classes.h6} style={{ marginTop: "2rem" }}>
        User modified schema
      </Typography>
      <Grid
        container
        item
        xs={12}
        justifyContent="center"
        style={{ margin: "1rem 0" }}
      >
        <Grid item xs={5}>
          Attribute Name
        </Grid>
        <Grid item xs={5}>
          Attribute Rename
        </Grid>
      </Grid>
      {renamedSavedData.map((item, index) => (
        <Grid
          container
          item
          xs={12}
          justifyContent="space-around"
          style={{ margin: "1rem 0" }}
          key={index}
        >
          <Grid item xs={4}>
            <Textfield
              name="file_attribute_name"
              value={item.file_attribute_name}
              disabled={true}
            />
          </Grid>
          <Grid item xs={4}>
            <Textfield
              id={index}
              name="file_attribute_renamed"
              value={item.file_attribute_renamed}
              disabled={editRename != index}
              onChange={handleAttributeRenameChange}
              style={{
                borderRadius: `${editRename == index ? "4px" : "none"}`,
                boxShadow: `${
                  editRename == index ? "0 0 0 1px blue " : "none"
                }`,
              }}
            />
          </Grid>
          <Grid item xs={2} className={classes.svg}>
            <EditIcon
              onClick={() => handleEditRename(index)}
              style={{ cursor: "pointer" }}
            />
            <DeleteForeverIcon
              style={{ cursor: "pointer" }}
              onClick={() => handleNameAndRenameDelete(index)}
            />
          </Grid>
          {editRename == index && (
            <span
              style={{
                position: "absolute",
                left: "70%",
                color: "rgba(255,0,0,0.9)",
                textTransform: "capitalize",
                fontSize: "0.8rem",
              }}
            >
              you need to click on <strong>save</strong> to save the changes
            </span>
          )}
        </Grid>
      ))}

      {/* add attribute name and renamed Attribute */}

      <Grid container item xs={12} justifyContent="space-around">
        <Grid item xs={4}>
          <Textfield
            name="file_attribute_name"
            onChange={handleAttributeNameAndRenameChange}
            onFocus={() => {
              setEditRename(null);
              setEditIndex(null);
            }}
            value={attributeVal.file_attribute_name}
            disabled={false}
          />
        </Grid>
        <Grid item xs={4}>
          <Textfield
            name="file_attribute_renamed"
            onChange={handleAttributeNameAndRenameChange}
            onFocus={() => {
              setEditRename(null);
              setEditIndex(null);
            }}
            value={attributeVal.file_attribute_renamed}
            disabled={false}
          />
        </Grid>
        <Grid item xs={2} className={classes.svg}>
          <AddCircleIcon
            style={{ cursor: "pointer" }}
            onClick={addNameAndRename}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default memo(UserModifiedSchema);
