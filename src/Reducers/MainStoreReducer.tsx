import update from "immutability-helper";
import Constants from "../Utils/Constants";

let initialState = {
  //Grid State
  rows: 5,
  cols: 5,
  grid: [],
  robot: {},
  isRobotExist: false,
  currentDirection: Constants.ROBOT_DIRECTION_NORTH,

  //Form State
  x_input: "",
  y_input: "",
  f_input: "",
  outputReport: "",
};

let storeReducer = (state: any = initialState, action: any) => {
  switch (action.type) {
    case Constants.STORE_ACTION_DISPATCH_GRID:
      return update(state, {
        grid: { $set: action.state },
      });
    case Constants.STORE_ACTION_DISPATCH_CURRENT_DIRECTION:
      return update(state, {
        currentDirection: { $set: action.state },
      });
    case Constants.STORE_ACTION_DISPATCH_FORM_FIELD_UPDATE:
      return update(state, {
        [action.state.name]: { $set: action.state.value },
      });
    case Constants.STORE_ACTION_DISPATCH_FORM_ROBOT_PLACE:
      if (action.state.directionStyle != null) {
        return update(state, {
          grid: {
            [action.state.index]: {
              isRobot: { $set: action.state.isRobot },
              directionStyle: { $set: action.state.directionStyle },
            },
          },
        });
      }

      return update(state, {
        grid: {
          [action.state.index]: {
            isRobot: { $set: action.state.isRobot },
            directionStyle: { $set: null },
          },
        },
      });

    case Constants.STORE_ACTION_DISPATCH_FORM_ROBOT_EXISTENSE:
      return update(state, {
        isRobotExist: { $set: action.state.isRobotExist },
      });
    case Constants.STORE_ACTION_DISPATCH_FORM_OUTPUT:
      return update(state, {
        outputReport: { $set: action.state },
      });
    default:
      return state;
  }
};

export default storeReducer;
