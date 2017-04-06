import React, {Component, PropTypes} from 'react';
import {TimelineLite} from 'gsap';

export default class Timeline extends Component {
  static propTypes = {
    timeline: PropTypes.instanceOf(TimelineLite).isRequired
  }

  constructor(props) {
    super(props);

    // console.log(props.timeline.getChildren(false));
  }

  getPercentage(time) {
    const start = parseFloat(time);
    const end = parseFloat(this.props.timeline.totalDuration());
    return `${(start / end).toFixed(2) * 100}%`;
  }

  render() {
    const {timeline} = this.props;

    return (
      <div className="timeline">
        {timeline.getChildren(false).map((item, index) => {
          const style = {
            left: this.getPercentage(item.startTime()),
            right: this.getPercentage(timeline.totalDuration() - item.endTime())
          };

          if (item instanceof TimelineLite) {
            // Render timelines
            return (
              <div key={index} className="node node--timeline">
                <div className="node__inner" style={style}>
                  Timeline
                </div>
              </div>
            );
          }

          // Render tweens
          return (
            <div key={index} className="node node--tween">
              <div className="node__inner" style={style}>
                {item._propLookup.reduce((arr, item) =>
                  arr.concat(Object.keys(item))
                , []).join(', ')}
              </div>
            </div>
          );
        })}

        <style jsx>{`
          .node {
            position: relative;
            width: 100%;
            height: 20px;
          }

          .node__inner {
            position: absolute;
            top: 0;
            bottom: 0;
          }

          .node--tween .node__inner {
            background: #afeef0
          }

          .node--timeline .node__inner {
            background: #d5a6b7
          }
        `}</style>
      </div>
    );
  }
}
