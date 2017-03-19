import React, { Component } from 'react';
import StatsStore from '../stores/stats_store'
import StatsActions from '../actions/stats_actions';

export default class Stats extends Component {
  constructor(props) {
    super(props);
    this.state = StatsStore.getState();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    StatsStore.listen(this.onChange);
    StatsActions.getStats();
  }

  componentWillUnmount() {
    StatsStore.unlisten(this.onChange);
  }

  onChange(state) {
    this.setState(state);
  }

  render() {
    return (
      <div className='container'>
        <div className='col-xs-12 col-sm-8'>
          <div className='panel panel-default'>
            <table className='table table-striped'>
              <thead>
              <tr>
                <th colSpan='2'>Medal Statistics</th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td>Total number of medals</td>
                <td>{this.state.totalCount}</td>
              </tr>
              <tr>
                <td>Total votes cast</td>
                <td>{this.state.totalVotes}</td>
              </tr>
              <tr>
                <td>Leading affinity in Top 100</td>
                <td><span className='cap'>{this.state.leadingAffinity.affinity}</span> with {this.state.leadingAffinity.count} medals</td>
              </tr>
              <tr>
                <td>Leading attribute in Top 100</td>
                <td><span className='cap'>{this.state.leadingAttribute.attribute}</span> with {this.state.leadingAttribute.count} medals</td>
              </tr>
              <tr>
                <td>Upright Medals</td>
                <td>{this.state.uprightCount}</td>
              </tr>
              <tr>
                <td>Reversed Medals</td>
                <td>{this.state.reversedCount}</td>
              </tr>
              <tr>
                <td>Power Medals</td>
                <td>{this.state.powerCount}</td>
              </tr>
              <tr>
                <td>Speed Medals</td>
                <td>{this.state.speedCount}</td>
              </tr>
              <tr>
                <td>Magic Medals</td>
                <td>{this.state.magicCount}</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}