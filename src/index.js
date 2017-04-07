import React, {Component, PropTypes} from 'react';
import {TimelineLite} from 'gsap';
import Label from './label';
import Timeline from './timeline';
import TimeScale from './time-scale';

export default class TimelineViewer extends Component {
  static propTypes = {
    timeline: PropTypes.instanceOf(TimelineLite).isRequired
  }

  static formatTime(time) {
    return parseFloat(time).toFixed(2);
  }

  constructor(props) {
    super(props);

    this.setTimelineState(true);
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.timeline && nextProps.timeline) {
      this.setTimelineState();
    }
  }

  setTimelineState = (initial = false) => {
    const {timeline} = this.props;

    const sliderState = {
      playing: !timeline.paused(),
      reversed: timeline.reversed(),
      currentTime: timeline.totalTime(),
      duration: timeline.totalDuration(),
      labels: timeline.getLabelsArray(),
      timeScale: String(timeline.timeScale())
    };

    if (initial) {
      const coreState = {
        timeScaleVisible: false
      };
      timeline.eventCallback('onUpdate', this.setTimelineState);
      this.state = {...sliderState, ...coreState};
    } else {
      this.setState(sliderState);
    }
  }

  handlePlayButtonClick = () => {
    const {timeline} = this.props;

    if (timeline.paused()) {
      if (timeline.reversed()) {
        timeline.reverse();
      } else {
        timeline.play();
      }
    } else {
      timeline.pause();
      this.setTimelineState();
    }
  }

  handleReverseButtonClick = () => {
    const {timeline} = this.props;

    if (timeline.reversed()) {
      timeline.play();
    } else {
      timeline.reverse();
    }
  }

  handleSliderClick = () => {
    const {timeline} = this.props;

    if (timeline.paused()) {
      this.wasPaused = true;
    } else {
      this.wasPaused = false;
      timeline.pause();
    }
  }

  handleSliderChange = event => {
    this.props.timeline.totalTime(event.target.value);
  }

  handleSliderRelease = () => {
    if (this.wasPaused === false) {
      this.props.timeline.play();
    }
  }

  handleLabelClick = name => {
    this.props.timeline.seek(name);
  }

  handleTimeScaleButton = () => {
    this.setState({
      timeScaleVisible: !this.state.timeScaleVisible
    });
  }

  handleTimeScaleChange = value => {
    this.props.timeline.timeScale(value);
    this.setState({
      timeScale: String(value)
    });
  }

  render() {
    const {formatTime} = this.constructor;
    const {timeline} = this.props;
    const {currentTime, duration, playing, labels, reversed, timeScale, timeScaleVisible} = this.state;

    return (
      <div className="container">
        <div className="strip">
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
            <div>
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
            <div>
              <button type="button" onClick={this.handleTimeScaleButton}>Time Scale: {timeScale}</button>
            </div>
          </div>
        </div>

        {timeScaleVisible && <div className="strip">
          <TimeScale value={timeScale} onChange={this.handleTimeScaleChange}/>
        </div>}

        <style jsx>{`
          .container {
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.25);
          }

          .strip {
            display: flex;
            flex-flow: row nowrap;
            align-items: center;
            padding: 16px;
          }

          .strip:not(:first-child) {
            border-top: 1px solid #ddd;
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
