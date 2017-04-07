import React, {Component, PropTypes} from 'react';
import {TimelineLite} from 'gsap';
import Node from './node';
import organizeTimeline from '../util/organize-timeline';

export default class Timeline extends Component {
  static propTypes = {
    collapsed: PropTypes.bool,
    timeline: PropTypes.instanceOf(TimelineLite).isRequired
  }

  static defaultProps = {
    collapsed: false
  }

  constructor(props) {
    super(props);

    console.log(props.timeline.getChildren(false));

    this.state = {
      rows: organizeTimeline(props.timeline)
    };
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
