import React, { Component } from 'react';
import WelcomeView from './components/WelcomeView';
import LoadingView from './components/LoadingView';
import WeatherView from './components/WeatherView';
import EnterLocationView from './components/EnterLocationView';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentView: {
        startView: true,
        enterLocationView: false,
        displayWeatherView: false,
        loadingView: false,
        errorView : false,
      },
      location: {},
      weatherData: {},
      forecast: {}
    };
  }

  getUserLocationByGeolocation = () => {
    let setPosition = (locationData) => {
      this.setState((prevState) => {
        prevState.location.latitude = locationData.coords.latitude;
        prevState.location.longitude = locationData.coords.longitude;
        return prevState;
      }, this.getWeatherFromLatLng);
    };

    if (navigator.geolocation) {
        this.setState((prevState) => {
          for (var prop in prevState.currentView) {
            prevState.currentView[prop] = false;
          }
          prevState.currentView.loadingView = true;
          return prevState;
        });
        navigator.geolocation.getCurrentPosition(setPosition);
    } else {
        console.error('no geo location');
    }
  };

  buildUserSearchScreen = () => {
    this.setState((prevState) => {
      for (var prop in prevState.currentView) {
        prevState.currentView[prop] = false;
      }
      prevState.currentView.enterLocationView = true;
      return prevState;
    })
  };

  getLocationByGoogleAPI = (input) => {
    this.setState((prevState) => {
      for (var prop in prevState.currentView) {
        prevState.currentView[prop] = false;
      }
      prevState.currentView.loadingView = true;
      return prevState;
    }, () => {
      fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${input}`)
      .then(
        (data) => data.json()
      ).then(
        (data) => {
          this.setState((prevState) => {
            prevState.location.latitude = data.results[0].geometry.location.lat;
            prevState.location.longitude = data.results[0].geometry.location.lng;
            return prevState;
          }, this.getWeatherFromLatLng);
        }
      ).catch((e) => {
        console.log(e);
        this.setState((prevState) => {
          return {currentView: {errorView: true}};
        })
      });
    });
  };

  getWeatherFromLatLng = () => {
    const requestString = `//api.openweathermap.org/data/2.5/weather?APPID=12a5b5760c644c0607d2fc6c74802e1c&units=imperial&lat=${this.state.location.latitude}&lon=${this.state.location.longitude}`;

    fetch(requestString).then(
      (data) => { return data.json()}
    ).then((data) => {
      if (data) {
        this.setState((prevState)=>{
          prevState.weatherData = data;
          return prevState;
        }, ()=>{
          this.getCityFromLatLong();
        });
      }
    }).catch((e) => {
      console.log(e);
      this.setState((prevState) => {
        return {currentView: {errorView: true}};
      })
    });
  };

  getCityFromLatLong = () => {
    const requestString = `//maps.googleapis.com/maps/api/geocode/json?latlng=${this.state.location.latitude},${this.state.location.longitude}&sensor=true`;

    fetch(requestString).then(
      (data) => data.json()
    ).then((data) => {
      if (data.results[9].formatted_address) {
        this.setState((prevState)=> {
          prevState.location.cityAndCountry = data.results[9].formatted_address;
          console.log(prevState);
          return prevState;
        }, this.getForecastFromLatLong);
      }
    }).catch((e) => {
      console.log(e);
      this.setState((prevState) => {
        return {currentView: {errorView: true}};
      });
    });
  }

  getForecastFromLatLong = () => {
    const requestString = `//api.openweathermap.org/data/2.5/forecast?lat=${this.state.location.latitude}&lon=${this.state.location.longitude}&APPID=12a5b5760c644c0607d2fc6c74802e1c&units=imperial`;

    fetch(requestString).then((data) => {
      return data.json();
    }).then((data) => {
      if (data) {
        this.setState((prevState) => {
          prevState.forecast = data;
          for (var prop in prevState.currentView) {
            prevState.currentView[prop] = false;
          }
          prevState.currentView.displayWeatherView = true;
          return prevState;
        })
      }
    }).catch((e) => {
      console.log(e);
      this.setState((prevState) => {
        return {currentView: {errorView: true}};
      })
    });
  };

  render() {
    if (this.state.currentView.startView) {
      return (
        <WelcomeView
          getUserLocation={this.getUserLocationByGeolocation}
          buildUserSearchScreen={this.buildUserSearchScreen}
        />
      );
    } else if (this.state.currentView.enterLocationView) {
      return (
          <EnterLocationView
            handleLocationSubmit={this.getLocationByGoogleAPI}
            handleGetUserLocation={this.getUserLocationByGeolocation}
          />
      )
    } else if (this.state.currentView.loadingView) {
      return (
        <LoadingView />
      );
    } else if (this.state.currentView.displayWeatherView) {
      return (
        <WeatherView
          handleSearchNewLocation={this.buildUserSearchScreen}
          weather={this.state.weatherData}
          forecast={this.state.forecast}
          location={this.state.location.cityAndCountry}
        />
      );
    } else if (this.state.currentView.errorView) {
      return (
        <div>
          <h1 style={{position: 'absolute', textAlign: 'center', width: '100%'}}>Error Please Try Again</h1>
          <EnterLocationView
            handleLocationSubmit={this.getLocationByGoogleAPI}
            handleGetUserLocation={this.getUserLocationByGeolocation}
          />
        </div>
      );
    }
  }
}
