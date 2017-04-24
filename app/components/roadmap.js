import React, { Component } from 'react';
import { Link } from 'react-router';

export default (props) => {

  return (
    <div className='container roadmap'>
      <div className='row'>
        <div className='col-xs-12 col-sm-4'>
          <h1>Launch checklist</h1>
          <ul>
            <li>FINAL CLEANUP: Check for any personal / irrelvant information, clean up this roadmap page</li>
            <li>FINAL CLEANUP: Verify all important user flows/paths</li>
          </ul>
        </div>
        <div className='col-xs-12 col-sm-4'>
          <h1>Upcoming Features</h1>
          <ul>
            <li>Add placeholder content where things load (for example: medal image placeholder)</li>
            <li>Add "help needed" section</li>
            <li>Externalize strings into separate file for internationalization</li>
            <li>Add pagination to the medal listing pages</li>
            <li>Add pagination for votes history for each medal</li>
            <li>Add ability to compare two specific medals</li>
            <li>Format "add medal" form</li>
            <li>List/stream of recent votes</li>
            <li>More filtering options (by guilt, boost, tier, etc)</li>
            <li>Add link to boosted and guilted versions of medal in the medal profile.</li>
            <li>Better loading spinners and placeholder graphics</li>
            <li>Search results LIST</li>
            <li>Better Stats page / rankings</li>
            <li>Add ratio trend graph</li>
            <li>Add "medal showdown" feature to pit two medals specifically against each other</li>
            <li>Place a small advertisement square on the page</li>
            <li>Improve password reset experience (emails, messages)</li>
            <li>Automatically log in once password is reset</li>
            <li>More email notifications about things?</li>
            <li>Prettier emails</li>
          </ul>
        </div>
        <div className='col-xs-12 col-sm-4'>
          <h1>Bug Fixes</h1>
          <ul>
            <li>Issue with adding medals: if the image file has '&' in it then it fails to upload</li>
            <li>Issue with adding medals: if there is already a medal with same name/slug, it says the add succeeded even if it actually fails</li>
            <li>So many validation issues with adding and editing medals... regarding the name of the medal, whether or not it has guilted/boosted, and also the slug being unique</li>
            <li>If I deactivate a medal, the votes history for other medals including that medal show up as 'Loading...' with an error message. See api/medals/vote/:id</li>
            <li>Search doesn't work when searching for guilted or boosted medals</li>
            <li><del>When I click "isBoosted", I cannot un-check it</del></li>
            <li>When I hover over a Boosted sign, I cannot click on the medal itself</li>
            <li>Guilt icon flickers when I click on medal</li>
            <li>No file type validation on the server side</li>
            <li>No number validation on "add" form</li>
            <li>On medal add form, if I check then uncheck 'isBoosted', the boost fields stay visible.</li>
            <li><del>On admin page when not logged in as admin: Uncaught TypeError: this.state.users.map is not a function</del></li>
          </ul>
        </div>
        <div className='col-xs-12 col-sm-12'>
          <h1>Done</h1>
          <ul>
            <li><del>ssl and paid heroku dyno</del></li>
            <li><del>Add "HOW THIS WORKS" section... medals in system (boosted/guilted) --> vote --> generate stats --> vote more --> create geniune ranking list --> view other info</del></li>
            <li><del>Ask to sign in / make user account after first 7 clicks: "You can play without registering BUT if you register you get to ..."</del></li>
            <li><del>Add personal votes history page</del></li>
            <li><del>Add ability to undo vote</del></li>
            <li><del>Review medal retrieval logic so that the 'newest' medals get a lot of votes to catch up</del></li>
            <li><del>Remove legacy image paths and API endpoints</del></li>
            <li><del>Refine image compete API logic: dont compete two of the same medal, etc</del></li>
            <li><del>Review the if '(winner.voted || loser.voted) return res.status(200).end();' logic</del></li>
            <li><del>Help get to 100k votes -- format votes bar, dismissable, minimum 20% width to see count</del></li>
            <li><del>Make image blank space a little larger by default</del></li>
            <li><del>Add all medals</del></li>
            <li><del>Set up AWS S3 for image storage: https://devcenter.heroku.com/articles/s3</del></li>
            <li><del>Change image path and rendering logic to fit AWS</del></li>
            <li><del>Replace success/fail messaging with proper toastr messaging (or other?)</del></li>
            <li><del>Add medals edit page</del></li>
            <li><del>Add links to guilted/booted versions of medals to medal info page</del></li>
            <li><del>Add mixpanel tracking links for all relevant links</del></li>
            <li><del>Clean up UI for contributor page</del></li>
            <li><del>Contributor panel: ability to view medals you've added, edit medals</del></li>
            <li><del>Terms of Service + any other legal shit</del></li>
            <li><del>Error message for email or username that's already taken ON SIGN UP</del></li>
            <li><del>Format the login dropdown</del></li>
            <li><del>Validation for the login dropdown</del></li>
            <li><del>Error messaging for bad login attempts</del></li>
            <li><del>ADMIN PANEL: ability to edit user rights</del></li>
            <li><del>User settings page: change username, password, email</del></li>
            <li><del>Collect email from user at login</del></li>
            <li><del>Generate new password</del></li>
            <li><del>On load, automatically check for login and display user login</del></li>
            <li><del>Add "boost amount" to medals</del></li>
            <li><del>Add user info to medal submits</del></li>
            <li><del>Add user info to medal votes</del></li>
            <li><del>Make 'contributer' user account type with validations</del></li>
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
      </div>
    </div>
  );
}