const SERVER_URL =
  prompt("Please select data set size (large or small): ").toLowerCase() ===
  "large"
    ? "https://dummyjson.com/users?limit=208"
    : "https://dummyjson.com/users?limit=32";
const ROWS = 50;
const PAGE_WINDOW_SIZE = 5;
const FIRST_PAGE = 1;

class PaginatedDataSet {
  #rows;
  #dataSet;
  #numberOfPages;
  #currentPageNumber;
  constructor(dataSet, rows) {
    this.#dataSet = dataSet;
    this.#rows = rows;
    this.#numberOfPages = Math.ceil(dataSet.length / rows);
    this.#currentPageNumber = FIRST_PAGE;
  }

  getPageByNumber(pageNumber) {
    let start = (pageNumber - FIRST_PAGE) * this.#rows;
    let end = start + this.#rows;

    return this.#dataSet.slice(start, end);
  }

  goToPage(pageNumber) {
    this.#currentPageNumber = pageNumber;
    return this.getPageByNumber(pageNumber);
  }

  getCurrentPage() {
    return this.getPageByNumber(this.#currentPageNumber);
  }

  get numberOfPages() {
    return this.#numberOfPages;
  }

  get currentPageNumber() {
    return this.#currentPageNumber;
  }

  set currentPageNumber(pageNumber) {
    this.#currentPageNumber = pageNumber;
  }
}

async function fetchData() {
  try {
    const response = await fetch(SERVER_URL);
    const data = await response.json();
    return data.users;
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return [];
  }
}

function routePageButtons(dataSet) {
  let wrapper = document.getElementById("page-button-wrapper");
  wrapper.addEventListener("click", (event) => {
    if (event.target.tagName === "BUTTON") {
      const dataSetPage = dataSet.goToPage(Number(event.target.getAttribute("value")));
      renderPageTable(dataSetPage);
      renderPageButtons(dataSet.currentPageNumber, dataSet.numberOfPages);
    }
  });
}

function renderPageButtons(currentPageNumber, numberOfPages) {
  console.log("currentPage:", currentPageNumber);
  let wrapper = document.getElementById("page-button-wrapper");
  let buttons = "";

  const halfWindow = Math.floor(PAGE_WINDOW_SIZE / 2);
  let start = Math.max(FIRST_PAGE, currentPageNumber - halfWindow);
  let end = start + PAGE_WINDOW_SIZE - 1;

  if (end > numberOfPages) {
    end = numberOfPages;
    start = Math.max(FIRST_PAGE, end - PAGE_WINDOW_SIZE + FIRST_PAGE);
  }

  for (let page = start; end != FIRST_PAGE && page <= end; page++) {
    buttons += `<button value=${page} class="page btn btn-lg btn-outline-dark mx-1">${page}</button>`;
  }

  if (currentPageNumber !== FIRST_PAGE) {
    buttons =
      `<button value=${FIRST_PAGE} class="page btn btn-lg btn-outline-dark mx-1">First</button>` +
      buttons;
  }
  if (currentPageNumber !== numberOfPages) {
    buttons += `<button value=${numberOfPages} class="page btn btn-lg btn-outline-dark mx-1">Last</button>`;
  }
  wrapper.innerHTML = buttons;
}

function renderPageTable(dataSetPage) {
  let table = document.getElementById("data-table");
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
  table.innerHTML = rows;
}

function routeSortingIndicators(dataSet) {
  document.querySelectorAll("th[data-column]").forEach((th) => {
    th.addEventListener("click", () => {
      const column = th.getAttribute("data-column");
      let order = th.getAttribute("data-order");

      order = order === "desc" ? "asc" : "desc";
      th.setAttribute("data-order", order);
      let dataSetPage = [...dataSet.getCurrentPage()];
      dataSetPage.sort((a, b) => compareBy(a, b, column, order));
      updateSortingIndicators(th, order);
      renderPageTable(dataSetPage);
    });
  });
}

function compareBy(a, b, column, order) {
  const aValue = a[column];
  const bValue = b[column];
  if (typeof aValue === "string") {
    return order === "asc"
      ? aValue.localeCompare(bValue)
      : bValue.localeCompare(aValue);
  }
  return order === "asc" ? aValue - bValue : bValue - aValue;
}

function updateSortingIndicators(th, order) {
  let upArrow = "&uarr;";
  let downArrow = "&darr;";
  let oldHtml = th.innerHTML;
  if (order === "asc") {
    th.innerHTML = oldHtml.slice(0, -1) + upArrow;
  } else {
    th.innerHTML = oldHtml.slice(0, -1) + downArrow;
  }
}

fetchData().then((data) => {
  const dataSet = new PaginatedDataSet(data, ROWS);
  let firstPage = dataSet.getCurrentPage();
  renderPageTable(firstPage);
  renderPageButtons(dataSet.currentPageNumber, dataSet.numberOfPages);
  routePageButtons(dataSet);
  routeSortingIndicators(dataSet);
});
