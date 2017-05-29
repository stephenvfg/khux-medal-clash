import alt from '../alt';

class NewsActions {

  constructor() {
    this.generateActions(
      'getNewsSuccess',
      'getNewsFail',
      'updateIndex',
      'getNewsCountSuccess',
      'getNewsCountFail',
    );
  }

  getNews(start) {

    var urlParam = start ? '?start='+start : '';

    $.ajax({ url: '/api/news' + urlParam })
      .done((data) => {
        this.actions.getNewsSuccess(data);
      })
      .fail((jqXhr) => {
        this.actions.getNewsFail(jqXhr);
      });
  }

  getNewsCount() {
    $.ajax({ url: '/api/news/count' })
      .done((data) => {
        this.actions.getNewsCountSuccess(data)
      })
      .fail((jqXhr) => {
        this.actions.getNewsCountFail(jqXhr)
      });
  }
}

export default alt.createActions(NewsActions);