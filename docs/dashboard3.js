initSqlJs({
    locateFile: file => 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.5.0/sql-wasm.wasm'
}).then(function (SQL) {
    let db;

    // Load the SQLite database
    fetch('weo.sqlite')
        .then(response => response.arrayBuffer())
        .then(buffer => {
            db = new SQL.Database(new Uint8Array(buffer));
            updateVisualizations(); // Initial call to load the visualizations
        })
        .catch(error => console.error('Error loading database:', error));

    document.getElementById('countrySelect').addEventListener('change', updateVisualizations);
    document.getElementById('chartTypeSlider').addEventListener('input', updateVisualizations);
    document.getElementById('combinationDataType').addEventListener('change', updateVisualizations);

    const labels = {
        'GDP_per_capita_current_prices': 'GDP per capita (USD)',
        'General_government_gross_debt_GDP': 'Gov Gross debt position (% of GDP)',
        'Inflation_rate': 'Inflation rate (%)',
        'Population': 'Population (M)',
        'Real_GDP_growth': 'Real GDP growth (%)',
        'Unemployment_rate': 'Unemployment rate (%)',
        'Gov_Expenditure_GDP': 'Gov Expenditure (% of GDP)',
        'Gov_Revenue_GDP': 'Gov Revenue (% of GDP)',
        'Gov_Gross_debt_position_GDP': 'Gov Gross debt position (% of GDP)'
    };

    function updateVisualizations() {
        const country = document.getElementById('countrySelect').value;
        const datasetType = document.getElementById('combinationDataType').value;
        const chartTypeValue = document.getElementById('chartTypeSlider').value;
        const chartType = chartTypeValue === '1' ? 'line+bar' : 'line';
        document.getElementById('chartTypeLabel').textContent = chartType === 'line+bar' ? 'Line + Bar' : 'Line';
    
        const datasets = {
            'Real GDP growth, Inflation and Unemployment rate': {
                left: ['Inflation_rate', 'Unemployment_rate'],
                right: ['Real_GDP_growth']
            },
            'Government Expenditure, Revenue and Debt': {
                left: ['Gov_Expenditure_GDP', 'Gov_Revenue_GDP'],
                right: ['Gov_Gross_debt_position_GDP']
            },
            'Population and GDP per capita': {
                left: ['Population'],
                right: ['GDP_per_capita_current_prices']
            }
        };
    
        const selectedDataset = datasets[datasetType];
    
        const leftSeries = selectedDataset.left.map(variable => ({
            name: labels[variable],
            data: getData(variable, country),
            type: 'line',
            zIndex: 2 
        }));
    
        const rightSeries = selectedDataset.right.map(variable => ({
            name: labels[variable],
            data: getData(variable, country),
            yAxis: 1,
            type: chartType === 'line+bar' ? 'column' : 'line',
            zIndex: chartType === 'line+bar' ? 1 : 2 
        }));
    
        renderChart('combinationChart', leftSeries, rightSeries, datasetType);
    }

    function getData(variable, country) {
        const stmt = db.prepare(`SELECT * FROM ${variable} WHERE Country = ?`);
        stmt.bind([country]);
        const data = [];
        while (stmt.step()) {
            const row = stmt.getAsObject();
            for (let year = 2015; year <= 2029; year++) {
                data.push([year, parseFloat(row[year])]);
            }
        }
        stmt.free();
        return data;
    }

    function renderChart(container, leftSeries, rightSeries, datasetType) {
        const country = document.getElementById('countrySelect').value;
        Highcharts.chart(container, {
            chart: {
                zoomType: 'xy'
            },
            title: {
                text: `${datasetType} for ${country}`
            },
            xAxis: {
                categories: Array.from({ length: 15 }, (_, i) => 2015 + i)
            },
            yAxis: [{
                title: {
                    text: leftSeries.map(series => series.name).join(', ')
                }
            }, {
                title: {
                    text: rightSeries.map(series => series.name).join(', ')
                },
                opposite: true
            }],
            series: [...leftSeries, ...rightSeries]
        });
    }
    
});
