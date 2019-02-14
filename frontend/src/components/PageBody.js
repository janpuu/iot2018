import React from 'react'
import Visitor from './Visitor';
import FanState from './FanState';
import LightState from './LightState';
import PageBanner from './PageBanner';
import PageChart from './PageChart';

const PageBody = ({ latestArray, visitorsToday }) => {
  return (
    <div>
  {/*
	Ion by TEMPLATED
	templated.co @templatedco
	Released for free under the Creative Commons Attribution 3.0 license (templated.co/license)
  */}
      {/* Banner */}
      <PageBanner />
      <section id="two" className="wrapper style2">
        <header className="major">
          <h2>People inside: {latestArray.peoplein} </h2>
          <p>Visitors today: {visitorsToday} </p>
          <p></p>
        </header>
        <div className="container">
          <div className="row">
            <div className="6u">
              <section className="special">
                <h3>Visitors yesterday: <Visitor latestArray={latestArray} /></h3>
                <p><LightState latestArray={latestArray} /> </p>
                <p><FanState latestArray={latestArray} /> </p>
                {/* <ul className="actions">
                    <li><a href="#" className="button alt">Link button</a></li>
                  </ul> */}
              </section>
            </div>
            {/* Chart area */}
            <PageChart />
          </div>
        </div>
      </section>
    </div>
  )
}

export default PageBody