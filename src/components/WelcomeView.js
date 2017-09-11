import React from 'react';
const containerStyles = {
  width: '100%',
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}
export default function WelcomeView(props) {
  return (
    <div style={containerStyles}>
      <div>
        <h1>Hello</h1>
        <p>In order to tell you the weather I’m going to need a location.</p>
        <div>
          <button onClick={props.getUserLocation}>Get Location</button>
          <button>Enter Location</button>
        </div>
      </div>
    </div>
  )
}
