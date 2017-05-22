import React, { Component } from 'react';
import { Link } from 'react-router';
import { isEqual } from 'underscore';
import MedalListStore from '../stores/medal_list_store';
import MedalListActions from '../actions/medal_list_actions';
import MedalImg from './medal_img';

export default class MedalList extends Component {
  constructor(props) {
    super(props);
    this.state = MedalListStore.getState();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    MedalListStore.listen(this.onChange);
    MedalListActions.getMedals(this.props.params);
  }

  componentWillUnmount() {
    MedalListStore.unlisten(this.onChange);
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(prevProps.params, this.props.params)) {
      MedalListActions.getMedals(this.props.params);
    }
  }

  onChange(state) {
    this.setState(state);
  }

  render() {
    let medalsList = this.state.medals.map((medal, index) => {
      return (
        <div key={medal._id} className='list-group-item animated fadeIn'>
          <div className='media'>
            <span className='position pull-left'>{index + 1}</span>
            <div className='pull-left thumb-lg'>
              <Link to={'/medal/' + medal.slug}>
                <MedalImg isGuilted={medal.isGuilted} isBoosted={medal.isBoosted} 
                    tier={medal.tier} imgPath={medal.imgPath} large='' cl='media-object' dir='thumbs'
                    onClick='' 
                />
              </Link>
            </div>
            <div className='media-body'>
              <h4 className='media-heading'>
                <strong><Link to={'/medal/' + medal.slug}>
                  { medal.name }
                </Link></strong>
              </h4>
              <h4>Wins: <strong>{medal.wins}</strong></h4>
              <h4>Losses: <strong>{medal.losses}</strong></h4>
              <h4>Rate: <strong>{(medal.ratio*100).toFixed(1) + '%'}</strong></h4>
            </div>
          </div>
        </div>
      );
    });

    return (
      <div className='container'>
        
        <ul>
          <li className='dropdown'>
            <a href='#' className='dropdown-toggle' data-toggle='dropdown'>Affinity <span className='caret'></span></a>
            <ul className='dropdown-menu'>
              <li>
                <div className='form-group'>
                  <input type='checkbox' name='upright' id='upright' value='upright'/>
                  <label htmlFor='upright'>&nbsp; Upright</label>
                </div>
              </li>
              <li>
                <div className='form-group'>
                  <input type='checkbox' name='reversed' id='reversed' value='reversed'/>
                  <label htmlFor='reversed'>&nbsp; Reversed</label>
                </div>
              </li>
            </ul>
          </li>
          <li className='dropdown'>
            <a href='#' className='dropdown-toggle' data-toggle='dropdown'>Attribute <span className='caret'></span></a>
            <ul className='dropdown-menu'>
              <li>
                <div className='form-group'>
                  <input type='checkbox' name='power' id='power' value='power'/>
                  <label htmlFor='power'>&nbsp; Power</label>
                </div>
              </li>
              <li>
                <div className='form-group'>
                  <input type='checkbox' name='speed' id='speed' value='speed'/>
                  <label htmlFor='speed'>&nbsp; Speed</label>
                </div>
              </li>
              <li>
                <div className='form-group'>
                  <input type='checkbox' name='magic' id='magic' value='magic'/>
                  <label htmlFor='magic'>&nbsp; Magic</label>
                </div>
              </li>
            </ul>
          </li>
          <li className='dropdown'>
            <a href='#' className='dropdown-toggle' data-toggle='dropdown'>Special Attack Target <span className='caret'></span></a>
            <ul className='dropdown-menu'>
              <li>
                <div className='form-group'>
                  <input type='checkbox' name='single' id='single' value='single'/>
                  <label htmlFor='single'>&nbsp; Single</label>
                </div>
              </li>
              <li>
                <div className='form-group'>
                  <input type='checkbox' name='all' id='all' value='all'/>
                  <label htmlFor='all'>&nbsp; All</label>
                </div>
              </li>
              <li>
                <div className='form-group'>
                  <input type='checkbox' name='random' id='random' value='random'/>
                  <label htmlFor='random'>&nbsp; Random</label>
                </div>
              </li>
            </ul>
          </li>
          <li className='dropdown'>
            <a href='#' className='dropdown-toggle' data-toggle='dropdown'>Tier <span className='caret'></span></a>
            <ul className='dropdown-menu'>
              <li>
                <div className='form-group'>
                  <input type='checkbox' name='one' id='one' value='one'/>
                  <label htmlFor='one'>&nbsp; 1</label>
                </div>
              </li>
              <li>
                <div className='form-group'>
                  <input type='checkbox' name='two' id='two' value='two'/>
                  <label htmlFor='two'>&nbsp; 2</label>
                </div>
              </li>
              <li>
                <div className='form-group'>
                  <input type='checkbox' name='three' id='three' value='three'/>
                  <label htmlFor='three'>&nbsp; 3</label>
                </div>
              </li>
              <li>
                <div className='form-group'>
                  <input type='checkbox' name='four' id='four' value='four'/>
                  <label htmlFor='four'>&nbsp; 4</label>
                </div>
              </li>
              <li>
                <div className='form-group'>
                  <input type='checkbox' name='five' id='five' value='five'/>
                  <label htmlFor='five'>&nbsp; 5</label>
                </div>
              </li>
            </ul>
          </li>
          <li className='dropdown'>
            <a href='#' className='dropdown-toggle' data-toggle='dropdown'>Bonuses <span className='caret'></span></a>
            <ul className='dropdown-menu'>
              <li>
                <div className='form-group'>
                  <input type='checkbox' name='guilted' id='guilted' value='guilted'/>
                  <label htmlFor='guilted'>&nbsp; Guilted</label>
                </div>
              </li>
              <li>
                <div className='form-group'>
                  <input type='checkbox' name='boosted-str' id='boosted-str' value='boosted-str'/>
                  <label htmlFor='boosted-str'>&nbsp; Boosted STR</label>
                </div>
              </li>
              <li>
                <div className='form-group'>
                  <input type='checkbox' name='boosted-def' id='boosted-def' value='boosted-def'/>
                  <label htmlFor='boosted-def'>&nbsp; Boosted DEF</label>
                </div>
              </li>
            </ul>
          </li>
        </ul>

        <div className='medal-list list-group col-xs-12 col-sm-6'>
          {medalsList}
        </div>
      </div>
    );
  }
}