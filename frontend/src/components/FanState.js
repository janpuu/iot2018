import React from 'react'

const fanOn = require('../images/fan_on.gif');
const fanOff = require('../images/fan_off.png');

const FanState = ({ latestArray }) => {

    if (latestArray.equipmentstate === 0) {
        return (
            <span>Fan state: <img src={fanOff} width="50" height="50" alt="Fan OFF" style={{ verticalAlign: 'middle', marginLeft: '1em' }} /></span>
        )
    }
    else if (latestArray.equipmentstate === 1) {
        return (
            <span>Fan state: <img src={fanOn} width="50" height="50" alt="Fan ON" style={{ verticalAlign: 'middle', marginLeft: '1em' }} /></span>
        )
    }
    else {
        return (<span></span>)
    }
}

export default FanState