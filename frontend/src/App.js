import React from 'react';
import PageBody from './components/PageBody';
import PageFooter from './components/PageFooter';
import CurrentService from './services/CurrentService';
import PersonService from './services/PersonService';

class App extends React.Component {
  constructor() {
    super();
    this.state={
      recentList: [],
      latestArray: [],
      visitorsToday: 0,
      refreshToggle: 0
		}
  }

  componentDidMount() {
    this.getData(100); // Get data from DB

    // Interval for updating webpage by changing state
    this.interval = setInterval(() => {
        let myBoolean = !this.state.refreshToggle;
        this.setState({ refreshToggle: myBoolean });
        this.getData(100); // Get data from DB
    }, 5000); 
  }
  
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getData(amount) {
    CurrentService
      .getLatest()
      .then(response => {
        this.setState({ latestArray: response })
      })
      .catch((err) => {
        // Handle any error that occurred in any of the previous
        // promises in the chain.        
        console.log(err)
      });

    PersonService
      .getVisitorsToday()
      .then(response => {
        this.setState({ visitorsToday: response })
      })
      .catch((err) => {
        // Handle any error that occurred in any of the previous
        // promises in the chain.
        console.log(err)
      });
  }

  render() {
    return (
      <div>
        <PageBody latestArray={this.state.latestArray} visitorsToday={this.state.visitorsToday} />
        <PageFooter />
      </div>
    )
  }
}

export default App