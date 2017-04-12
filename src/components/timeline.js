import React, {Component, PropTypes} from 'react';
import {TimelineLite} from 'gsap';
import organizeTimeline from '../util/organize-timeline';
import Node from './node';

export default class Timeline extends Component {
  static propTypes = {
    expand: PropTypes.bool,
    timeline: PropTypes.instanceOf(TimelineLite).isRequired
  }

  static defaultProps = {
    expand: false
  }

  constructor(props) {
    super(props);

    console.log(props.timeline.getChildren(true));

    this.state = {
      rows: organizeTimeline(props.timeline.getChildren(props.expand, true, !props.expand))
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.expand !== this.props.expand) {
      this.setState({
        rows: organizeTimeline(nextProps.timeline.getChildren(nextProps.expand, true, !nextProps.expand))
      });
    }
  }

  render() {
    const {timeline} = this.props;
    const {rows} = this.state;

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
