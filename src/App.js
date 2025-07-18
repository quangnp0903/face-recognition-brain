import { Component } from 'react';
import ParticlesBg from 'particles-bg';

import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Logo from './components/Logo/Logo';
import Navigation from './components/Navigation/Navigation';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import Modal from './components/Modal/Modal';
import Profile from './components/Profile/Profile';
import fetchApi from './utils/fetchApi';

import './App.css';

const initialState = {
  input: '',
  imageUrl: null,
  boxes: [],
  route: 'signin',
  isSignedIn: false,
  isProfileOpen: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: '',
    pet: '',
    age: '',
  },
};

class App extends Component {
  constructor() {
    super();
    this.state = { ...initialState };
  }

  componentDidMount() {
    const token = window.sessionStorage.getItem('token');
    if (token) {
      fetchApi('http://localhost:3001/signin', 'post', null, token)
        .then((data) => {
          if (data && data.id) {
            fetchApi(
              `http://localhost:3001/profile/${data.id}`,
              'get',
              null,
              token
            ).then((user) => {
              if (user && user.email) {
                this.loadUser(user);
                this.onRouteChange('home');
              }
            });
          }
        })
        .catch(console.log);
    }
  }

  loadUser = (data) => {
    const { id, name, email, entries, joined, age, pet } = data;
    this.setState({ user: { id, name, email, entries, joined, age, pet } });
  };

  calculateFaceLocations = (data) => {
    // const clarifaiFace =
    //   data.outputs[0].data.regions[0].region_info.bounding_box;
    const clarifaiFaces = data?.[0]?.data?.regionsList;

    if (!clarifaiFaces) return [];

    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);

    const dimensions = clarifaiFaces.map((face) => {
      const dimension = face.regionInfo.boundingBox;
      return {
        leftCol: dimension.leftCol * width,
        topRow: dimension.topRow * height,
        rightCol: width - dimension.rightCol * width,
        bottomRow: height - dimension.bottomRow * height,
      };
    });

    return dimensions;
  };

  displayFaceBoxes = (boxes) => {
    this.setState({ boxes });
  };

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  };

  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input });
    const token = window.sessionStorage.getItem('token');

    fetchApi(
      'http://localhost:3001/imageurl',
      'post',
      {
        input: this.state.input,
      },
      token
    )
      .then((response) => {
        if (response) {
          fetchApi(
            'http://localhost:3001/image',
            'put',
            {
              id: this.state.user.id,
            },
            token
          )
            .then((count) => {
              this.setState(Object.assign(this.state.user, { entries: count }));
            })
            .catch(console.log);
        }
        this.displayFaceBoxes(this.calculateFaceLocations(response));
      })
      .catch((err) => console.log(err));
  };

  onRouteChange = (route) => {
    if (route === 'signout') {
      return this.setState(initialState);
    } else if (route === 'home') {
      this.setState({ isSignedIn: true });
    }
    this.setState({ route });
  };

  toggleModal = () => {
    this.setState((prevState) => ({
      ...prevState,
      isProfileOpen: !prevState.isProfileOpen,
    }));
  };

  render() {
    const { isSignedIn, boxes, route, imageUrl, user, isProfileOpen } =
      this.state;

    return (
      <div className="App">
        <ParticlesBg type="cobweb" bg={true} num={30} />
        <Navigation
          isSignedIn={isSignedIn}
          onRouteChange={this.onRouteChange}
          toggleModal={this.toggleModal}
        />
        {isProfileOpen && (
          <Modal>
            <Profile
              isProfileOpen={isProfileOpen}
              toggleModal={this.toggleModal}
              loadUser={this.loadUser}
              user={user}
            />
          </Modal>
        )}
        {route === 'home' ? (
          <div>
            <Logo />
            <Rank name={user.name} entries={user.entries} />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}
            />
            <FaceRecognition boxes={boxes} imageUrl={imageUrl} />
          </div>
        ) : route === 'signin' ? (
          <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
        ) : (
          <Register
            loadUser={this.loadUser}
            onRouteChange={this.onRouteChange}
          />
        )}
      </div>
    );
  }
}

export default App;
