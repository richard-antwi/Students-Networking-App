import avatar from '../Images/avatar.webp';
{/* <img src={logo} className="App-logo" alt="logo" /> */}
function NavBar() {
  return (
    <>
      {/* Navigation Bar */}
      <nav className="navbar navbar-expand-md navbar-dark bg-primary fixed-top">
      <a className="navbar-brand" href="home.html">Social Networking App</a>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon" />
      </button>
      <form className="form-inline my-2 my-lg-0">
        <div className="input-group">
          <input className="form-control" type="search" placeholder="Search" aria-label="Search" />
          <div className="input-group-append">
            <button className="btn btn-success" type="submit">Search</button>
          </div>
        </div>
      </form>
      <div className="collapse navbar-collapse mt-3" id="navbarNav">
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <div className="d-flex flex-column align-items-center">
              <i className="fas fa-home" style={{color: 'white'}} />
              <a className="nav-link" href="Home.html">Home</a>
            </div>
          </li>
          <li className="nav-item">
            <div className="d-flex flex-column align-items-center">
              <i className="fas fa-puzzle-piece" style={{color: 'white'}} />
              <a className="nav-link" href="projects.html">Projects</a>
            </div>
          </li>
          <li className="nav-item">
            <div className="d-flex flex-column align-items-center">
              <i className="fas fa-users" style={{color: 'white'}} />
              <a className="nav-link" href="profiles.html">Profiles</a>
            </div>
          </li>
          <li className="nav-item">
            <div className="d-flex flex-column align-items-center">
              <i className="fas fa-message" style={{color: 'white'}} />
              <a className="nav-link" href="messages.html">Messages</a>
            </div>
          </li>
          <li className="nav-item">
            <div className="d-flex flex-column align-items-center">
              <i className="fas fa-bolt" style={{color: 'white'}} />
              <a className="nav-link" href="notification.html">Notification</a>
            </div>
          </li>
          <li>
            <div className="dropdown mr-3">
              <a className="nav-link dropdown-toggle" href="avatar.html" role="button" id="profileDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <img src={avatar} alt="Avatar" className="avatar-img small-avatar" />
                John Doe
              </a>
              <div className="dropdown-menu mr-5" aria-labelledby="profileDropdown">
                {/* Dropdown items go here */}
                <div className="dropdown-item">
                  <p>Online Status</p>
                  <div className="dropdown-divider" />
                  <div className="form-check">
                    <input className="form-check-input" type="radio" name="status" id="onlineRadio" defaultChecked />
                    <label className="form-check-label" htmlFor="onlineRadio">
                      Online
                    </label>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" type="radio" name="status" id="offlineRadio" />
                    <label className="form-check-label" htmlFor="offlineRadio">
                      Offline
                    </label>
                  </div>
                </div>
                <div className="dropdown-divider" />
                <div className="dropdown-item">
                  <h6>Custom Status</h6>
                </div>
                <div className="dropdown-divider" />
                {/* Input field and Submit button */}
                <div className="dropdown-item">
                  <form>
                    <div className="form-group">
                      <input type="text" className="form-control" id="customStatusInput" placeholder="Enter custom status" />
                      <button type="submit" className="btn btn-primary">OK</button>
                    </div>
                  </form>
                </div>
                <div className="dropdown-divider" />
                <div className="dropdown-item">
                  <h6>Settings</h6>
                </div>
                <div className="dropdown-divider" />
                <a className="dropdown-item" href="profile_account_settings.html">Acount Settings</a>
                <a className="dropdown-item" href="policy_privacy.html">Privacy</a>
                <a className="dropdown-item" href="frequently_asked_questions.html">FAQs</a>
                <a className="dropdown-item" href="terms_and_conditions.html">Terms &amp; Conditions</a>
                <div className="dropdown-divider" />
                <div className>
                  <a className="dropdown-item" href="logout.html">Logout</a>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </nav>
    </>
  );
}

export default NavBar;




