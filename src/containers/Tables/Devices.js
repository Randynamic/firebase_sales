import React from "react";

import { getDevices, getDeviceCols } from "../../services/devices/devices";

import styles from "./Devices.scss";

export default class extends React.Component {
  state = {
    devices: [],
    cols: [],
    currentFormat: "",
    dateTimeFormat: "",
    dateTimeFormats: [{ value: "short", label: "Short" }, { value: "medium", label: "Medium" }, { value: "long", label: "Long" }, { value: "invalid-format", label: "Invalid Format" }]
  };

  constructor(props) {
    super(props);
    this.changeDateTimeFormat = this.changeDateTimeFormat.bind(this);
    this.changeDateTimeManualFormat = this.changeDateTimeManualFormat.bind(this);
  }

  async componentDidMount() {
    this.setState({
      devices: await getDevices(),
      cols: getDeviceCols(),
      currentFormat: "medium",
      dateTimeFormat: this.props.i18n.datetime.formats.date.medium
    });
  }

  changeDateTimeFormat(e) {
    const format = e.currentTarget.value;
    if (this.props.i18n.datetime.formats.date[format]) {
      this.setState({ currentFormat: format, dateTimeFormat: this.props.i18n.datetime.formats.date[format] });
    }
  }

  changeDateTimeManualFormat(e) {
    const format = e.currentTarget.value;
    this.setState({ dateTimeFormat: format });
  }

  render() {
    return (
      <table className={styles.clients__table}>
        <thead>
          <tr>
            {this.state.cols.map((col, i) => {
              switch (col) {
                case "activatedAt":
                  return (
                    <th key={i}>
                      {col}
                      <br />
                      <select onChange={this.changeDateTimeFormat} value={this.state.currentFormat}>
                        {this.state.dateTimeFormats.map((option, i) => {
                          return (
                            <option key={i} value={option.value}>
                              {option.label}
                            </option>
                          );
                        })}
                      </select>
                      <br />
                      <input value={this.state.dateTimeFormat} onChange={this.changeDateTimeManualFormat} />
                    </th>
                  );
                default:
                  return <th key={i}>{col}</th>;
              }
            })}
          </tr>
        </thead>
        <tbody>
          {this.state.devices.map((device, i) => (
            <tr key={i}>
              {this.state.cols.map((col, i) => {
                switch (col) {
                  case "status":
                    return <td key={i}>{device[col] ? "active" : "turned-off"}</td>;
                  case "activatedAt":
                    const date = this.props.i18n.datetime.moment(device[col]).format(this.state.dateTimeFormat);
                    return <td key={i}>{date}</td>;
                  default:
                    return <td key={i}>{device[col]}</td>;
                }
              })}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}
