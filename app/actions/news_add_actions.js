import alt from '../alt';

class NewsAddActions {
  constructor() {
    this.generateActions(
      'loggedInSuccess',
      'loggedInFail',
      'newsAddSuccess',
      'newsAddFail',
      'updateHeadline',
      'updateContent',
      'updateType',
      'invalidHeadline',
      'invalidContent',
      'invalidType'
    );
  }

  loggedIn() {
    $.ajax({ url: '/api/login' })
      .done((data) => {
        this.actions.loggedInSuccess(data.user);
      })
      .fail((jqXhr) => {
        this.actions.loggedInFail();
      });
  }

  addNews(headline, content, type, author) {

    $.ajax({
      type: 'POST',
      url: '/api/news',
      data: { 
        headline: headline,
        content: content,
        type: type,
        author: author
      }
    })
      .done((data) => {
        this.actions.newsAddSuccess(data.message);
      })
      .fail((jqXhr) => {
        this.actions.newsAddFail(jqXhr.responseJSON.message);
      });
  }
}

export default alt.createActions(NewsAddActions);