const express = require('express');
const axios = require('axios');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;
app.use(cors());


// Middleware to parse JSON requests
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const apiUrl = 'https://s3.amazonaws.com/roxiler.com/product_transaction.json';

// Function to fetch data from the third-party API
async function fetchData() {
  try {
    const response = await axios.get(apiUrl);
    // console.log(response);

    return response.data;
  } catch (error) {
    throw new Error(`Error fetching data from the API: ${error.message}`);
  }
}

// app.get('/transaction', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

// API to list all transactions with search and pagination
app.get('/transactions', async (req, res) => {
    try {
      const { month, search = '', page = 1, perPage = 10 } = req.query;
      const data = await fetchData();
      // console.log("All data ", data);

      const filteredData = data.filter(transaction =>
      transaction.dateOfSale &&
      transaction.dateOfSale.includes(month) &&
      (transaction.title.includes(search) ||
        transaction.description.includes(search) ||
        (transaction.price && transaction.price.toString().includes(search)))
    );
      
      // console.log('Filtered Data:', filteredData);
  
      const startIndex = (page - 1) * perPage;
      const endIndex = startIndex + parseInt(perPage);
      const paginatedData = filteredData.slice(startIndex, endIndex);
  
      // console.log('Filtered Data:', paginatedData); // Log filtered data for debugging
  
      res.status(200).json({ transactions: paginatedData });
      res.sendFile(path.join(__dirname, 'public', 'index.html'));
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });




function calculateStatistics(data, month) {
    const totalSaleAmount = data
      .filter(transaction =>
        transaction.dateOfSale &&
        transaction.dateOfSale.toLowerCase().includes(month.toLowerCase())
      )
      .reduce((total, transaction) => total + transaction.price, 0);
  
      const totalSoldItems = data
      .filter(transaction =>
        transaction.dateOfSale &&
        transaction.dateOfSale.toLowerCase().includes(month.toLowerCase()) &&
        transaction.sold
      ).length;


      const totalNotSoldItems = data
      .filter(transaction =>
        transaction.dateOfSale &&
        transaction.dateOfSale.toLowerCase().includes(month.toLowerCase()) &&
        !transaction.sold
      ).length;
    
  
    return {
      totalSaleAmount,
      totalSoldItems,
      totalNotSoldItems,
    };
  }

// app.get('/statistics', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'statistics.html'));
// })
app.get('/statistic', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'statistics.html'));
});

app.get('/api/statistics', async (req, res) => {
  try {
    const { month } = req.query;
    const data = await fetchData();
    const statistics = calculateStatistics(data, month);

    // Return the statistics in the response
    res.json(statistics);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




// Function to update bar chart with the provided data
function updateBarChart(barChartData) {
  // Assuming 'barChart' is your Chart.js bar chart instance
  barChart.data.labels = barChartData.labels;
  barChart.data.datasets[0].data = barChartData.data;
  barChart.update();
}

// Function to update pie chart with the provided data
function updatePieChart(pieChartData) {
  // Assuming 'pieChart' is your Chart.js pie chart instance
  pieChart.data.labels = pieChartData.labels;
  pieChart.data.datasets[0].data = pieChartData.data;
  pieChart.update();
}

// Function to calculate bar chart data
function calculateBarChartData(apiResponse) {
  // Extract relevant data from the API response
  const priceRanges = ['0-100', '101-200', '201-300', '301-400', '401-500', '501-600', '601-700', '701-800', '801-900', '901-above'];

  // Replace this line with the logic to extract the number of items in each price range from the API response
  const itemsInPriceRanges = [5, 10, 8, 15, 20, 12, 7, 9, 14, 6];

  // Return the formatted data for the bar chart
  return { labels: priceRanges, data: itemsInPriceRanges };
}

// API endpoint for bar chart data
app.get('/api/bar-chart', async (req, res) => {
  try {
      const { month } = req.query;
      const data = await fetchData();  // Assuming fetchData is your function to get data
      const barChartData = calculateBarChartData(data, month);

      res.json(barChartData);
      res.sendFile(path.join(__dirname, 'public', 'updateBar.html'));
  } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Function to calculate pie chart data
function calculatePieChartData(apiResponse) {
  // Replace this line with the logic to extract unique categories and the number of items from the API response
  const categoryData = [
      { category: 'X', count: 20 },
      { category: 'Y', count: 5 },
      { category: 'Z', count: 3 }
  ];

  // Return the formatted data for the pie chart
  return categoryData;
}

// API endpoint for pie chart data
app.get('/api/pie-chart', async (req, res) => {
  try {
      const { month } = req.query;
      const data = await fetchData();  // Assuming fetchData is your function to get data
      const pieChartData = calculatePieChartData(data, month);

      res.json(pieChartData);
      res.sendFile(path.join(__dirname, 'public', 'updateBar.html'));

  } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Now you can initialize your chart instances and call the API endpoints in your application


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
