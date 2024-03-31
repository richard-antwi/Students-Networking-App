
import {Link} from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
function Footer() {
    return (
      <>
    <footer className="bg-white text-dark py-3">
      <div className="container">
        <div className="row">
          <div className="col-md-10 mx-0">
            <ul className="list-inline">
              <li className="list-inline-item"><Link to="help_center" className="text-muted">Help Center |</Link></li>
              <li className="list-inline-item"><Link to="about" className="text-muted">About |</Link></li>
              <li className="list-inline-item"><Link to="privacy_policy" className="text-muted">Privacy Policy |</Link></li>
              <li className="list-inline-item"><Link to="cookies_policy" className="text-muted">Cookies Policy |</Link></li>
              <li className="list-inline-item"><Link to="forum" className="text-muted">Forum |</Link></li>
              <li className="list-inline-item"><Link to="copyright_policy" className="text-muted">Copyright Policy</Link></li>
            </ul>
          </div>
          <div className="col-md-2">
            <p className="text-md-end text-muted">© 2024 Social Netwroking App.</p>
          </div>
        </div>
      </div>
    </footer>
    </>
  );
}

export default Footer;