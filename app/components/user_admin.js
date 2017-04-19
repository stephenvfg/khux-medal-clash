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

    var i = this.props.location.query.i ? this.props.location.query.i : 0;
    UserAdminActions.updateIndex(i);
  }

  componentWillUnmount() {
    UserAdminStore.unlisten(this.onChange);
  }

  componentWillReceiveProps(nextProps) {
    UserAdminActions.updateIndex(nextProps.location.query.i);
  }

  onChange(state) {
    this.setState(state);
  }

  updateIndex(change) {
    var newIndex = parseInt(this.state.i) + parseInt(change);
    if (newIndex < 0) { newIndex = 0; }
    UserAdminActions.updateIndex(newIndex);
  }

  handleContributorUpdate(event) {
    event.preventDefault();

    let id = event.target.getAttribute('data-id');
    let contributor = event.target.value;

    UserAdminActions.updateContributor(id, contributor);
  }

  handleAdminUpdate(event) {
    event.preventDefault();

    let id = event.target.getAttribute('data-id');
    let admin = event.target.value;

    UserAdminActions.updateAdmin(id, admin);
  }

  render() {

    let usersList = this.state.users.map((user, index) => {
      return (
        <tr key={user._id}>
          <td>{user.username}</td>
          <td>
            <button className='btn btn-default' 
                data-id={user._id} 
                value={!user.admin} 
                onClick={this.handleAdminUpdate.bind(this)}>
              {user.admin ? 'Remove Admin' : 'Make Admin'}
            </button>
          </td>
          <td>
            <button className='btn btn-default' 
                data-id={user._id} 
                value={!user.contributor} 
                onClick={this.handleContributorUpdate.bind(this)}>
              {user.contributor ? 'Remove Contributor' : 'Make Contributor'}
            </button>
          </td>
          <td></td>
        </tr>
      );
    });

    return (
      <div className='container'>
        { this.state.successMessage 
          ? (
            <div className='row flipInX animated'>
              <div className='col-sm-8'>
                <div className='panel panel-default'>
                  <div className='panel-heading'>{ this.state.successMessage }</div>
                </div>
              </div>
            </div>
            )
          : ('')
        }
        <div className='row flipInX animated'>
          <div className='col-sm-8'>
            { this.state.user && this.state.user.admin
              ? (
                <div className='panel panel-default'>
                  <table className='table table-striped'>
                    <thead>
                      <tr>
                        <th>List of Users</th>
                        <th>Admin Access</th>
                        <th>Contributor Access</th>
                        <th><Link to={'/admin/?i=' + 
                            (this.state.i > 20 
                              ? (parseInt(this.state.i) - 20)
                              : 0)
                            }>&lt;&lt;</Link>
                            &nbsp;&nbsp;
                            <Link to={'/admin/?i=' + 
                            (this.state.i < (this.state.totalUsers - 20)
                              ? (parseInt(this.state.i) + 20)
                              : parseInt(this.state.i))
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
                  <div className='panel-heading'>You must be an admin user to access this page.</div>
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