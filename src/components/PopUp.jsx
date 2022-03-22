import React, { useEffect, useState } from "react";
import {
  Popover,
  makeStyles,
  Typography,
  Grid,
  Button,
} from "@material-ui/core";
import Textfield from "./Textfield";

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(2),
  },
  wrapper: {
    padding: theme.spacing(1, 3),
  },
}));

const PopUp = (props = {}) => {
  const {
    open,
    onClose = () => {},
    anchorEl,
    id,
    data = [],
    handleSave = () => {},
    file_id = "",
    isRename = false,
    showAttributes = false,
  } = props;

  const [tempData, setTempData] = useState(data);

  const classes = useStyles();

  const handleSaveClick = () => {
    handleSave(tempData, file_id);
    onClose();
  };

  const handleCancelClick = () => {
    onClose();
  };

  const handlePredefinedDataChange = (e) => {
    const { name, value, id } = e.target || {};
    const values = tempData.filter((item, index) => index == id);
    const newV = { ...values[0], file_attribute_renamed: value };

    if (values.length) {
      const tData = [...tempData];
      tData.splice(id, 1, newV);
      setTempData(tData);
    }
  };

  useEffect(() => {
    setTempData(data);
  }, [data]);

  return (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
    >
      {!!isRename && (
        <Grid className={classes.container}>
          <Grid
            container
            xs={12}
            justifyContent="center"
            style={{ textAlign: "center" }}
          >
            <Grid xs={6}>
              <Typography>Attribute Name</Typography>
            </Grid>
            <Grid xs={6}>
              <Typography>Renamed Attribute</Typography>
            </Grid>
          </Grid>
          {tempData.length &&
            tempData.map((item, index) => (
              <Grid
                container
                item
                key={index}
                xs={12}
                justifyContent="space-around"
                style={{ margin: "1rem 0" }}
              >
                <Grid item xs={5}>
                  <Textfield
                    name="file_attribute_name"
                    onChange={handlePredefinedDataChange}
                    value={item.file_attribute_name}
                    disabled={true}
                  />
                </Grid>
                <Grid item xs={5}>
                  <Textfield
                    id={index}
                    name="file_attribute_renamed"
                    onChange={handlePredefinedDataChange}
                    value={item.file_attribute_renamed}
                    disabled={false}
                  />
                </Grid>
              </Grid>
            ))}
          <Grid container item xs={12} justifyContent="center">
            <Grid
              item
              container
              xs={4}
              justifyContent="center"
              style={{ marginTop: "1rem" }}
            >
              <Button
                onClick={handleSaveClick}
                variant="contained"
                color="primary"
                disabled={!tempData.length}
              >
                Save
              </Button>
            </Grid>
            <Grid
              item
              container
              xs={4}
              justifyContent="center"
              style={{ marginTop: "1rem" }}
            >
              <Button
                onClick={handleCancelClick}
                variant="contained"
                color="secondary"
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </Grid>
      )}
      {showAttributes && (
        <div>
          {data &&
          Object.values(data).length &&
          Object.values(data.file_attributes).length ? (
            Object.values(data.file_attributes).map((item, index) => (
              <div className={classes.wrapper}>
                {JSON.stringify(item)}
                <br />
              </div>
            ))
          ) : (
            <div className={classes.wrapper}>No Attribute</div>
          )}
        </div>
      )}
    </Popover>
  );
};

export default PopUp;
