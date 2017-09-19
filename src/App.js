import React, { Component } from 'react';
import {
  PageHeader,
  Table
} from 'react-bootstrap'
import {connect} from 'react-redux'
import {fetchAsteroids} from './actions/asteroidsActions'

const mapComponentToProps = (store) =>{
  return {
    asteroids: store.asteroids.all
  }
}

export default connect(mapComponentToProps)(
  class App extends Component {
    constructor(props){
      super(props)
      let today = new Date()
      this.state = {
        apiKey: "NT8V130OXGjNIRbuEbvygKwFipek7WxYXI8nn1o9",
        startDate: `${today.getFullYear()}-${today.getMonth() +1}-${today.getDate()}`,
        apiUrl: "https://api.nasa.gov/neo/rest/v1/feed",
        asteroids: []
      }
    }
    componentWillMount(){
      this.props.dispatch(fetchAsteroids())
    }

    render() {
      return (
        <div className="App">
          <div className="container" >
            <PageHeader>
              <img src="./images/asteroid.png" alt="meteor" />
              Duck, Duck, Meteor!
            </PageHeader>
            <h4>Hello Cosmonaut on the Spaceship Earth.  Are you concerned about all the Near Earth Objects whizzing past your loneljy planet spaceship?  Think there may be an imminent collision about to happen?  Fortunatly, there are hard working scientists at NASA monitoring the skies for just such events, and we're going to provide all of that information to you right here, right now.  This information is real time, so if you see any space rocks that are less than about 238,900 miles from earth (the distance to the moon) you may want to take cover, or at least wear a helmet.
            </h4>

            <h2>List of the closest Meteors to Earth</h2>
            <Table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Estimated Diameter (feet)</th>
                  <th>Date of Closest Approach</th>
                  <th>Distance (miles)</th>
                  <th>Velocity (miles/hour)</th>
                </tr>
              </thead>
              <tbody>
                {this.props.asteroids.map((asteroid) => {
                  return(
                    <tr key={asteroid.id}>
                      <td>{asteroid.name}</td>
                      <td>{asteroid.diameterMin} - {asteroid.diameterMax}</td>
                      <td>{asteroid.date}</td>
                      <td>{asteroid.distance}</td>
                      <td>{asteroid.velocity}</td>
                    </tr>
                  )
                })}
              </tbody>
            </Table>
          </div>
        </div>
      );
    }
  }
)
