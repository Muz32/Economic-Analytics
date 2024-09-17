async function loadDataAndPlotSunburst() {
    const dbPath = 'weo.sqlite'; // Path to your SQLite database

    try {
        // Fetch the SQLite database as an ArrayBuffer
        const response = await fetch(dbPath);
        const buffer = await response.arrayBuffer();
        
        // Initialize the SQL.js database
        const SQL = await initSqlJs({ locateFile: filename => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.5.0/sql-wasm.wasm` });
        const db = new SQL.Database(new Uint8Array(buffer));

        // Define countries, years, and data types
        const countries = ['Australia', 'China', 'Germany', 'India', 'Japan', 'Korea (South)', 'New Zealand', 'Singapore', 'United Kingdom', 'United States'];
        const years = ['2020', '2021', '2022', '2023', '2024'];
        const dataTypes = {
            'Nominal GDP': 'GDP_at_current_prices',
           
        };

        // Prepare arrays for the sunburst chart
        const labels = [];
        const parents = [];
        const values = [];

        // Loop through each country
        for (const country of countries) {
            let countryTotal = 0;

            // Loop through each year
            for (const year of years) {
                let yearTotal = 0;

                // Loop through each data type
                for (const [label, table] of Object.entries(dataTypes)) {
                    // Query the database for the data
                    const query = `SELECT "${year}" AS value FROM "${table}" WHERE Country = "${country}"`;
                    const stmt = db.prepare(query);

                    if (stmt.step()) {
                        const row = stmt.getAsObject();
                        const value = row.value ? parseFloat(row.value) : 0;

                        // Data Type (e.g., Nominal GDP) as the leaf node
                        const dataLabel = `${country} - ${year} - ${label}`;
                        labels.push(dataLabel);
                        parents.push(`${country} - ${year}`);
                        values.push(value);

                        yearTotal += value;
                    }

                    stmt.free(); // Free the statement after use
                }

                // Year level
                const yearLabel = `${country} - ${year}`;
                labels.push(yearLabel);
                parents.push(country);
                values.push(yearTotal);

                countryTotal += yearTotal;
            }

            // Country level
            labels.push(country);
            parents.push('');
            values.push(countryTotal);
        }

        // Create the sunburst chart
        const data = [{
            type: 'sunburst',
            labels: labels,
            parents: parents,
            values: values,
            outsidetextfont: { size: 20, color: '#377eb8' },
            leaf: { opacity: 0.4 },
            marker: { line: { width: 2 } }
        }];

        // Layout configuration for the sunburst chart
        const layout = {
            title: 'GDP at Current prices 2020 - 2024 (USD B)',
            margin: { l: 0, r: 0, b: 0, t: 50 },
            sunburstcolorway: ['#4B0082','#FFD700',	'#00BFFF', '#DC143C','#00008B', '#FF1493', '#FF8C00', '#006400','#9932CC', '#6495ED', '#6A5ACD']
        };

        // Plot the sunburst chart
        Plotly.newPlot('sunburstChart', data, layout);

    } catch (error) {
        console.error('Error loading or querying database:', error);
    }
}

// Call the function to load data and plot the sunburst chart
loadDataAndPlotSunburst();