import React from "react";
import { connect } from "react-redux";
import _ from "lodash";

import "./Form.css";

import FormType from "../../Types/FormType";
import Constants from "../../Utils/Constants";

///////////////////////////////////////////////////////////////////////////
///React Component <PropsType, StateType>/////////////////////////////////
//////////////////////////////////////////////////////////////////////////
class Form extends React.Component<FormType, {}> {
  constructor(props: any) {
    super(props);

    //event bindings
    this.handleFormOnchanged = this.handleFormOnchanged.bind(this);
    this.handlePlaceRobot = this.handlePlaceRobot.bind(this);
    this.handleMoveRobot = this.handleMoveRobot.bind(this);
    this.handleRotateLeft = this.handleRotateLeft.bind(this);
    this.handleRotateRight = this.handleRotateRight.bind(this);
    this.handleOutput = this.handleOutput.bind(this);
  }

  ///////////////////////////////////////////////////////////////////////////
  //update fields state every change on x, y, f inputs///////////////////////
  //////////////////////////////////////////////////////////////////////////
  handleFormOnchanged(e: any) {
    let { name, value } = e.target;

    this.props.updateField(name, value);
  }

  ///////////////////////////////////////////////////////////////////////////
  //Place robot in grid/////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////
  handlePlaceRobot() {
    let { x_input, y_input, f_input, grid, isRobotExist } = this.props;

    let isInputValid = this.placeRobotValidation();

    if (isInputValid) {
      grid.forEach((grid: any, index: number) => {
        if (isRobotExist) {
          if (
            grid.isRobot &&
            !(grid.col === parseInt(y_input) && grid.row === parseInt(x_input))
          ) {
            this.props.updateRobotPosition(!grid.isRobot, index);
          }

          if (
            grid.col === parseInt(y_input) &&
            grid.row === parseInt(x_input)
          ) {
            this.props.updateRobotPosition(
              true,
              index,
              this.getDirectionStyle(f_input)
            );
          }
        } else {
          if (
            grid.col === parseInt(y_input) &&
            grid.row === parseInt(x_input) &&
            !grid.isRobot
          ) {
            this.props.updateRobotPosition(
              !grid.isRobot,
              index,
              this.getDirectionStyle(f_input)
            );
            this.props.updateRobotExistense(!isRobotExist);
          }
        }
      });

      this.props.updateCurrentDirection(f_input);
    }
  }

  ///////////////////////////////////////////////////////////////////////////
  //x, y, f input basic validation//////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////

  placeRobotValidation() {
    let { x_input, y_input, f_input } = this.props;

    if (
      parseInt(x_input) > 4 ||
      parseInt(x_input) < 0 ||
      parseInt(y_input) > 4 ||
      parseInt(y_input) < 0 ||
      isNaN(parseInt(x_input)) ||
      isNaN(parseInt(y_input))
    ) {
      alert("[x input and y input] => Please enter only number 0 to 4");
      return false;
    }

    if (
      ![
        Constants.ROBOT_DIRECTION_EAST,
        Constants.ROBOT_DIRECTION_WEST,
        Constants.ROBOT_DIRECTION_NORTH,
        Constants.ROBOT_DIRECTION_SOUTH,
      ].includes(f_input)
    ) {
      alert(
        "[f input] => Please enter only values " +
          Constants.ROBOT_DIRECTION_EAST +
          ", " +
          Constants.ROBOT_DIRECTION_WEST +
          ", " +
          Constants.ROBOT_DIRECTION_NORTH +
          ", " +
          Constants.ROBOT_DIRECTION_SOUTH
      );
      return false;
    }

    return true;
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //Get Direction style => transform: {rotation(xxxdeg)}, update currentDirection if navigation is provided/////////
  //Handles rotation logic//////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  getDirectionStyle(currentDirection: string, navigation: any = null) {
    let rotateValue = 0;
    let newDirection = "";

    switch (currentDirection) {
      case Constants.ROBOT_DIRECTION_WEST:
        navigation
          ? navigation === Constants.ROBOT_ROTATION_LEFT
            ? (rotateValue = 270 - 90)
            : (rotateValue = 270 + 90)
          : (rotateValue = 270);

        newDirection = navigation
          ? navigation === Constants.ROBOT_ROTATION_LEFT
            ? Constants.ROBOT_DIRECTION_SOUTH
            : Constants.ROBOT_DIRECTION_NORTH
          : "";

        break;
      case Constants.ROBOT_DIRECTION_NORTH:
        navigation
          ? navigation === Constants.ROBOT_ROTATION_LEFT
            ? (rotateValue = 0 - 90)
            : (rotateValue = 0 + 90)
          : (rotateValue = 0);

        newDirection = navigation
          ? navigation === Constants.ROBOT_ROTATION_LEFT
            ? Constants.ROBOT_DIRECTION_WEST
            : Constants.ROBOT_DIRECTION_EAST
          : "";

        break;
      case Constants.ROBOT_DIRECTION_EAST:
        navigation
          ? navigation === Constants.ROBOT_ROTATION_LEFT
            ? (rotateValue = 90 - 90)
            : (rotateValue = 90 + 90)
          : (rotateValue = 90);

        newDirection = navigation
          ? navigation === Constants.ROBOT_ROTATION_LEFT
            ? Constants.ROBOT_DIRECTION_NORTH
            : Constants.ROBOT_DIRECTION_SOUTH
          : "";

        break;
      case Constants.ROBOT_DIRECTION_SOUTH:
        navigation
          ? navigation === Constants.ROBOT_ROTATION_LEFT
            ? (rotateValue = 180 - 90)
            : (rotateValue = 180 + 90)
          : (rotateValue = 180);

        newDirection = navigation
          ? navigation === Constants.ROBOT_ROTATION_LEFT
            ? Constants.ROBOT_DIRECTION_EAST
            : Constants.ROBOT_DIRECTION_WEST
          : "";

        break;
      default:
        break;
    }

    if (navigation) this.props.updateCurrentDirection(newDirection);

    return { transform: `rotate(${rotateValue.toString()}deg)` };
  }

  ///////////////////////////////////////////////////////////////////////////
  //Moves the Robot forward depending on the currentDirection///////////////
  //////////////////////////////////////////////////////////////////////////

  handleMoveRobot() {
    let { grid, currentDirection } = this.props;
    let robot = this.getRobotCurrentPosition();

    switch (currentDirection) {
      case Constants.ROBOT_DIRECTION_WEST:
        if (robot.col > 0) robot.col--;

        break;
      case Constants.ROBOT_DIRECTION_NORTH:
        // if (robot.row > 0) robot.row--;
        if (robot.row < this.props.rows - 1) robot.row++;

        break;
      case Constants.ROBOT_DIRECTION_EAST:
        if (robot.col < this.props.cols - 1) robot.col++;

        break;
      case Constants.ROBOT_DIRECTION_SOUTH:
        // if (robot.row < this.props.rows - 1) robot.row++;
        if (robot.row > 0) robot.row--;

        break;
      default:
        break;
    }

    grid.forEach((grid: any, index: number) => {
      if (grid.isRobot && !(grid.col === robot.col && grid.row === robot.row)) {
        this.props.updateRobotPosition(!grid.isRobot, index);
      }

      if (grid.col === robot.col && grid.row === robot.row) {
        this.props.updateRobotPosition(
          true,
          index,
          this.getDirectionStyle(currentDirection)
        );
      }
    });
  }

  ///////////////////////////////////////////////////////////////////////////
  //Get current position of robot. Robot => isRobot : true//////////////////
  //////////////////////////////////////////////////////////////////////////
  getRobotCurrentPosition() {
    let robot = _.find(this.props.grid, { isRobot: true });

    return {
      row: robot.row,
      col: robot.col,
    };
  }

  ///////////////////////////////////////////////////////////////////////////
  //Rotate Robot to Left, -90 degrees from current direction/////////////////
  //////////////////////////////////////////////////////////////////////////

  handleRotateLeft() {
    let { currentDirection, grid } = this.props;
    let index = _.findIndex(grid, { isRobot: true });

    this.props.updateRobotPosition(
      true,
      index,
      this.getDirectionStyle(currentDirection, Constants.ROBOT_ROTATION_LEFT)
    );
  }

  ///////////////////////////////////////////////////////////////////////////
  //Rotate Robot to right, +90 degrees from current direction////////////////
  //////////////////////////////////////////////////////////////////////////
  handleRotateRight() {
    let { currentDirection, grid } = this.props;

    let index = _.findIndex(grid, { isRobot: true });

    this.props.updateRobotPosition(
      true,
      index,
      this.getDirectionStyle(currentDirection, Constants.ROBOT_ROTATION_RIGHT)
    );
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////
  //Show output(in string) of current postion => X => row, Y => col, F => currentDirection////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  handleOutput() {
    let currentPosition = this.getRobotCurrentPosition();
    let outputString =
      "X => " +
      currentPosition.col +
      ", Y => " +
      currentPosition.row +
      ", F => " +
      this.props.currentDirection;

    this.props.updateOutput(outputString);
  }

  ///////////////////////////////////////////////////////////////////////////
  //Render()/////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////
  render() {
    return (
      <div className="form-container col s4">
        <form>
          <div className="place-input row">
            <div className="input-field col s12">
              <input
                type="text"
                id="x_input"
                name="x_input"
                placeholder="Please input numbers 0 to 4"
                autoComplete="off"
                onChange={this.handleFormOnchanged}
              />
              <label htmlFor="x_input">X</label>
            </div>

            <div className="input-field col s12">
              <input
                type="text"
                id="y_input"
                name="y_input"
                placeholder="Please input numbers 0 to 4"
                autoComplete="off"
                onChange={this.handleFormOnchanged}
              />
              <label htmlFor="y_input">Y</label>
            </div>

            <div className="input-field col s12">
              <input
                type="text"
                id="f_input"
                name="f_input"
                placeholder="Please input either NORTH, SOUTH, EAST, WEST"
                autoComplete="off"
                onChange={this.handleFormOnchanged}
              />
              <label htmlFor="f_input">F</label>
            </div>

            <div className="col s12">
              <button
                style={{ width: "100%" }}
                type="button"
                className="btn waves-effect waves-light"
                onClick={this.handlePlaceRobot}
              >
                PLACE ROBOT
              </button>
            </div>
          </div>

          <div className="move-input row">
            <div className="col s12">
              <button
                style={{ width: "100%" }}
                type="button"
                className="btn waves-effect waves-light"
                onClick={this.handleMoveRobot}
                disabled={!this.props.isRobotExist}
              >
                MOVE ROBOT
              </button>
            </div>
          </div>

          <div className="rotate-input row">
            <div className="col s6">
              <button
                type="button"
                style={{ width: "100%" }}
                className="btn waves-effect waves-light"
                onClick={this.handleRotateLeft}
                disabled={!this.props.isRobotExist}
              >
                LEFT
              </button>
            </div>
            <div className="col s6">
              <button
                type="button"
                style={{ width: "100%" }}
                className="btn waves-effect waves-light"
                onClick={this.handleRotateRight}
                disabled={!this.props.isRobotExist}
              >
                RIGHT
              </button>
            </div>
          </div>

          <div className="output-button row">
            <div className="col s12">
              <button
                type="button"
                style={{ width: "100%" }}
                className="btn waves-effect waves-light"
                onClick={this.handleOutput}
                disabled={!this.props.isRobotExist}
              >
                OUTPUT
              </button>
            </div>
          </div>
          <div className="output-container row">
            <div className="col s12 card-panel teal lighten-2">
              {this.props.outputReport}
            </div>
          </div>
        </form>
      </div>
    );
  }
}

///////////////////////////////////////////////////////////////////////////
///Get state from Main store and map to props//////////////////////////////
//////////////////////////////////////////////////////////////////////////

let mapStatetoProps = (state: any, ownProps: any) => {
  return {
    rows: state.rows,
    cols: state.cols,
    grid: state.grid,
    isRobotExist: state.isRobotExist,
    currentDirection: state.currentDirection,
    x_input: state.x_input,
    y_input: state.y_input,
    f_input: state.f_input,
    outputReport: state.outputReport,
  };
};

///////////////////////////////////////////////////////////////////////////
///Map dispatch from Main Store so we can use it in our component//////////
//////////////////////////////////////////////////////////////////////////

let mapDispatchToProps = (dispatch: Function, ownProps: any) => {
  return {
    updateCurrentDirection: (currentDirection: string) => {
      dispatch({
        type: Constants.STORE_ACTION_DISPATCH_CURRENT_DIRECTION,
        state: currentDirection,
      });
    },
    updateGrid: (grid: Array<any>) => {
      dispatch({
        type: Constants.STORE_ACTION_DISPATCH_GRID,
        state: grid,
      });
    },
    updateField: (name: string, value: string) => {
      dispatch({
        type: Constants.STORE_ACTION_DISPATCH_FORM_FIELD_UPDATE,
        state: { name, value },
      });
    },
    updateRobotPosition: (
      isRobot: boolean,
      index: number,
      directionStyle: any = null
    ) => {
      dispatch({
        type: Constants.STORE_ACTION_DISPATCH_FORM_ROBOT_PLACE,
        state: {
          index,
          isRobot,
          directionStyle,
        },
      });
    },
    updateRobotExistense: (isRobotExist: boolean) => {
      dispatch({
        type: Constants.STORE_ACTION_DISPATCH_FORM_ROBOT_EXISTENSE,
        state: {
          isRobotExist,
        },
      });
    },
    updateOutput: (outputString: string) => {
      dispatch({
        type: Constants.STORE_ACTION_DISPATCH_FORM_OUTPUT,
        state: outputString,
      });
    },
  };
};

///////////////////////////////////////////////////////////////////////////////////////////
///Export Component with react-redux connect so we can connect to our Main Store//////////
//////////////////////////////////////////////////////////////////////////////////////////
export default connect(mapStatetoProps, mapDispatchToProps)(Form);
