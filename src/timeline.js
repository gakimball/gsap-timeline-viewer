import React, {Component, PropTypes} from 'react';
import {TimelineLite} from 'gsap';

export default class Timeline extends Component {
  static propTypes = {
    timeline: PropTypes.instanceOf(TimelineLite).isRequired
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

  constructor(props) {
    super(props);

    this.state = {
      rows: this.constructor.organizeTimeline(props.timeline)
    };
  }

  getPercentage(time) {
    const start = parseFloat(time);
    const end = parseFloat(this.props.timeline.totalDuration());
    return `${(start / end).toFixed(2) * 100}%`;
  }

  render() {
    const {timeline} = this.props;
    const {rows} = this.state;

    return (
      <div className="timeline">
        {rows.map(row =>
          <div className="row" key={row.line}>
            {row.items.map((item, index) => {
              const style = {
                left: this.getPercentage(item.startTime()),
                right: this.getPercentage(timeline.totalDuration() - item.endTime())
              };

              if (item instanceof TimelineLite) {
                // Render timelines
                return (
                  <div className="node node--timeline" style={style} key={index} >
                    Timeline
                  </div>
                );
              }

              // Render tweens
              return (
                <div className="node node--tween" style={style} key={index}>
                  {item._propLookup.reduce((arr, item) =>
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
          }

          .node {
            position: absolute;
            top: 0;
            bottom: 0;
          }

          .node--tween {
            background: #afeef0
          }

          .node--timeline {
            background: #d5a6b7
          }
        `}</style>
      </div>
    );
  }
}
