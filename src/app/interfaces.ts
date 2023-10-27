interface IhistoryPath {
  path: RegExp | string,
  cb: (...args: string[]) => void,
}

interface ICarGet {
  name: string,
  color: string,
  id: number,
}

interface ICarSet {
  name: string,
  color: string,
}

interface IWinner {
  id: number,
  wins: number,
  time: number,
}

interface ICarDrive {
  velocity: number, 
  distance: number,
}

type SortType = 'wins' | 'time';
type OrderType = 'ASC' | 'DESC';
type StatusType = 'drive' | 'started' | 'stopped';

export { 
  IhistoryPath,
  ICarGet,
  ICarSet,
  IWinner,
  SortType,
  OrderType,
  StatusType,
  ICarDrive,
}