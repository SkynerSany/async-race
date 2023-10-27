import Garage from '../pages/garage/garage';
import Score from '../pages/score/score';
import Header from '../components/header/header';
import Router from './router';
import Footer from '../components/footer/footer';
import './app.scss';

function setTemplate(): HTMLElement {
  const header = new Header().render();
  const footer = new Footer().render();
  const main = document.createElement('main');
  main.className = 'main';
  
  document.body.append(header);
  document.body.append(main);
  document.body.append(footer);

  return main;
}

function setRouter(): void {
  const container = setTemplate();
  const garage = new Garage(container);
  const score = new Score(container);
  garage.init();

  const pages = {
    'garage': () => garage.render(),
    'score': () => score.render(),
  }
  
  const router = new Router();
  
  Object.entries(pages).forEach((page) => {
    router.add(new RegExp(page[0]), page[1])
  });

  window.addEventListener('updateRequest', () => {
    garage.init();
  })
  
  router.setListener();
}

setRouter();