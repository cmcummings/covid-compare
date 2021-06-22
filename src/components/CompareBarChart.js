import React from 'react'
import { Chart } from 'react-charts'

const stats = {
    confirmed: 'Confirmed Cases',
    recovered: 'Recovered Cases',
    critical: 'Critical Cases',
    deaths: 'Deaths',
}

const CompareBarChart = props => {
    // Set bar graph axes
    const axes = React.useMemo(
        () => [
            { primary: true, type: 'ordinal', position: 'bottom' },
            { type: 'linear', position: 'left' },
        ],
        []
    )

    // Set graph type to bar
    const series = React.useMemo(() => ({ type: 'bar' }), [])

    const data = React.useMemo(
        () => {
            var r = []

            for(let country of props.countries) {
                var countryData = []

                for(let stat in stats) {
                    if(country[stat]) {
                        countryData.push({
                            primary: stats[stat], 
                            secondary: country[stat]
                        })
                    }
                }

                r.push({label: country.country, data: countryData})
            }

            return r
        },
        [props]
    )

    return (
        <div
            style={{
                width: '600px',
                height: '300px',
            }}
        >
            <Chart data={data} axes={axes} series={series} tooltip />
        </div>
    )
}

export default CompareBarChart