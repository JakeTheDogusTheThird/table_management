const SERVER_URL =
  prompt("Please select data set size (large or small): ").toLowerCase() ===
  "large"
    ? "https://dummyjson.com/users?limit=208"
    : "https://dummyjson.com/users?limit=32";
const ROWS = 20;
const PAGE_WINDOW_SIZE = 5;

class PaginatedDataSet {
  #rows;
  #dataSet;
  #numberOfPages;
  #currentPageNumber;
  constructor(dataSet, rows) {
    this.#dataSet = dataSet;
    this.#rows = rows;
    this.#numberOfPages = Math.ceil(dataSet.length / rows);
  }

  getPageByNumber(pageNumber) {
    this.#currentPageNumber = pageNumber;
    let start = (this.#currentPageNumber - 1) * this.#rows;
    let end = start + this.#rows;

    return this.#dataSet.slice(start, end);
  }

  get numberOfPages() {
    return this.#numberOfPages;
  }

  getCurrentPage() {
    return this.getPageByNumber(this.#currentPageNumber);
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
  let buttons = document.getElementsByClassName("page");
  for (let i = 0; i < buttons.length; i++) {
    let button = buttons[i];
    button.addEventListener("click", () => {
      dataSetPage = dataSet.getPageByNumber(button.textContent);
      renderPageTable(dataSetPage);
    });
  }
}

function renderPageButtons(numberOfPages) {
  let wrapper = document.getElementById("page-buttons-wrapper");
  let buttons = "";

  for (let page = 1; page <= numberOfPages; page++) {
    buttons += `<button value=${page} class="page btn btn-lg btn-outline-dark mx-1">${page}</button>`;
  }
  console.log("Buttons", buttons);
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
      let dataSetPage = dataSet.getCurrentPage();
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
  let firstPage = dataSet.getPageByNumber(1);
  renderPageTable(firstPage);
  renderPageButtons(dataSet.numberOfPages);
  routePageButtons(dataSet);
  routeSortingIndicators(dataSet);
});
