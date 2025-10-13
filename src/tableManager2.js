const SERVER_URL =
  prompt("Please select data set size (large or small): ").toLowerCase() ===
  "large"
    ? "https://dummyjson.com/users?limit=208"
    : "https://dummyjson.com/users?limit=32";
const ROWS_PER_PAGE = 50;
const PAGE_WINDOW_SIZE = 5;
const FIRST_PAGE = 1;
const ONE_PAGE = 1;
const ZERO_PAGES = 0;

class PaginatedDataSet {
  #rows;
  #dataSet;
  #numberOfPages;
  #currentPageNumber;
  #filteredDataSet;
  constructor(dataSet, rows) {
    this.#dataSet = dataSet;
    this.#rows = rows;
    this.#currentPageNumber = FIRST_PAGE;
    this.#filteredDataSet = [...this.#dataSet];
    this.computeNumberOfPages();
  }

  getPageByNumber(pageNumber) {
    let start = (pageNumber - FIRST_PAGE) * this.#rows;
    let end = start + this.#rows;

    return this.#filteredDataSet.slice(start, end);
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

  computeNumberOfPages() {
    this.#numberOfPages = Math.ceil(this.#filteredDataSet.length / this.#rows);
  }

  filter(text) {
    text = text.toLowerCase();
    this.#filteredDataSet = this.#dataSet.filter((entry) => {
      return (
        entry.id === Number(text) ||
        entry.firstName.toLowerCase().includes(text) ||
        entry.lastName.toLowerCase().includes(text) ||
        entry.email.toLowerCase().includes(text) ||
        entry.phone.toLowerCase().includes(text)
      );
    });
    this.computeNumberOfPages();
    this.#currentPageNumber = FIRST_PAGE;
  }

  getDataEntryById(id) {
    return this.#filteredDataSet.find((entry) => entry.id === id);
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
      const dataSetPage = dataSet.goToPage(
        Number(event.target.getAttribute("value"))
      );
      renderPageTable(dataSetPage);
      renderPageButtons(dataSet.currentPageNumber, dataSet.numberOfPages);
    }
  });
}

function renderPageButtons(currentPageNumber, numberOfPages) {
  let wrapper = document.getElementById("page-button-wrapper");
  if (numberOfPages === ONE_PAGE || numberOfPages === ZERO_PAGES) {
    wrapper.innerHTML = "";
    return;
  }
  let buttons = "";

  const halfWindow = Math.floor(PAGE_WINDOW_SIZE / 2);
  let start = Math.max(FIRST_PAGE, currentPageNumber - halfWindow);
  let end = start + PAGE_WINDOW_SIZE - ONE_PAGE;

  if (end > numberOfPages) {
    end = numberOfPages;
    start = Math.max(FIRST_PAGE, end - PAGE_WINDOW_SIZE + FIRST_PAGE);
  }

  for (let page = start; page <= end; page++) {
    let activeButton = "";
    if (page == currentPageNumber) {
      activeButton = "active";
    }
    buttons += `<button value=${page} class="page btn btn-lg btn-outline-dark mx-1 ${activeButton}">${page}</button>`;
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
  const tableHeader = document.getElementById("table-head");

  tableHeader.addEventListener("click", (event) => {
    const th = event.target.closest("th");
    const column = th.getAttribute("data-column");
    let order = th.getAttribute("data-order");

    order = order === "desc" ? "asc" : "desc";
    th.setAttribute("data-order", order);
    let dataSetPage = [...dataSet.getCurrentPage()];
    dataSetPage.sort((a, b) => compareBy(a, b, column, order));
    updateSortingIndicators(th, order);
    renderPageTable(dataSetPage);
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
  let oldText = th.textContent.trim();
  if (order === "asc") {
    th.innerHTML = oldText.slice(0, -1) + upArrow;
  } else {
    th.innerHTML = oldText.slice(0, -1) + downArrow;
  }
}

function routeSearchBar(dataSet) {
  const searchBar = document.getElementById("search-bar");
  const searchButton = document.getElementById("search-button");

  searchButton.addEventListener("click", () => {
    let searchText = searchBar.value;
    dataSet.filter(searchText);
    renderPageTable(dataSet.getCurrentPage());
    renderPageButtons(dataSet.currentPageNumber, dataSet.numberOfPages);
  });
}

function renderDetails(data) {
  const details = document.getElementById("details-container");
  details.innerHTML = `<p>User selected <b>${data.firstName} ${data.lastName}</b></p>
                       <p>Description:</p>
                       <textarea>age: ${data.age}\ngender: ${data.gender}\ndate-of-birth: ${data.birthDate}</textarea>
                       <p>Residential address: <b>${data.address.address}</b></p>
                       <p>City: <b>${data.address.city}</b></p>
                       <p>Province/State: <b>${data.address.state}</b></p>
                       <p>Index <b>${data.address.postalCode}</b></p>`;
}

function routeTableRows(dataSet) {
  document.getElementById("data-table").addEventListener("click", (event) => {
    const tr = event.target.closest("tr");
    if (tr === null) {
      return;
    }
    console.log("TR", tr);
    console.log("TR CHILDREND", tr.children);
    const id = Number(tr.children[0].textContent);
    console.log("ID", id);
    const entry = dataSet.getDataEntryById(id);
    console.log("ENTRY", entry);
    renderDetails(entry);
  });
}

fetchData().then((data) => {
  const dataSet = new PaginatedDataSet(data, ROWS_PER_PAGE);
  let firstPage = dataSet.getCurrentPage();
  renderPageTable(firstPage);
  routeTableRows(dataSet);
  renderPageButtons(dataSet.currentPageNumber, dataSet.numberOfPages);
  routePageButtons(dataSet);
  routeSortingIndicators(dataSet);
  routeSearchBar(dataSet);
});
