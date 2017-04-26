import React, { Component } from 'react';
import { Link } from 'react-router';

export default (props) => {

  return (
    <div className='container roadmap'>
      <div className='row'>
        <div className='col-xs-12 col-sm-6'>
          <h1>Upcoming changes</h1>
          <ul className='features'>
            <li>
              <h3>Search results</h3>
              <span>Add a search results page so that users can access all possible matches to their search (vs. exact match)</span>
            </li>
            <li>
              <h3>Better filtering options</h3>
              <span>Add the ability to filter medals by affinity, attribute, tier, target, etc</span>
            </li>
            <li>
              <h3>More medal categories</h3>
              <span>Categorize medals by usage/type ("attackers", "buffers", "healers", "defensive", etc)</span>
            </li>
            <li>
              <h3>Nicer loading placeholders</h3>
              <span>Add placeholder images or animations so that the site looks nicer as content loads</span>
            </li>
            <li>
              <h3>Medal list pagination</h3>
              <span>Add pagination on pages with lists of medals (for example, the Top 100 page) so that it's easier to browse the medals</span>
            </li>
            <li>
              <h3>User profile page</h3>
              <span>Add a public-facing profile page for users with accounts. The profile page will have information on past votes, self-identified "favorite" medals, and user-specific stats like "preferred attribute/affinity"</span>
            </li>
            <li>
              <h3>Medal votes pagination</h3>
              <span>Add pagination to votes history on medal pages so that users can browse all votes</span>
            </li>
            <li>
              <h3>Compare medals</h3>
              <span>New page to compare two medals side-by-side</span>
            </li>
            <li>
              <h3>Recent votes activity</h3>
              <span>Create an area where users can see all recent votes</span>
            </li>
            <li>
              <h3>Medal trends</h3>
              <span>Add trends over time to medal pages</span>
            </li>
            <li>
              <h3>Medal showdown</h3>
              <span>Ability to pit two medals against each other and host the competition on external sites</span>
            </li>
            <li>
              <h3>Improved profile information</h3>
              <span>Profile information and password reset experiences should be smoother</span>
            </li>
            <li>
              <h3>Nicer emails</h3>
              <span>Modify email format so that it's nicer and doesn't look so spammy</span>
            </li>
          </ul>
        </div>
        <div className='col-xs-12 col-sm-6'>
          <h1>Known issues</h1>
          <ul className='issues'>
            <li>
              <h3>Search issues</h3>
              <span>Searching for guilted or boosted medals doesn't work. Same thing for medals with special characters.</span>
            </li>
            <li>
              <h3>Can't click on boosted/guilted symbols</h3>
              <span>When I hover over a guilt or boosted symbol, I cannot click on the medal itself</span>
            </li>
            <li>
              <h3>Guilt icon flicker</h3>
              <span>Guilt icon flickers when I click on medal to vote for it</span>
            </li>
            <li>
              <h3>Medals with special characters not appearing on mobile</h3>
              <span>Images with a file name containing a special character (like Saix, Namine, etc) are not loading on mobile devices</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}