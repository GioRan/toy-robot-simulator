import React from "react";
import { connect } from "react-redux";

import "./Grid.css";

import MainPropsType from "../../Types/MainPropsType";
import Constants from "../../Utils/Constants";

///////////////////////////////////////////////////////////////////////////
///React Component <PropsType, StateType>/////////////////////////////////
//////////////////////////////////////////////////////////////////////////
class Grid extends React.Component<MainPropsType, {}> {
  ////////////////////////////
  //Constructor//////////////
  ///////////////////////////
  constructor(props: any) {
    super(props);
  }

  ////////////////////////////
  //ComponentDidMount////////
  ///////////////////////////

  componentDidMount() {
    this.initializeGrid();
  }

  ///////////////////////////////////////////////////////////////////////////
  //Initialized Grid => cols (vertical angle), rows (horizontal angle)///////
  //////////////////////////////////////////////////////////////////////////

  initializeGrid() {
    const grid = [];

    for (let row = this.props.rows - 1; row >= 0; row--) {
      for (let col = 0; col < this.props.cols; col++) {
        grid.push({
          row,
          col,
          isRobot: false,
          directionStyle: null,
        });
      }
    }

    this.props.updateGrid(grid);
  }

  ///////////////////////////////////////////////////////////////////////////
  //Render()/////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////
  render() {
    const gridItems = this.props.grid.map((grid: any) => {
      return (
        <div
          key={grid.row.toString() + "-" + grid.col.toString()}
          className={grid.isRobot ? "grid-item robot-item" : "grid-item"}
          style={grid.directionStyle != null ? grid.directionStyle : {}}
        ></div>
      );
    });
    return (
      <div className="grid-container col s8">
        <div className="grid">{gridItems}</div>
      </div>
    );
  }
}

///////////////////////////////////////////////////////////////////////////
///Get state from Main store and map to props//////////////////////////////
//////////////////////////////////////////////////////////////////////////

let mapStatetoProps = (state: any) => {
  return {
    rows: state.rows,
    cols: state.cols,
    grid: state.grid,
    robot: state.robot,
    currentDirection: state.currentDirection,
    directionStyle: state.directionStyle,
  };
};

///////////////////////////////////////////////////////////////////////////
///Map dispatch from Main Store so we can use it in our component//////////
//////////////////////////////////////////////////////////////////////////
let mapDispatchToProps = (dispatch: Function, ownProps: any) => {
  return {
    updateGrid: (grid: Array<any>) => {
      dispatch({
        type: Constants.STORE_ACTION_DISPATCH_GRID,
        state: grid,
      });
    },
    updateCurrentDirection: (currentDirection: string) => {
      dispatch({
        type: Constants.STORE_ACTION_DISPATCH_CURRENT_DIRECTION,
        state: currentDirection,
      });
    },
  };
};

///////////////////////////////////////////////////////////////////////////////////////////
///Export Component with react-redux connect so we can connect to our Main Store//////////
//////////////////////////////////////////////////////////////////////////////////////////

export default connect(mapStatetoProps, mapDispatchToProps)(Grid);
