import React from 'react';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';

class ProfileIcon extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: false,
    };
  }

  toggle = () => {
    this.setState((prevState) => ({
      dropdownOpen: !prevState.dropdownOpen,
    }));
  };

  signOut = () => {
    fetch('http://localhost:3001/signout', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: window.sessionStorage.getItem('token'),
      },
    })
      .then((response) => {
        if (response.status === 200) {
          window.sessionStorage.removeItem('token');
          this.props.onRouteChange('signout');
        }
      })
      .catch((err) => {
        console.error('Sign out error:', err);
      });
  };

  render() {
    return (
      <div className="pa4 tc">
        <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
          <DropdownToggle data-toggle="dropdown" tag="span">
            <img
              src="https://tachyons.io/components/avatars/circle-border/screenshot.jpg"
              className="br-100 ba h3 w3 dib"
              alt="avatar"
            />
          </DropdownToggle>
          <DropdownMenu
            direction="end"
            className="b--transparent shadow-5"
            style={{
              marginTop: '20px',
              backgroundColor: 'rgba(255, 255, 255, 0.5)',
            }}
          >
            <DropdownItem onClick={this.props.toggleModal}>
              View Profile
            </DropdownItem>
            <DropdownItem onClick={this.signOut}>Sign Out</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    );
  }
}

export default ProfileIcon;
