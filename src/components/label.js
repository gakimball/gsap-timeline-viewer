import React, {Component, PropTypes} from 'react';

export default class Label extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    time: PropTypes.number.isRequired,
    duration: PropTypes.number.isRequired,
    onClick: PropTypes.func.isRequired
  }

  static formatPercent(value) {
    return (parseFloat(value).toFixed(2) * 100) + '%';
  }

  handleClick = () => {
    this.props.onClick(this.props.name);
  }

  render() {
    const {formatPercent} = this.constructor;
    const {name, time, duration} = this.props;

    return (
      <div
        className="label"
        style={{left: formatPercent(time / duration)}}
        onClick={this.handleClick}
        >
        {name}
        <style jsx>{`
          .label {
            position: absolute;
            bottom: 0;
            background: #3d7fd5;
            padding: 2px 5px;
            cursor: pointer;
            font-size: 11px;
            text-transform: uppercase;
            font-weight: bold;
            color: #fff;
          }

          .label::before {
            content: '';
            display: block;
            width: 2px;
            height: 150%;
            position: absolute;
            top: 0;
            left: -1px;
            background: #3d7fd5;
          }
        `}</style>
      </div>
    );
  }
}
