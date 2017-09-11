import React from 'react';
const containerStyles = {
  width: '100%',
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}
export default function EnterLocationView(props) {

  let userInput = '';

  function findLocation(event){
    event.preventDefault();
    if (userInput !== ''){
      props.handleLocationSubmit(userInput);
    }
  }

  function setUserInput(text){
    userInput = text.target.value;
  }

  return (
    <div style={containerStyles}>
      <div>
        <h1>Enter Location:</h1>
        <form onSubmit={findLocation}>
          <input type="text" onChange={setUserInput}/>
          <button type="submit">Enter Location</button>
        </form>
      </div>
    </div>
  )
}
