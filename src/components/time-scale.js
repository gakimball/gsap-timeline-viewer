import React, {Component, PropTypes} from 'react';

/**
 * Component to adjust the speed of a timeline.
 */
export default class TimeScale extends Component {
  /**
   * Prop types for `<TimeScale />`.
   * @prop {Integer} value - Value of slider.
   * @prop {Function} onChange - Callback to run when slider changes.
   */
  static propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired
  }

  static values = [
    '0.33',
    '0.5',
    '0.66',
    '1',
    '1.5',
    '2',
    '3',
    '4'
  ]

  constructor(props) {
    super(props);

    this.state = {
      textValue: props.value
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      this.setState({
        textValue: nextProps.value
      });
    }
  }

  handleRangeChange = event => {
    const {values} = this.constructor;
    this.props.onChange(values[event.target.value]);
  }

  handleTextChange = event => {
    this.setState({
      textValue: event.target.value
    });
  }

  handleTextConfirm = event => {
    if (event.key === 'Enter') {
      this.props.onChange(event.target.value);
    }
  }

  render() {
    const {values} = this.constructor;
    const {value} = this.props;
    const {textValue} = this.state;

    return (
      <div className="scale">
        <input type="range" min="0" max={values.length} value={values.indexOf(value)} onChange={this.handleRangeChange}/>
        <input type="number" value={textValue} onChange={this.handleTextChange} onKeyUp={this.handleTextConfirm}/>
      </div>
    );
  }
}
