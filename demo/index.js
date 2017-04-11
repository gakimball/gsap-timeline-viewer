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
        .set('.word', {color: '#834071'})
        .add(() => console.log('Hello!'))
        .addLabel('stagger')
        .staggerTo('.letter', 0.25, {y: -10}, 0.1)
        .staggerTo('.letter', 0.25, {y: 10}, 0.1, 0.25)
        .staggerTo('.letter', 0.25, {y: 0}, 0.1, 0.5)
        .addLabel('bye')
        .set('.word', {color: '#000'})
        .addPause()
        .fromTo('.word', 1, {opacity: 1}, {opacity: 0})
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

        <style jsx global>{`
          html {
            font-family: 'Source Sans Pro';
          }
        `}</style>

        <style jsx>{`
          .word {
            font-size: 64px;
            font-weight: 900;
            text-align: center;
            line-height: 100vh;
          }

          .letter {
            position: relative;
            display: inline-block;
          }

          .viewer {
            position: fixed;
            bottom: 10px;
            left: 12.5%;
            width: 75vw;
          }
        `}</style>
      </div>
    );
  }
}

render(<App/>, document.getElementById('app'));
