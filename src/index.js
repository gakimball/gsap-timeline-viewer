import React, {Component, PropTypes} from 'react';
import {TimelineLite} from 'gsap';
import Label from './label';
import Timeline from './timeline';

export default class TimelineViewer extends Component {
  static propTypes = {
    timeline: PropTypes.instanceOf(TimelineLite).isRequired
  }

  static formatTime(time) {
    return parseFloat(time).toFixed(2);
  }

  constructor(props) {
    super(props);

    this.state = {
      playing: false,
      reversed: false,
      currentTime: 0,
      duration: 1,
      labels: []
    };

    if (props.timeline) {
      console.log(props.timeline);
      this.setupTimeline(true);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.timeline && nextProps.timeline) {
      this.setupTimeline();
    }
  }

  setupTimeline(initial = false) {
    const {timeline} = this.props;
    timeline.eventCallback('onUpdate', this.updateSlider);

    const nextState = {
      playing: !timeline.paused(),
      reversed: this.props.timeline.reversed(),
      currentTime: timeline.totalTime(),
      duration: timeline.totalDuration(),
      labels: timeline.getLabelsArray()
    };

    if (initial) {
      this.state = {...nextState};
    } else {
      this.setState(nextState);
    }
  }

  play() {
    this.props.timeline.play();
    this.updateButtons();
  }

  pause() {
    this.props.timeline.pause();
    this.updateButtons();
  }

  handlePlayButtonClick = () => {
    const {timeline} = this.props;

    if (timeline.paused()) {
      this.play();
    } else {
      this.pause();
    }
  }

  handleReverseButtonClick = () => {
    const {timeline} = this.props;

    if (timeline.reversed()) {
      timeline.play();
    } else {
      timeline.reverse();
    }

    this.updateButtons();
  }

  handleSliderClick = () => {
    const {timeline} = this.props;

    if (timeline.paused()) {
      this.wasPaused = true;
    } else {
      this.wasPaused = false;
      this.pause();
    }
  }

  handleSliderChange = event => {
    this.props.timeline.totalTime(event.target.value);
    this.updateSlider();
  }

  handleSliderRelease = () => {
    if (this.wasPaused === false) {
      this.play();
    }
  }

  handleLabelClick = name => {
    this.props.timeline.seek(name);

    if (this.props.timeline.paused()) {
      this.updateSlider();
    }
  }

  updateButtons() {
    this.setState({
      playing: !this.props.timeline.paused(),
      reversed: this.props.timeline.reversed()
    });
  }

  updateSlider = () => {
    this.setState({
      currentTime: this.props.timeline.totalTime()
    });
  }

  render() {
    const {formatTime} = this.constructor;
    const {timeline} = this.props;
    const {currentTime, duration, playing, labels, reversed} = this.state;

    return (
      <div className="container">
        <div className="controls">
          <button className="button" onClick={this.handlePlayButtonClick}>
            {playing ? 'Pause' : 'Play'}
          </button>
          <button className="button" onClick={this.handleReverseButtonClick}>
            {reversed ? 'Unreverse' : 'Reverse'}
          </button>
        </div>
        <div className="timeline">
          <Timeline timeline={timeline}/>
          <input
            className="slider"
            type="range"
            value={currentTime}
            min="0"
            max={duration}
            step="0.1"
            onMouseDown={this.handleSliderClick}
            onChange={this.handleSliderChange}
            onMouseUp={this.handleSliderRelease}
            />
          <div className="labels">
            {labels.map(({name, time}) =>
              <Label key={name} name={name} time={time} duration={duration} onClick={this.handleLabelClick}/>
            )}
          </div>
        </div>
        <div className="time">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>

        <style jsx>{`
          .container {
            display: flex;
            flex-flow: row nowrap;
            align-items: center;
            padding: 16px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.25);
          }

          .timeline {
            position: relative;
            flex: 1 1 0px;
            display: flex;
            flex-flow: column nowrap;
          }

          .controls {
            flex: 0 0 10%;
            display: flex;
            flex-flow: column nowrap;
            align-items: center;
            justify-content: space-between;
            margin-right: 10px;
          }

          .slider {
            width: 100%;
            cursor: pointer;
          }

          .time {
            flex: 0 0 18%;
            text-align: center;
          }

          .labels {
            position: absolute;
            left: 0;
            bottom: 100%;
            width: 100%;
          }
        `}</style>
      </div>
    );
  }
}
