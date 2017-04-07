import React, {Component, PropTypes} from 'react';
import {TimelineLite} from 'gsap';
import cls from 'classnames';

export default class Node extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    timeline: PropTypes.instanceOf(TimelineLite).isRequired
  }

  static getPercentage(time, total) {
    const start = parseFloat(time);
    const end = parseFloat(total);
    return `${(start / end).toFixed(2) * 100}%`;
  };

  static propLookup(item) {
    const properties = Array.isArray(item._propLookup) ? item._propLookup : [];

    if (Array.isArray(item._propLookup)) {
      return properties.reduce((arr, item) =>
        arr.concat(Object.keys(item))
      , []).join(', ');
    }

    if (typeof item._propLookup === 'object') {
      return Object.keys(item._propLookup).join(', ');
    }

    return '';
  }

  get isInstant() {
    return this.props.item.duration() === 0;
  }

  get nodeType() {
    const {item} = this.props;

    if (item instanceof TimelineLite) {
      return 'timeline';
    }

    if (this.isInstant) {
      if (item.data === 'isPause') {
        return 'pause';
      } else if (typeof item.target === 'function') {
        return 'function';
      }

      return 'set';
    }

    return 'tween';
  }

  get style() {
    const {getPercentage} = this.constructor;
    const {item, timeline} = this.props;

    return {
      left: getPercentage(item.startTime(), timeline.totalDuration()),
      right: getPercentage(timeline.totalDuration() - item.endTime(), timeline.totalDuration())
    };
  }

  render() {
    const {propLookup} = this.constructor;
    const {item} = this.props;
    const className = cls('node', `node--${this.nodeType}`, {
      'node--instant': this.isInstant
    });

    return (
      <div className={className} style={this.style}>
        {(() => {
          switch (this.nodeType) {
            case 'tween':
              return propLookup(item);
            case 'timeline':
              return 'Timeline';
            case 'function':
              return 'F';
            case 'set':
              return 'S';
            case 'pause':
              return 'P';
            default:
          }
        })()}
        <style jsx>{`
          .node {
            position: absolute;
            top: 0;
            bottom: 0;
            font-size: 11px;
            line-height: 20px;
            text-align: center;
            text-transform: uppercase;
            font-weight: bold;
            color: #fff;
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
            background: #34c1f6
          }

          .node--timeline {
            background: #00e1ac
          }

          .node--function {
            background: #ad7bff;
          }

          .node--set {
            background: #fc9900;
          }

          .node--pause {
            background: #ff504a;
          }
        `}</style>
      </div>
    );
  }
}
