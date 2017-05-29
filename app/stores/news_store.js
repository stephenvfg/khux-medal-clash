import alt from '../alt';
import NewsActions from '../actions/news_actions';

class NewsStore {
  constructor() {
    this.bindActions(NewsActions);

    this.totalNews = 0;
    this.news = [];
    this.i = 0;
  }

  onGetNewsSuccess(data) {
    if (!data.message) {
      this.news = data;
    }
  }

  onGetNewsFail(jqXhr) {
    toastr.error(jqXhr.responseJSON.message);
  }

  onUpdateIndex(i) {
    this.i = i;
    NewsActions.getNews(this.i);
  }

  onGetNewsCountSuccess(data) {
    this.totalNews = data.count;
  }

  onGetNewsCountFail(jqXhr) {
    toastr.error(jqXhr.responseJSON.message);
  }
}

export default alt.createStore(NewsStore);