// Load SQL.js and initialize the SQLite database
initSqlJs({
    locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.5.0/sql-wasm.wasm`
}).then(function (SQL) {
    let db;

    // Load the database 
    fetch('weo.sqlite')
        .then(response => response.arrayBuffer())
        .then(buffer => {
            db = new SQL.Database(new Uint8Array(buffer));
            updateVisualizations();  // Initial call to load the visualizations
        });

    // Select elements
    const yearSlider = document.getElementById('yearSlider');
    const dataTypeSelect = document.getElementById('dataType');
    const selectedYear = document.getElementById('selectedYear');
    const chartTypeSelect = document.getElementById('chartType');

    // Update year display and redraw charts
    yearSlider.addEventListener('input', function () {
        selectedYear.textContent = this.value;
        updateVisualizations();
    });

    dataTypeSelect.addEventListener('change', updateVisualizations);
    chartTypeSelect.addEventListener('change', updateVisualizations);

    // Function to update visualizations based on selected data type and year
    function updateVisualizations() {
        const year = yearSlider.value;
        const dataType = dataTypeSelect.value;

        // Query the database
        const countries = [
            'Australia', 'China', 'Japan', 'Korea (South)', 'Taiwan', 'India', 'United States',
            'Singapore', 'Vietnam', 'New Zealand', 'Malaysia', 'Indonesia', 'Thailand',
            'Hong Kong', 'Philippines', 'United Kingdom', 'United Arab Emirates', 'Germany', 
            'Canada', 'France', 'Brazil'
        ];

        const query = `SELECT Country, "${year}" AS Value FROM ${dataType} WHERE Country IN ('${countries.join("','")}')`;
        const result = db.exec(query)[0];

        if (result) {
            let data = result.values;

            // Sort data by value in descending order for bar chart
            data = data.sort((a, b) => b[1] - a[1]);

            const countries = data.map(row => row[0]);
            const values = data.map(row => row[1]);

            drawBarChart(countries, values);
            drawRightChart(countries, values);
        }
    }

    // Bar Chart with Plotly (Sorted in Descending Order)
    function drawBarChart(countries, values) {
        const trace = {
            x: countries,
            y: values,
            type: 'bar',
            marker: {
                color: values,
                colorscale: 'Viridis'
            }
        };

        const layout = {
            title: `${dataTypeSelect.options[dataTypeSelect.selectedIndex].text} ${yearSlider.value}`,
            xaxis: { title: '' },
            yaxis: { title: 'Percent' }
        };

        Plotly.newPlot('barChart', [trace], layout);
    }

    // Right Chart (Toggle between Radial Column Chart and Bubble Chart)
    function drawRightChart(countries, values) {
        const chartType = chartTypeSelect.value;

        if (chartType === 'radial') {
            drawRadialColumnChart(countries, values);
        } else if (chartType === 'bubble') {
            drawBubbleChart(countries, values);
        }
    }

    // Bubble Chart with Plotly
    function drawBubbleChart(countries, values) {
        const trace = {
            x: countries,
            y: values,
            mode: 'markers',
            marker: {
                size: values.map(v => v * 7),  // Making the size larger based on the value
                color: values,
                colorscale: 'Viridis'
            }
        };

        const layout = {
            title: `${dataTypeSelect.options[dataTypeSelect.selectedIndex].text} ${yearSlider.value}`,
            xaxis: { title: '' },
            yaxis: { title: 'Percent' }
        };

        Plotly.newPlot('rightChart', [trace], layout);
    }

    // Radial Column Chart with Plotly
    function drawRadialColumnChart(countries, values) {
        const trace = {
            type: 'barpolar',
            r: values,
            theta: countries,
            marker: {
                color: values,
                colorscale: 'Viridis'
            }
        };

        const layout = {
            title: `${dataTypeSelect.options[dataTypeSelect.selectedIndex].text} ${yearSlider.value}`,
            polar: {
                radialaxis: {
                    visible: true,
                    range: [0, Math.max(...values)]
                }
            }
        };

        Plotly.newPlot('rightChart', [trace], layout);
    }
});
