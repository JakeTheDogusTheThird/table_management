class PageRenderer {
  #header;
  #body;
  #buttons;
  #details;
  constructor(tableHeader, tableBody, tableButtons, tableDetails) {
    this.#header = tableHeader;
    this.#body = tableBody;
    this.#buttons = tableButtons;
    this.#details = tableDetails;
  }

  updateColumnHeaderSortingOrder(columnId, sortingOrder) {
    const column = this.#header.getElementById(columnId);
    const orderPlaceholder = column.querySelector("order-placeholder");

    orderPlaceholder.innerHTML = sortingOrder;
  }

  renderBody(dataSetPage) {
    let rows = "";
    for (let i = 0; i < dataSetPage.length; i++) {
      rows += `<tr>
                  <td>${dataSetPage[i].id}</td>
                  <td>${dataSetPage[i].firstName}</td>
                  <td>${dataSetPage[i].lastName}</td>
                  <td>${dataSetPage[i].email}</td>
                  <td>${dataSetPage[i].phone}</td>
               </tr>`;
    }
    this.#body.innerHTML = rows;
  }

  renderTableButtons(currentPageNumber, numberOfPages) {
    if (numberOfPages === ONE_PAGE || numberOfPages === ZERO_PAGES) {
      this.#buttons.innerHTML = "";
      return;
    }

    const halfWindow = Math.floor(PAGE_WINDOW_SIZE / 2);
    let start = Math.max(FIRST_PAGE, currentPageNumber - halfWindow);
    let end = start + PAGE_WINDOW_SIZE - ONE_PAGE;

    if (end > numberOfPages) {
      end = numberOfPages;
      start = Math.max(FIRST_PAGE, end - PAGE_WINDOW_SIZE + FIRST_PAGE);
    }

    let buttonsHtml = "";
    for (let page = start; page <= end; page++) {
      let activeButton = "";
      if (page == currentPageNumber) {
        activeButton = "active";
      }
      buttonsHtml += `<button value=${page} class="page btn btn-lg btn-outline-dark mx-1 ${activeButton}">${page}</button>`;
    }

    if (currentPageNumber !== FIRST_PAGE) {
      buttonsHtml =
        `<button value=${FIRST_PAGE} class="page btn btn-lg btn-outline-dark mx-1">First</button>` +
        buttonsHtml;
    }
    if (currentPageNumber !== numberOfPages) {
      buttonsHtml += `<button value=${numberOfPages} class="page btn btn-lg btn-outline-dark mx-1">Last</button>`;
    }
    this.#buttons.innerHTML = buttonsHtml;
  }

  renderDetails() {}

  resetSortingIndicators() {
    // Reset header indicators
  }

  updateSortingIndicator(columnKey, direction) {
    // Set the arrow on the active column
  }
}
