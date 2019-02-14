import React, {Component} from 'react';
import {Bar} from 'react-chartjs-2';
import CurrentService from '../services/CurrentService';

let data = { 
    labels: [],
    datasets: [{
        label: 'People inside', 
        showLine: true,
        backgroundColor: 'rgba(0,150,150,0.4)',
        data: [],
    }], 
};

let chartoptions = { 
	scales: { 
		xAxes: [{ 
			display: false,
			ticks: {
                beginAtZero: true
			}    	
		}], 
		yAxes: [{
			display: true,
			gridLines: {
			    display: true
			},
			ticks: {
                beginAtZero: true,
                precision: 0
			},
		},
    ]},
    tooltips: {
        enabled: true,
        callbacks: {
            title: function() {
                return '';
            }
        }
    }
};

class Chart extends Component {
    constructor(props) {
        super(props);

        this.state = {
            todayList: [],
            refreshToggle: false
        }
    }

    static defaultProps = {
        fontSize: 20
    }

    componentDidMount() {
        this.getChartData(100); // Get data from DB for Chart
        
        // Interval for updating chart by changing state
        this.interval = setInterval(() => {
            let tempBoolean = !this.state.refreshToggle;
            this.setState({ refreshToggle: tempBoolean });
            this.getChartData(100);
        }, 5000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    getChartData(amount) {
        CurrentService
        .getTodayAmount(amount) // limit to x amount of documents
        .then(response => {
            this.setState({ todayList: response })
        })
        .catch((err) => {
            // Handle any error that occurred in any of the previous
            // promises in the chain.
            console.log(err)
        });
    }

	data2datasets(objArray) {
        let peopleInArray = objArray.map(a => a.peoplein);
        // let timeArray = objArray.map(a => a.time);
        data.datasets[0].data = peopleInArray;
        data.labels = peopleInArray; // Further development: change to parsed timeArray
	}

    render() {
        this.data2datasets(this.state.todayList);
        return (
            <p className="chart">
                <Bar data={data} options={chartoptions} />
            </p>
        )
    }
}

export default Chart;