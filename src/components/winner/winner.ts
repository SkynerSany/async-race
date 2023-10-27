import stringToElement from "../../utils/htmlToElement";
import WINNER_TEMPLATE from "./winner.template";
import './winner.scss';
import { ICarGet, IWinner } from "../../app/interfaces";
import { getCar } from "../../utils/requests";

const IMG_CAR_COUNT = 4;

export default class Winner {
  winnerRow!: HTMLTemplateElement;
  container: HTMLElement;
  winner: IWinner;
  index!: number;

  constructor(container: HTMLElement, winner: IWinner) {
    this.container = container;
    this.winner = winner;
  }

  private getWinnerImg(): number {
    const carImages = JSON.parse(localStorage.getItem('carImages') || `{}`) as {[prop: string]: number};
    if (!carImages[this.winner.id]) { 
      carImages[this.winner.id] = Math.round(Math.random() * (IMG_CAR_COUNT - 1) + 1);
      localStorage.carImages = JSON.stringify(carImages);
    }

    return carImages[this.winner.id];
  }

  private getWinnerData(): void {
    getCar(this.winner.id)
      .then((response) => response.json())
      .then((winner: ICarGet) => { if (winner.id) this.setWinner(winner) })
      .catch((err) => console.log(err))
  }

  private setWinner(winner: ICarGet): void {
    const [
      winnerIndex,
      winnerImage,
      winnerName,
      winsNumber,
      winsTime
    ] = Array.from(this.winnerRow.children) as HTMLElement[];

    const winnerImg = this.getWinnerImg();

    winnerIndex.textContent = this.index.toString();
    winnerImage.style.maskImage = `url(./assets/car${ winnerImg }.svg)`;
    winnerImage.style.webkitMaskImage = `url(./assets/car${ winnerImg }.svg)`;
    winnerImage.style.backgroundColor = winner.color;
    winnerName.textContent = winner.name;
    winsNumber.textContent = this.winner.wins.toString();
    winsTime.textContent = this.winner.time.toString();
  }

  public render(index: number, page: number, countOnPage: number): void {
    this.index = (page - 1) * countOnPage + index + 1;
    this.winnerRow = stringToElement(WINNER_TEMPLATE);
    this.getWinnerData();

    this.container.append(this.winnerRow);
  }
}
