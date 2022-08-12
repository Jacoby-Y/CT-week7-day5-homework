const api_key = "769145eb9a1107de33b41730696c51c5";

const buildUrl = (query)=> `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${api_key}`;

export const callApi = async (city, state, country, callback=(json={})=>{})=>{
    const query = city + (state ? "," + state : "") + (country ? "," + country : "");

    const response = await fetch(buildUrl(query));
    // console.log(response);
    const json = await response.json();
    // console.log(json);
    callback(json);
}

export const getIcon = icon => `http://openweathermap.org/img/wn/${icon}@2x.png`;

export const timeOffset = (seconds)=>{
    const offset = Math.round((seconds - Math.round(Date.now()/1000))/60/60 *10)/10;
    if (offset < 0) {
        return `${Math.abs(offset)} hours ago`;
    }
    return `In ${offset} hours`;
}

export const kToF = (kel)=> Math.round((kel - 273.15) * 9/5 + 32)