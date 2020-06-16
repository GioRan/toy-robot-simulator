type MainPropsType = {
  //Grid Types
  rows: number;
  cols: number;
  grid: Array<any>;
  isRobotExist: boolean;
  currentDirection: string;
  directionStyle: any;
  updateGrid: Function;
  updateCurrentDirection: Function;

  //Form Types
  x_input: string;
  y_input: string;
  f_input: string;
  output: string;
  updateOutput: Function;
  updateField: Function;
  updateRobotPosition: Function;
  handleMoveRobot: Function;
};

export default MainPropsType;
