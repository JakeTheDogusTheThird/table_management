import { PageRenderer } from "./PageRenderer.js";
import { PaginatedData } from "./PaginatedData.js";
import { PageController } from "./PageController.js";

const ROWS_PER_PAGE = 50;

document.addEventListener("DOMContentLoaded", main);
const SERVER_URL =
  prompt("Please select data set size (large or small): ").toLowerCase() ===
  "large"
    ? "https://dummyjson.com/users?limit=208"
    : "https://dummyjson.com/users?limit=32";

function main() {
  fetchData().then((data) => {
    const columnHeaders = document.querySelectorAll("th[data-column]");
    const tableBody = document.getElementById("table-body");
    const pageButtonsContainer = document.getElementById(
      "page-buttons-container"
    );
    const detailsContainer = document.getElementById("details-container");
    const searchBar = document.getElementById("search-bar");
    const searchButton = document.getElementById("search-button");
    const addButton = document.getElementById("add-button");
    const addForm = document.getElementById("add-form");
    const inputs = Array.from(addForm.querySelectorAll("input[required]"));
    const saveButton = document.getElementById("save-button");

    const pageRenderer = new PageRenderer(
      columnHeaders,
      tableBody,
      pageButtonsContainer,
      detailsContainer
    );
    const paginatedData = new PaginatedData(data, ROWS_PER_PAGE);
    const pageController = new PageController(paginatedData, pageRenderer);

    pageButtonsContainer.addEventListener("click", (event) => {
      if (event.target.tagName === "BUTTON") {
        const pageNumber = Number(event.target.getAttribute("value"));
        pageController.goToPage(pageNumber);
      }
    });

    columnHeaders.forEach(header => {
      header.addEventListener("click", () => {
        pageController.sort(header);
      });
    })

    searchButton.addEventListener("click", () => {
      const text = searchBar.value;
      pageController.search(text);
    })
    
    tableBody.addEventListener("click", (event) => {
      const row = event.target.closest("tr");
      if (row === null) {
        return;
      }
      pageController.handleRowClick(row);
    });

    inputs.forEach(input => {
      input.addEventListener('input', () => {
        pageController.areInputsEmpty(inputs, saveButton);
        console.log("input");
      });
      input.addEventListener('change', () => {
        pageController.areInputsEmpty(inputs, saveButton);
        console.log("change");
      });
    });

    saveButton.addEventListener("click", () => {
      pageController.saveForm(addForm);
    })
  });
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
