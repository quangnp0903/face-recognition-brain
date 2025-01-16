import Tilt from 'react-parallax-tilt';
import brain from './brain.png';
import './Logo.css';

const Logo = () => {
  return (
    <div className="ma4 mt0 Tilt">
      <Tilt tiltMaxAngleX={55}>
        <div
          className="br2 shadow-2 Tilt-content"
          style={{ height: '150px', width: '150px' }}
        >
          <h1 className="pa3">
            <img src={brain} alt="logo" />
          </h1>
        </div>
      </Tilt>
    </div>
  );
};
export default Logo;
