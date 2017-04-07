import React, {Component, PropTypes} from 'react';
import {TimelineLite} from 'gsap';
import Node from './node';

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

    console.log(props.timeline.getChildren(false));

    this.state = {
      rows: this.constructor.organizeTimeline(props.timeline),
      nestedTimelines: this.constructor.getNestedTimelines(props.timeline)
    };
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
            {row.items.map((item, index) => <Node item={item} timeline={timeline} key={index}/>)}
          </div>
        )}

        <style jsx>{`
          .row {
            position: relative;
            width: 100%;
            height: 20px;
            margin-bottom: 2px;
          }
        `}</style>
      </div>
    );
  }
}
