import React from 'react'

const lightOn = require('../images/light_on.png');
const lightOff = require('../images/light_off.png');

const LightState = ({ latestArray }) => {

    if (latestArray.lightstate === 0) {
        return (
            <span>Light state: <img src={lightOff} width="50" height="50" alt="Light OFF" style={{ verticalAlign: 'middle', marginLeft: '1em' }} /></span>
        )
    }
    else if (latestArray.lightstate === 1) {
        return (
            <span>Light state: <img src={lightOn} width="50" height="50" alt="Light ON" style={{ verticalAlign: 'middle', marginLeft: '1em' }} /></span>
        )
    }
    else {
        return (<span></span>)
    }
}

export default LightState