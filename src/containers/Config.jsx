import React, { useEffect, useState } from "react";
import {
  Checkbox,
  Grid,
  makeStyles,
  Typography,
  Button,
} from "@material-ui/core";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { useNavigate } from "react-router-dom";
import {
  Spinner,
  CustomizedSnackbars,
  Textfield,
  CustomTabs,
  CustomTable,
} from "../components";
import { useLocation } from "react-router-dom";
import request from "../utils/request";
import { PopUp } from "../components";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    width: "100%",
  },
  container: {
    margin: "2rem auto",
    width: "40%",
  },
  formRoot: {},
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
  attributes: {
    margin: theme.spacing(5, 0, 0, 0),
  },
  svg: {
    "& .MuiSvgIcon-root": {
      fontSize: "2rem",
    },
  },
  validateAndPoolBtn: {
    display: "flex",
    padding: theme.spacing(0, 2),
    margin: theme.spacing(4, 0),
  },
  filesTable: {
    margin: "54px -37%",
    width: "200%",
  },
}));

const initialValues = {
  file_properties: {},
  file_attributes: [],
};

const tableHead = [
  "_Id",
  "File Name",
  "File Path",
  "Status",
  "Validation Message",
  "Action",
];

const Config = () => {
  const [configValues, setConfigValues] = useState(initialValues);
  const [properties, setProperties] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [property, setProperty] = useState({});
  const [attribute, setAttribute] = useState({});
  const [checked, setChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("success");
  const [activeTab, setActiveTab] = useState(0);
  const [data, setData] = useState();
  const [anchorEl, setAnchorEl] = useState(null);
  const [renamedData, setRenamedData] = useState([]);
  const [fileId, setFileId] = useState("");
  const [attributeVal, setAttributeVal] = useState({});

  const isPopupOpen = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const classes = useStyles();
  const navigate = useNavigate();
  const { state } = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const dataWithUserDefinedSchema = {
      ...configValues,
      user_defined_schema: {
        file_attributes: renamedData,
      },
    };

    const URL = state === null ? "/config" : `/config/${state[0]._id}`;
    const requestOptions = {
      method: state === null ? "POST" : "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(dataWithUserDefinedSchema),
    };
    try {
      const response = await request({
        URL: URL,
        requestOptions: requestOptions,
      });
      if (response.status === 200) {
        setIsLoading(false);
        navigate("/");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleAddProperties = () => {
    setProperties((prevValues) => [...prevValues, property]);
    setProperty({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target || {};
    setProperty((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const handleRemoveProperty = (index) => {
    const tempProperties = properties.filter((item, ind) => ind !== index);
    setProperties(tempProperties);
  };

  const handleAttributeAdd = () => {
    setAttributes((prevValues) => [...prevValues, attribute]);
    setAttribute({});
    setChecked(false);
  };

  const handleRemoveAttribute = (index) => {
    const tempAttributes = attributes.filter((item, ind) => ind !== index);
    setAttributes(tempAttributes);
  };

  const handleAttributeChange = (e) => {
    const { name, value } = e.target || {};
    setAttribute((prevValues) => ({
      ...prevValues,
      [name]: value,
      file_attribute_required: checked,
    }));
  };

  const handleValid = async () => {
    const URL = `/is_config_valid/${state[0]._id}`;
    try {
      const response = await request({
        URL,
        requestOptions: {
          method: "GET",
        },
      });
      if (response.status === 200) {
        const result = await response.json();
        if (result.status === "success") {
          setSeverity("success");
        }
        if (result.status === "invalid") {
          setSeverity("error");
        }
        setMessage(result.status);
        setOpen(true);
        setIsLoading(false);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleSnakbarClose = () => {
    setOpen(false);
  };

  const handleTabChange = (e, selectedTab) => {
    setActiveTab(selectedTab);
  };

  const handlePoolBtnClick = async () => {
    const URL = "/files";
    const response = await request({
      URL,
      requestOptions: {
        method: "GET",
      },
    });
    if (response.status === 200) {
      const tempData = [];
      const result = await response.json();
      result.forEach((item) => {
        const { status, _id, validation_message, file_name, guess_schema } =
          item || {};
        const { file_path } = guess_schema.file_properties || {};
        const tData = {
          _id: _id,
          file_name: file_name,
          file_path: file_path,
          status: status,
          validation_message: validation_message
            ? validation_message
            : "no-message",
        };
        tempData.push(tData);
      });
      setData(tempData);
    }
  };

  const handleDelete = async (_id) => {
    const URL = `/file/${_id}`;
    const response = await request({
      URL,
      requestOptions: {
        method: "DELETE",
      },
    });

    const result = await response.json();
    if (result.status === 200) {
      const tempData = data.filter((item, index) => item._id !== _id);
      setData(tempData);
    }
  };

  const handleRename = async (event, _id) => {
    setFileId(_id);
    setAnchorEl(event.currentTarget);
    const URL = `/map_user_defined_schema/${_id}`;
    const response = await request({
      URL,
      requestOptions: {
        method: "GET",
      },
    });

    // const text = await response.text();
    // if (text === "no file id") {
    // } else {
    const result = await response.json();
    setRenamedData(result);
    // }
  };

  const handleValidate = async (_id) => {
    const URL = `/validate/${_id}`;
    const response = await request({
      URL,
      requestOptions: {
        method: "GET",
      },
    });
    const result = await response.json();
    if (response.status === 200) {
      setSeverity(result.message === "status is valid" ? "success" : "error");
      setMessage(result.message);
      setOpen(true);
    }
  };

  const handlePopupClose = () => {
    setAnchorEl(null);
    // setRenamedData([]);
  };

  const handleAttributesSave = async (data, _id) => {
    const URL = `/update_user_defined_schema/${_id}`;
    const finalData = { user_defined_schema: data };
    const response = request({
      URL,
      requestOptions: {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalData),
      },
    });
    console.log(await response);
    setRenamedData(data);
    setActiveTab(0);
  };

  const handleAttributeNameAndRenameChange = (e) => {
    const { name, value } = e.target || {};
    setAttributeVal((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const handleAddNameAndRename = () => {
    setRenamedData((prevValues) => [...prevValues, attributeVal]);
    setAttributeVal({});
  };

  const handleNameAndRenameDelete = (index) => {
    const tempData = renamedData.filter((item, ind) => ind !== index);
    setRenamedData(tempData);
  };

  useEffect(() => {
    setConfigValues((prevValues) => ({
      ...prevValues,
      file_attributes: attributes,
    }));

    const newVal = {};
    properties.forEach((item) => {
      const { key, value } = item;
      newVal[key] = value;
    });
    setConfigValues((prevValues) => ({
      ...prevValues,
      file_properties: { ...newVal },
    }));
  }, [attributes, properties]);

  useEffect(() => {
    if (state) {
      const { file_attributes, file_properties } = state[0] || {};
      if (file_attributes && file_properties) {
        const tempProperties = [];
        Object.entries(file_properties).forEach((item) => {
          tempProperties.push({ key: item[0], value: item[1] });
        });
        setProperties(tempProperties);
        // setProperty((prevValues) => ({ ...prevValues, ...tempProperties }));
        const tempData = file_attributes.filter((item) => {
          return {
            file_attribute_name: item.file_attribute_name,
            file_attribute_required: item.file_attribute_required,
          };
        });
        setAttributes(tempData);
      }
    }
  }, [state]);

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <Button
          variant="outlined"
          style={{
            marginLeft: "12px",
          }}
          onClick={() => {
            navigate("/");
          }}
        >
          <ArrowBackIcon style={{ marginRight: "4px" }} /> <span>Back</span>
        </Button>
        <Typography
          variant="h6"
          style={{ textAlign: "center", marginBottom: "16px" }}
        >
          Config Management
        </Typography>

        {/* tabs */}

        <div className={classes.tabs}>
          <CustomTabs
            activeTab={activeTab}
            onChange={handleTabChange}
            tabs={["Config", "Files"]}
          />
        </div>

        <div className={classes.validateAndPoolBtn}>
          {activeTab === 0 && (
            <Button
              variant="contained"
              style={{ marginRight: "24px", padding: "5px 24px" }}
              disabled={state === null}
              onClick={handleValid}
            >
              Validate
            </Button>
          )}
          {activeTab === 1 && (
            <Button
              variant="contained"
              disabled={state === null}
              style={{ padding: "5px 24px" }}
              onClick={handlePoolBtnClick}
            >
              Pool
            </Button>
          )}
        </div>
        {isLoading && <Spinner />}
        {!isLoading && activeTab === 0 && (
          <form onSubmit={handleSubmit} className={classes.formRoot}>
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
              {properties.map((item, index) => (
                <Grid key={index} contaier xs={12} className={classes.inputs}>
                  <Grid xs={4}>
                    <Textfield
                      id={index}
                      name={item.key}
                      onChange={handleChange}
                      value={item.key}
                      disabled={true}
                    />
                  </Grid>
                  <Grid xs={4}>
                    <Textfield
                      id={index}
                      name={item.value}
                      onChange={handleChange}
                      value={item.value}
                      disabled={true}
                    />
                  </Grid>
                  <Grid xs={2} className={classes.svg}>
                    <DeleteForeverIcon
                      onClick={() => handleRemoveProperty(index)}
                      style={{ cursor: "pointer" }}
                    />
                  </Grid>
                </Grid>
              ))}
              <Grid contaier xs={12} className={classes.inputs}>
                <Grid xs={4}>
                  <Textfield
                    name="key"
                    onChange={handleChange}
                    value={property.key}
                  />
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
                    onClick={handleAddProperties}
                  />
                </Grid>
              </Grid>
            </div>

            {/* attributes */}

            <div className={classes.attributes}>
              <Typography className={classes.h6}>File Attributes</Typography>
              <Grid
                container
                xs={12}
                style={{ display: "flex", justifyContent: "center" }}
              >
                <Grid item xs={6}>
                  <Typography
                    style={{ textAlign: "center", marginLeft: "-50px" }}
                  >
                    Attribute Name
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography style={{ textAlign: "start" }}>
                    Required
                  </Typography>
                </Grid>
              </Grid>

              {/* display atttributes */}

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
                    <Checkbox
                      checked={item.file_attribute_required}
                      disabled={true}
                    />
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
                  <AddCircleIcon
                    style={{ cursor: "pointer" }}
                    onClick={handleAttributeAdd}
                  />
                </Grid>
              </Grid>

              {/* user modified schema */}
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
              {renamedData.map((item, index) => (
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
                      name="file_attribute_renamed"
                      value={item.file_attribute_renamed}
                      disabled={true}
                    />
                  </Grid>
                  <Grid item xs={2} className={classes.svg}>
                    <DeleteForeverIcon
                      style={{ cursor: "pointer" }}
                      onClick={() => handleNameAndRenameDelete(index)}
                    />
                  </Grid>
                </Grid>
              ))}

              {/* add attribute name and renamed Attribute */}

              <Grid container item xs={12} justifyContent="space-around">
                <Grid item xs={4}>
                  <Textfield
                    name="file_attribute_name"
                    onChange={handleAttributeNameAndRenameChange}
                    value={attributeVal.file_attribute_name}
                    disabled={false}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Textfield
                    name="file_attribute_renamed"
                    onChange={handleAttributeNameAndRenameChange}
                    value={attributeVal.file_attribute_renamed}
                    disabled={false}
                  />
                </Grid>
                <Grid item xs={2} className={classes.svg}>
                  <AddCircleIcon
                    style={{ cursor: "pointer" }}
                    onClick={handleAddNameAndRename}
                  />
                </Grid>
              </Grid>

              <Grid
                container
                // justifyContent="center"
                style={{ margin: "2rem 0 0 25%" }}
              >
                <Grid>
                  <Button
                    variant="contained"
                    color="primary"
                    style={{ marginRight: "2rem" }}
                    type="submit"
                  >
                    Save
                  </Button>
                </Grid>
                <Grid>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => navigate("/")}
                  >
                    Cancel
                  </Button>
                </Grid>
              </Grid>
            </div>
          </form>
        )}

        {/* pop up */}
        <PopUp
          id={id}
          open={isPopupOpen}
          anchorEl={anchorEl}
          onClose={handlePopupClose}
          data={renamedData}
          handleSave={handleAttributesSave}
          file_id={fileId}
        />

        <CustomizedSnackbars
          message={message}
          isOpen={open}
          onClose={handleSnakbarClose}
          severity={severity}
        />

        {/* files table */}

        {activeTab === 1 && (
          <div className={classes.filesTable}>
            <CustomTable
              tableBody={data}
              tableHead={tableHead}
              isRename={true}
              onDelete={handleDelete}
              onRename={handleRename}
              onValidate={handleValidate}
              fromFile={true}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Config;
