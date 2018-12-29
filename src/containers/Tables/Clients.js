import React from "react";

import { getClients, getClientsCols } from "../../services/clients/clients";

import styles from "./Devices.scss";

export class Clients extends React.Component {
  state = {
    clients: [],
    cols: []
  };
  async componentDidMount() {
    this.setState({
      clients: await getClients(),
      cols: getClientsCols()
    });
  }

  render() {
    return (
      <table className={styles.clients__table}>
        <thead>
          <tr>{this.state.cols && this.state.cols.map((col, i) => <th key={i}>{col}</th>)}</tr>
        </thead>
        <tbody>
          {this.state.clients &&
            this.state.clients.map((client, i) => (
              <tr key={i}>
                {this.state.cols &&
                  this.state.cols.map((col, i) => {
                    switch (col) {
                      case "status":
                        return <td key={i}>{client[col] ? "active" : "turned-off"}</td>;
                      case "devices":
                        return <td key={i}>{client[col] && client[col].length}</td>;
                      case "validated":
                        return <td key={i}>{client[col] ? "confirmed" : "pending"}</td>;
                      default:
                        return <td key={i}>{client[col]}</td>;
                    }
                  })}
              </tr>
            ))}
        </tbody>
      </table>
    );
  }
}

export default Clients;
