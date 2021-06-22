import React from 'react'
import { useEffect, useState } from 'react'
import CompareBarChart from './components/CompareBarChart'

const App = () => {
    /*	List of all countries
        {
            "name": "string",
            "alpha-2-code": "string",
            "alpha-3-code": "string",
            "latitude": 0,
            "longitude": 0
        }
    */
    const [countryList, setCountryList] = useState([])

    /* Selected Country
        {
            "country": "string",
            "confirmed": 0,
            "recovered": 0,
            "critical": 0,
            "deaths": 0,
            "latitude": 0,
            "longitude": 0,
            "lastChange": "2021-06-21T02:58:50.138Z",
            "lastUpdate": "2021-06-21T02:58:50.138Z"
        }
    */
    const [selectedCountries, setSelectedCountries] = useState([])

    useEffect(() => {
        loadCountryList()
        //test()
    }, [])

    const loadCountryList = async () => {
        const response = await fetch("https://covid19-api.com/help/countries?format=json")
        const data = await response.json()
        setCountryList(data)
    }

    const test = async () => {
        const response = await fetch("https://world-population.p.rapidapi.com/allcountriesname", {
            "method": "GET",
            "headers": {
                "x-rapidapi-host": "world-population.p.rapidapi.com"
            }
        })
        const data = await response.json()
        console.log(data)
    }

    const addCountry = async (countryName) => {
        // Fetch country data
        const response = await fetch("https://covid19-api.com/country?name=" + countryName + "&format=json")
        const data = await response.json()
        
        // Add to list
        if (selectedCountries.findIndex((country) => country.country === countryName) < 0) {
            var newCountry = data[0]
            
            setSelectedCountries([...selectedCountries, newCountry]
                .sort((a, b) => {
                    if(a.confirmed > b.confirmed) {
                        return -1
                    } else {
                        return 1
                    }
                })
            )
        }
    }

    const removeCountry = (countryName) => {
        // Create new list without unwanted country
        setSelectedCountries(selectedCountries.filter((country) => country.country !== countryName))
    }

    const clearCountries = () => {
        setSelectedCountries([])
    }

    return (
        <div className="app">
            <h1>COVID-19 Compare</h1>

            <p>Add Country: <select name="country" id="country" onChange={e => { addCountry(e.target.value) }}>
                {countryList.map((country) => <option key={country.name} value={country.name}>{country.name}</option>)}
            </select>
            </p>

            {selectedCountries.length > 0 && <div>
                <button onClick={() => {clearCountries()}}>Clear All Selections</button> 
                <table>
                    <thead>
                        <tr>
                            <th>Country</th>
                            <th>Confirmed Cases</th>
                            <th>Recovered Cases</th>
                            <th>Critical Cases</th>
                            <th>Deaths</th>
                        </tr>
                    </thead>
                    <tbody>
                        {selectedCountries.map((country) => <tr key={country.country}>
                            <td><button className="remove-button" onClick={() => { removeCountry(country.country) }}>X</button> {country.country}</td>
                            <td>{country.confirmed.toLocaleString('en-US')}</td>
                            <td>{country.recovered.toLocaleString('en-US')}</td>
                            <td>{country.critical.toLocaleString('en-US')}</td>
                            <td>{country.deaths.toLocaleString('en-US')}</td>
                        </tr>)}
                    </tbody>
                </table>
                
                <CompareBarChart countries={selectedCountries} />
            </div>}
        </div>
    );
}

export default App;
