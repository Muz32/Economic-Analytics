# Economic Analysis of Australia and its Major Trading Partners

![Web Page Preview](./images/map%20of%20trading%20partners.png)

# Project Overview

This project aims to analyse key economic trends of Australia and its major trading partners through a series of interactive dashboards. These dashboards present complex economic data in a meaningful and visually appealing manner using various charting methods. The platform provides an engaging and immersive experience, allowing users to gain valuable insights from the data. Users have control over how they visualise the data, rather than being limited to pre-plotted charts.

## Key Features

- **Interactive Dashboards**: Users can interact with the data through various charting methods, enhancing their understanding and engagement.
- **Customisable Visualisations**: Users can choose how they want to visualise the data, providing a personalised experience.
- **Robust Data Handling**: The dashboard is powered by JavaScript and an SQLite backend database, ensuring efficient data retrieval and visualisation.

## Economic Indicators Visualised

The dashboard visualises a range of key economic indicators, including:
- GDP at Current Prices
- GDP per Capita
- Real GDP Growth
- Inflation Rate
- Unemployment Rate
- Government Expenditure
- Government Revenue
- Government Gross Debt Position
- Current Account Balance
- Population

## Major Trading Partners Analysed

The project analyses data from Australia's major trading partners, including:
- China
- Japan
- South Korea
- India
- Singapore
- Germany
- New Zealand
- United Kingdom
- United States



## GitHub Deployment

The project is deployed on GitHub Pages, making it easy for you to start interacting with the dashboard right away. This deployment ensures that the latest version of the project is always accessible online, providing a seamless and interactive experience.

To explore the Economic Analytics Interactive Dashboard, please click the following link: [Economic Analytics Interactive Dashboard](https://muz32.github.io/Economic-Analytics)

Feel free to navigate through the various sections and visualisations to gain insights into the economic trends of Australia and its major trading partners.

## Tools Used
- **Python**: Converting XLS files to an SQLite database
- **JavaScript**: For interactive elements and functionality
- **HTML/CSS**: For structuring and styling the dashboard
- **Bootstrap**: For responsive design and layout
- **GitHub Pages**: For deploying the project
- **Plotly.js**: For creating interactive visualisations
- **Highcharts.js**: For advanced charting options
- **SQL.js**: For client-side database management

## Interacting with the Project

The dashboard is divided into four different sections, each showcasing data in various visual formats.

### 1. Economic Outlook

This section allows you to analyse the economic outlook based on selected data types, years, and chart types. It provides four different visualisations: a map, a bar chart, a radial column chart, and an option to flip the radial column chart to a bubble chart. You can begin by:

1. **Selecting the Data Type**: Use the menu bar to choose from the following options:
   - Real GDP Growth (%)
   - Inflation Rate (%)
   - Unemployment Rate (%)
   - Government Gross Debt (% of GDP)
   - GDP per Capita (Current Prices USD)
   - Current Account Balance (USD B)
   - Population (M)

2. **Choosing a Year**: Click and drag the dot on the year slider to select a year between 2015 and 2029. Hovering over coloured countries on the map will reveal relevant data for that country. Note that greyed-out countries do not have data, and only preselected major trading partners of Australia are highlighted. The colour scale bar on the right indicates the data values, with darker colours representing lower values and lighter colours representing higher values.

3. **Viewing Additional Charts**: Scroll down to see a bar chart and a radial column chart displaying the same data. For convenience, you can drag the menu bar closer to the charts by clicking the lock icon. After clicking the lock icon, an unlock icon will appear, allowing you to drag the menu bar to a suitable position. Make selections for the data type and year to see how the visualisations appear on the bar chart and radial column chart.

4. **Flipping the Radial Column Chart**: Use the chart type drop-down menu to flip the radial column chart to a bubble chart for a different perspective on the data.

The colour scale of countries in all charts in this section is synchronised, allowing you to easily compare the same country data across different charts.

### 2. Time Series Plots

This section allows you to plot similar data from the first section using time series charts. Up to 11 countries' data, spanning from 2015 to projected data from 2024 to 2029, can be plotted in a spline chart and a bar race chart.

1. **Spline Chart**: The spline charts smoothly emphasise trends over time, with each line represented by a different colour. Hovering over a line highlights the corresponding country and displays a tooltip with relevant data. You can also click on the country legends at the bottom of the chart to add or remove countries from the view.

2. **Bar Race Chart**: Transform the time series plot into a bar race chart by selecting the Bar Race option. This dynamic chart visually demonstrates how data evolves over time, with the animation taking approximately 30 seconds to complete.

### 3. Combination Charts

In this section, you can visualise up to three types of data in a single chart using dual Y-axis charts comprising line and bar combination charts.

1. **Choosing Data Types**: Begin by selecting a country and then choose a data type from the drop-down menu, which includes:
   - **Economic Indicators**: Inflation rate, unemployment rate, and real GDP growth. This combination helps assess whether a country is experiencing stagflation (high inflation, high unemployment, and slow economic growth).
   - **Fiscal Position**: Government expenditure, revenue, and gross debt as a percentage of GDP. This combination helps evaluate a government's fiscal position.
   - **Population and GDP per Capita**: Compares population numbers with GDP output per person, helping to evaluate average incomes and living standards.

2. **Flipping the Chart Type**: The data represented on the right Y-axis can be switched to a bar chart for better visual comparison. This can be done by dragging the slider beside the select chart type to a line + bar chart.

3. **Using Legends**: Click on the legends at the bottom to add or remove a data set.


### 4. Sunburst Chart

The sunburst chart is highly interactive and summarises GDP at current prices (in USD B) for a list of countries from 2020 to 2024. To interact with the chart:

1. **Selecting Data**: Click on a particular country, then click on a chosen year to unveil the data.
2. **Navigating Hierarchies**: Click on the middle circle to move back a hierarchy. You can select a different year or click the middle circle again to navigate back to country selections.

## Data Source

The data for this project is sourced from the International Monetary Fund (IMF): [IMF Data Mapper](https://www.imf.org/external/datamapper/datasets)

## Folders and Files

### Economic Analytics (Root Directory)
- **images**
   - `map of trading partners`
- **docs**
  - `index.html`
  - `styles.css`
  - `dashboard1.js`
  - `dashboard2.js`
  - `dashboard3.js`
  - `dashboard4.js`
  - `draggable.js`
  - `weo.sqlite`
  - **data**
    - `Unemployment rate (%).xls`
    - `Current account balance (% of GDP).xls`
    - `Current account balance (USD Billions).xls`
    - `GDP at current prices (USD Billions).xls`
    - `GDP per capita current prices (USD).xls`
    - `General government gross debt (% of GDP).xls`
    - `General Government net lending and borrowing (% of GDP).xls`
    - `Inflation rate, end of period consumer prices (Annual percent change).xls`
    - `Population (millions of people).xls`
    - `Real GDP Growth (%).xls`
    - `Script for database creation and loading.py`

