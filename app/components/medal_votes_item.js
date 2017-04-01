import React from 'react';
import { Link } from 'react-router';
import MedalImg from './medal_img';

export default (props) => {
  
  return (
    <div>
      { props.currentMedalWon ? (
        <div className='medal-vote-item animated fadeIn'>
          { props.winner ? (
            <div key={props.winner._id} className='col-xs-4 v-centered'>
              <Link to={'/medal/' + props.winner.slug}>
                <MedalImg isGuilted={props.winner.isGuilted} isBoosted={props.winner.isBoosted} 
                    tier={props.winner.tier} imgPath={props.winner.imgPath} large=''
                    cl='thumb-md' dir='thumbs' onClick='' 
                />
              </Link>
            </div>
          ) : 'Loading...' }
          <div className='col-xs-4 centered v-centered'>
            <strong><span className='verdict'>won</span> vs.</strong>
          </div>
          { props.loser ? (
            <div key={props.loser._id} className='col-xs-4 v-centered'>
              <Link to={'/medal/' + props.loser.slug}>
                <MedalImg isGuilted={props.loser.isGuilted} isBoosted={props.loser.isBoosted} 
                    tier={props.loser.tier} imgPath={props.loser.imgPath} large=''
                    cl='thumb-md' dir='thumbs' onClick='' 
                />
              </Link>
            </div>
          ) : 'Loading...' }
        </div>
      ) : (
        <div className='medal-vote-item animated fadeIn'>
          { props.loser ? (
            <div key={props.loser._id} className='col-xs-4 v-centered'>
              <Link to={'/medal/' + props.loser.slug}>
                <MedalImg isGuilted={props.loser.isGuilted} isBoosted={props.loser.isBoosted} 
                    tier={props.loser.tier} imgPath={props.loser.imgPath} large=''
                    cl='thumb-md' dir='thumbs' onClick='' 
                />
              </Link>
            </div>
          ) : 'Loading...' }
          <div className='col-xs-4 centered v-centered'>
            <strong><span className='verdict'>lost</span> vs.</strong>
          </div>
          {props.winner ? (
            <div key={props.winner._id} className='col-xs-4 v-centered'>
              <Link to={'/medal/' + props.winner.slug}>
                <MedalImg isGuilted={props.winner.isGuilted} isBoosted={props.winner.isBoosted} 
                    tier={props.winner.tier} imgPath={props.winner.imgPath} large=''
                    cl='thumb-md' dir='thumbs' onClick='' 
                />
              </Link>
            </div>
          ) : 'Loading...' }
        </div>
      )}
    </div>
  );
}