import React from "react";
import numeral from "numeral";
import {Circle, Popup} from "react-leaflet";


const casesTypeColors = {

    cases:{
        hex:"#CC1034",
       
        multiplier:200, //size of the circles
    },
    recovered:{
        hex:"#7dd71d",
       
        multiplier: 300, //size of the circles

    },

    deaths: {
        hex: "#fb4443",
    
        multiplier: 500, //size of the circles
    },
};


export const sortData = (data) => {
    const sortedData = [...data];
    sortedData.sort((a, b) => {
        if (a.cases >b.cases) {
              return -1;
              /*  return: -1 means also return false*/
        } else {
            return 1;
            /*  return 1 means also return true*/
        }
    })
    return sortedData;
}

//draw circles on the map with interactive tooltip

export const showDataOnMap = (data, casesType="cases") => (
data.map((country)=> (

    <Circle
    center={[country.countryInfo.lat, country.countryInfo.long]}
    fillOpacity={0.4}
    color={casesTypeColors[casesType].hex}
    fillcolor={casesTypeColors[casesType].hex}

     radius={ 
         Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier
     }
    
    
    >
        <Popup>
        <div className="info-container">
          <div
            className="info-flag"
            style={{ backgroundImage: `url(${country.countryInfo.flag})` }}
          ></div>
          <div className="info-name">{country.country}</div>
          <div className="info-confirmed">
            Cases: {numeral(country.cases).format("0,0")}
          </div>
          <div className="info-recovered">
            Recovered: {numeral(country.recovered).format("0,0")}
          </div>
          <div className="info-deaths">
            Deaths: {numeral(country.deaths).format("0,0")}
          </div>
        </div>
                   



        </Popup>

    </Circle>




))
);