import { ASCENDING, DESCENDING, FIRST_PAGE } from "./constants.js";

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

  save(form) {
    const user = {
      id: form[0].value,
      firstName: form[1].value,
      lastName: form[2].value,
      email: form[3].value,
      phone: form[4].value
    }
    this.#data = [user, ...this.#data];
    this.#filteredData = [user, ...this.#filteredData];
  }
}

export { PaginatedData };
