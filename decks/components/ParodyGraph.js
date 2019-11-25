import React, { useEffect, useState } from "react";
const horizontal = {
  position: "absolute",
  bottom: 20,
  left: 40,
  right: 50,
  height: 5,
  background: "#fff"
};

const horizontalTriangle = {
  position: "absolute",
  bottom: 2,
  height: 5,
  right: 30,
  borderTop: "20px solid transparent",
  borderBottom: "20px solid transparent",
  borderLeft: "20px solid #fff"
};

const vertical = {
  position: "absolute",
  top: 40,
  bottom: 20,
  width: 5,
  left: 40,
  background: "#fff"
};

const verticalTriangle = {
  position: "absolute",
  top: 20,
  bottom: 20,
  height: 5,
  left: 22,
  borderLeft: "20px solid transparent",
  borderRight: "20px solid transparent",
  borderBottom: "20px solid #fff"
};

const centerLeftStyles = {
  transform: "translateX(-100px) translateY(-50%) rotate(270deg) ",
  position: "absolute",
  top: "50%"
};

const bar = {
  width: 200,
  background: "hotpink",
  position: "absolute",
  bottom: 25,
  transformOrigin: "0% 100%",
  transition: "transform 3s ease-out",
  textAlign: 'center'
};

const Graph = ({
  height = 400,
  leftText = "",
  loser = "loser",
  winner = "winner",
  loserHeight = 40,
  winnerHeight = 130
}) => {
  const [scale, setScale] = useState(0);
  useEffect(() => {
    setTimeout(() => {
      setScale(1);
    }, 100);
  }, []);
  return (
    <div style={{ height, background: "", position: "relative" }}>
      <div style={horizontal} />
      <div style={horizontalTriangle} />
      <div style={vertical} />
      <div style={{ left: 2, ...centerLeftStyles }}>{leftText}</div>
      <div style={verticalTriangle} />
      <div
        style={{
          ...bar,
          height: loserHeight,
          left: "20%",
          transform: `scaleY(${scale})`
        }}
      >
        {loser}
      </div>
      <div
        style={{
          ...bar,
          height: winnerHeight,
          left: "60%",
          transform: `scaleY(${scale})`
        }}
      >
        {winner}
      </div>
    </div>
  );
};

export default Graph;
