import React, { Component } from 'react';
import { Link } from 'react-router';
import NewsStore from '../stores/news_store';
import NewsActions from '../actions/news_actions';
import DOMPurify from 'dompurify'

class News extends Component {
  constructor(props) {
    super(props);
    this.state = NewsStore.getState();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    NewsStore.listen(this.onChange);

    NewsActions.getNewsCount();

    var i = this.props.location.query.i ? this.props.location.query.i : 0;
    NewsActions.updateIndex(i);
  }

  componentWillUnmount() {
    NewsStore.unlisten(this.onChange);
  }

  componentWillReceiveProps(nextProps) {
    NewsActions.updateIndex(nextProps.location.query.i);
  }

  onChange(state) {
    this.setState(state);
  }

  updateIndex(change) {
    var newIndex = parseInt(this.state.i) + parseInt(change);
    if (newIndex < 0) { newIndex = 0; }
    NewsActions.updateIndex(newIndex);
  }

  render() {

    let newsList = this.state.news.map((item, index) => {

      var dateHumanReadable = new Date(item.date).toDateString();

      return (
        <tr key={item._id}>
          <td className='date-col v-top'>
            <span className={item.type}>{item.type}</span>
            <h5>{dateHumanReadable}</h5>
          </td>
          <td className='news-col' colSpan='2'>
            <h3>{item.headline}</h3>
            <p dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(item.content)}}></p>
          </td>
        </tr>
      );
    });

    return (
      <div className='container news-panel'>
        <div className='row animated'>
          <div className='col-sm-8'>
            <div className='panel panel-default'>
              <table className='table table-striped'>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Update</th>
                    <th className='right-align'><Link to={'/news/?i=' + 
                        (this.state.i > 10 
                          ? (parseInt(this.state.i) - 10)
                          : 0)
                        }>&lt;&lt;</Link>
                        &nbsp;&nbsp;
                        <Link to={'/news/?i=' + 
                        (this.state.i < (this.state.totalNews - 10)
                          ? (parseInt(this.state.i) + 10)
                          : parseInt(this.state.i))
                        }>&gt;&gt;</Link>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {newsList}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default News;