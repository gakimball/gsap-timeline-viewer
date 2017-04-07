import React, {Component, PropTypes} from 'react';
import {TimelineLite} from 'gsap';

export default class Timeline extends Component {
  static propTypes = {
    collapsed: PropTypes.bool,
    timeline: PropTypes.instanceOf(TimelineLite).isRequired
  }

  static defaultProps = {
    collapsed: false
  }

  static organizeTimeline(timeline) {
    const items = timeline.getChildren(false);
    const rows = [];
    const freeRow = item => {
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        let freeSpace = true;

        for (let i = 0; i < row.items.length; i++) {
          const segment = row.items[i];
          const itemStart = item.startTime();
          const itemEnd = item.endTime();
          const segmentStart = segment.startTime();
          const segmentEnd = segment.endTime();

          if (itemStart >= segmentStart && itemStart <= segmentEnd) {
            freeSpace = false;
          } else if (itemEnd >= segmentStart && itemEnd <= segmentEnd) {
            freeSpace = false;
          }
        }

        if (freeSpace) {
          return i;
        }
      }

      return -1;
    };
    const addRow = segment => rows.push({
      line: rows.length,
      items: [segment]
    });

    for (const item of items) {
      if (rows.length === 0) {
        addRow(item);
      } else {
        const index = freeRow(item);
        if (index > -1) {
          rows[index].items.push(item);
        } else {
          addRow(item);
        }
      }
    }

    return rows;
  }

  static getNestedTimelines(timeline) {
    return timeline.getChildren(false, false).map(() => false);
  }

  constructor(props) {
    super(props);

    this.state = {
      rows: this.constructor.organizeTimeline(props.timeline),
      nestedTimelines: this.constructor.getNestedTimelines(props.timeline)
    };
  }

  getPercentage(time) {
    const start = parseFloat(time);
    const end = parseFloat(this.props.timeline.totalDuration());
    return `${(start / end).toFixed(2) * 100}%`;
  }

  showTimeline(index) {
    const nestedTimelines = [...this.state.nestedTimelines];
    nestedTimelines[index] = true;

    this.setState({nestedTimelines});
  }

  render() {
    const {collapsed, timeline} = this.props;
    const {rows} = this.state;

    if (collapsed) {
      return <div/>;
    }

    return (
      <div className="timeline">
        {rows.map(row =>
          <div className="row" key={row.line}>
            {row.items.map((item, index) => {
              const style = {
                left: this.getPercentage(item.startTime()),
                right: this.getPercentage(timeline.totalDuration() - item.endTime())
              };

              // Render timelines
              if (item instanceof TimelineLite) {
                return (
                  <div className="node node--timeline" style={style} key={index}>
                    {/* <Timeline timeline={item}/> */}
                    Timeline
                  </div>
                );
              }

              // Render items with no duration (callbacks, sets)
              if (item.startTime() === item.endTime()) {
                const type = typeof item.target === 'function' ? 'function' : 'set';
                return (
                  <div className={`node node--instant node--${type}`} style={style} key={index}>
                    {type === 'function' ? 'F' : 'S'}
                  </div>
                );
              }

              // Render tweens
              const props = Array.isArray(item._propLookup) ? item._propLookup : [];
              return (
                <div className="node node--tween" style={style} key={index}>
                  {props.reduce((arr, item) =>
                    arr.concat(Object.keys(item))
                  , []).join(', ')}
                </div>
              );
            })}
          </div>
        )}

        <style jsx>{`
          .row {
            position: relative;
            width: 100%;
            height: 20px;
            margin-bottom: 2px;
          }

          .node {
            position: absolute;
            top: 0;
            bottom: 0;
            font-size: 11px;
            line-height: 20px;
            text-align: center;
            text-transform: uppercase;
            font-weight: bold;
            color: rgba(0, 0, 0, 0.5);
          }

          .node--instant {
            right: auto !important;
            width: 20px;
            height: 20px;
            margin-left: -10px;
            border-radius: 50%;
            text-align: center;
          }

          .node--tween {
            background: #afeef0
          }

          .node--timeline {
            background: #d5a6b7
          }

          .node--function {
            background: #a7f1ba;
          }

          .node--set {
            background: #97ddd6;
          }
        `}</style>
      </div>
    );
  }
}
