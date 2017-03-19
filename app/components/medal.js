import React, { Component } from 'react';
import { Link } from 'react-router';
import MedalStore from '../stores/medal_store';
import MedalActions from '../actions/medal_actions';
import MedalVotes from './medal_votes';
import MedalImg from './medal_img';
import MedalCard from './medal_card';

export default class Medal extends Component {
  constructor(props) {
    super(props);
    this.state = MedalStore.getState();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    MedalStore.listen(this.onChange);
    MedalActions.getMedal(this.props.params.slug);
  }

  componentWillUnmount() {
    MedalStore.unlisten(this.onChange);
    $(document.body).removeClass();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.params.slug !== this.props.params.slug) {
      MedalActions.getMedal(this.props.params.slug);
    }
  }

  onChange(state) {
    this.setState(state);
  }

  render() {
    return this.state.medal ? (
      <div className='container'>
        <h1 className='profile-name'><strong>{this.state.medal.name}</strong></h1>
        <div className='col-sm-4'>
          <div className='profile-img'>
            <MedalImg isGuilted={this.state.medal.isGuilted} isBoosted={this.state.medal.isBoosted} 
                tier={this.state.medal.tier} imgPath={this.state.medal.imgPath} large='-lg' cl='' dir='fullsize'
                onClick=''
            />
          </div>
        </div>
        <div className='col-sm-4'>
          <div className='profile-stats clearfix'>
            <ul>
              <li><span className='stats-number'>{this.state.winLossRatio}</span>Winning Percentage</li>
              <li><span className='stats-number win-stats'>{this.state.medal.wins}</span> Wins</li>
              <li><span className='stats-number lose-stats'>{this.state.medal.losses}</span> Losses</li>
            </ul>
          </div>
          <MedalCard medal={this.state.medal} />
        </div>
        <div className='col-sm-4'>
          <MedalVotes medalId={this.state.medal._id} />
        </div>
      </div>
    ) : (<h2>Loading...</h2>);
  }
}