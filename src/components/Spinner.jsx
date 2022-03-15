import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    position: "relative",
    top: "50%",
    left: "50%",
    transform: "translate(,-50%)",
    
  },
}));

export default function Spinner() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CircularProgress size={50} />
    </div>
  );
}
