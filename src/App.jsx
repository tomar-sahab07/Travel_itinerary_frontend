import React, { useState } from 'react';
import axios from 'axios';
import './App.css';


const App = () => {
  const [destination, setDestination] = useState('');
  const [location, setLocation] = useState('');
  const [budget, setBudget] = useState('');
  const [days, setDays] = useState('');
  const [itinerary, setItinerary] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    const data = `Hi Gemini, I need help planning a ${days}-day travel itinerary. My destination is ${destination}, and I’ll be departing from ${location} with a budget of ${budget}. Can you provide a detailed, day-wise itinerary that includes recommendations for accommodations, activities, dining, and transportation, ensuring everything fits within the budget and duration? Please structure the response using the following JSON schema: [Insert Schema Here].`;
    try {
      const response = await axios.post('https://travel-itinerary-backend-6gzc.onrender.com', {
        data,
      });
       // Parse the JSON data if necessary
       let jsonData;
       console.log(response.data);
       if (typeof response.data === 'string') {
         try {
           jsonData = JSON.parse(response.data);
         } catch (e) {
           console.error('Failed to parse JSON:', e);
           setError('Error parsing itinerary data.');
           return;
         }
       } else {
         jsonData = response.data;
       }
 
       // Log parsed JSON data
       console.log('Parsed JSON data:', jsonData);
       // Set the data state

       
       
       localStorage.setItem('itineraryData', JSON.stringify(jsonData));
       const savedData = localStorage.getItem('itineraryData');
       const store = savedData ? JSON.parse(savedData) : null;
       setItinerary(jsonData);
       console.log(itinerary);
      setError(null);
    } catch (err) {
      setError('Error fetching itinerary. Please try again.');
      setItinerary(null);
    }
    
  };

  return (
    <div>
      <h1>Travel Itinerary Planner</h1>
      <div>
        <label>Destination: </label>
        <input
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />
      </div>
      <div>
        <label>Location: </label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>
      <div>
        <label>Budget: </label>
        <input
          type="text"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
        />
      </div>
      <div>
        <label>Days: </label>
        <input
          type="number"
          value={days}
          onChange={(e) => setDays(e.target.value)}
        />
      </div>
      <button onClick={handleSubmit}>Generate Itinerary</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {itinerary && <ItineraryDisplay data={itinerary}/>}
    </div>
  );
};


const ItineraryDisplay = ({ data }) => {
  
  const { itinerary = {}, budget = {}, notes = {} } = data || {};
  // Extract days from itinerary
  const days = itinerary?.days || {};


    return (
      <div>
        <h2>Itinerary</h2>
        {itinerary.length > 0 ? (
          itinerary.map((item, index) => (
            <div key={index}>
              <h3>Day {item.day}</h3>
              <div><strong>Accommodation:</strong> {item.accommodation}</div>
              <div>
                <strong>Activities:</strong>
                <ul>
                  {item.activities.map((activity, idx) => (
                    <li key={idx}>{activity}</li>
                  ))}
                </ul>
              </div>
              <div>
                <strong>Dining:</strong>
                <ul>
                  {item.dining.map((place, idx) => (
                    <li key={idx}>{place}</li>
                  ))}
                </ul>
              </div>
              <div>
                <strong>Transportation:</strong>
                <ul>
                  {item.transportation.map((transport, idx) => (
                    <li key={idx}>{transport}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))
        ) : (
          <p>No itinerary available.</p>
        )}
  
        <h2>Budget</h2>
        {Object.keys(budget).length > 0 ? (
          <ul>
            <li><strong>Accommodation:</strong> {budget.accommodation}</li>
            <li><strong>Food:</strong> {budget.food}</li>
            <li><strong>Transportation:</strong> {budget.transportation}</li>
            <li><strong>Activities:</strong> {budget.activities}</li>
          </ul>
        ) : (
          <p>No budget information available.</p>
        )}
  
        <h2>Notes</h2>
        {Object.keys(notes).length > 0 ? (
          <ul>
            <li><strong>Flights:</strong> {notes.flights}</li>
            <li><strong>Visa:</strong> {notes.visa}</li>
            <li><strong>Currency:</strong> {notes.currency}</li>
          </ul>
        ) : (
          <p>No notes available.</p>
        )}
      </div>
    );
};


export default App;
