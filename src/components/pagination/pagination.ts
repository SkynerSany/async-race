import stringToElement from "../../utils/htmlToElement";
import PAGINATION_TEMPLATE from "./pagination.template";
import './pagination.scss';

const BTN = {
  SHOW: 'visible',
  HIDE: 'hidden',
}

export default class Pagination {
  paginationTemplate!: HTMLElement;
  btnNext!: HTMLButtonElement;
  btnPrev!: HTMLButtonElement;
  carsCount!: string;
  countOnPage: number;
  container: HTMLElement;
  page = 1;

  constructor(countOnPage: number, container: HTMLElement) {
    this.countOnPage = countOnPage;
    this.container = container;
  }

  public checkPagination(): void {
    if (this.page === 1) {
      this.btnPrev.style.visibility = BTN.HIDE;
      if (+this.carsCount > this.countOnPage) this.btnNext.style.visibility = BTN.SHOW;
    }
    if (this.page > 1) {
      this.btnPrev.style.visibility = BTN.SHOW;
      this.btnNext.style.visibility = (+this.carsCount / this.countOnPage <= this.page) ? BTN.HIDE : BTN.SHOW;
    }
  }

  private nextPage(): void {
    if (+this.carsCount / this.countOnPage <= this.page) return;

    this.page += 1;
    this.container.dispatchEvent(new CustomEvent('setPage'));
  }

  private prevPage(): void {
    if (this.page === 1) return;

    this.page -= 1;
    this.container.dispatchEvent(new CustomEvent('setPage'));
  }

  private getPaginationBtns() {
    const btnPrev = this.paginationTemplate.querySelector('.btn-prev');
    const btnNext = this.paginationTemplate.querySelector('.btn-next');
    if (!(btnPrev instanceof HTMLButtonElement) || !(btnNext instanceof HTMLButtonElement)) return;
    this.btnPrev = btnPrev;
    this.btnNext = btnNext;
  }

  private setEvents(): void {
    this.getPaginationBtns();

    this.btnPrev.addEventListener('click', () => this.prevPage())
    this.btnNext.addEventListener('click', () => this.nextPage())
  }

  public render(): void {
    this.paginationTemplate = stringToElement(PAGINATION_TEMPLATE);

    this.setEvents();
    this.container.append(this.paginationTemplate);
  }
}
