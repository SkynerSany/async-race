import { 
  createCar, 
  createWinner, 
  deleteWinner, 
  getCar, 
  getWinner, 
  updateCar
} from '../../../utils/requests';
import './control-panel.scss';
import stringToElement from '../../../utils/htmlToElement';
import CONTROL_PANEL_TEMPLATE from './control-panel.template';
import { ICarGet, ICarSet, IWinner } from '../../../app/interfaces';
import { MODEL_NAME, BRAND_NAME } from '../../../data/cars.data';

const FORM_HIDDEN = 'control-panel__form';
const RACE_BTN = '#btn-race';
const RESET_BTN = '#btn-reset';
const GENERATE_CARS_COUNT = 100;
const NUMBERS_COLOR = 16777215;
const HEXA_DECIMAL_FORMAT = 16;
const MIN_COLOR_LENGTH = 6;
const CLOSE_WINNER_TIMEOUT = 3000;

export default class ControlPanel {
  private panelTemplate!: HTMLTemplateElement;

  private getRandomNumber(max: number): number {
    return Math.round(Math.random() * max);
  }

  private getRandomColor(): string {
    return `#${Math.floor(Math.random() * NUMBERS_COLOR)
      .toString(HEXA_DECIMAL_FORMAT)
      .padStart(MIN_COLOR_LENGTH, '0')
    }`;
  }
    
  static showWinner(winner: IWinner): void {
    getCar(winner.id)
    .then((response) => response.json())
    .then((car: ICarGet) => {
        const message = ControlPanel.createMessage(winner.time, car.name);
        document.body.append(message);
        setTimeout(() => message.remove(), CLOSE_WINNER_TIMEOUT);
      }
    )
    .catch((err) => console.log(err));
  }

  static createMessage(time: number, name: string): HTMLParagraphElement {
    const message = document.createElement('p');
    message.className = 'winner-message';
    message.textContent = `${name} won over time ${time}s`;
    return message;
  }

  private getData(form: HTMLFormElement): ICarSet {
    const inputs = Array.from(form.elements) as HTMLInputElement[];
    return {
      name: inputs[0].value,
      color: inputs[1].value,
    }
  }

  static deleteWinner(odlerWinner: IWinner, newWinner: IWinner): void {
    if (Object.keys(odlerWinner).length === 0) {
      createWinner(newWinner).catch((err) => console.log(err));
      return;
    }
    
    const winner = odlerWinner;
    winner.wins += 1;
    winner.time = Math.min(winner.time, newWinner.time)

    deleteWinner(winner.id).then(
      () => createWinner(winner).catch((err) => console.log(err)),
      (err) => console.log(err)
    )
  }

  static checkWinner(winner: IWinner): void {
    ControlPanel.showWinner(winner);

    getWinner(winner.id)
      .then((response) => response.json())
      .then((winnerData: IWinner) => ControlPanel.deleteWinner(winnerData, winner))
      .catch((err) => console.log(err))
  }

  private createRandomCar(): ICarSet {
    const name = `${
      BRAND_NAME[this.getRandomNumber(BRAND_NAME.length - 1)]
    } ${
      MODEL_NAME[this.getRandomNumber(MODEL_NAME.length - 1)]
    }`;
    const color = this.getRandomColor();

    return { name, color }
  }

  private generate(): void {
    const newCars = [];
    for (let i = 0; i < GENERATE_CARS_COUNT; i += 1) {
      newCars.push(createCar(this.createRandomCar()));
    }

    Promise.allSettled(newCars).then(
      () => window.dispatchEvent(new CustomEvent('updateRequest')),
      (err) => {console.log(err)},
    )
  }

  private create(e: Event): void {
    e.preventDefault();
    if (!(e.currentTarget instanceof HTMLFormElement)) return; 

    createCar(this.getData(e.currentTarget)).then(
      () => window.dispatchEvent(new CustomEvent('updateRequest')),
      (err) => {console.log(err)},
    )
  }

  private update(e: Event): void {
    e.preventDefault();
    if (!(e.currentTarget instanceof HTMLFormElement) || !e.currentTarget.dataset.carId) return;

    updateCar(+e.currentTarget.dataset.carId, this.getData(e.currentTarget))
      .then(
        () => window.dispatchEvent(new CustomEvent('updateRequest')),
        (err) => {console.log(err)},
      )

    e.currentTarget.className = FORM_HIDDEN;
  }

  private setBtnsStatus(status: boolean) {
    const createBtn = this.panelTemplate.querySelector('.btn-create');
    const generateBtn = this.panelTemplate.querySelector('#btn-generate');
    const selectBtns = document.querySelectorAll('.btn-select');
    const removeBtns = document.querySelectorAll('.btn-remove');
    const garage = document.querySelector('.garage-container');
    const prevBtn = garage?.querySelector('.btn-prev');
    const nextBtn = garage?.querySelector('.btn-next');

    if (createBtn instanceof HTMLButtonElement) createBtn.disabled = status;
    if (generateBtn instanceof HTMLButtonElement) generateBtn.disabled = status;
    if (prevBtn instanceof HTMLButtonElement) prevBtn.disabled = status;
    if (nextBtn instanceof HTMLButtonElement) nextBtn.disabled = status;
    selectBtns.forEach((selectBtn) => {
      if (selectBtn instanceof HTMLButtonElement) selectBtn.disabled = status;
    });
    removeBtns.forEach((removeBtn) => {
      if (removeBtn instanceof HTMLButtonElement) removeBtn.disabled = status;
    });
  }

  private race(e: Event): void {
    const resetBtn = this.panelTemplate.querySelector(RESET_BTN);
    if (!(e.currentTarget instanceof HTMLButtonElement)) return;

    this.setBtnsStatus(true);
    e.currentTarget.disabled = true;
    const startBtns = document.querySelectorAll('[data-status=ready]');
    startBtns.forEach((btn) => {
      if (btn instanceof HTMLButtonElement) btn.click();
    });

    function winnerListener(event: Event) {
      window.removeEventListener('winner', winnerListener);
      if (event instanceof CustomEvent) ControlPanel.checkWinner(event.detail as IWinner);

      if (!(resetBtn instanceof HTMLButtonElement)) return;
      resetBtn.disabled = false;
    }

    window.addEventListener('winner', winnerListener);
  }

  private reset(e: Event): void {
    const raceBtn = this.panelTemplate.querySelector(RACE_BTN);
    if (!(e.currentTarget instanceof HTMLButtonElement)
    || !(raceBtn instanceof HTMLButtonElement)) return;
    
    this.setBtnsStatus(false);
    e.currentTarget.disabled = true;
    const startBtns = document.querySelectorAll('[data-status=unready]');
    startBtns.forEach((btn) => {
      if (btn instanceof HTMLButtonElement) btn.click();
    });

    function resetListener() {
      if (!(raceBtn instanceof HTMLButtonElement) || document.querySelectorAll('[data-status=unready]').length > 0) return;
      
      window.removeEventListener('reset', resetListener);
      raceBtn.disabled = false;
    }

    window.addEventListener('reset', resetListener);
  }

  private setEvents(): void {
    const formCreate = this.panelTemplate.querySelector('#create-form');
    const formUpdate = this.panelTemplate.querySelector('#update-form');
    const generateBtn = this.panelTemplate.querySelector('#btn-generate');
    const raceBtn = this.panelTemplate.querySelector(RACE_BTN);
    const resetBtn = this.panelTemplate.querySelector(RESET_BTN);
    
    formCreate?.addEventListener('submit', (e) => this.create(e));
    formUpdate?.addEventListener('submit', (e) => this.update(e));
    generateBtn?.addEventListener('click', () => this.generate());
    raceBtn?.addEventListener('click', (e) => this.race(e));
    resetBtn?.addEventListener('click', (e) => this.reset(e));
  }

  public render(): HTMLTemplateElement {
    this.panelTemplate = stringToElement(CONTROL_PANEL_TEMPLATE);
    this.setEvents();

    return this.panelTemplate;
  }
}
