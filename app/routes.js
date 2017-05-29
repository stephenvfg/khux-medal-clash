import React from 'react';
import { Route, IndexRoute, Redirect } from 'react-router';

import App from './components/app';
import MedalCompete from './components/medal_compete';
import MedalAdd from './components/medal_add';
import MedalEdit from './components/medal_edit';
import Medal from './components/medal';
import MedalList from './components/medal_list';
import Stats from './components/stats';
import Roadmap from './components/roadmap';
import TOS from './components/tos';
import HowThisWorks from './components/how_this_works';
import User from './components/user';
import UserVotes from './components/user_votes';
import UserAdmin from './components/user_admin';
import NewsAdd from './components/news_add';
import News from './components/news';
import UserContributor from './components/user_contributor';
import UserReset from './components/user_reset';
import NotFound from './components/not_found';

export default (
  <Route path='/' component={App}>
    <IndexRoute component={MedalCompete} />
    <Route path='/add' component={MedalAdd} />
    <Route path='/edit/:slug' component={MedalEdit} />
    <Route path='/medal/:slug' component={Medal} />
    <Route path='/stats' component={Stats} />
    <Route path='/roadmap' component={Roadmap} />
    <Route path='/tos' component={TOS} />
    <Route path='/howto' component={HowThisWorks} />
    <Route path='/profile' component={User} />
    <Route path='/votes' component={UserVotes} />
    <Route path='/admin' component={UserAdmin} />
    <Route path='/news' component={News} />
    <Route path='/news/add' component={NewsAdd} />
    <Route path='/contributor' component={UserContributor} />
    <Route path='/reset/:token' component={UserReset} />
    <Route path='/medals/:category' component={MedalList}>
      <Route path=':attribute' component={MedalList}>
        <Route path=':affinity' component={MedalList} />
      </Route>
    </Route>
    <Route path='/404' component={NotFound} />
    <Redirect from='*' to='/404' />
  </Route>
);