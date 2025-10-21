import {
  FIRST_PAGE,
  ONE_PAGE,
  PAGE_WINDOW_SIZE,
  ZERO_PAGES,
  UNSORTED,
} from "./constants.js";

class PageRenderer {
  #headers;
  #body;
  #buttons;
  #details;
  constructor(
    columnHeaders,
    tableBody,
    pageButtonsContainer,
    detailsContainer
  ) {
    this.#headers = columnHeaders;
    this.#body = tableBody;
    this.#buttons = pageButtonsContainer;
    this.#details = detailsContainer;
  }

  updateColumnHeaderSortingOrder(dataColumn, sortingOrder) {
    this.#headers.forEach((header) => {
      const orderPlaceholder = header.querySelector(".order-placeholder");
      if (header.getAttribute("data-column") === dataColumn) {
        orderPlaceholder.innerHTML = sortingOrder;
      } else {
        orderPlaceholder.innerHTML = UNSORTED;
      }
    });
  }

  renderTablePage(dataSet) {
    const dataSetPage = dataSet.getCurrentPage();
    const currentPageNumber = dataSet.currentPageNumber;
    const numberOfPages = dataSet.numberOfPages;
    this.renderBody(dataSetPage);
    this.renderPageButtons(currentPageNumber, numberOfPages);
    this.clearDetails();
  }

  renderBody(dataSetPage) {
    let rows = "";
    for (let i = 0; i < dataSetPage.length; i++) {
      rows += `<tr data-details="false">
                  <td>${dataSetPage[i].id}</td>
                  <td>${dataSetPage[i].firstName}</td>
                  <td>${dataSetPage[i].lastName}</td>
                  <td>${dataSetPage[i].email}</td>
                  <td>${dataSetPage[i].phone}</td>
               </tr>`;
    }
    this.#body.innerHTML = rows;
  }

  renderPageButtons(currentPageNumber, numberOfPages) {
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

  renderDetails(rowData) {
    this.#details.innerHTML = `<p>User selected <b>${rowData.firstName} ${rowData.lastName}</b></p>
                       <p>Description:</p>
                       <textarea>age: ${rowData.age}\ngender: ${rowData.gender}\ndate-of-birth: ${rowData.birthDate}</textarea>
                       <p>Residential address: <b>${rowData.address.address}</b></p>
                       <p>City: <b>${rowData.address.city}</b></p>
                       <p>Province/State: <b>${rowData.address.state}</b></p>
                       <p>Index <b>${rowData.address.postalCode}</b></p>`;
  }

  clearDetails() {
    this.#details.innerHTML = "";
  }

  resetSortingIndicators() {
    // Reset header indicators
  }

  updateSortingIndicator(columnKey, direction) {
    // Set the arrow on the active column
  }
}

export { PageRenderer };
