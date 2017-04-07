import React, {PropTypes} from 'react';
import {TimelineLite} from 'gsap';
import cls from 'classnames';

const getPercentage = (time, total) => {
  const start = parseFloat(time);
  const end = parseFloat(total);
  return `${(start / end).toFixed(2) * 100}%`;
};

const Node = ({item, timeline}) => {
  const style = {
    left: getPercentage(item.startTime(), timeline.totalDuration()),
    right: getPercentage(timeline.totalDuration() - item.endTime(), timeline.totalDuration())
  };
  const isInstant = item.duration() === 0;
  const isFunction = typeof item.target === 'function';
  const nodeType = do {
    if (item instanceof TimelineLite) {
      'timeline';
    } else if (isInstant) {
      if (isFunction) {
        'function';
      } else {
        'set';
      }
    } else {
      'tween';
    }
  };

  const className = cls('node', {
    'node--instant': isInstant,
    'node--timeline': nodeType === 'timeline',
    'node--set': nodeType === 'set',
    'node--function': nodeType === 'function',
    'node--tween': nodeType === 'tween'
  });

  return (
    <div className={className} style={style}>
      {(() => {
        switch (nodeType) {
          case 'tween': {
            const properties = Array.isArray(item._propLookup) ? item._propLookup : [];
            return properties.reduce((arr, item) =>
              arr.concat(Object.keys(item))
            , []).join(', ');
          }
          case 'timeline':
            return 'Timeline';
          case 'function':
            return 'F';
          case 'set':
            return 'S';
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
};

Node.propTypes = {
  item: PropTypes.object.isRequired,
  timeline: PropTypes.instanceOf(TimelineLite).isRequired
};

export default Node;
