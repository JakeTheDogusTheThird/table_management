function renderTable(data) {
  let table = document.getElementById("dataTable");
  let rows = "";
  let paginatedData = pagination(data, state.page, state.rows);
  let querySetPage = paginatedData.querySet;
  for (let i = 0; i < querySetPage.length; i++) {
    rows += `<tr>
                  <td>${querySetPage[i].id}</td>
                  <td>${querySetPage[i].firstName}</td>
                  <td>${querySetPage[i].lastName}</td>
                  <td>${querySetPage[i].email}</td>
                  <td>${querySetPage[i].phone}</td>
               </tr>`;
  }
  table.innerHTML = rows;

  pageButtons(paginatedData.pages, data);
}

class Person {
  #id;
  #firstName;
  #lastName;
  #phone;
  #email;
  constructor(id, firstName, lastName, phone, email) {
    this.#id = id;
    this.#firstName = firstName;
    this.#lastName = lastName;
    this.#phone = phone;
    this.#email = email;
  }

  get id() {
    return this.#id;
  }

  get firstName() {
    return this.#firstName;
  }

  get lastName() {
    return this.#lastName;
  }

  get email() {
    return this.#email;
  }

  get phone() {
    return this.#phone;
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

document.querySelectorAll("th[data-column]").forEach((th) => {
  th.addEventListener("click", () => {
    const column = th.getAttribute("data-column");
    let order = th.getAttribute("data-order");

    order = order === "desc" ? "asc" : "desc";
    th.setAttribute("data-order", order);

    users.sort((a, b) => compareBy(a, b, column, order));
    updateSortingIndicators(th, order);
    renderTable(users);
  });
});

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

const SERVER_URL =
  prompt("Please select data set size (large or small): ").toLowerCase() ===
  "large"
    ? "https://dummyjson.com/users?limit=208"
    : "https://dummyjson.com/users?limit=32";

let users = [];

fetchData().then((data) => {
  users = data;
  renderTable(users);
});

const state = {
  page: 5,
  rows: 50,
};

function pagination(querySet, page, rows) {
  let trimStart = (page - 1) * rows;
  let trimEnd = trimStart + rows;

  let trimmedData = querySet.slice(trimStart, trimEnd);

  let pages = Math.ceil(querySet.length / rows);

  return {
    querySet: trimmedData,
    pages: pages,
  };
}

function pageButtons(pages, data) {
  let wrapper = document.getElementById("pagination-wrapper");
  let buttons = "";

  for (let page = 1; page <= pages; page++) {
    buttons += `<button value=${page} class="page btn btn-sm btn-info">${page}</button>`;
  }

  wrapper.innerHTML = buttons;
  let wrappedButtons = document.getElementsByClassName("page");
  for (let i = 0; i < wrappedButtons.length; i++) {
    let button = wrappedButtons[i];
    button.addEventListener("click", () => {
      document.getElementById("dataTable").innerHTML = "";
      state.page = button.textContent;
      renderTable(data);
    });
  }
}
