import { Component } from '@theme/component';
import { morph } from '@theme/morph';
import { StandardEvents, ProductSelectEvent } from '@shopify/events';

class PbGlazeAccent extends Component {
  /** @type {AbortController | undefined} */
  #controller;

  connectedCallback() {
    super.connectedCallback();

    this.#controller = new AbortController();
    const section = this.closest('.shopify-section');
    section?.addEventListener(StandardEvents.productSelect, this.#handleProductSelect, {
      signal: this.#controller.signal,
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.#controller?.abort();
  }

  /**
   * Updates the glaze tag when the shopper picks another variant.
   * @param {ProductSelectEvent} event - The product select event.
   */
  #handleProductSelect = (event) => {
    if (!(event.target instanceof Element) || event.target.closest('product-card')) return;

    event.promise
      .then(({ detail }) => {
        if (!detail?.html || detail.productId !== this.dataset.productId) return;

        const newGlazeAccent = detail.html.getElementById(this.id);
        if (!newGlazeAccent) return;

        morph(this, newGlazeAccent);
      })
      .catch((error) => {
        if (error?.name !== 'AbortError') console.warn('[pb-glaze-accent] Event promise rejected:', error);
      });
  };
}

if (!customElements.get('pb-glaze-accent')) {
  customElements.define('pb-glaze-accent', PbGlazeAccent);
}
