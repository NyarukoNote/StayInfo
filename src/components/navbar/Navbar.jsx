import "./navbar.css"
import logoImage from "../../img/koreatech.png";
import { Link } from 'react-router-dom';


const Navbar = () => {
  return (
    <div className="navbar">
      <div className="navContainer">
        <Link to="/" className="logoContainer">
          <img src={logoImage} alt="Koreatech Logo" className="logoImage" />
          <span className="logo">koreatech</span>
        </Link>
        <div className="navItems">
          {/* 다른 네비게이션 아이템들 */}
        </div>
      </div>
    </div>
  )
}

export default Navbar