import {html, nothing, TemplateResult} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';
import {VscElement} from '../includes/VscElement.js';
import '../vscode-icon/index.js';
import styles from './vscode-button.styles.js';

/**
 * @fires vsc-click Dispatched only when button is not in disabled state.
 *
 * @cssprop [--background=var(--vscode-button-background)]
 * @cssprop [--foreground=var(--vscode-button-foreground)]
 * @cssprop [--icon-foreground=var(--vscode-button-foreground)]
 * @cssprop [--hover-background=var(--vscode-button-hoverBackground)]
 * @cssprop [--font-family=var(--vscode-font-family)]
 * @cssprop [--font-size=var(--vscode-font-size)]
 * @cssprop [--font-weight=var(--vscode-font-weight)]
 * @cssprop [--secondary-foreground=var(--vscode-button-secondaryForeground)]
 * @cssprop [--secondary-background=var(--vscode-button-secondaryBackground)]
 * @cssprop [--secondary-hover-background=var(--vscode-button-secondaryHoverBackground)]
 * @cssprop [--focus-border=var(--vscode-focusBorder)]
 */
@customElement('vscode-button')
export class VscodeButton extends VscElement {
  static styles = styles;

  /** @internal */
  static formAssociated = true;

  /** @internal */
  @property({type: Number, reflect: true})
  tabIndex = 0;

  /**
   * Button has a less prominent style.
   */
  @property({type: Boolean, reflect: true})
  secondary = false;

  @property({reflect: true})
  role = 'button';

  @property({type: Boolean, reflect: true})
  disabled = false;

  /**
   * A [Codicon](https://microsoft.github.io/vscode-codicons/dist/codicon.html) before the label
   */
  @property()
  icon = '';

  /**
   * A [Codicon](https://microsoft.github.io/vscode-codicons/dist/codicon.html) after the label
   */
  @property({attribute: 'icon-after'})
  iconAfter = '';

  @property({type: Boolean, reflect: true})
  focused = false;

  @property({type: String, reflect: true})
  name: string | undefined = undefined;

  @property({reflect: true})
  type: 'submit' | 'reset' | 'button' = 'button';

  @property()
  value = '';

  private _prevTabindex = 0;
  private _internals: ElementInternals;

  get form(): HTMLFormElement | null {
    return this._internals.form;
  }

  constructor() {
    super();
    this.addEventListener('keydown', this._handleKeyDown.bind(this));
    this.addEventListener('click', this._handleClick.bind(this));
    this._internals = this.attachInternals();
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('focus', this._handleFocusBound);
    this.addEventListener('blur', this._handleBlurBound);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('focus', this._handleFocusBound);
    this.removeEventListener('blur', this._handleBlurBound);
  }

  attributeChangedCallback(name: string, oldVal: string, newVal: string): void {
    super.attributeChangedCallback(name, oldVal, newVal);

    if (name === 'disabled' && this.hasAttribute('disabled')) {
      this._prevTabindex = this.tabIndex;
      this.tabIndex = -1;
    } else if (name === 'disabled' && !this.hasAttribute('disabled')) {
      this.tabIndex = this._prevTabindex;
    }
  }

  update(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    super.update(changedProperties);

    if (changedProperties.has('value')) {
      this._internals.setFormValue(this.value);
    }
  }

  private _executeAction() {
    if (this.type === 'submit' && this._internals.form) {
      this._internals.form.requestSubmit();
    }

    if (this.type === 'reset' && this._internals.form) {
      this._internals.form.reset();
    }
  }

  private _handleKeyDown(event: KeyboardEvent) {
    if (
      (event.key === 'Enter' || event.key === ' ') &&
      !this.hasAttribute('disabled')
    ) {
      this.dispatchEvent(
        new CustomEvent<{
          originalEvent: MouseEvent;
        }>('vsc-click', {
          detail: {
            originalEvent: new MouseEvent('click'),
          },
        })
      );

      this._executeAction();
    }
  }

  private _handleClick(event: MouseEvent) {
    if (!this.hasAttribute('disabled')) {
      this.dispatchEvent(
        new CustomEvent<{
          originalEvent: MouseEvent;
        }>('vsc-click', {
          detail: {
            originalEvent: event,
          },
        })
      );

      this._executeAction();
    }
  }

  private _handleFocus() {
    this.focused = true;
  }

  private _handleFocusBound = this._handleFocus.bind(this);

  private _handleBlur() {
    this.focused = false;
  }

  private _handleBlurBound = this._handleBlur.bind(this);

  render(): TemplateResult {
    const hasIcon = this.icon !== '';
    const hasIconAfter = this.iconAfter !== '';
    const wrapperClasses = {
      wrapper: true,
      'has-icon-before': hasIcon,
      'has-icon-after': hasIconAfter,
    };

    const iconElem = hasIcon
      ? html`<vscode-icon name="${this.icon}" class="icon"></vscode-icon>`
      : nothing;

    const iconAfterElem = hasIconAfter
      ? html`<vscode-icon
          name="${this.iconAfter}"
          class="icon-after"
        ></vscode-icon>`
      : nothing;

    return html`
      <span class="${classMap(wrapperClasses)}">
        ${iconElem}
        <slot></slot>
        ${iconAfterElem}
      </span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'vscode-button': VscodeButton;
  }
}
