import CAR_CONTROL_TEMPLATE from "./car-control.template";
import stringToElement from "../../utils/htmlToElement";
import './car-control.scss';
import { ICarDrive, ICarGet, StatusType } from "../../app/interfaces";
import { deleteCar, deleteWinner, setStatusCar } from "../../utils/requests";

const BTN_REMOVE = '.btn-remove';
const BTN_SELECT = '.btn-select';
const BTN_START = '.btn-start';
const BTN_LABEL = '.button__label';
const FORM_UPDATE = '#update-form';
const VISIBLE_FORM = 'control-panel__form control-panel__form-visivle';
const CAR_IMG = '.car';
const ANIMATION_TYPE = 'all linear';
const ANIMATION_REMOVE = 'all linear 0s';
const ONE_SECOND = 1000;
const CAR_STATUS = {
  READY: 'ready',
  UNREADY: 'unready',
}
const START_NAME = {
  STOP: 'STOP',
  START: 'START',
}
const STATUS_CAR = {
  STOP: 'stopped' as StatusType,
  START: 'started' as StatusType,
  DRIVE: 'drive' as StatusType,
}

export default class CarControl {
  control!: HTMLTemplateElement;
  container: HTMLElement;
  car: ICarGet;
  road: HTMLTemplateElement;

  constructor(container: HTMLElement, car: ICarGet, road: HTMLTemplateElement) {
    this.container = container;
    this.car = car;
    this.road = road;
  }

  private clickRemove(): void {
    deleteCar(this.car.id).then(
      () => window.dispatchEvent(new CustomEvent('updateRequest')),
      (err) => console.log(err),
    )

    deleteWinner(this.car.id).then(
      () => console.log('car removed'),
      (err) => console.log(err)
    )
  }

  private clickSelect(): void {
    const formUpdate = document.querySelector(FORM_UPDATE);
    if (!(formUpdate instanceof HTMLFormElement)) return;

    const inputs = Array.from(formUpdate.elements) as HTMLInputElement[];

    formUpdate.dataset.carId = this.car.id.toString();
    inputs[0].value = this.car.name;
    inputs[1].value = this.car.color;
    formUpdate.className = VISIBLE_FORM;
  }

  private logWinner(time: number): void {
    const event = new CustomEvent('winner', {
      detail: {
        id: this.car.id,
        time: (time / ONE_SECOND).toFixed(2),
        wins: 1,
      }
    })
    window.dispatchEvent(event);
  }

  private actionCar(carData: ICarDrive): void {
    const finish = this.road.querySelector('.road__finish');
    const carImg = this.road.querySelector(CAR_IMG);
    if (!(carImg instanceof HTMLElement) || !(finish instanceof HTMLElement)) return;
    
    const time = carData.distance / carData.velocity;
    carImg.style.transition = `${ ANIMATION_TYPE } ${ time / ONE_SECOND }s`;
    carImg.style.left = `${ finish.offsetLeft }px`;

    setStatusCar(this.car.id, STATUS_CAR.DRIVE)
      .then((request) => request.json())
      .then(() => {
          this.logWinner(time);
          carImg.style.transition = ANIMATION_REMOVE;
        }
      )
      .catch(() => {
        carImg.style.transition = ANIMATION_REMOVE;
        carImg.style.left = `${ carImg.offsetLeft - parseFloat(getComputedStyle(carImg).marginLeft) }px`;
      })
  }

  private setDriveCar(driveInfo: ICarDrive, btn: HTMLButtonElement): void {
    const [btnStart, btnLabel] = [btn, btn.querySelector(BTN_LABEL)];
    if (!(btnLabel instanceof HTMLElement)) return;

    this.actionCar(driveInfo);
    btnStart.disabled = false;
    btnLabel.textContent = START_NAME.STOP;
  }

  private startCar(): void {
    const btn = this.control.querySelector(BTN_START);
    if (!(btn instanceof HTMLButtonElement)) return;

    btn.dataset.status = CAR_STATUS.UNREADY;

    setStatusCar(this.car.id, STATUS_CAR.START)
      .then((request) => request.json())
      .then((driveInfo: ICarDrive) => this.setDriveCar(driveInfo, btn))
      .catch((err) => console.log(err));
  }

  private changeBtnStopStatus(): void {
    const btn = this.control.querySelector(BTN_START);
    if (!(btn instanceof HTMLButtonElement)) return;
    
    const btnLabel = btn.querySelector(BTN_LABEL);
    if (!(btnLabel instanceof HTMLElement)) return;
    
    btn.disabled = false;
    btnLabel.textContent = START_NAME.START;
    btn.dataset.status = CAR_STATUS.READY;
  }

  private changeCarPosition(): void {
    const carImg = this.road.querySelector(CAR_IMG);
    if (!(carImg instanceof HTMLElement)) return;

    carImg.style.transition = ANIMATION_REMOVE;
    carImg.style.left = `0px`;
  }

  private showStopedCar(): void {
    this.changeCarPosition();    
    this.changeBtnStopStatus();
    
    window.dispatchEvent(new CustomEvent('reset'));
  }

  private stopCar(): void {
    setStatusCar(this.car.id, STATUS_CAR.STOP)
      .then((request) => request.json())
      .then(() => this.showStopedCar())
      .catch((err) => console.log(err));
  }

  private clickStart(): void {
    const btn = this.control.querySelector(BTN_START);
    if (!(btn instanceof HTMLButtonElement)) return;

    btn.disabled = true;
    
    if (btn.dataset.status === CAR_STATUS.UNREADY) {
      this.stopCar();
      return;
    }
    
    this.startCar();
  }

  private setEvents(): void {
    const btnRemove = this.control.querySelector(BTN_REMOVE);
    const btnSelect = this.control.querySelector(BTN_SELECT);
    const btnStart = this.control.querySelector(BTN_START);

    btnRemove?.addEventListener('click', () => this.clickRemove());
    btnSelect?.addEventListener('click', () => this.clickSelect());
    btnStart?.addEventListener('click', () => this.clickStart());
  }

  public render(): void {
    this.control = stringToElement(CAR_CONTROL_TEMPLATE);
    this.setEvents();

    this.container.append(this.control);
  }
}
