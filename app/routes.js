import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './components/app';
import MedalCompete from './components/medal_compete';
import MedalAdd from './components/medal_add';
import Medal from './components/medal';
import MedalVotes from './components/medal_votes';
import MedalList from './components/medal_list';
import Stats from './components/stats';
import Roadmap from './components/roadmap';
import User from './components/user';
import UserAdmin from './components/user_admin';
import UserReset from './components/user_reset';

export default (
  <Route path='/' component={App}>
    <IndexRoute component={MedalCompete} />
    <Route path='/add' component={MedalAdd} />
    <Route path='/medals/:slug' component={Medal} />
    <Route path='/stats' component={Stats} />
    <Route path='/votes' component={MedalVotes} />
    <Route path='/roadmap' component={Roadmap} />
    <Route path='/profile' component={User} />
    <Route path='/admin' component={UserAdmin} />
    <Route path='/reset/:token' component={UserReset} />
    <Route path=':category' component={MedalList}>
      <Route path=':attribute' component={MedalList}>
        <Route path=':affinity' component={MedalList} />
      </Route>
    </Route>
  </Route>
);