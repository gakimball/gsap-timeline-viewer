/* eslint-env browser */
/* eslint react/no-array-index-key:0 */

import React, {Component} from 'react';
import {render} from 'react-dom';
import {TimelineMax} from 'gsap';
import TimelineViewer from '../src';

class App extends Component {
  state = {}

  componentDidMount() {
    this.setupTimeline();
  }

  setupTimeline() {
    this.setState({
      timeline: new TimelineMax()
        .addLabel('whoosh')
        .fromTo('.word', 1, {scale: 0}, {scale: 1})
        .addLabel('stagger')
        .staggerTo('.letter', 0.25, {y: -10}, 0.1)
        .staggerTo('.letter', 0.25, {y: 10}, 0.1, 0.25)
        .staggerTo('.letter', 0.25, {y: 0}, 0.1, 0.5)
        .addLabel('bye')
        .fromTo('.word', 1, {opacity: 1}, {opacity: 0})
        .timeScale(1 / 3)
    });
  }

  render() {
    const {timeline} = this.state;

    return (
      <div>
        <div className="word">
          {'Everything Is Terrible!'.split('').map((letter, index) =>
            <span className="letter" key={index}>{letter}</span>
          )}
        </div>
        <div className="viewer">
          {timeline && <TimelineViewer timeline={timeline}/>}
        </div>
      </div>
    );
  }
}

render(<App/>, document.getElementById('app'));
