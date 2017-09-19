import nearEathObjects from '../fixtures/sample-neo'

export function fetchAsteroids(){

  // fetch(`${this.state.apiUrl}?start_date=${this.state.startDate}&api_key=${this.state.apiKey}`).then((rawResponse)=>{
  //   return rawResponse.json()
  // }).then((parsedResponse) => {
  let neoData = nearEathObjects.near_earth_objects
  let newAsteroids = []
  Object.keys(neoData).forEach((date)=>{
    neoData[date].forEach((asteroid) =>{
      newAsteroids.push({
        id: asteroid.neo_reference_id,
        name: asteroid.name,
        date: asteroid.close_approach_data[0].close_approach_date,
        diameterMin: asteroid.estimated_diameter.feet.estimated_diameter_min.toFixed(0),
        diameterMax: asteroid.estimated_diameter.feet.estimated_diameter_max.toFixed(0),
        closestApproach: asteroid.close_approach_data[0].miss_distance.miles,
        velocity: parseFloat(asteroid.close_approach_data[0].relative_velocity.miles_per_hour).toFixed(0),
        distance: asteroid.close_approach_data[0].miss_distance.miles
      })
    })
  })

  return {
    type: 'FETCHED_ASTEROIDS',
    payload: newAsteroids
  }
}
