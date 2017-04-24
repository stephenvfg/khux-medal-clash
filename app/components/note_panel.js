import React, { Component } from 'react';
import { Link } from 'react-router';

export default (props) => {

  function hidePanel() {
    $(".note-panel").hide();
  }

  return (
    <div className='note-panel'>
      <div className='col-xs-12 col-sm-12 card'>
        <div>
          <h4><strong>Want to reverse a vote or keep a history of your votes?</strong> Sign up for an account using the link in the nav and then head to 'My Votes'.</h4>
          <a href='#' onClick={hidePanel()}></a>
        </div>
      </div>
    </div>
  );
}