document.addEventListener("DOMContentLoaded", () => {
    // Theme toggle button
    const themeToggle = document.querySelector('.theme-toggle');
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-theme');
      themeToggle.textContent = document.body.classList.contains('dark-theme')
        ? '🌞 Light Mode'
        : '🌙 Dark Mode';
    });
  
    // Card elements
    const casesElem      = document.getElementById("total-cases");
    const recoveriesElem = document.getElementById("total-recoveries");
    const deathsElem     = document.getElementById("total-deaths");
  
    // Chart instances
    let barChart, pieChart, lineChart;
  
    // Helper to destroy chart if it exists
    function destroyChart(chart) {
      if (chart) {
        chart.destroy();
      }
    }
  
    // Fetch data and render dashboard
    async function fetchDataAndRender() {
      try {
        // 1) Global stats
        const globalRes = await fetch("/global_data");
        const globalData = await globalRes.json();
        casesElem.innerText      = globalData.cases.toLocaleString();
        recoveriesElem.innerText = globalData.recovered.toLocaleString();
        deathsElem.innerText     = globalData.deaths.toLocaleString();
  
        // 2) Top 10 countries bar chart
        const countryRes = await fetch("/country_data");
        const countryData = await countryRes.json();
        const top10 = countryData
          .sort((a, b) => b.cases - a.cases)
          .slice(0, 10);
        const labels = top10.map(c => c.country);
        const values = top10.map(c => c.cases);
  
        const barCtx = document.getElementById("barChart").getContext("2d");
        destroyChart(barChart);
        barChart = new Chart(barCtx, {
          type: "bar",
          data: {
            labels,
            datasets: [{
              label: "Total Cases",
              data: values,
              backgroundColor: "rgba(54, 162, 235, 0.6)",
              borderColor:     "rgba(54, 162, 235, 1)",
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: { beginAtZero: true }
            }
          }
        });

        
        // 3) Global distribution pie chart
        const pieCtx = document.getElementById("pieChart").getContext("2d");
        destroyChart(pieChart);
        pieChart = new Chart(pieCtx, {
          type: "pie",
          data: {
            labels: ["Active", "Recovered", "Deaths"],
            datasets: [{
              data: [
                globalData.active,
                globalData.recovered,
                globalData.deaths
              ],
              backgroundColor: [
                "rgba(255, 206, 86, 0.6)",
                "rgba(75, 192, 192, 0.6)",
                "rgba(255, 99, 132, 0.6)"
              ],
              borderColor: [
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(255, 99, 132, 1)"
              ],
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false
          }
        });
  
        // 4) Historical trends line chart
        const histRes = await fetch("/historical_data");
        const histData = await histRes.json();
        const days    = Object.keys(histData.cases);
        const casesArr     = Object.values(histData.cases);
        const recoveredArr = Object.values(histData.recovered);
        const deathsArr    = Object.values(histData.deaths);
  
        const lineCtx = document.getElementById("lineChart").getContext("2d");
        destroyChart(lineChart);
        lineChart = new Chart(lineCtx, {
          type: "line",
          data: {
            labels: days,
            datasets: [
              {
                label: "Cases",
                data: casesArr,
                borderColor: "rgba(54, 162, 235, 1)",
                fill: false,
                tension: 0.1
              },
              {
                label: "Recovered",
                data: recoveredArr,
                borderColor: "rgba(75, 192, 192, 1)",
                fill: false,
                tension: 0.1
              },
              {
                label: "Deaths",
                data: deathsArr,
                borderColor: "rgba(255, 99, 132, 1)",
                fill: false,
                tension: 0.1
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: { beginAtZero: true }
            }
          }
        });
  
      } catch (err) {
        console.error("Dashboard error:", err);
      }
    }
  
    // Initial render + auto-refresh
    fetchDataAndRender();
    setInterval(fetchDataAndRender, 60000);
  });
  