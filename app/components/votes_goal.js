import React, { Component } from 'react';
import VotesGoalStore from '../stores/votes_goal_store'
import VotesGoalActions from '../actions/votes_goal_actions';

export default class VotesGoal extends Component {
  constructor(props) {
    super(props);
    this.state = VotesGoalStore.getState();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    VotesGoalStore.listen(this.onChange);
    VotesGoalActions.getCount();
  }

  componentWillUnmount() {
    VotesGoalStore.unlisten(this.onChange);
  }

  onChange(state) {
    this.setState(state);
  }

  hideVotes() {
     $(".votes-goal").hide();
  }

  render() {

    var pct = ((this.state.count/100000)*100 > 10) ? (this.state.count/100000)*100 + '%' : '20%';

    return (
      <div className='votes-goal'>
        <div className='col-xs-12 col-sm-12 card'>
          <div>
            <h4>Medal statistics won't be valuable until we reach a large number of votes - <strong>help reach our goal of 100k votes by May 31st</strong></h4>
            <a href='#' onClick={this.hideVotes}></a>
          </div>
          <div className='progress'>
            <div className='progress-bar progress-bar-striped active' role='progressbar'
                aria-valuenow={this.state.count} aria-valuemin='0' aria-valuemax='100000' style={{width: pct}}>
              {this.state.count}
            </div>
          </div>
        </div>
      </div>
    );
  }
}