import React, { Component } from 'react';
import { Link } from 'react-router';
import UserAdminStore from '../stores/user_admin_store';
import UserAdminActions from '../actions/user_admin_actions';

class UserAdmin extends Component {
  constructor(props) {
    super(props);
    this.state = UserAdminStore.getState();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    UserAdminStore.listen(this.onChange);

    UserAdminActions.getUserCount();
    UserAdminActions.loggedIn();

    var s = this.props.location.query.start ? this.props.location.query.start : 0;
    UserAdminActions.updateStart(s);
  }

  componentWillUnmount() {
    UserAdminStore.unlisten(this.onChange);
  }

  componentWillReceiveProps(nextProps) {
    UserAdminActions.updateStart(nextProps.location.query.start);
  }

  onChange(state) {
    this.setState(state);
  }

  updateStart(change) {
    var newStart = parseInt(this.state.start) + parseInt(change);
    if (newStart < 0) { newStart = 0; }
    UserAdminActions.updateStart(newStart);
  }

  render() {

    let usersList = this.state.users.map((user, index) => {
      return (
        <tr key={user._id}>
          <td>{user.username}</td>
          <td>{user.admin ? 'Admin' : 'Not Admin'}</td>
          <td>{user.contributor ? 'Contributor' : 'Not Contributor'}</td>
        </tr>
      );
    });

    return (
      <div className='container'>
        <div className='row flipInX animated'>
          <div className='col-sm-8'>
            { this.state.user && this.state.user.admin
              ? (
                <div className='panel panel-default'>
                  <table className='table table-striped'>
                    <thead>
                      <tr>
                        <th>List of Users</th>
                        <th><Link to={'/admin/?start=' + 
                            (this.state.start > 20 
                              ? (parseInt(this.state.start) - 20)
                              : 0)
                            }>&lt;&lt;</Link>
                        </th>
                        <th><Link to={'/admin/?start=' + 
                            (this.state.start < (this.state.totalUsers - 20)
                              ? (parseInt(this.state.start) + 20)
                              : parseInt(this.state.start))
                            }>&gt;&gt;</Link>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {usersList}
                    </tbody>
                  </table>
                </div>
              ) 
              : (
                <div className='panel panel-default'>
                  <div className='panel-heading'>Must be an admin user to access this page.</div>
                </div>
              ) 
            }
          </div>
        </div>
      </div>
    );
  }
}

export default UserAdmin;