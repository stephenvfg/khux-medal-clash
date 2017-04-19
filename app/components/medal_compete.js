import React, { Component } from 'react';
import { Link } from 'react-router';
import MedalCompeteStore from '../stores/medal_compete_store'
import MedalCompeteActions from '../actions/medal_compete_actions';
import { first, without, findWhere } from 'underscore';
import MedalImg from './medal_img';
import MedalCard from './medal_card';

export default class medal_compete extends Component {

	constructor(props) {
    super(props);
    this.state = MedalCompeteStore.getState();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    MedalCompeteStore.listen(this.onChange);

    MedalCompeteActions.loggedIn();
    MedalCompeteActions.getTwoMedals();
  }

  componentWillUnmount() {
    MedalCompeteStore.unlisten(this.onChange);
  }

  onChange(state) {
    this.setState(state);
  }

  handleClick(medal) {
    var winner = medal._id;
    var loser = first(without(this.state.medals, findWhere(this.state.medals, { _id: winner })))._id;
    var voter = this.state.user ? this.state.user._id : null;

    MedalCompeteActions.vote(winner, loser, voter);
  }

  onClickShow(event){
    event.preventDefault();

    if (!this.state.showedCardsOnce) {
      mixpanel.track("Displayed medal stats");
      this.setState({ showedCardsOnce: true });
    }
    this.setState({ showCards: !this.state.showCards });
  }

  render() {
    var medalNodes = this.state.medals.map((medal, index) => {
      return (
        <div key={medal._id} className={index === 0
            ? 'medal-compete col-xs-6 col-sm-6 col-md-4 col-md-offset-2' 
            : 'medal-compete col-xs-6 col-sm-6 col-md-4'}>
          <div className='thumbnail fadeInUp animated'>
            <MedalImg isGuilted={medal.isGuilted} isBoosted={medal.isBoosted} 
                tier={medal.tier} imgPath={medal.imgPath} large='-lg' cl='medal' dir='fullsize'
                onClick={this.handleClick.bind(this, medal)} 
            />
            <div className='caption text-center'>
              <h4>
                <Link to={'/medal/' + medal.slug}><strong>
                  { medal.name }
                </strong></Link>
              </h4>
            </div>
          </div>
        </div>
      );
    }, this);

    var medalCards = this.state.medals.map((medal, index) => {
      return (
        <div key={medal._id} className={index === 0 ? 'col-xs-12 col-sm-12 col-md-4 col-md-offset-2 fadeInUp animated' : 'col-xs-12 col-sm-12 col-md-4 fadeInUp animated'}>
          <MedalCard medal={medal} />
        </div>
      );
    }, this);

    return (
      <div className='container'>
        <h3 className='text-center medal-compete'><strong>Which medal would you keep?</strong></h3>
        <div className='row'>
          {medalNodes}
        </div>
        <div className='row centered'>
          <a className='btn btn-primary medal-compete fadeInUp animated' onClick={this.onClickShow.bind(this)} href='#'>
            { this.state.showCards ? ('Hide Stats') : ('Show Medal Stats') }
          </a>
        </div>
        { this.state.showCards ? (
          <div className='row'>
            {medalCards}
          </div>
        ) : ('') }
      </div>
    );
  }
}