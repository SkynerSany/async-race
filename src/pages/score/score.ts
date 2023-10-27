import './score.scss';
import stringToElement from '../../utils/htmlToElement';
import SCORE_TEMPLATE from './score.template';
import { getWinners } from '../../utils/requests';
import { IWinner, OrderType, SortType } from '../../app/interfaces';
import Winner from '../../components/winner/winner';
import Pagination from '../../components/pagination/pagination';

const DEFAULT_SORT = 'time';
const CONTAINER = {
  SHOW: 'flex',
  HIDE: 'none',
}
const SORT_TYPE = {
  ASK: 'ASC' as OrderType,
  DESC: 'DESC' as OrderType,
}
const GARAGE_HIDE = {
  POSITION: 'absolute',
  SHIFT: '-100vw',
}
const SORT_NAME = {
  TIME: 'time',
  WINS: 'wins',
}
const CONTROL_PANEL_HIDE = '-1';

export default class Score {
  container: HTMLElement;
  scoreTemplate!: HTMLTemplateElement;
  pagination!: Pagination
  countOnPage = 10;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  private getTotalCount(response: Response): void {
    const count = this.scoreTemplate.querySelector('.score__count');
    if (!count) return;

    this.pagination.carsCount = response.headers.get('X-Total-Count') || '0';
    count.textContent = this.pagination.carsCount;
  }

  private setWinner(winners: IWinner[]): void {
    const table = this.scoreTemplate.querySelector('.score-table__row-body');

    if (!(table instanceof HTMLElement)) return;
    if (!winners || winners.length === 0) {
      this.pagination.carsCount = '0';
      return
    }

    table.innerHTML = '';
    this.pagination.checkPagination();
    winners.forEach((winner, i) => new Winner(table, winner).render(i, this.pagination.page, this.countOnPage))
  }

  private setPageCount(): void {
    const pageCount = this.scoreTemplate.querySelector('.score__current-page');
    if (pageCount) pageCount.textContent = this.pagination.page.toString();
  }

  private setWinners(sort: SortType = DEFAULT_SORT, order: OrderType = SORT_TYPE.ASK): void {
    this.setPageCount();

    getWinners(this.pagination.page, this.countOnPage, sort, order)
      .then((response) => {
          this.getTotalCount(response);
          return response.json();
      })
      .then((winners: IWinner[]) => this.setWinner(winners))
      .catch((err) => console.log(err));
  }

  private sortTable(e: Event): void {
    if (!(e.target instanceof HTMLParagraphElement) || !e.target.dataset.sort) return;
    const btnWins = this.scoreTemplate.querySelector('#sort-wins');
    const btnTime = this.scoreTemplate.querySelector('#sort-time');

    const [sortType, sortOrder] = e.target.dataset.sort.split('-') as [SortType, OrderType];
    if (e.target === btnWins && btnTime instanceof HTMLElement) btnTime.textContent = SORT_NAME.TIME;
    if (e.target === btnTime && btnWins instanceof HTMLElement) btnWins.textContent = SORT_NAME.WINS;

    e.target.textContent = (sortOrder === SORT_TYPE.ASK ? `${ sortType } ▲` : `${ sortType } ▼`);
    const sortData = sortOrder === SORT_TYPE.ASK 
      ? `${ sortType }-${ SORT_TYPE.DESC }` 
      : `${ sortType }-${ SORT_TYPE.ASK }`;

    e.target.setAttribute('data-sort', sortData);
    this.setWinners(sortType, sortOrder)
  }

  private setEvents(): void {
    const headerTable = this.scoreTemplate.querySelector('.score-table__row-header');
    headerTable?.addEventListener('click', (e) => this.sortTable(e))
    this.scoreTemplate.addEventListener('setPage', () => this.setWinners());
  }

  private removePrevPage(): void {
    const prevScore = this.container.querySelector(`.score-container`);
    if (prevScore) this.container.removeChild(prevScore);
  }

  private showPage(): void {
    const garage = this.container.querySelector('.garage-container');
    const controlPanel = document.querySelector('.control-panel');
    
    if (controlPanel instanceof HTMLElement) controlPanel.style.zIndex = CONTROL_PANEL_HIDE;
    if (garage instanceof HTMLElement) {
      garage.style.position = GARAGE_HIDE.POSITION;
      garage.style.left = GARAGE_HIDE.SHIFT;
    }

    this.scoreTemplate.style.display = CONTAINER.SHOW;
  }

  public render(): void {
    this.scoreTemplate = stringToElement(SCORE_TEMPLATE);
    this.pagination = new Pagination(this.countOnPage, this.scoreTemplate);
    this.pagination.render();
    
    this.removePrevPage();
    this.setEvents();
    this.setWinners();

    this.container.append(this.scoreTemplate);
    this.showPage();
  }
}
