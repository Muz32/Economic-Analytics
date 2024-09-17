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

        if (chartType === 'streamGraph') {
            drawStreamGraph(data);
       
        } else if (chartType === 'spline') {
            drawSplineChart(data);
        }
    }

    // Viridis color scheme
    const viridisColors = ['#440154', '#482878', '#3e4a89', '#31688e', '#26838f', '#1f9d8a', 
                           '#6cce5a', '#b6de2b', '#fee825'];

    // Function to draw stream graph using Highcharts
    function drawStreamGraph(data) {
        const chartTitle = timeSeriesDataTypeSelect.options[timeSeriesDataTypeSelect.selectedIndex].text;


        Highcharts.chart('timeSeriesChart', {
            chart: {
                type: 'streamgraph',
                backgroundColor: 'white'
            },
            colors: viridisColors,
            title: {
                text: chartTitle
            },
            series: data.map((countryData, i) => ({
                name: countryData.country,
                data: countryData.values.map(v => v.value),
                color: viridisColors[i % viridisColors.length]
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
                visible: false
            }
        });
    }

    function drawSplineChart(data) {
        const chartTitle = timeSeriesDataTypeSelect.options[timeSeriesDataTypeSelect.selectedIndex].text;
    
        Highcharts.chart('timeSeriesChart', {
            chart: {
                type: 'spline',
                backgroundColor: 'white'
            },
            colors: viridisColors,
            title: {
                text: chartTitle
            },
            series: data.map((countryData, i) => ({
                name: countryData.country,
                data: countryData.values.map(v => v.value),
                color: viridisColors[i % viridisColors.length],
                marker: {
                    enabled: false  // Disable marker points for each data point
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
                visible: true,  // Ensure yAxis is visible with the 0 line
                plotLines: [{  // Add a dark horizontal line at the 0 mark
                    value: 0,
                    color: 'black',
                    width: 2,
                    zIndex: 5
                }],
                title: { text: 'Value' }  // Optional, can be removed if not needed
            }
        });
    }
    
    
    // Set the default chart type to 'streamGraph' on page load
    timeSeriesChartTypeSelect.value = 'streamGraph';
});
