import React, { useEffect, useState } from "react";
import {
  Popover,
  makeStyles,
  Typography,
  Grid,
  Button,
  TextField,
  Select,
  InputAdornment,
  MenuItem,
  FormControl,
  InputLabel,
} from "@material-ui/core";
import Textfield from "./Textfield";
import SearchIcon from "@material-ui/icons/Search";

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(2),
  },
  wrapper: {
    padding: theme.spacing(1, 3),
  },
  processFunctionWrapper: {
    padding: theme.spacing(2),
    width: theme.spacing(110),
    minHeight: theme.spacing(40),
  },
  tabs: {
    background: "rgba(0,0,0,0.1)",
    margin: theme.spacing(0, 1),
    padding: theme.spacing(1, 2),
    borderRadius: theme.spacing(1),
    height: theme.spacing(3),
    cursor: "pointer",
    "&:hover": {
      background: "rgba(0,0,255,0.2)",
    },
  },
  aTab: {
    background: "rgba(0,0,255,0.2)",
  },
  formulaWrapper: {
    margin: theme.spacing(1, 0),
    padding: theme.spacing(1),
    maxHeight: theme.spacing(22),
    border: "1px solid rgba(0,0,0,0.1)",
    overflowY: "scroll",
    // "&::-webkit-scrollbar": {
    //   display: "none",
    // },
  },
  listItem: {
    listStyle: "none",
    margin: theme.spacing(0.6, 0),
    padding: theme.spacing(0, 1),
    cursor: "pointer",
    "&:hover": {
      background: "rgba(0,0,0,0.1)",
    },
  },
  // typo: {
  //   cursor: "pointer",
  //   margin: theme.spacing(1, 0),
  //   // border: "1px solid rgba(0,0,0,0.5)",
  //   boxShadow: "0 0 0 1px rgba(0,0,0,0.5)",
  //   padding: theme.spacing(1, 2),
  //   borderRadius: theme.spacing(1),
  //   letterSpacing: "0.5px",
  //   "&:hover": {
  //     // border: "1px solid #000",
  //     // boxShadow:"none",
  //     backgroundColor: "rgba(255,0,0,0.4)",
  //     color: "#fff",
  //   },
  // },
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
    idRenameClicked = false,
    isProcesFnsClicked = false,
    formulaList = [],
    onSaveFunction = () => {},
    onCancelClick = () => {},
    columns = [],
    selectedformula = "",
  } = props;

  const [tempData, setTempData] = useState(data);
  const [activeTab, setActiveTab] = useState("functions");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedFormula, setSelectedFormula] = useState("");
  const [selectedColumn, setSelectedColumn] = useState("");
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [formula, setFormula] = useState("");
  // const [shouldMessageVisible, setShouldMessageVisible] = useState(false);

  const [formulaCategories, setFormulaCategories] = useState([]);
  const [formulas, setFormulas] = useState([]);
  const [parametersReq, setParametersReq] = useState("");

  useEffect(() => {
    if (formulaList && formulaList.length) {
      const tempCategory = formulaList.map((item) => item.formula_category);
      const filteredCategories = [...new Set(tempCategory)];
      const tempFormulas = formulaList.map((item) => item.formula_name);
      setFormulaCategories(["All", ...filteredCategories]);
      setFormulas(tempFormulas);
    }
  }, [formulaList]);

  useEffect(() => {
    setSelectedFormula(selectedformula);
  }, [selectedformula]);

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

  const handleAddFormula = (f) => {
    setFormula(f);
    setSelectedFormula(`${f}("")`);
    setSelectedColumns([]);
    setSelectedColumn("");
  };

  const handleColumnFormula = (value) => {
    formula.length && setSelectedColumn(value);
    formula.length && setSelectedColumns((p) => [...p, value]);
    // if (
    //   selectedColumns.length &&
    //   !selectedColumns.some((item) => item === value)
    // ) {
    //   selectedColumn.length && setSelectedColumns((p) => [...p, value]);
    // }
    // if (!selectedColumns.length) {
    //   setSelectedColumns((p) => [...p, value]);
    // }
  };

  const handleFunctionCategoryChange = (e) => {
    const { name, value } = e.target || {};
    setSelectedCategory(value);
    const tempFormulas =
      value === "All"
        ? formulaList
            .map((item) => item.formula_name)
            .filter((item) => item !== undefined)
        : formulaList
            .map((item) => {
              if (item.formula_category === value) {
                return item.formula_name;
              }
            })
            .filter((item) => item !== undefined);
    setFormulas(tempFormulas);
  };

  useEffect(() => {
    setTempData(data);
  }, [data]);

  useEffect(() => {
    // const tempValue = `${formula}("${
    //   selectedColumns.length && selectedColumns.length < 1
    //     ? selectedColumns[0]
    //     : selectedColumns.join(",")
    // }")`;
    const tempColumnsNames = selectedColumns.map((column) => `"${column}"`);
    const tempValue = `${formula}("") ${tempColumnsNames.join("")}`;
    formula && setSelectedFormula(tempValue);
  }, [selectedColumn, selectedColumns]);

  useEffect(() => {
    // if (selectedFormula.length) {
    //   setShouldMessageVisible(true);
    // } else {
    //   setShouldMessageVisible(false);
    // }
    const tempF = selectedFormula.slice(0, selectedFormula.indexOf("("));
    const tempInd =
      formulaList &&
      formulaList.length &&
      formulaList.filter((item, index) => item.formula_name === tempF);
    tempInd.length && setParametersReq(tempInd[0].required_parameters);
  }, [selectedFormula]);

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
      {!!isRename && !!idRenameClicked && (
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
      {isProcesFnsClicked && (
        <div className={classes.processFunctionWrapper}>
          <Grid
            container
            xs={12}
            justifyContent="space-between"
            style={{ padding: "1rem 0" }}
          >
            <Grid item xs={6}>
              <TextField
                type="text"
                name="formulas"
                multiline={true}
                variant="outlined"
                fullWidth={true}
                minRows={12}
                value={selectedFormula}
                onChange={(e) => {
                  const { name, value } = e.target || {};
                  setSelectedFormula(value);
                }}
              />
            </Grid>
            <Grid container item xs={5}>
              <Grid
                item
                container
                xs={12}
                justifyContent="center"
                // alignItems="center"
              >
                <div
                  className={` ${classes.tabs} ${
                    activeTab == "columns" ? classes.aTab : ""
                  }`}
                  onClick={() => setActiveTab("columns")}
                >
                  Columns
                </div>
                <div
                  className={` ${classes.tabs} ${
                    activeTab == "functions" ? classes.aTab : ""
                  }`}
                  onClick={() => setActiveTab("functions")}
                >
                  Functions
                </div>
              </Grid>
              <Grid
                item
                xs={12}
                style={{
                  margin: "0.8rem 0",
                  // border: "1px solid black",
                  width: "100%",
                  height: "25vh",
                }}
              >
                <Grid item xs={12}>
                  {activeTab === "functions" ? (
                    <>
                      <Grid
                        container
                        item
                        xs={12}
                        justifyContent="space-between"
                      >
                        <Grid item xs={5}>
                          <FormControl
                            fullWidth={true}
                            variant="outlined"
                            size="small"
                          >
                            <InputLabel>Select Category</InputLabel>
                            <Select
                              labelId="fns_categories"
                              id="fns_categories"
                              value={selectedCategory}
                              onChange={handleFunctionCategoryChange}
                              fullWidth={true}
                              size="small"
                              label="select category"
                            >
                              {formulaCategories.map((item, index) => (
                                <MenuItem value={item} key={index}>
                                  {item}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            type="text"
                            name="formulas"
                            variant="outlined"
                            fullWidth={true}
                            size="small"
                            // value={selectedFormula}
                            label="search"
                            onChange={(e) => {
                              const { name, value } = e.target || {};
                              const tempFormulas =
                                selectedCategory !== "All"
                                  ? formulaList
                                      .map((item) => {
                                        if (
                                          item.formula_name.includes(value) &&
                                          item.formula_category ===
                                            selectedCategory
                                        ) {
                                          return item.formula_name;
                                        }
                                      })
                                      .filter((item) => item !== undefined)
                                  : formulaList
                                      .map((item) => {
                                        if (item.formula_name.includes(value)) {
                                          return item.formula_name;
                                        }
                                      })
                                      .filter((item) => item !== undefined);
                              setFormulas(tempFormulas);
                            }}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <SearchIcon />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                      </Grid>
                      <div className={classes.formulaWrapper}>
                        {
                          formulas.map((item, index) => (
                            // item.name === selectedCategory &&
                            // item.formulas.map((formula) => (
                            <li
                              onClick={() => handleAddFormula(item)}
                              className={classes.listItem}
                              key={index}
                            >
                              {item}
                            </li>
                          ))
                          // ))
                        }
                      </div>
                    </>
                  ) : (
                    <div className={classes.formulaWrapper}>
                      {columns.length &&
                        columns.map((item, index) => (
                          <li
                            className={classes.listItem}
                            onClick={() =>
                              handleColumnFormula(item.file_attribute_name)
                            }
                          >
                            {item.file_attribute_name}
                          </li>
                        ))}
                    </div>
                  )}
                </Grid>
              </Grid>
            </Grid>
            {/* {!!shouldMessageVisible && (
              <Grid item xs={12}>
                <Typography
                  style={{
                    color: "rgb(255,0,0,0.5)",
                    margin: "0.8rem 0 0 0",
                  }}
                >
                  you need to add atleast {parametersReq.toString()} column to
                  the formula{" "}
                </Typography>
              </Grid>
            )} */}
            <Grid
              item
              container
              xs={12}
              style={{
                textAlign: "center",
                display: "flex",
                justifyContent: "center",
                margin: "1rem 0 0 0",
              }}
            >
              <Grid item xs={2}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth={true}
                  onClick={() => {
                    let ind = "";
                    const startingPtData = [];
                    selectedColumns.forEach((column, index) => {
                      columns.map((c, i) => {
                        if (column === c.file_attribute_name) {
                          ind = i;
                        }
                      });
                      startingPtData.push(`${column}${ind}`);
                    });
                    // columns.map((item, index) => {
                    //   if (item.file_attribute_name === selectedColumn) {
                    //     ind = index;
                    //   }
                    // });
                    // onSaveFunction(selectedFormula, {
                    //   starting_point: `${selectedColumn}${ind}`,
                    // });
                    onSaveFunction(selectedFormula, {
                      starting_points: startingPtData,
                    });
                    setSelectedFormula("");
                    setSelectedColumns([]);
                    setSelectedColumn("");
                    setActiveTab("functions");
                    setFormula("");
                  }}
                  disabled={!selectedFormula.length || !selectedColumn.length}
                >
                  Save
                </Button>
              </Grid>
              <Grid item xs={2}>
                <Button
                  variant="contained"
                  color="secondary"
                  fullWidth={true}
                  style={{ margin: "0 1rem" }}
                  onClick={() => {
                    onCancelClick();
                    setSelectedFormula("");
                    setSelectedColumns([]);
                    setSelectedColumn("");
                    setActiveTab("functions");
                    setFormula("");
                  }}
                >
                  cancel
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </div>
      )}
    </Popover>
  );
};

export default PopUp;
