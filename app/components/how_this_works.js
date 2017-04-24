import React, { Component } from 'react';
import { Link } from 'react-router';

export default (props) => {

  return (
    <div className='container how-this-works'>
      <div className='row'>
        <div className='col-xs-12 col-md-8'>
          <div className='panel panel-default'>
            <div className='panel-heading'>Vote for the more valuable medal</div>
            <div className='panel-body'><img src='/gifs/vid-vote.gif'></img></div>
          </div>
          <div className='panel panel-default'>
            <div className='panel-heading'>Search and browse medal statistics</div>
            <div className='panel-body'><img src='/gifs/vid-search.gif'></img></div>
          </div>
          <div className='panel panel-default'>
            <div className='panel-heading'>View rankings and leaderboards</div>
            <div className='panel-body'><img src='/gifs/vid-stats.gif'></img></div>
          </div>
          <div className='panel panel-default'>
            <div className='panel-heading'>Manage your past votes</div>
            <div className='panel-body'><img src='/gifs/vid-swap.gif'></img></div>
          </div>
        </div>
      </div>
    </div>
  );
}