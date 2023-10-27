import './header.scss';
import stringToElement from '../../utils/htmlToElement';
import HEADER_TEMPLATE from './header.template';
import ControlPanel from './control-panel/control-panel';

const ACTIVE_LINK = 'header__link-active';
const CONTAINER = '.wrapper';
const DEFAULT_PAGE = 'garage';

export default class Header {
  private headerTemplate!: HTMLTemplateElement;

  public setCurrentPage(): void {
    const currentLocation = window.location.hash.slice(2);
    const prevPage = this.headerTemplate.querySelector(`.${ ACTIVE_LINK }`);
    const currentPage = this.headerTemplate.querySelector(`#${ currentLocation === '' ? DEFAULT_PAGE : currentLocation }`);
    if(prevPage === currentPage) return;

    prevPage?.classList.toggle(ACTIVE_LINK);
    currentPage?.classList.toggle(ACTIVE_LINK);
  }

  private setControlPanel(): void {
    const container = this.headerTemplate.querySelector(CONTAINER);
    container?.prepend(new ControlPanel().render())
  }

  public render(): HTMLTemplateElement {
    this.headerTemplate = stringToElement(HEADER_TEMPLATE);
    window.addEventListener('popstate', () => this.setCurrentPage());
    this.setCurrentPage();
    this.setControlPanel();

    return this.headerTemplate;
  }
}
