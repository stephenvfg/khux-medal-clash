import React, { Component } from 'react';
import { Link } from 'react-router';
import UserVotesStore from '../stores/user_votes_store';
import UserVotesActions from '../actions/user_votes_actions';
import MedalVotesItem from './medal_votes_item';

class UserVotes extends Component {
  constructor(props) {
    super(props);
    this.state = UserVotesStore.getState();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    UserVotesStore.listen(this.onChange);

    UserVotesActions.getVoteCount();
    UserVotesActions.loggedIn();

    var i = this.props.location.query.i ? this.props.location.query.i : 0;
    UserVotesActions.updateIndex(i);
  }

  componentWillUnmount() {
    UserVotesStore.unlisten(this.onChange);
  }

  componentWillReceiveProps(nextProps) {
    UserVotesActions.updateIndex(nextProps.location.query.i);
  }

  onChange(state) {
    this.setState(state);
  }

  updateIndex(change) {
    var newIndex = parseInt(this.state.i) + parseInt(change);
    if (newIndex < 0) { newIndex = 0; }
    UserVotesActions.updateIndex(newIndex);
  }

  handleVoteActivate(event) {
    event.preventDefault();

    let id = event.target.getAttribute('data-id');
    let winner = event.target.getAttribute('data-winner');
    let loser = event.target.getAttribute('data-loser');
    let active = event.target.value;

    UserVotesActions.updateVote(id, winner, loser, active);
  }

  handleVoteUpdate(event) {
    event.preventDefault();

    let id = event.target.getAttribute('data-id');
    let winner = event.target.getAttribute('data-loser');
    let loser = event.target.getAttribute('data-winner');

    UserVotesActions.updateVote(id, winner, loser, null);
  }

  render() {

    let votesList = this.state.votes.map((vote, index) => {

      var dateHumanReadable = new Date(vote.date).toDateString();

      return (
        <tr key={vote._id}>
          <td className='date-col'>{dateHumanReadable}</td>
          <td className='main-col' colSpan='2'>
            <div className='media col-xs-12 col-md-6'>
              <div className='media-body'> 
                { this.state.vMedals[index] ? (
                    <MedalVotesItem voteId={vote._id} 
                        winner={this.state.vMedals[index].winner} 
                        loser={this.state.vMedals[index].loser} 
                        currentMedalWon={true} />
                  ) : ('Loading...') }
              </div>
            </div>
            <div className='col-xs-12 col-md-6'>
              <button className='btn btn-default' 
                  data-id={vote._id} 
                  data-winner={vote.winner} 
                  data-loser={vote.loser} 
                  value={!vote._active} 
                  onClick={this.handleVoteActivate.bind(this)}>
                {vote._active ? 'Remove Vote' : 'Enable Vote'}
              </button>
              <button className='btn btn-primary' 
                  data-id={vote._id} 
                  data-winner={vote.winner} 
                  data-loser={vote.loser} 
                  onClick={this.handleVoteUpdate.bind(this)}>
                Swap Winner and Loser
              </button>
            </div>
          </td>
        </tr>
      );
    });

    return (
      <div className='container user-votes'>
        <div className='row flipInX animated'>
          <div className='col-sm-8'>
            { this.state.user
              ? (
                <div className='panel panel-default'>
                  <table className='table table-striped'>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Medals</th>
                        <th><Link to={'/votes/?i=' + 
                            (this.state.i > 20 
                              ? (parseInt(this.state.i) - 20)
                              : 0)
                            }>&lt;&lt;</Link>
                            &nbsp;&nbsp;
                            <Link to={'/votes/?i=' + 
                            (this.state.i < (this.state.totalVotes - 20)
                              ? (parseInt(this.state.i) + 20)
                              : parseInt(this.state.i))
                            }>&gt;&gt;</Link>
                        </th>
                      </tr>
                    </thead>
                    <tbody className='medal-list'>
                      {votesList}
                    </tbody>
                  </table>
                </div>
              ) 
              : (
                <div className='panel panel-default'>
                  <div className='panel-heading'>You must be logged in to access this page.</div>
                </div>
              ) 
            }
          </div>
        </div>
      </div>
    );
  }
}

export default UserVotes;