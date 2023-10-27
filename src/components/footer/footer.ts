import './footer.scss';
import stringToElement from '../../utils/htmlToElement';
import FOOTER_TEMPLATE from './footer.template';

export default class Footer {
  public render(): HTMLTemplateElement {
    const footerTemplate = stringToElement(FOOTER_TEMPLATE);

    return footerTemplate;
  }
}
