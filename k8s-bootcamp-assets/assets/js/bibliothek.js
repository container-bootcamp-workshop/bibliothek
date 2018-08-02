const parser = new DOMParser();

/*
**  iq-form
*/

class IqForm extends HTMLElement {
  getQueryString(formData) {
    return [...formData.entries()]
      .map(e => `${encodeURIComponent(e[0])}=${encodeURIComponent(e[1])}`)
      .join("&");
  }

  async fetchDocument(uri, formData) {
    let response = await fetch(`${uri}?${this.getQueryString(formData)}`, {
      credentials: "include"
    });
    let htmlString = await response.text();
    return parser.parseFromString(htmlString, "text/html");
  }

  connectedCallback() {
    let selector = this.getAttribute("data-target");
    let $form = this.querySelector("form");

    $form.addEventListener("submit", async event => {
      event.preventDefault();
      let $remoteDocument = await this.fetchDocument(
        $form.action,
        new FormData($form)
      );
      let $target = $remoteDocument.querySelector(selector);
      let $source = document.querySelector(selector);
      $source.parentNode.replaceChild($target, $source);
    });
  }
}

window.customElements.define("iq-form", IqForm);
