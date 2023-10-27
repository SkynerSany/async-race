import { 
  ICarGet, 
  ICarSet, 
  IWinner, 
  OrderType, 
  SortType, 
  StatusType
} from "../app/interfaces";

const BASE_URL = 'http://127.0.0.1:4000/async-race/';
const GARAGE = 'garage/';
const ENGINE = 'engine/';
const WINNERS = 'winners/';

function getCars(limit?: number, page?: number): Promise<Response> {
  return fetch(`${ BASE_URL }${ GARAGE }${ `limit/${ limit }/` || ''}${ `page/${ page }/` || '' }`);
}

function getCar(id: number): Promise<Response> {
  return fetch(`${ BASE_URL }${ GARAGE }id/${ id }`);
}

function createCar(car: ICarSet): Promise<Response> {
  return fetch(`${ BASE_URL }${ GARAGE }`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(car)
  })
}

function deleteCar(id: number): Promise<Response> {
  return fetch(`${ BASE_URL }${ GARAGE }id/${id}`, { method: 'DELETE'});
}

function updateCar(id: number, car: ICarSet): Promise<Response> {
  return fetch(`${ BASE_URL }${ GARAGE }id/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(car)
  });
}

function setStatusCar(id: number, status: StatusType): Promise<Response> {
  return fetch(`${ BASE_URL }${ ENGINE }id/${id}/status/${status}`, { method: 'PATCH' });
}

function getWinners(
    page?: number, 
    limit?: number, 
    sort?: SortType, 
    order?: OrderType
  ): Promise<Response> {
  return fetch(`${ BASE_URL }${ WINNERS }${ `page/${ page }/` || '' }${ `limit/${ limit }/` || '' }${ `sort/${ sort }/` || '' }${ `order/${ order }/` || '' }`);
}

function getWinner(id: number): Promise<Response> {
  return fetch(`${ BASE_URL }${ WINNERS }id/${id}`);
}

function createWinner(car: IWinner): Promise<Response> {
  return fetch(`${ BASE_URL }${ WINNERS }`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(car)
  });
}

function deleteWinner(id: number): Promise<Response> {
  return fetch(`${ BASE_URL }${ WINNERS }id/${id}`, { method: 'DELETE' });
}

function updateWinner(id: number, car: IWinner): Promise<Response> {
  return fetch(`${ BASE_URL }${ WINNERS }id/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(car)
  });
}

export { 
  getCars,
  getCar,
  createCar,
  deleteCar,
  updateCar,
  setStatusCar,
  getWinners,
  getWinner,
  createWinner,
  deleteWinner,
  updateWinner,
}