import React, { Component } from 'react';
import { Link } from 'react-router';

export default (props) => {

  return (
    <div className='container roadmap'>
      <div className='row'>
        <div className='col-xs-12 col-sm-4'>
          <h1>Launch checklist</h1>
          <ul>
            <li>Add user info to medal submits</li>
            <li>Add user info to medal votes</li>
            <li>Format the login dropdown</li>
            <li>Validation for the login dropdown</li>
            <li>User settings page: change username, password, email</li>
            <li>Add 2 second timer between votes to prevent vote spamming</li>
            <li>Ask to sign in / make user account after first 7 clicks</li>
            <li>Add "boost amount" to medals</li>
            <li>ADMIN PANEL</li>
            <li>Add all medals</li>
          </ul>
          <h1>Done</h1>
          <ul>
            <li><del>Hide "add medal" form from public (authentication?)</del></li>
            <li><del>Close the API from unauthenticated calls</del></li>
            <li><del>AUTHENTICATION - For Add medal and API usage</del></li>
            <li><del>Admin auth vs. user auth</del></li>
            <li><del>Move att1 to affinity, att2 to attribute</del></li>
            <li><del>Add images to medals</del></li>
            <li><del>Change medal upload so that the guilted ver. upload happens from the call, not the API</del></li>
            <li><del>Change medal upload so that it can also upload boosted version</del></li>
            <li><del>Change medal upload form to include questions about boosted stats</del></li>
            <li><del>Add images to showcase boosted versions</del></li>
            <li><del>Add images to showcase guilted versions</del></li>
            <li><del>Add "votes" model and track vote counts through the model instead of raw #</del></li>
            <li><del>Add "medal no." to model</del></li>
            <li><del>Change 0, 1, 2 to say AOE, Upright, Speed, etc</del></li>
            <li><del>Add votes history to medal page (which medals did it win/lose against?)</del></li>
            <li><del>Add "slug" to model (name + boosted + guilted)</del></li>
            <li><del>Automatically create guilted version of medals</del></li>
            <li><del>Remove "isGuilted" from add form</del></li>
            <li><del>Make single medal component that takes imgpath, isguilted, isboosted, tier as props</del></li>
            <li><del>Make a "medal info" component to be reused in medal page and compete page</del></li>
            <li><del>Polish up the votes history listing: add medals</del></li>
            <li><del>Fix top medals algorithm to return top medals based on ratio! (right?)</del></li>
            <li><del>Make "upright", "reversed" etc. capitalized via CSS</del></li>
            <li><del>Clean up header</del></li>
            <li><del>Clean up footer</del></li>
            <li><del>Clean up styles</del></li>
            <li><del>GitHub!</del></li>
            <li><del>Deployment plan?</del></li>
            <li><del>Google Analytics</del></li>
            <li><del>Implement user session monitoring</del></li>
            <li><del>Add contact info</del></li>
          </ul>
        </div>
        <div className='col-xs-12 col-sm-4'>
          <h1>Upcoming Features</h1>
          <ul>
            <li>Format "add medal" form</li>
            <li>List/stream of recent votes</li>
            <li>More filtering options (by guilt, boost, tier, etc)</li>
            <li>Add link to boosted and guilted versions of medal in the medal profile.</li>
            <li>Better loading spinner</li>
            <li>Search results LIST</li>
            <li>Better Stats page / rankings</li>
            <li>Add ratio trend graph</li>
            <li>Add "medal showdown" feature to pit two medals specifically against each other</li>
            <li>Place a small advertisement square on the page</li>
          </ul>
        </div>
        <div className='col-xs-12 col-sm-4'>
          <h1>Bug Fixes</h1>
          <ul>
            <li><del>When I click "isBoosted", I cannot un-check it</del></li>
            <li>When I hover over a Boosted sign, I cannot click on the medal itself</li>
            <li>Guilt icon flickers when I click on medal</li>
            <li>No file type validation on the server side</li>
            <li>No number validation on "add" form</li>
          </ul>
        </div>
      </div>
    </div>
  );
}