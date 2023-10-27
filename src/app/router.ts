import { IhistoryPath } from "./interfaces";

const DEFAULT_PAGE = 'garage';

export default class Router {
  private routes: IhistoryPath[] = [];
  private current!: string;

  public add(path: RegExp | string, cb: (id?: string, specification?: string) => void) {
    this.routes.push({ path, cb });
    return this;
  }

  private clearSlashes(path: string): string {
    return path
      .toString()
      .replace(/\/$/, '')
      .replace(/^\//, '');
  }
    
  private getFragment(): string {
    const match = window.location.href.match(/#(.*)$/);
    const fragment = match ? match[1] : '';
    return this.clearSlashes(fragment);
  }

  private changePage(): void {
    let page = this.getFragment();
    page = page === '' || window.location.hash === '' ? DEFAULT_PAGE : page;
    this.current = page;

    this.routes.some(route => {
      const match = this.current.match(route.path);
      if (!match) return false;
      
      match.shift();
      route.cb.apply({}, match);
      return match;
    });
  }

  public setListener(): void {
    window.addEventListener('popstate', () => this.changePage());
    this.changePage();
  }
}