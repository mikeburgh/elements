import {html, TemplateResult} from 'lit';
import {customElement} from 'lit/decorators.js';
import {VscElement} from '../includes/VscElement';
import styles from './vscode-form-description.styles';

/**
 * @deprecated
 */
@customElement('vscode-form-description')
export class VscodeFormDescription extends VscElement {
  static styles = styles;

  render(): TemplateResult {
    return html` <slot></slot> `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'vscode-form-description': VscodeFormDescription;
  }
}