const connectPointStyle = {
    position: "absolute",
    width: 15,
    height: 15,
    borderRadius: "50%",
    background: "black"
  };
  const connectPointOffset = {
    left: { left: 0, top: "50%", transform: "translate(-50%, -50%)" },
    right: { left: "100%", top: "50%", transform: "translate(-50%, -50%)" },
    top: { left: "50%", top: 0, transform: "translate(-50%, -50%)" },
    bottom: { left: "50%", top: "100%", transform: "translate(-50%, -50%)" }
  };
  
  const ConnectPointsWrapper = ({ boxId, handler, ref0 }) => {
    const ref1 = useRef();
  
    const [position, setPosition] = useState({});
    const [beingDragged, setBeingDragged] = useState(false);
    return (
      <React.Fragment>
        <div
          className="connectPoint"
          style={{
            ...connectPointStyle,
            ...connectPointOffset[handler],
            ...position
          }}
          draggable
          onDragStart={e => {
            setBeingDragged(true);
            e.dataTransfer.setData("arrow", boxId);
          }}
          onDrag={e => {
            setPosition({
              position: "fixed",
              left: e.clientX,
              top: e.clientY,
              transform: "none",
              opacity: 0
            });
          }}
          ref={ref1}
          onDragEnd={e => {
            setPosition({});
            // e.dataTransfer.setData("arrow", null);
            setBeingDragged(false);
          }}
        />
        {beingDragged ? <Xarrow start={ref0} end={ref1} /> : null}
      </React.Fragment>
    );
  };
  
  const boxStyle = {
    border: "1px solid black",
    position: "relative",
    padding: "20px 10px"
  };
  
  const Box = ({ text, handler, addArrow, boxId }) => {
    const ref0 = useRef();
    return (
      <div
        id={boxId}
        style={boxStyle}
        ref={ref0}
        onDragOver={e => e.preventDefault()}
        onDrop={e => {
          if (e.dataTransfer.getData("arrow") === boxId) {
            console.log(e.dataTransfer.getData("arrow"), boxId);
          } else {
            const refs = { start: e.dataTransfer.getData("arrow"), end: boxId };
            addArrow(refs);
          }
        }}
      >
        {text}
        <ConnectPointsWrapper {...{ boxId, handler, ref0 }} />
      </div>
    );
  };
  
  export default function App() {
    const [arrows, setArrows] = useState([]);
    const addArrow = ({ start, end }) => {
      setArrows([...arrows, { start, end }]);
    };
    return (
      <div style={{ display: "flex", justifyContent: "space-evenly" }}>
        {/* two boxes */}
        <Box
          text="drag my handler to second element"
          {...{ addArrow, handler: "right", boxId: "box2_1" }}
        />
        <Box
          text="second element"
          {...{ addArrow, handler: "left", boxId: "box2_2" }}
        />
        {arrows.map(ar => (
          <Xarrow
            start={ar.start}
            end={ar.end}
            key={ar.start + "-." + ar.start}
          />
        ))}
      </div>
    );
  }