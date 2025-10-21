import {
  UNSORTED,
  EXPANDED_ROW,
  NOT_EXPANDED_ROW,
  ASCENDING,
  DESCENDING,
} from "./constants.js";

class PageController {
  #paginatedData;
  #pageRenderer;
  constructor(paginatedData, pageRenderer) {
    this.#paginatedData = paginatedData;
    this.#pageRenderer = pageRenderer;

    this.init();
  }

  init() {
    this.#pageRenderer.renderTablePage(this.#paginatedData);
  }

  goToPage(pageNumber) {
    this.#paginatedData.goToPage(pageNumber);
    this.#pageRenderer.renderTablePage(this.#paginatedData);
  }

  sort(header) {
    const dataColumn = header.getAttribute("data-column");
    const orderPlaceholder = header.querySelector(".order-placeholder");
    const sortOrder = orderPlaceholder.innerHTML.trim();
    const newOrder = sortOrder === ASCENDING ? DESCENDING : ASCENDING;
    this.#paginatedData.sort(dataColumn, sortOrder);
    this.#pageRenderer.updateColumnHeaderSortingOrder(dataColumn, newOrder);
    this.#pageRenderer.renderTablePage(this.#paginatedData);
    this.closeExpandedDetails();
  }

  search(text) {
    this.#paginatedData.filter(text);
    this.#pageRenderer.updateColumnHeaderSortingOrder(UNSORTED, UNSORTED);
    this.#pageRenderer.renderTablePage(this.#paginatedData);
    this.closeExpandedDetails();
  }

  handleRowClick(row) {
    const isExpanded = row.dataset.details === EXPANDED_ROW;
    if (isExpanded) {
      row.dataset.details = NOT_EXPANDED_ROW;
      this.#pageRenderer.clearDetails();
      return;
    }

    this.closeExpandedDetails();

    row.dataset.details = EXPANDED_ROW;
    const id = Number(row.children[0].textContent);
    const rowData = this.#paginatedData.getRowDataById(id);

    this.#pageRenderer.renderDetails(rowData);
  }

  closeExpandedDetails() {
    const expandedRow = document.querySelector('tr[data-details="true"]');
    if (expandedRow) {
      expandedRow.dataset.details = NOT_EXPANDED_ROW;
      this.#pageRenderer.clearDetails();
    }
  }

  areInputsEmpty(inputs, saveButton) {
    const allFilled = inputs.every((input) => input.value.trim() !== "");
    saveButton.disabled = !allFilled;
  }

  saveForm(form) {
    this.#paginatedData.save(form);
    this.#pageRenderer.renderTablePage(this.#paginatedData);
  }
}

export { PageController };
