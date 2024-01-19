$(document).ready(function() {
    const apiUrl = '/api/statistics';

    function fetchStatisticsFromBackend(month) {
        return $.ajax({
            url: apiUrl,
            method: 'GET',
            data: { month },
            dataType: 'json'
        });
    }

    function updateStatistics(totalSaleAmount, totalSoldItems, totalNotSoldItems) {
        $("#totalSaleAmount").text(totalSaleAmount);
        $("#totalSoldItems").text(totalSoldItems);
        $("#totalNotSoldItems").text(totalNotSoldItems);
    }

    function handleGetStatistics() {
        const getStatisticsButton = $("#getStatisticsButton");

        getStatisticsButton.click(function() {
            const selectedMonth = $("#monthSelect").val();
            fetchStatisticsAndUpdatePage(selectedMonth);
        });
    }

    function fetchStatisticsAndUpdatePage(month) {
        fetchStatisticsFromBackend(month)
            .done(function(response) {
                if (response.error) {
                    console.error("Error fetching statistics:", response.error);
                } else {
                    const { totalSaleAmount, totalSoldItems, totalNotSoldItems } = response;
                    updateStatistics(totalSaleAmount, totalSoldItems, totalNotSoldItems);
                }
            })
            .fail(function(error) {
                console.error("AJAX request failed:", error.statusText);
            });
    }

    const monthSelect = $("#monthSelect");
    const months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];

    $.each(months, function(index, month) {
        monthSelect.append($("<option>", { value: month, text: month }));
    });

    handleGetStatistics();
});
