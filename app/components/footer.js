import React, { Component } from 'react';
import { Link } from 'react-router';
import FooterStore from '../stores/footer_store'
import FooterActions from '../actions/footer_actions';
import MedalImg from './medal_img';

export default class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = FooterStore.getState();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    FooterStore.listen(this.onChange);
    FooterActions.getTopMedals();
  }

  componentWillUnmount() {
    FooterStore.unlisten(this.onChange);
  }

  onChange(state) {
    this.setState(state);
  }

  render() {
    let leaderboardMedals = this.state.medals.map((medal) => {
      return (
        <li key={medal._id}>
          <Link to={'/medals/' + medal.slug}>
            <MedalImg isGuilted={medal.isGuilted} isBoosted={medal.isBoosted} 
                tier={medal.tier} imgPath={medal.imgPath} large='' cl='thumb-md' dir='thumbs'
                onClick='' 
            />
          </Link>
        </li>
      )
    });

    return (
      <footer>
        <div className='container'>
          <div className='row'>
            <div className='col-sm-4'>
              <h3 className='lead'><strong>KHUX</strong> Medal Clash</h3>
              <p>🔑+❤️ for the Kingdom Hearts Union x [CROSS] community. <Link to='/roadmap'>See what's next.</Link> <a href="mailto:khuxmedalclash@gmail.com">Contact site owner.</a></p>
              <p>Credit to Sahat Yalkabov for his open source project <a href="https://github.com/sahat/newedenfaces-react" target="_blank">here</a>.</p>
            </div>
            <div className='col-sm-8 hidden-xs'>
              <h3 className='lead'><strong>Leaderboard</strong> Top 10 Medals</h3>
              <ul className='list-inline'>
                {leaderboardMedals}
              </ul>
            </div>
          </div>
        </div>
      </footer>
    );
  }
}