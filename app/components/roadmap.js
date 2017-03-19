import React, { Component } from 'react';
import { Link } from 'react-router';
import RoadmapStore from '../stores/roadmap_store'
import RoadmapActions from '../actions/roadmap_actions';

export default class Roadmap extends Component {
  constructor(props) {
    super(props);
    this.state = RoadmapStore.getState();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    RoadmapStore.listen(this.onChange);
  }

  componentWillUnmount() {
    RoadmapStore.unlisten(this.onChange);
  }

  onChange(state) {
    this.setState(state);
  }

  render() {
    return (
        <div className='container roadmap'>
          <div className='row'>
            <div className='col-xs-12 col-sm-4'>
              <h1>Launch checklist</h1>
              <ul>
                <li>Format "add medal" form</li>
                <li>Hide "add medal" form from public (authentication?)</li>
                <li>Add 3 second timer between votes to prevent vote spamming</li>
                <li>Captcha after first 7 clicks - include note about not being a dick and cookie the response</li>
                <li>Close the API from unauthenticated calls</li>
                <li>GitHub!</li>
                <li>Scrape KH UX wiki with script to retrieve all medal data</li>
                <li>Implement user session monitoring</li>
                <li>Google Analytics</li>
                <li>Deployment plan?</li>
              </ul>
              <h1>Done</h1>
              <ul>
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
              </ul>
            </div>
            <div className='col-xs-12 col-sm-4'>
              <h1>Upcoming Features</h1>
              <ul>
                <li>More filtering options (by guilt, boost, tier, etc)</li>
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
}