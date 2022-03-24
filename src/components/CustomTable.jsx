import React, { useState } from "react";
import {
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
} from "@material-ui/core";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import PlaylistAddCheckIcon from "@material-ui/icons/PlaylistAddCheck";
import CreateIcon from "@material-ui/icons/Create";
import VisibilityIcon from "@material-ui/icons/Visibility";
import PopUp from "./PopUp";

const useStyles = makeStyles((theme) => ({
  table: {},
  headCell: {
    cursor: "pointer",
    color: "rgba(0,0,255,0.6)",
    "&:hover": {
      color: "rgba(0,0,255,1)",
    },
  },
  deleteIcon: {
    cursor: "pointer",
    "&:hover": {
      color: "rgba(255,0,0,0.7)",
    },
  },

  renameIcon: {
    cursor: "pointer",
    "&:hover": {
      // color: "rgba(0,0,255,0.7)",
      color: "orange",
    },
  },
  renameTab: {
    display: "flex",
    width: theme.spacing(15),
    gap: theme.spacing(0.5),
    justifyContent: "space-around",
    alignItems: "center",
    height: "42px",
  },
}));

const CustomTable = (props = {}) => {
  const {
    tableHead = [],
    tableBody = [],
    onClick = () => {},
    onDelete = () => {},
    isDeleteIcon = false,
    isRename = false,
    onRename = () => {},
    onValidate = () => {},
    fromFile = false,
    guessSchema = [],
    date = false,
  } = props;

  const [anchorEl, setAnchorEl] = useState(null);
  const [attributes, setAttributes] = useState({});

  const id = "simple-popover";
  const isPopupOpen = Boolean(anchorEl);

  const classes = useStyles();

  const handleViewAttributesClick = (event, _id) => {
    const tempAttribute = guessSchema.filter((item, index) => item._id === _id);
    setAttributes(tempAttribute[0]);
    setAnchorEl(event.currentTarget);
  };

  const handlePopupClose = () => {
    setAnchorEl(null);
  };

  return (
    <Grid container justifyContent="center">
      <TableContainer style={{ width: "100%" }} component={Paper}>
        <Table
          className={classes.table}
          size="medium"
          aria-label="simple table"
        >
          <TableHead>
            <TableRow>
              {tableHead.map((head, index) => (
                <TableCell key={index} align="center">
                  {head}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {tableBody.map((item, index) => (
              <TableRow key={index}>
                <TableCell
                  className={classes.headCell}
                  align="center"
                  component="th"
                  scope="row"
                  onClick={() => onClick(item._id)}
                >
                  {item._id}
                </TableCell>
                {fromFile && (
                  <TableCell align="center">{item.file_name}</TableCell>
                )}
                <TableCell align="center">{item.file_path}</TableCell>
                {!fromFile && (
                  <TableCell align="center">{item.file_type}</TableCell>
                )}
                <TableCell align="center">{item.status}</TableCell>
                {item.validation_message && (
                  <TableCell align="center">
                    {item.validation_message}
                  </TableCell>
                )}
                {isDeleteIcon && (
                  <TableCell align="center">
                    <DeleteForeverIcon
                      className={classes.deleteIcon}
                      onClick={() => onDelete(item._id)}
                    />
                  </TableCell>
                )}
                {date && (
                  <>
                    <TableCell>
                      {item.created_at}
                      {/* {new Date(item.created_at).toLocaleDateString()},
                      {new Date(item.created_at).toLocaleTimeString()} */}
                    </TableCell>
                    <TableCell>
                      {item.last_modified_date}
                      {/* {new Date(item.last_modified_date).toLocaleDateString()},
                      {new Date(item.last_modified_date).toLocaleString()} */}
                    </TableCell>
                  </>
                )}
                {isRename && (
                  <TableCell className={classes.renameTab}>
                    <DeleteForeverIcon
                      className={classes.deleteIcon}
                      onClick={() => onDelete(item._id)}
                    />
                    <CreateIcon
                      className={classes.renameIcon}
                      onClick={(e) => onRename(e, item._id)}
                    />
                    <PlaylistAddCheckIcon
                      className={classes.renameIcon}
                      onClick={() => onValidate(item._id)}
                    />
                    <VisibilityIcon
                      className={classes.renameIcon}
                      fontSize="small"
                      onClick={(e) => handleViewAttributesClick(e, item._id)}
                    />
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* pop up for file attributes */}
      <PopUp
        id={id}
        open={isPopupOpen}
        anchorEl={anchorEl}
        onClose={handlePopupClose}
        data={attributes}
        showAttributes={true}
      />
    </Grid>
  );
};

export default CustomTable;
