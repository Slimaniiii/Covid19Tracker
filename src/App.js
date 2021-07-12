import React, {useState, useEffect} from "react";
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import { sortData } from "./util";
import LineGraph from './LineGraph';
import "leaflet/dist/leaflet.css";


import  {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent
  
} from "@material-ui/core";
import './App.css';


function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState ('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] =useState([]);
  const [mapCenter, setMapCenter] = useState({
    lat: 34.80746, lng: -40.4796
  });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
   
  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
    .then(response => response.json())
    .then(data => {
    setCountryInfo(data);
    });
  }, []);

   useEffect(() => {
   const getCountriesData = async() => {
    await fetch ("https://disease.sh/v3/covid-19/countries").then((response) => response.json())
    .then((data) => {

      const countries = data.map((country) =>(
        {
           name: country.country, //tunisia, algeria etc....
           value: country.countryInfo.iso2 // TN, USA etc.
        }));
        const sortedData = sortData(data);
        setTableData(sortedData);
        setMapCountries(data);
        setCountries(countries);
    });
   };
   getCountriesData();
   }, []);

   const onCountryChange = async (event) => {
     const countryCode = event.target.value;
    

     const url = countryCode === 'worldwide' 
     ? 'https://disease.sh/v3/covid-19/all' :
      `https://disease.sh/v3/covid-19/countries/${countryCode}`;
      await fetch(url)
      .then(response => response.json())
      .then(data =>  {
         setCountry(countryCode);
          setCountryInfo(data);
          setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
          setMapZoom(4);
      });
   };
   console.log("country >>",countryInfo);
 
   
  return (
    <div className="app">

      <div className="app__left">
      <div className="app__header">
      <h1 className="covid__title">COVID-19 TRACKER</h1>
      <FormControl className="app__dropdown">
        <Select variant="outlined" onChange={onCountryChange} value={country}>
        <MenuItem value="worldwide">worldwide</MenuItem>
          {
            countries.map((country) => (
              <MenuItem value={country.value}>{country.name}</MenuItem>
            ))}

      
        </Select>
      </FormControl>
    </div>

    <div className="app__stats">
      <InfoBox title="CoronaVirus Cases" cases={countryInfo.todayCases} total={countryInfo.cases} />

      <InfoBox title="Recovered" cases={countryInfo.todayRecovered} total={countryInfo.recovered} />

      <InfoBox title="Deaths" cases={countryInfo.todayDeaths} total={countryInfo.deaths} />
 
    </div>
    

      <Map 
      countries={mapCountries}
      center={mapCenter}
      zoom={mapZoom}
      
      />

      </div>
       <Card className="app_right">
         <CardContent>
           <h3>Live cases by country</h3>
           <Table  countries={tableData} />

           <h3 className="worldwidenew">Worldwide new cases </h3>

             <LineGraph />

         </CardContent>
       </Card>
      </div>
 
  );
}

export default App;
