import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import { callApi, getIcon, timeOffset, kToF } from "./weather_api.js";

String.prototype.capitalize = function() {
  return this[0].toUpperCase() + this.slice(1);
}

function Location (props) {
  const location = props.location;
  // console.log(location);
  return (
    <div className="text-light card-wrapper">
      {location === undefined &&
        <div></div>
      }
      {location !== undefined &&
        <div className="card text-bg-dark border-light mb-3" style={{ maxWidth: `${25}rem` }}>
          <div className="card-header h2">{location.name}</div>
          <div className="card-body flex-center flex-column">
            <p className="card-text">Longitude: {location.lon}</p>
            <p className="card-text">Latitude: {location.lat}</p>
          </div>
        </div>
      }
    </div>
  );
}

function Conditions (props) {
  const conditions = props.conditions;
  // console.log(conditions);
  return (
    <div className="text-light card-wrapper">
      {conditions === undefined &&
        <div></div>
      }
      {conditions !== undefined &&
        <div className="card text-bg-primary mb-3" style={{ maxWidth: `${25}rem` }}>
          <div className="card-header h2">Weather Conditions</div>
          <div className="card-body flex-center flex-column">
            <img src={getIcon(conditions.icon)} alt="Icon" />
            <p className="card-text">{conditions.description.capitalize()}</p>
            <p className="card-text">Precipitation: {conditions.all}%</p>
          </div>
        </div>
      }
    </div>
  );
}

function Temp (props) {
  const temp = props.temp;
  // console.log(temp);
  return (
    <div className="text-light card-wrapper">
      {temp === undefined &&
        <div></div>
      }
      {temp !== undefined &&
        <div className="card text-bg-danger mb-3" style={{ maxWidth: `${25}rem` }}>
          <div className="card-header h2">Temperature</div>
          <div className="card-body flex-center flex-column">
            {/* <img src={getIcon(temp.icon)} alt="Icon" /> */}
            <p className="card-text">High: {kToF(temp.temp_max)}°F</p>
            <p className="card-text">Low: {kToF(temp.temp_min)}°F</p>
            <p className="card-text">Humidity: {temp.humidity}%</p>
          </div>
        </div>
      }
    </div>
  );
}

function Sun (props) {
  const sun = props.sun;
  // console.log(temp);
  return (
    <div className="text-light card-wrapper">
      {sun === undefined &&
        <div></div>
      }
      {sun !== undefined &&
        <div className="card text-bg-success mb-3" style={{ maxWidth: `${25}rem` }}>
          <div className="card-header h2">Sunrise & Sunset</div>
          <div className="card-body flex-center flex-column">
            {/* <img src={getIcon(sun.icon)} alt="Icon" /> */}
            <p className="card-text">Sunrise: {timeOffset(sun.sunrise)}</p>
            <p className="card-text">Sunset: {timeOffset(sun.sunset)}</p>
          </div>
        </div>
      }
    </div>
  );
}

function App() {

  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");

  const changeCity = (e)=> setCity(e.target.value);
  const changeState = (e)=> setState(e.target.value);
  const changeCountry = (e)=> setCountry(e.target.value);

  const [location, setLocation] = useState(undefined);
  const [conditions, setConditions] = useState(undefined);
  const [temp, setTemp] = useState(undefined);
  const [sun, setSun] = useState(undefined);

  const [loading, setLoading] = useState(false);

  const search = ()=>{
    if (!city) return;
    setLoading(true);
    callApi(
      city,
      state,
      country,
      (json)=>{
        console.log(json);
        setLoading(false);
        (json.coord && json.sys ? setLocation({name: json.name, ...json.coord}) : setLocation(undefined));
        (json.weather && json.clouds ? setConditions({...json.weather[0], ...json.clouds}) : setConditions(undefined));
        (json.main ? setTemp(json.main) : setTemp(undefined));
        (json.sys ? setSun(json.sys) : setTemp(undefined));
      }
    )
  }
  return (
    <div className="App">
      <header className="App-header container pt-5">
        {loading &&
          <div className="spinner-border text-info" role="status" id="loading">
            <span className="visually-hidden">Loading...</span>
          </div>
        }

        <div className="input-group mb-3">
          <span className="input-group-text">City Name <i className="text-danger">*</i></span>
          <input
            type="text"
            className="form-control"
            placeholder="Chicago"
            aria-label="City Name"
            onChange={changeCity}
            value={city}
            />
          <span className="input-group-text">State / Province</span>
          <input
            type="text"
            className="form-control"
            placeholder="Illinois"
            aria-label="State or Province"
            onChange={changeState}
            value={state}
            />
          
          {/* Display none when screen smaller than "medium" */}
          <span className="input-group-text d-none d-lg-flex">Country</span>
          <input
            type="text"
            className="form-control d-none d-lg-flex"
            placeholder="USA"
            aria-label="Country"
            onChange={changeCountry}
            value={country}
            />
          <input type="button" className="form-control btn btn-success d-none d-lg-flex" value="Search" onClick={search} />
        </div>
        <div className="input-group mb-3 d-lg-none d-flex">
          <span className="input-group-text">Country</span>
          <input
            type="text"
            className="form-control"
            placeholder="USA"
            aria-label="Country"
            onChange={changeCountry}
            value={country}
            />
          <input type="button" className="form-control btn btn-success" value="Search" onClick={search} />
        </div>
      </header>
      <main className="container gap-3 gap-md-4 flex-center flex-column py-5">
        <div className="container gap-3 gap-md-4 flex-center flex-column flex-md-row">
          <Location location={location}/>
        </div>
        <div className="container gap-3 gap-md-4 flex-center flex-column flex-md-row">
          <Conditions conditions={conditions}/>
          <Temp temp={temp}/>
        </div>
        <div className="container gap-3 gap-md-4 flex-center flex-column flex-md-row">
          <Sun sun={sun}/>
          {/* <Conditions conditions={conditions}/> */}
        </div>
      </main>
    </div>
  );
}

export default App;
