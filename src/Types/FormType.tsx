type FormType = {
  //Grid Types
  rows: number;
  cols: number;
  grid: Array<any>;
  isRobotExist: boolean;
  currentDirection: string;
  updateGrid: Function;
  updateCurrentDirection: Function;

  //Form Types
  x_input: string;
  y_input: string;
  f_input: string;
  outputReport: string;
  updateOutput: Function;
  updateField: Function;
  updateRobotPosition: Function;
  updateRobotExistense: Function;
};

export default FormType;
