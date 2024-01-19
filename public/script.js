// public/script.js
$(document).ready(function() {
    const apiUrl = '/transactions';  // Update with your backend API endpoint

    // Function to fetch data from the backend API
    function fetchDataFromBackend(month, search, page, perPage) {
        return $.ajax({
            url: apiUrl,
            method: 'GET',
            data: { month, search, page, perPage },
            dataType: 'json'
        });
    }

    // Function to populate the month dropdown dynamically
    function populateMonthDropdown() {
        const monthSelect = $("#monthSelect");
        const months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
0
        $.each(months, function(index, month) {
            monthSelect.append($("<option>", { value: month, text: month }));
        });

        // Default selected month
        const defaultMonth = "March";
        monthSelect.val(defaultMonth);
    }

    // Function to handle search functionality
    function handleSearch() {
        const searchInput = $("#searchInput");
        const searchButton = $("#searchButton");
        const clearButton = $("#clearButton");

        searchButton.click(function() {
            const selectedMonth = $("#monthSelect").val();
            const searchText = searchInput.val();
            fetchDataAndUpdateTable(selectedMonth, searchText);
        });

        clearButton.click(function() {
            searchInput.val("");
            const selectedMonth = $("#monthSelect").val();
            fetchDataAndUpdateTable(selectedMonth, "");
        });
    }

    // Function to update the table dynamically
    function updateTable(data) {
        const table = $("#transactionsTable");
        const thead = table.find("thead");
        const tbody = table.find("tbody");

        // Clear existing table content
        thead.empty();
        tbody.empty();

        // Sample headers, modify as needed based on your data structure
        const headers = ["Title", "Description", "Price", "Date of Sale"];
        const headerRow = $("<tr>");

        $.each(headers, function(index, header) {
            headerRow.append($("<th>").text(header));
        });

        thead.append(headerRow);

        // Sample data rows, modify as needed based on your data structure
        $.each(data, function(index, transaction) {
            const dataRow = $("<tr>");

            dataRow.append($("<td>").text(transaction.title));
            dataRow.append($("<td>").text(transaction.description));
            dataRow.append($("<td>").text(transaction.price));
            dataRow.append($("<td>").text(transaction.dateOfSale));

            tbody.append(dataRow);
        });
    }

    // Function to fetch data and update the table
    function fetchDataAndUpdateTable(month, search) {
        const page = 1;  // Default page
        const perPage = 10;  // Default items per page

        fetchDataFromBackend(month, search, page, perPage)
            .done(function(response) {
                const transactions = response.transactions || [];
                updateTable(transactions);
            })
            .fail(function(error) {
                console.error("Error fetching data:", error);
            });
    }

    // Function to handle pagination (Next and Previous buttons)
    function handlePagination() {
        const prevButton = $("#prevButton");
        const nextButton = $("#nextButton");

        prevButton.click(function() {
            // Implement logic to load the previous page data using API
            console.log("Previous button clicked");
        });

        nextButton.click(function() {
            // Implement logic to load the next page data using API
            console.log("Next button clicked");
        });
    }

    // Initialize functions on page load
    populateMonthDropdown();
    handleSearch();
    handlePagination();

    // Initial load with default values
    const defaultMonth = "March";
    fetchDataAndUpdateTable(defaultMonth, "");
});
