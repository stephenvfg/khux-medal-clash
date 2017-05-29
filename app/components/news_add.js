import React, { Component } from 'react';
import NewsAddStore from '../stores/news_add_store';
import NewsAddActions from '../actions/news_add_actions';

class NewsAdd extends Component {
  constructor(props) {
    super(props);
    this.state = NewsAddStore.getState();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    NewsAddStore.listen(this.onChange);

    NewsAddActions.loggedIn();
  }

  componentWillUnmount() {
    NewsAddStore.unlisten(this.onChange);
  }

  onChange(state) {
    this.setState(state);
  }

  handleSubmit(event) {
    event.preventDefault();

    var user = this.state.user;

    var headline = this.state.headline.trim();
    var content = this.state.content.trim();
    var type = this.state.type.trim();

    var valid = true;

    if (!headline) {
      NewsAddActions.invalidHeadline();
      valid = false;
    }

    if (!content) {
      NewsAddActions.invalidContent();
      valid = false;
    }

    if (!type) {
      NewsAddActions.invalidType();
      valid = false;
    }

    if (valid) {
      NewsAddActions.addNews(headline, content, type, user._id);
    } else {
      toastr.error('Please fill out all fields.');
    }
  }

  render() {

    return (
      <div className='container'>
        <div className='row flipInX animated'>
          <div className='col-sm-8'>
            { this.state.user && this.state.user.contributor 
              ? (
                <div className='panel panel-default'>
                <div className='panel-heading'>Add News</div>
                  <div className='panel-body'>
                    <form onSubmit={this.handleSubmit.bind(this)} encType="multipart/form-data">
                      <div className={'form-group ' + this.state.typeValidationState}>
                        <label className='control-label'>Update Type: &nbsp;</label>
                        <div className='radio radio-inline'>
                          <input type='radio' name='type' id='feature' value='feature' checked={this.state.type === 'feature'}
                                 onChange={NewsAddActions.updateType}/>
                          <label htmlFor='feature'>New Feature</label>
                        </div>
                        <div className='radio radio-inline'>
                          <input type='radio' name='type' id='bug' value='bug' checked={this.state.type === 'bug'}
                                 onChange={NewsAddActions.updateType}/>
                          <label htmlFor='bug'>Bug Fix</label>
                        </div>
                        <div className='radio radio-inline'>
                          <input type='radio' name='type' id='medal' value='medal' checked={this.state.type === 'medal'}
                                 onChange={NewsAddActions.updateType}/>
                          <label htmlFor='medal'>Medal Update</label>
                        </div>
                        <div className='radio radio-inline'>
                          <input type='radio' name='type' id='announcement' value='announcement' checked={this.state.type === 'announcement'}
                                 onChange={NewsAddActions.updateType}/>
                          <label htmlFor='announcement'>Announcement</label>
                        </div>
                      </div>
                      <div className='col-sm-8'>
                        <div className={'form-group ' + this.state.headlineValidationState}>
                          <label className='control-label'>Headline</label>
                          <input type='text' className='form-control' ref='headlineTextField' value={this.state.headline}
                                 onChange={NewsAddActions.updateHeadline} autoFocus/>
                        </div>
                      </div>
                      <div className={'form-group ' + this.state.contentValidationState}>
                        <label className='control-label'>Content</label>
                        <textarea rows='4' type='text' className='form-control' ref='contentTextField' value={this.state.content}
                               onChange={NewsAddActions.updateContent} />
                      </div>
                      <button type='submit' className='btn btn-primary'>Submit</button>
                    </form>
                  </div>
                </div>
              ) 
              : (
                <div className='panel panel-default'>
                  <div className='panel-heading'>You must have 'Contributor' rights to add news updates.</div>
                </div>
              ) 
            }
          </div>
        </div>
      </div>
    );
  }
}

export default NewsAdd;