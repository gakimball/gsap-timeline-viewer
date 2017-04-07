import React, {PropTypes} from 'react';
import {TimelineLite} from 'gsap';

const getPercentage = (time, total) => {
  const start = parseFloat(time);
  const end = parseFloat(total);
  return `${(start / end).toFixed(2) * 100}%`;
};

const css = (
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
);

const Node = ({item, timeline}) => {
  const style = {
    left: getPercentage(item.startTime(), timeline.totalDuration()),
    right: getPercentage(timeline.totalDuration() - item.endTime(), timeline.totalDuration())
  };

  // Render timelines
  if (item instanceof TimelineLite) {
    return (
      <div className="node node--timeline" style={style}>
        {/* <Timeline timeline={item}/> */}
        Timeline
        {css}
      </div>
    );
  }

  // Render items with no duration (callbacks, sets)
  if (item.startTime() === item.endTime()) {
    const type = typeof item.target === 'function' ? 'function' : 'set';
    return (
      <div className={`node node--instant node--${type}`} style={style}>
        {type === 'function' ? 'F' : 'S'}
        {css}
      </div>
    );
  }

  // Render tweens
  const properties = Array.isArray(item._propLookup) ? item._propLookup : [];
  return (
    <div className="node node--tween" style={style}>
      {properties.reduce((arr, item) =>
        arr.concat(Object.keys(item))
      , []).join(', ')}
      {css}
    </div>
  );
};

Node.propTypes = {
  item: PropTypes.object.isRequired,
  timeline: PropTypes.instanceOf(TimelineLite).isRequired
};

export default Node;
