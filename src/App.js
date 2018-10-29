import React, { Component } from 'react';

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: []
    }

    this.addColumn = this.addColumn.bind(this);
    this.addRow = this.addRow.bind(this);
    this.downloadCSV = this.downloadCSV.bind(this);
  }

  addColumn() {
    if (!!this.state.data.length) {
      return this.setState({
        data: [
          this.state.data[0].concat(""),
          ...this.state.data.filter((item, index) => index !== 0).map(row => row.concat(""))
        ]
      });
    }
    return this.setState({
      data: [
        this.state.data.concat([""]),
        ...this.state.data.filter((item, index) => index !== 0).map(row => row.concat(""))
      ]
    });
  }

  addRow() {
    this.setState({
      data: this.state.data.concat([
        this.state.data[0].map(() => '')
      ])
    });
  }

  updateHeader(value, index) {
    this.setState(prevState => ({
      data: Object.assign(
        [...prevState.data], 
        {0: Object.assign([...prevState.data[0]], { [index]: value })}
      )
    }));
  }

  updateRow(value, RowIndex, CellIndex) {
    this.setState(prevState => ({
      data: Object.assign(
        [...prevState.data], 
        {[RowIndex+1]: Object.assign([...prevState.data[RowIndex+1]], { [CellIndex]: value })}
      )
    }));
  }

  removeColumn(ColumnIndex) {
    this.setState(prevState => ({
      data: Object.assign(
        [...prevState.data.map(item => item.filter((row, index) => ColumnIndex !== index))],
        {0: prevState.data[0].filter((item, index) => ColumnIndex !== index)}
      )
    }));
  }

  removeRow(RowIndex) {
    this.setState(prevState => ({
      data: prevState.data.filter((item, index) => (RowIndex + 1) !== index)
    }));
  }

  downloadCSV() {
    let csvContent = "data:text/csv;charset=utf-8,";
    this.state.data.forEach((rowArray) => {
       let row = rowArray.join(",");
       csvContent += row + "\r\n";
    });

    return encodeURI(csvContent);
  }
 
  render() {
    return (
      <div className="app">
        <table>
          <thead>
            <tr>
              {
                !!this.state.data.length && this.state.data[0].map((header, index) => (
                    <th key={`header_${index}`}>
                      <button className="remove-btn" onClick={() => this.removeColumn(index)}>Remove Column</button>
                      <input value={header} onChange={(e) => this.updateHeader(e.target.value, index)} />
                    </th>
                ))
              }
            </tr>
          </thead>
          <tbody>
            {
              this.state.data.filter((item, index) => index !== 0).map((row, RowIndex) => (
                  <tr key={`row_${RowIndex}`}>
                    {
                      row.map((cell, CellIndex) => (
                        <td key={`cell_${RowIndex}_${CellIndex}`}>
                          {!CellIndex && <button className="remove-btn" onClick={() => this.removeRow(RowIndex)}>Remove Row</button>}
                          <input value={cell} onChange={(e) => this.updateRow(e.target.value, RowIndex, CellIndex)} />
                        </td>
                      ))
                    }
                  </tr>
              ))
            }  
          </tbody>        
        </table>
        <div className="group-btn">
          <button className="add-btn" onClick={this.addColumn}>Add column</button>
          { this.state.data[0] && 
            <button className="add-btn" onClick={this.addRow}>Add row</button>
          }
        </div>
        <a className="download-link" href={this.downloadCSV()} download>Download CSV</a>
      </div>
    );
  }
}

export default App;
