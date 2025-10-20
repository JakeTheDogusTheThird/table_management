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

  renderHeader(columns, sortState = {}) {
    this.#header.innerHTML = "";
    let row = "";

    columns.forEach((column) => {
      const th = document.createElement("th");
      th.setAttribute("data-column", column.key);
      th.setAttribute("data-label", column.label)
      th.setAttribute("data-order", sortState[column.key] || "none");

      let arrow = " ↑↓";
      if (sortState[column.key] === "asc") arrow = " ↑";
      if (sortState[column.key] === "desc") arrow = " ↓";

      th.innerHTML = `${column.label}${arrow}`;
      row.appendChild(th);
    });

    this.#header.appendChild(row);
  }

  renderBody() {}

  renderButtons() {}

  renderDetails() {}

  resetSortingIndicators() {
    // Reset header indicators
  }

  updateSortingIndicator(columnKey, direction) {
    // Set the arrow on the active column
  }
}
