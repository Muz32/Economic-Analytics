// Load SQL.js and initialize the SQLite database
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
            drawChoroplethMap(countries, values);  // Draw the choropleth map
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
            },
            hovertemplate: '%{theta}: %{r}<extra></extra>'  // Custom hover template
            
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

    // Draw Choropleth Map with Plotly

    function drawChoroplethMap(countries, values) {
        // List of all countries
        const allCountries = [
            'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 
            'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 
            'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 
            'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cambodia', 'Cameroon', 'Canada', 'Central African Republic', 'Chad', 
            'Chile', 'China', 'Colombia', 'Comoros', 'Congo (Congo-Brazzaville)', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 
            'Czechia (Czech Republic)', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt', 
            'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini (fmr. "Swaziland")', 'Ethiopia', 'Fiji', 
            'Finland', 'France', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 
            'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 
            'Iraq', 'Ireland', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 
            'Korea (North)', 'Korea (South)', 'Kosovo', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 
            'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 
            'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 
            'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar (formerly Burma)', 'Namibia', 'Nauru', 'Nepal', 
            'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Macedonia (formerly Macedonia)', 'Norway', 
            'Oman', 'Pakistan', 'Palau', 'Palestine State', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 
            'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 
            'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 
            'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 
            'South Africa', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria', 
            'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago', 
            'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 
            'United States of America', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City (Holy See)', 'Venezuela', 
            'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'
        ];
    
        // Create a map of queried countries and their values
        const countryValueMap = {};
        countries.forEach((country, index) => {
            countryValueMap[country] = values[index];
        });
    
        // Prepare data for all countries
        const allValues = allCountries.map(country => countryValueMap[country] !== undefined ? countryValueMap[country] : 0);
    
        // Base map with all countries in grey
        const baseMap = {
            type: 'choropleth',
            locationmode: 'country names',
            locations: allCountries,
            z: allValues.map(value => value === 0 ? 1 : 0),  // Set non-queried countries to 1 (grey)
            text: allCountries,
            colorscale: [
                [0, 'rgb(220, 220, 220)'],  // Grey for non-queried countries
                [1, 'rgb(220, 220, 220)']   // Grey for non-queried countries
            ],
            autocolorscale: false,
            showscale: false,
            marker: {
                line: {
                    color: 'rgb(180,180,180)',
                    width: 0.5
                }
            },
            hoverinfo: 'location'  // Only show country name
        };
    
        // Overlay map with queried countries in Viridis color scale
        const overlayMap = {
            type: 'choropleth',
            locationmode: 'country names',
            locations: countries,
            z: values,
            text: countries,
            colorscale: 'Viridis',
            autocolorscale: false,
            reversescale: false,
            marker: {
                line: {
                    color: 'rgb(180,180,180)',
                    width: 0.5
                }
            },
            colorbar: {
                autotick: false,
                tickprefix: '',
                title: 'Value'
            },
            hoverinfo: 'location+z'  // Show country name and value
        };
    
        const layout = {
            title: `${dataTypeSelect.options[dataTypeSelect.selectedIndex].text} ${yearSlider.value}`,
            geo: {
                showframe: false,
                showcoastlines: false,
                projection: {
                    type: 'equirectangular'
                }
            }
        };
    
        Plotly.newPlot('map', [baseMap, overlayMap], layout);
    }
    
    
});
