import ROAD_TEMPLATE from "./road.template";
import stringToElement from "../../utils/htmlToElement";
import './road.scss';
import { ICarGet } from "../../app/interfaces";
import CarControl from "../car-control/car-control";

const CAR_IMG = '.car';
const CAR_ID = '.car-id';
const CAR_NAME = '.car-name';
const IMG_CAR_COUNT = 4;  

export default class Road {
  road!: HTMLTemplateElement;
  index!: number;
  container: HTMLElement;
  car: ICarGet;

  constructor(container: HTMLElement, car: ICarGet) {
    this.container = container;
    this.car = car;
  }

  private getCarImg(): number {
    const carImages = JSON.parse(localStorage.getItem('carImages') || `{}`) as {[prop: string]: number};
    if (!carImages[this.car.id]) { 
      carImages[this.car.id] = Math.round(Math.random() * (IMG_CAR_COUNT - 1) + 1);
      localStorage.carImages = JSON.stringify(carImages);
    }

    return carImages[this.car.id];
  }

  private setCar(): void {
    const car = this.road.querySelector(CAR_IMG);
    if (!(car instanceof HTMLElement)) return;
    const carImg = this.getCarImg();

    car.style.maskImage = `url(./assets/car${ carImg }.svg)`;
    car.style.webkitMaskImage = `url(./assets/car${ carImg }.svg)`;
    car.style.backgroundColor = this.car.color;

    this.setCarName();
    this.setCarIndex();
  }

  private setCarName(): void {
    const carName = this.road.querySelector(CAR_NAME);
    if (!(carName instanceof HTMLParagraphElement)) return;

    carName.textContent = this.car.name;
  }

  private setCarIndex(): void {
    const carId = this.road.querySelector(CAR_ID);
    if (!(carId instanceof HTMLParagraphElement)) return;

    carId.textContent = this.index.toString();
  }

  public render(index: number, page: number, countOnPage: number): void {
    this.index = (page - 1) * countOnPage + index + 1;
    this.road = stringToElement(ROAD_TEMPLATE);
    this.setCar();

    new CarControl(this.container, this.car, this.road).render();
    this.container.append(this.road);
  }
}
