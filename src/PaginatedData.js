import { ASCENDING, NO_DATA, EMAIL, FIRST_NAME, FIRST_PAGE, ID, LAST_NAME, PHONE } from "./constants.js";

class PaginatedData {
  #rows;
  #data;
  #numberOfPages;
  #currentPageNumber;
  #filteredData;
  constructor(data, rows) {
    this.#data = data;
    this.#rows = rows;
    this.#currentPageNumber = FIRST_PAGE;
    this.#filteredData = [...this.#data];
    this.computeNumberOfPages();
  }

  getPageByNumber(pageNumber) {
    let start = (pageNumber - FIRST_PAGE) * this.#rows;
    let end = start + this.#rows;

    return this.#filteredData.slice(start, end);
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
    this.#numberOfPages = Math.ceil(this.#filteredData.length / this.#rows);
  }

  sort(column, order) {
    this.#filteredData.sort((a, b) => {
      const aValue = a[column];
      const bValue = b[column];
      if (typeof aValue === "string") {
        return order === ASCENDING
          ? bValue.localeCompare(aValue)
          : aValue.localeCompare(bValue);
      }
      return order === ASCENDING ? bValue - aValue : aValue - bValue;
    });
  }

  filter(text) {
    text = text.toLowerCase();
    this.#filteredData = this.#data.filter((entry) => {
      return (
        entry.id === Number(text) ||
        entry.firstName.toLowerCase().includes(text) ||
        entry.lastName.toLowerCase().includes(text) ||
        entry.email.toLowerCase().includes(text) ||
        entry.phone.includes(text)
      );
    });
    this.computeNumberOfPages();
    this.#currentPageNumber = FIRST_PAGE;
  }

  getRowDataById(id) {
    return this.#filteredData.find((entry) => entry.id === id);
  }
  
  isIdPresent(id) {
    for (let i = 0; i < this.#data.length; i++) {
      if (this.#data[i].id === id) {
        return true;
      }
    }
    return false;
  }

  save(form) {
    const row = this.formToRow(form)
    this.#data = [row, ...this.#data];
    this.#filteredData = [row, ...this.#filteredData];
  }

  formToRow(form) {
    return {
      id: Number(form[ID].value),
      firstName: form[FIRST_NAME].value,
      lastName: form[LAST_NAME].value,
      email: form[EMAIL].value,
      phone: form[PHONE].value,
      address: {
        address: NO_DATA,
        city: NO_DATA,
        state: NO_DATA,
        postalCode: NO_DATA,
      }
    };
  }
}

export { PaginatedData };
