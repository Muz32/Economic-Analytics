initSqlJs({
    locateFile: file => 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.5.0/sql-wasm.wasm'
}).then(function (SQL) {
    let db;

    // Load the database 
    fetch('weo.sqlite')
        .then(response => response.arrayBuffer())
        .then(buffer => {
            db = new SQL.Database(new Uint8Array(buffer));
            updateVisualizations();  // Initial call to load the visualizations
        })
        .catch(error => console.error('Error loading database:', error));

    // Select elements
    const timeSeriesDataTypeSelect = document.getElementById('timeSeriesDataType');
    const timeSeriesChartTypeSelect = document.getElementById('timeSeriesChartType');

    // Update visualizations when data type or chart type changes
    timeSeriesDataTypeSelect.addEventListener('change', updateVisualizations);
    timeSeriesChartTypeSelect.addEventListener('change', updateVisualizations);

    // Function to update visualizations based on selected data type
    function updateVisualizations() {
        if (!db) {
            console.error('Database not initialized');
            return;
        }

        const dataType = timeSeriesDataTypeSelect.value;

        // Query the database for time series data
        const countries = [
            'Australia', 'China', 'Japan', 'Korea (South)', 'Taiwan', 'India', 'United States',
            'Singapore', 'New Zealand', 'Thailand', 'United Kingdom', 'Germany'
        ];

        const query = `SELECT Country, "2015", "2016", "2017", "2018", "2019", "2020", "2021", 
                       "2022", "2023", "2024", "2025", "2026", "2027", "2028", "2029" 
                       FROM ${dataType} 
                       WHERE Country IN ('${countries.join("','")}')`;

        const result = db.exec(query)[0];

        if (result) {
            const data = result.values.map(row => ({
                country: row[0],
                values: row.slice(1).map((v, i) => ({ year: 2015 + i, value: parseFloat(v) || 0 }))
            }));

            drawCharts(data);
        } else {
            console.error('No data found for query:', query);
        }
    }

    // Function to draw charts using Highcharts
    function drawCharts(data) {
        const chartType = timeSeriesChartTypeSelect.value;

        if (chartType === 'bar race chart') {
            drawBarRaceChart(data);
        } else if (chartType === 'spline') {
            drawSplineChart(data);
        }
    }

    const distinctColors = ['#4B0082','#FFD700','#8B0000', '#2E8B57', '#00008B', '#FF1493', '#8B4513',  '#556B2F', '#FF8C00', '#9932CC', '#6495ED', '#6A5ACD'];



    function drawSplineChart(data) {
        const chartTitle = timeSeriesDataTypeSelect.options[timeSeriesDataTypeSelect.selectedIndex].text;
    
        Highcharts.chart('timeSeriesChart', {
            chart: {
                type: 'spline',
                backgroundColor: 'white'
            },
            colors: distinctColors,
            title: {
                text: chartTitle
            },
            series: data.map((countryData, i) => ({
                name: countryData.country,
                data: countryData.values.map(v => v.value),
                color: distinctColors[i % distinctColors.length],
                marker: {
                    enabled: true  // Disable marker points for each data point
                }
            })),
            tooltip: {
                formatter: function () {
                    return `<b>${this.series.name}</b><br/>Year: ${this.x}<br/>Value: ${this.y.toFixed(2)}`;
                },
                shared: false,
                valueDecimals: 2
            },
            xAxis: {
                categories: data[0].values.map(v => v.year),
                title: { text: 'Year' }
            },
            yAxis: {
                visible: true,  
                plotLines: [{  // Add a dark horizontal line at the 0 mark
                    value: 0,
                    color: 'black',
                    width: 2,
                    zIndex: 5
                }],
                title: { text: 'Value' }  
            }
        });
    }
    
    function drawBarRaceChart(data) {
        const chartTitle = timeSeriesDataTypeSelect.options[timeSeriesDataTypeSelect.selectedIndex].text;
    
        // Sort data by the first year's value in descending order
        data.sort((a, b) => b.values[0].value - a.values[0].value);
    
        // Initialize the chart
        const chart = Highcharts.chart('timeSeriesChart', {
            chart: {
                type: 'bar',
                animation: {
                    duration: 1000,
                    easing: 'easeOutBounce'
                },
                backgroundColor: 'white'
            },
            title: {
                text: chartTitle
            },
            xAxis: {
                categories: data.map(d => d.country),
                title: {
                    text: null 
                }
            },
            yAxis: {
                title: {
                    text: null
                }
            },
            legend: {
                enabled: false 
            },
            series: [{
                name: 'Year',
                data: data.map(d => d.values[0].value), // Start with the first year
                colorByPoint: true, // Assign distinct colors to each point
                colors: distinctColors.slice(0, data.length) // Use distinct colors
            }],
            plotOptions: {
                series: {
                    animation: {
                        duration: 1000
                    }
                }
            },
            tooltip: {
                formatter: function () {
                    const year = years[yearIndex - 1] || years[0];
                    return `<b>${this.x}</b><br/>${year}: ${this.y.toFixed(2)}`;
                }
            }
        });
    
        let yearIndex = 0;
        const years = data[0].values.map(v => v.year);
    
        function updateChart() {
            if (yearIndex < years.length) {
                const year = years[yearIndex];
                const newData = data.map(d => d.values[yearIndex].value);
    
                // Sort data by the current year's value in descending order
                const sortedData = data.map((d, i) => ({
                    country: d.country,
                    value: newData[i]
                })).sort((a, b) => b.value - a.value);
    
                // Update chart categories and data
                chart.xAxis[0].setCategories(sortedData.map(d => d.country));
                chart.series[0].setData(sortedData.map(d => d.value), true, {
                    duration: 1000,
                    easing: 'easeOutBounce'
                });
    
                chart.setTitle({ text: `${chartTitle} - ${year}` });
    
                yearIndex++;
                setTimeout(updateChart, 2000); // Update every 2 seconds
            }
        }
    
        updateChart();
    }
    
    
    

    // Set the default chart type to 'spline' on page load
    timeSeriesChartTypeSelect.value = 'spline';
});
