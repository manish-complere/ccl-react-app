import React, { useEffect, useState } from "react";
import {
  Checkbox,
  Grid,
  makeStyles,
  Typography,
  Button,
  Chip,
  TextField,
} from "@material-ui/core";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import EditIcon from "@material-ui/icons/Edit";
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
import Xarrow, { Xwrapper } from "react-xarrows";
import Autocomplete from "@material-ui/lab/Autocomplete";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    width: "100%",
  },
  container: {
    margin: "2rem auto",
    width: "100%",
    display: "flex",
    flexDirection: "column",
  },
  wrapper: {
    width: "40%",
    margin: "auto",
  },
  formRoot: {
    width: "40%",
    margin: "1rem auto",
  },
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
    // margin: "54px -37%",
    // width: "200%",
  },
  processDivRoot: {
    width: "100%",
    display: "flex",
    // height: "60vh",
  },
  processContainer: {
    margin: "1rem 0 0 15rem",
    alignItems: "center",
  },
  processTextfields: {
    display: "flex",
    gap: "1rem",
  },
  processAttributeWrapper: {
    maxHeight: "60vh",
    overflow: "scroll",
    "&::-webkit-scrollbar": {
      display: "none",
    },
  },
  processAttribute: {
    border: "1px solid black",
    height: "2.5rem",
    padding: "0rem 1rem",
    width: "70%",
    borderRadius: "4px",
    textAlign: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: ".5rem 0",
    overflow: "scroll",
    "&::-webkit-scrollbar": {
      display: "none",
    },
  },
  dummyProcessAttribute: {
    border: "1px solid black",
    height: "2.7rem",
    padding: "0.5rem 1rem",
    borderRadius: "4px",
    display: "flex",
    alignItems: "center",
    overflow: "scroll",
    "&::-webkit-scrollbar": {
      display: "none",
    },
  },
  dummyDataContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    // width:"20%"
  },
  FXwrapper: {
    width: "30px",
    height: "28px",
    borderRadius: "35%",
    border: "2px solid black",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    padding: "0.2rem 0.5rem",
  },
  chip: (isDragging) => ({
    marginRight: "0.5rem",
    position: "realtive",
    zIndex: isDragging ? "-1" : "1",
  }),
  option: {
    fontSize: 15,
    "& > span": {
      marginRight: 10,
      fontSize: 18,
    },
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
  "Created Date",
  "Last Modified Date",
  "Action",
];

const initialPoints = {
  start: "",
  end: "",
};

const FX = (props) => {
  const { onClick = () => {}, id = "" } = props || {};
  const classes = useStyles();
  return (
    <div className={classes.FXwrapper} onClick={onClick}>
      <Typography>FX</Typography>
    </div>
  );
};

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
  const [renamedSavedData, setRenamedSavedData] = useState([]);
  const [fileId, setFileId] = useState("");
  const [attributeVal, setAttributeVal] = useState({});
  const [guessSchema, setGuessSchema] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editRename, setEditRename] = useState(null);

  const [processAttributes, setProcessAttributes] = useState([]);
  const [connectingData, setConnectingData] = useState([]);
  const [point, setPoint] = useState(initialPoints);
  const [position, setPosition] = useState({});
  const [isDragging, setIsDragging] = useState(false);
  const [isRenamedClicked, setIsRenamedClicked] = useState(false);
  const [isProcesFnsClicked, setIsProcesFnsClicked] = useState(false);
  const [formulaList, setFormulaList] = useState([]);
  const [chipData, setChipData] = useState([]);
  const [selectedFunction, setSelectedFunction] = useState({});
  const [currentClickedFnIndex, setCurrentClickedFnIndex] = useState("");
  const [processList, setProcessList] = useState([]);
  const [selectedProcess, setSelectedProcess] = useState("");
  const [processNames, setProcessNames] = useState([]);
  const [selectedFormulasFromPopup, setSelectedFormulasFromPopup] = useState(
    {}
  );
  const [processID, setProcessID] = useState("");

  const isPopupOpen = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const classes = useStyles(isDragging);
  const navigate = useNavigate();
  const { state } = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const dataWithUserDefinedSchema = {
      ...configValues,
      user_defined_schema: {
        file_attributes: renamedSavedData,
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
        setMessage(
          `${result.status} ${result.message && `:${result.message}`}`
        );
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

  const handlePoolBtnClick = async (onlyFiles = false) => {
    const URL = onlyFiles ? "" : `/pooling/${state[0]._id}`;
    try {
      const response =
        !onlyFiles &&
        (await request({
          URL,
          requestOptions: {
            method: "GET",
          },
        }));
      if (response.status === 200 || onlyFiles) {
        const filesURL = `/files/${state[0]._id}`;
        try {
          const files = await request({
            URL: filesURL,
            requestOptions: {
              method: "GET",
            },
          });
          const result = await files.json();
          const tempData = [];
          result.forEach((item) => {
            const {
              status,
              _id,
              validation_message,
              file_name,
              guess_schema,
              created_at,
              last_modified_date,
            } = item || {};
            const { file_path } = guess_schema.file_properties || {};
            const { file_attributes } = guess_schema || {};
            const gSchema = { _id: _id, file_attributes: file_attributes };
            setGuessSchema((prevValues) => [...prevValues, gSchema]);
            const tData = {
              _id: _id,
              file_name: file_name,
              file_path: file_path,
              status: status,
              validation_message: validation_message
                ? validation_message
                : "no-message",
              created_at: created_at,
              last_modified_date: last_modified_date,
            };
            tempData.push(tData);
          });
          setData(tempData);
        } catch (e) {
          console.log(e);
        }
      }
    } catch (e) {
      console.log(e);
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
    setIsRenamedClicked(true);
    setFileId(_id);
    setAnchorEl(event.currentTarget);
    const URL = `/map_user_defined_schema/${_id}`;
    const response = await request({
      URL,
      requestOptions: {
        method: "GET",
      },
    });
    const result = await response.json();
    setRenamedData(result);
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
      // const onlyFiles = true;
      // await handlePoolBtnClick(onlyFiles);
      const URL = `/file/${_id}`;
      const res = request({
        URL,
        requestOptions: {
          method: "GET",
        },
      });

      const { status, validation_message } = await (await res).json();

      setSeverity(result.status === 200 ? "success" : "error");
      setMessage(result.message);
      setOpen(true);
      const tempData = data.map((item) => {
        if (item._id === _id) {
          return {
            ...item,
            status: status,
            validation_message: validation_message
              ? validation_message
              : "no-message",
          };
        } else {
          return item;
        }
      });
      setData(tempData);
    }
  };

  const handlePopupClose = () => {
    setAnchorEl(null);
    setRenamedData([]);
    setIsRenamedClicked(false);
    setIsProcesFnsClicked(false);
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
    setRenamedSavedData(data);
    setActiveTab(0);
    setIsRenamedClicked(false);
  };

  const handleAttributeNameAndRenameChange = (e) => {
    const { name, value } = e.target || {};
    setAttributeVal((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const handleAddNameAndRename = () => {
    setRenamedSavedData((prevValues) => [...prevValues, attributeVal]);
    setAttributeVal({});
  };

  const handleNameAndRenameDelete = (index) => {
    const tempData = renamedSavedData.filter((item, ind) => ind !== index);
    setRenamedSavedData(tempData);
  };

  const handleAttributeRenameChange = (e) => {
    const { name, value, id } = e.target || {};
    const values = renamedSavedData.filter((item, index) => index == id);
    const newValues = { ...values[0], file_attribute_renamed: value };
    if (values.length) {
      const tData = [...renamedSavedData];
      tData.splice(id, 1, newValues);
      setRenamedSavedData(tData);
    }
  };

  const handleConfigPropertiesChange = (e) => {
    const { name, value, id } = e.target || {};
    const values = properties.filter((item, index) => index == id);
    const newValues = { ...values[0], value: value };
    if (values.length) {
      const tData = [...properties];
      tData.splice(id, 1, newValues);
      setProperties(tData);
    }
  };

  const handleEditProperty = (index) => {
    setEditIndex(index);
    setEditRename(null);
  };

  const handleEditRename = (index) => {
    setEditRename(index);
    setEditIndex(null);
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
      const { file_attributes, file_properties, user_defined_schema } =
        state[0] || {};

      if (user_defined_schema) {
        setRenamedSavedData(user_defined_schema.file_attributes);
      }

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

  useEffect(() => {
    if (activeTab === 1) {
      const onlyFiles = true;
      !data && handlePoolBtnClick(onlyFiles);
    }

    if (activeTab === 2) {
      const re = async () => {
        try {
          const processURL = "/process";
          const processResponse = await request({
            URL: processURL,
            requestOptions: {
              method: "GET",
            },
          });
          const result = await processResponse.json();
          if (result.length) {
            const a = result.map((item) => {
              return item.process_name;
            });
            setProcessNames(a);
            setProcessList(result);
          }
        } catch (e) {
          console.log(e);
        }
      };
      const getMappingData = async () => {
        const URL = `/mapping/${state[0]._id}`;
        try {
          const response = await request({
            URL,
            requestOptions: {
              method: "GET",
            },
          });
          const result = await response.json();
          const { attribute_mapping, process_id, status, _id, config_id } =
            result;
          setProcessID(process_id);
          const processName = await getProcessNameFromId(process_id);
          setSelectedProcess(processName);
          attribute_mapping.forEach((attribute, index) => {
            const tempObj = {
              id: attribute.target_attribute,
              chips: Array.isArray(attribute.source_attribute)
                ? attribute.source_attribute
                : attribute.source_attribute
                ? [attribute.source_attribute]
                : [],
            };
            setChipData((prevData) => [...prevData, tempObj]);
            setSelectedFunction((p) => ({
              ...p,
              [index]: attribute.formula && `${attribute.formula}`,
            }));

            if (Array.isArray(attribute.source_attribute)) {
              attribute.source_attribute.forEach((item) => {
                renamedSavedData.forEach((attr, ind) => {
                  if (attr.file_attribute_renamed === item) {
                    setConnectingData((prevPoints) => [
                      ...prevPoints,
                      { start: item + ind, end: attribute.target_attribute },
                    ]);
                  }
                });
              });
            } else {
              renamedSavedData.forEach((attr, ind) => {
                if (
                  attr.file_attribute_renamed === attribute.source_attribute
                ) {
                  setConnectingData((prevPoints) => [
                    ...prevPoints,
                    {
                      start: attribute.source_attribute + ind,
                      end: attribute.target_attribute,
                    },
                  ]);
                }
              });
            }
          });
        } catch (e) {
          console.log(e);
        }
      };
      re();
      !chipData.length && !connectingData.length && getMappingData();
    }
  }, [activeTab]);

  const getProcessNameFromId = async (_id) => {
    try {
      const URL = `/process/${_id}`;
      const response = await request({
        URL,
        requestOptions: {
          method: "GET",
        },
      });
      const result = await response.json();
      const { process_name } = result || {};
      return process_name;
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const filteredData = processList.filter(
      (item, index) => item.process_name == selectedProcess
    );
    if (filteredData.length) {
      const { file_attributes, _id } = filteredData[0] || {};
      setProcessAttributes(file_attributes);
      setProcessID(_id);
    }
    if (processAttributes.length) {
      setConnectingData([]);
      // setFormulaList([]);
      setChipData([]);
      setSelectedFunction({});
    }
  }, [selectedProcess]);

  function allowDrop(ev) {
    ev.preventDefault();
  }

  function drag(ev) {
    ev.dataTransfer.setData("Text", ev.target.id);
  }

  function drop(ev, index) {
    ev.preventDefault();
    const { id } = ev.target || {};
    var data = ev.dataTransfer.getData("Text");
    const tempData = data.replace(/\d+/g, "");
    const tempID = id.replace(/\d+/g, "");
    const tempObj = { id: tempID, chips: [tempData] };
    if (chipData.length && chipData.some((item) => item.id === tempID)) {
      const tempChipData = [...chipData];
      let ind;
      const d = chipData.filter((item, index) => {
        if (item.id === tempID) {
          ind = index;
        }
        return item.id === tempID;
      });
      // if (!d[0].chips.includes(tempData)) {
      d[0].chips.push(tempData);
      // }
      tempChipData.splice(ind, 1, d[0]);
      setChipData([...tempChipData]);
    } else {
      setChipData((prevData) => [...prevData, tempObj]);
    }
    setSelectedFunction((prevValues) => ({
      ...prevValues,
      [index]: `${
        selectedFunction[index] ? selectedFunction[index] : ""
      }"${tempData}"`,
    }));
    // var nodeCopy = document.getElementById(data).cloneNode(true);
    // nodeCopy.id = "newId";
    // ev.target.appendChild(nodeCopy);
  }

  console.log(selectedFunction);

  useEffect(() => {
    if (point.start.length && point.end.length) {
      setConnectingData((prevData) => [...prevData, point]);
      setPoint(initialPoints);
    }
  }, [point]);

  const handleChipDelete = (ind, id, chip, inde) => {
    const tempChipData = [...chipData];
    const tempConnectingData = connectingData.filter((item, index) => {
      const tempStart = item.start.replace(/\d+/g, "");
      if (item.end === id && tempStart === chip) {
        return item;
      }
    });
    const final = connectingData.filter(
      (item) => JSON.stringify(item) !== JSON.stringify(tempConnectingData[0])
    );

    setConnectingData(final);
    let i;
    const d = chipData.filter((item, index) => {
      if (item.id === id) {
        i = index;
      }
      return item.id === id;
    });
    // const tempChips = [...new Set(d[0].chips)];
    // d[0].chips = [...tempChips];
    const tempChips = d[0].chips.filter((ch) => ch !== chip);
    d[0].chips = [...tempChips];
    tempChipData.splice(i, 1, d[0]);
    setChipData(tempChipData);
    const tempSelectedFn = { ...selectedFunction };
    const replacedFn = tempSelectedFn[inde].replaceAll(`"${chip}"`, "");
    tempSelectedFn[inde] = replacedFn;
    setSelectedFunction(tempSelectedFn);
  };

  const handleProcessSaveBtnClick = async () => {
    const [file_attributes] = processList.map((item, index) => {
      if (selectedProcess === item.process_name) {
        return item.file_attributes;
      }
    });
    const tempData = [];
    if (chipData.length) {
      file_attributes.forEach((attr, ind) => {
        chipData.forEach((item, index) => {
          if (item.id === attr.file_attribute_name) {
            tempData.push({
              target_attribute: item.id,
              source_attribute:
                item.chips.length > 1
                  ? item.chips
                  : item.chips.length
                  ? item.chips[0]
                  : null,
              formula: selectedFunction[index] ? selectedFunction[index] : "",
            });
          }
        });
      });
    } else {
      file_attributes.forEach((attr, ind) => {
        tempData.push({
          target_attribute: attr.file_attribute_name,
          source_attribute: null,
          formula: "",
        });
      });
    }
    const newD = [...tempData];
    const av = [];
    if (tempData.length < file_attributes.length) {
      file_attributes.forEach((attr, ind) => {
        tempData.forEach((item, index) => {
          if (item.target_attribute === attr.file_attribute_name) {
            av.push(attr.file_attribute_name);
          }
        });
      });
      file_attributes.forEach((attr) => {
        if (!av.some((t) => t === attr.file_attribute_name)) {
          newD.push({
            target_attribute: attr.file_attribute_name,
            source_attribute: null,
            formula: "",
          });
        }
      });
    }
    const finalProcessData = {
      config_id: state[0]._id,
      process_id: processID,
      attribute_mapping: newD,
    };
    const URL = "/mapping";
    try {
      setIsLoading(true);
      const response = await request({
        URL,
        requestOptions: {
          method: "POST",
          body: JSON.stringify(finalProcessData),
          headers: {
            "Content-Type": "application/json",
          },
        },
      });
      const mappingID = await response.text();
      if (response.status === 200) {
        setIsLoading(false);
        try {
          const URL = `/is_mapping_valid/${mappingID}`;
          const response = await request({
            URL,
            requestOptions: {
              method: "GET",
            },
          });
          const result = await response.json();
          if (response.status == 200) {
            setSeverity(() => (result.status === 200 ? "success" : "error"));
            setMessage(result.message);
            setOpen(true);
          }
        } catch (e) {
          console.log(e);
        }
      }
    } catch (e) {
      console.log(e);
      setIsLoading(false);
    }
  };

  const handleProcessCancelBtnClick = () => {
    navigate("/");
  };

  const handleFunctionClick = async (e, id) => {
    let endPt = "";
    processAttributes.forEach((item, index) => {
      if (index === id) {
        endPt = item.file_attribute_name;
      }
    });
    setPoint((prevPoints) => ({ ...prevPoints, end: endPt }));
    setIsProcesFnsClicked(true);
    setAnchorEl(e.currentTarget);
    const URL = "/formula";
    try {
      const response = await request({
        URL,
        requestOptions: {
          method: "GET",
        },
      });
      if (response.status === 200) {
        const result = await response.json();
        const tempFormulaNames = result.filter(
          (formula) => formula.formula_name
        );
        setFormulaList(tempFormulaNames);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleFunctionSave = (fn, { starting_points }, id) => {
    setSelectedFunction((prevValues) => ({
      ...prevValues,
      [currentClickedFnIndex]: fn,
    }));
    setSelectedFormulasFromPopup((prevData) => ({ ...prevData, [id]: fn }));
    setAnchorEl(null);
    console.log(starting_points, "points");
    setIsProcesFnsClicked(false);
    const pts = [];
    starting_points.forEach((starting_point, index) => {
      const points = { start: starting_point, end: point.end };
      setConnectingData((p) => [...p, points]);
      // setting the chip Data
      const tempData = starting_point.replace(/\d+/g, "");
      pts.push(tempData);
    });
    if (!chipData.length) {
      console.log("her..", pts);
      setChipData((prevData) => [
        ...prevData,
        { id: point.end, chips: [...pts] },
      ]);
    } else {
      const tempChipData = [...chipData];
      let ind;
      const d = chipData.filter((item, index) => {
        if (item.id === point.end) {
          ind = index;
        }
        return item.id === point.end;
      });
      d[0].chips = [...d[0].chips, ...pts];
      tempChipData.splice(ind, 1, d[0]);
      setChipData([...tempChipData]);
    }
  };

  const handleCancelBtnClick = () => {
    setAnchorEl(null);
    setIsProcesFnsClicked(false);
  };

  const handlePlayBtnClick = async (_id) => {
    const URL = `/run/${_id}`;
    try {
      const response = await request({
        URL,
        requestOptions: {
          method: "GET",
        },
      });
      const msg = await response.text();
      setSeverity("success");
      setMessage(msg);
      setOpen(true);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <div className={classes.wrapper}>
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
              tabs={["Config", "Files", "Process"]}
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
                onClick={() => {
                  const onlyFiles = false;
                  handlePoolBtnClick(onlyFiles);
                }}
              >
                Pool
              </Button>
            )}
          </div>
        </div>
        {isLoading && <Spinner />}

        {!isLoading && activeTab === 2 && (
          <>
            <div className={classes.processDivRoot}>
              <Grid
                container
                justifyContent="space-between"
                xs={8}
                className={classes.processContainer}
              >
                <Xwrapper>
                  <div
                    id="helperDiv"
                    style={{
                      position: "absolute",
                      transform: "translate(-50%, -50%)",
                      ...position,
                    }}
                  ></div>
                  <Grid xs={5} item className={classes.processAttributeWrapper}>
                    {renamedSavedData.length &&
                      renamedSavedData.map((item, index) => (
                        <div
                          key={index}
                          // onDrop={(e) => drop(e)}
                          // onDragOver={(e) => allowDrop(e)}
                        >
                          <div
                            className={classes.processAttribute}
                            draggable={true}
                            id={item.file_attribute_renamed + index}
                            onDragStart={(e) => {
                              drag(e);
                              setPoint((prevPoints) => ({
                                ...prevPoints,
                                start: item.file_attribute_renamed + index,
                              }));
                              setIsDragging(true);
                            }}
                            onDrag={(e) => {
                              e.preventDefault();
                              setPosition({
                                position: "fixed",
                                left: e.clientX - 30,
                                top: e.clientY,
                                transform: "none",
                              });
                            }}
                            onDragEnd={() => {
                              setPoint(initialPoints);
                              setPosition({
                                transform: "translate(-50%, -50%)",
                              });
                              setIsDragging(false);
                            }}
                          >
                            {item.file_attribute_renamed}
                          </div>
                        </div>
                      ))}

                    {connectingData.map(
                      (item, index) =>
                        item.start &&
                        item.end && (
                          <Xarrow
                            key={index}
                            start={item.start}
                            end={item.end}
                          />
                        )
                    )}
                    {point.start && (
                      <Xarrow start={point.start} end="helperDiv" />
                    )}
                  </Grid>
                </Xwrapper>
                <Grid
                  xs={5}
                  item
                  container
                  className={classes.processTextfields}
                >
                  <Autocomplete
                    id="process_name"
                    style={{ width: 300 }}
                    options={processNames}
                    classes={{
                      option: classes.option,
                    }}
                    size="small"
                    autoHighlight
                    value={selectedProcess}
                    getOptionLabel={(option) => option}
                    renderOption={(option) => (
                      <React.Fragment>{option}</React.Fragment>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Choose a process"
                        variant="outlined"
                        // value={selectedProcess}
                        inputProps={{
                          ...params.inputProps,
                          autoComplete: "new-password",
                        }}
                      />
                    )}
                    onChange={(e, value) => {
                      setSelectedProcess(value);
                    }}
                    // getOptionSelected={(option, value) => {
                    //   // handleSetAttributes(option);
                    //   setSelectedProcess(option);
                    // }}
                  />
                  <Xwrapper>
                    {selectedProcess &&
                      processAttributes.map((item, inde) => (
                        <Grid
                          xs={12}
                          container
                          className={classes.dummyDataContainer}
                          key={inde}
                        >
                          <Grid
                            item
                            xs={5}
                            id={item.file_attribute_name}
                            name={item.file_attribute_name}
                            className={classes.dummyProcessAttribute}
                            draggable={false}
                            onDrop={(e) => {
                              e.preventDefault();
                              const { id } = e.target || {};
                              const element = document.getElementById(id);
                              element.scrollTo(window.innerWidth, 0);
                              drop(e, inde);
                              setPoint((prevPoints) => ({
                                ...prevPoints,
                                end: item.file_attribute_name,
                              }));
                            }}
                            // onDragStart={(e) => drag(e)}
                            onDragOver={(e) => allowDrop(e)}
                          >
                            {chipData.length
                              ? chipData.map(
                                  (i, index) =>
                                    i.id === item.file_attribute_name &&
                                    i.chips.map((chip, ind) => (
                                      <Chip
                                        label={chip}
                                        key={index}
                                        className={classes.chip}
                                        variant="outlined"
                                        // color="primary"
                                        onDelete={() =>
                                          handleChipDelete(
                                            ind,
                                            i.id,
                                            chip,
                                            inde
                                          )
                                        }
                                      />
                                    ))
                                )
                              : null}
                          </Grid>
                          <Grid
                            item
                            id={inde}
                            xs={5}
                            className={classes.dummyProcessAttribute}
                          >
                            {item.file_attribute_name}
                          </Grid>
                          <Grid
                            item
                            xs={1}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <FX
                              onClick={(e) => {
                                handleFunctionClick(e, inde);
                                setCurrentClickedFnIndex(inde);
                              }}
                              id={inde}
                            />
                            {selectedFunction &&
                            Object.keys(selectedFunction).length &&
                            selectedFunction[inde] ? (
                              <Chip
                                variant="outlined"
                                label={selectedFunction[inde]}
                                style={{ margin: "0 0.5rem" }}
                              />
                            ) : null}
                          </Grid>
                        </Grid>
                      ))}
                  </Xwrapper>
                </Grid>
              </Grid>
            </div>
            <Grid
              container
              item
              xs={4}
              justifyContent="center"
              style={{
                width: "100%",
                position: "relative",
                left: "35%",
                top: "5%",
              }}
            >
              <Grid item xs={3}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleProcessSaveBtnClick}
                >
                  Save
                </Button>
              </Grid>
              <Grid item xs={3}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleProcessCancelBtnClick}
                >
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </>
        )}

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
                        boxShadow: `${
                          editIndex == index ? "0 0 0 1px blue " : "none"
                        }`,
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
                      you need to click on <strong>save</strong> to save the
                      changes
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
                    onClick={() => {
                      const isOk = window.confirm(
                        "you will lose all your changes, are you sure want to cancel?"
                      );
                      if (isOk) {
                        navigate("/");
                      }
                    }}
                  >
                    Cancel
                  </Button>
                </Grid>
              </Grid>
            </div>
          </form>
        )}

        {/* attribute pop up */}
        <PopUp
          id={id}
          open={isPopupOpen}
          anchorEl={anchorEl}
          onClose={handlePopupClose}
          data={renamedData}
          handleSave={handleAttributesSave}
          file_id={fileId}
          isRename={true}
          idRenameClicked={isRenamedClicked}
          isProcesFnsClicked={isProcesFnsClicked}
          formulaList={formulaList}
          onSaveFunction={handleFunctionSave}
          onCancelClick={handleCancelBtnClick}
          columns={renamedSavedData}
          indexOfProcessAttribute={selectedFunction[currentClickedFnIndex]}
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
              guessSchema={guessSchema}
              isRename={true}
              onDelete={handleDelete}
              onRename={handleRename}
              onValidate={handleValidate}
              onPlayBtnClick={handlePlayBtnClick}
              fromFile={true}
              date={true}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Config;
