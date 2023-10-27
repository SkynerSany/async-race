import './garage.scss';
import stringToElement from '../../utils/htmlToElement';
import GARAGE_TEMPLATE from './garage.template';
import Road from '../../components/road/road';
import { getCars } from '../../utils/requests';
import { ICarGet } from '../../app/interfaces';
import Pagination from '../../components/pagination/pagination';

const CONTAINER = {
  SHOW: 'block',
  HIDE: 'none',
}
const CONTROL_PANEL_BTNS = {
  SHOW: 'visible',
  HIDE: 'hidden',
}
const GARAGE_SHOW = {
  POSITION: 'initial',
  SHIFT: '0',
}
const CONTROL_PANEL_SHOW = '0';

export default class Garage {
  garageTemplate!: HTMLElement;
  container: HTMLElement;
  countOnPage = 7;
  pagination!: Pagination;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  private getTotalCount(response: Response): void {
    const count = this.garageTemplate.querySelector('.track__count');
    if (!count) return;

    this.pagination.carsCount = response.headers.get('X-Total-Count') || '0'
    count.textContent = this.pagination.carsCount;
  }

  private setCar(cars: ICarGet[]): void {
    const track = this.garageTemplate.querySelector('.track');

    if (!(track instanceof HTMLElement)) return;
    if (!cars || cars.length === 0) {
      this.setNotFound();
      return
    }

    track.innerHTML = '';
    this.setControlPanel(CONTROL_PANEL_BTNS.SHOW);
    this.pagination.checkPagination();
    cars.forEach((car, i) => new Road(track, car).render(i, this.pagination.page, this.countOnPage))
  }

  private setPageCount(): void {
    const pageCount = this.garageTemplate.querySelector('.garage__current-page');
    if (pageCount) pageCount.textContent = this.pagination.page.toString();
  }

  public setRoads(): void {
    this.setPageCount();

    getCars(this.countOnPage, this.pagination.page)
      .then((response) => {
          this.getTotalCount(response);
          return response.json();
        })
      .then((cars: ICarGet[]) => this.setCar(cars))
      .catch(() => this.setNotFound())
  }

  private setNotFound(): void {
    this.setControlPanel(CONTROL_PANEL_BTNS.HIDE);
    const notFound = this.garageTemplate.querySelector('.not-found');
    if (notFound) notFound.classList.toggle('show');
    this.pagination.carsCount = '0';
  }

  private setControlPanel(visibility: string): void {
    const btnRace = document.querySelector('#btn-race');
    const btnReset = document.querySelector('#btn-reset');
    if (btnRace instanceof HTMLElement) btnRace.style.visibility = visibility;
    if (btnReset instanceof HTMLElement) btnReset.style.visibility = visibility;
  }

  private removePrevPage(): void {
    const prevGarage = this.container.querySelector('.garage-container');
    if (prevGarage) this.container.removeChild(prevGarage);
  }

  public init(): void {
    this.garageTemplate = stringToElement(GARAGE_TEMPLATE);
    this.pagination = new Pagination(this.countOnPage, this.garageTemplate);
    
    this.setRoads();
    this.pagination.render();
    this.removePrevPage();

    this.garageTemplate.addEventListener('setPage', () => this.setRoads());
    
    this.container.append(this.garageTemplate);
  }

  public render(): void {
    const score = this.container.querySelector('.score-container');
    const controlPanel = document.querySelector('.control-panel');

    if (controlPanel instanceof HTMLElement) controlPanel.style.zIndex = CONTROL_PANEL_SHOW;
    if (score instanceof HTMLElement) score.style.display = CONTAINER.HIDE;
    this.garageTemplate.style.position = GARAGE_SHOW.POSITION;
    this.garageTemplate.style.left = GARAGE_SHOW.SHIFT;
  }
}
