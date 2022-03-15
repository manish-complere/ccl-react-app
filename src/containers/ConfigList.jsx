import React, { useEffect, useState } from "react";
import { makeStyles, Button, Typography } from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import { Spinner } from "../components";
import AddIcon from "@material-ui/icons/Add";
import { CustomTable } from "../components";
import request from "../utils/request";
import { CustomizedSnackbars } from "../components";

const useStyles = makeStyles((theme) => ({
  table: {},
  root: {
    padding: theme.spacing(2, 10),
    textAlign: "center",
  },
  btn: {
    display: "flex",
    alignItems: "center",
  },
  backArrow: {
    margin: theme.spacing(0, 0.5, 0, 0),
  },
  btn: {
    margin: theme.spacing(3, 0),
    width: theme.spacing(11),
  },
  addConfig: {
    textAlign: "center",
    margin: theme.spacing(0, 0, 4, 0),
    display: "flex",
    justifyContent: "space-around",
  },
}));

const tableHead = ["_Id", "File Path", "File Type", "Status", "Action"];

const ConfigList = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [isLoading, setisLoading] = useState(false);
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState({});

  useEffect(() => {
    getConfigList();
  }, []);

  const getConfigList = async () => {
    setisLoading(true);
    const URL = "/configs";
    const response = await request({
      URL,
      requstOptions: { method: "GET" },
    });
    if (response.status === 200) {
      let tempData = [];
      setisLoading(false);
      const result = await response.json();
      setOriginalData(result);
      Object.values(result).forEach((item) => {
        const { file_properties, status, _id } = item || {};
        const { file_path, file_type } = file_properties || {};
        const tData = {
          _id: _id,
          file_path: file_path,
          file_type: file_type,
          status: status,
        };
        tempData.push(tData);
      });
      setData(tempData);
    }
  };
  const handleIdClick = (_id) => {
    const data = Object.values(originalData).filter((row) => row._id === _id);
    navigate("/update-config", { state: { ...data } });
  };

  const handleDeleteConfig = async (_id) => {
    const tData = data.filter((item) => item._id !== _id);
    const URL = `/config/${_id}`;
    const response = await request({
      URL,
      requestOptions: {
        method: "DELETE",
      },
    });
    if (response.status === 200) {
      setData(tData);
    }
  };

  return (
    <div className={classes.root}>
      <Typography variant="h6">Config</Typography>
      <div className={classes.addConfig}>
        <div></div>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => navigate("/update-config")}
        >
          <AddIcon />
          <span>Add Config</span>
        </Button>
      </div>
      {isLoading && <Spinner />}
      {!isLoading && (
        <CustomTable
          tableHead={tableHead}
          tableBody={[...data]}
          isDeleteIcon={true}
          onClick={handleIdClick}
          onDelete={handleDeleteConfig}
        />
      )}
      <CustomizedSnackbars />
    </div>
  );
};

export default ConfigList;
