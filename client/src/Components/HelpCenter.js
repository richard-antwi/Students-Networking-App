import '../App.css';
import 'bootstrap';


function HelpCenter() {
    
      return (
        <>
        <div>
          <div className="container-fluid bg-primary text-white  mb-5" style={{top: '70px'}}>
            <div className="row">
              <div className="col">
                <div className="container text-center mt-5">
                  <div className="d-flex justify-content-center">
                    <h2>How Can we help you?</h2>
                  </div>
                  <div className="d-flex justify-content-center mb-3">
                    <form className="form-inline mt-3">
                      <div className="input-group">
                        <input type="text" className="form-control" placeholder="Search for help..." aria-label="Search" aria-describedby="button-addon2" />
                        <div className="input-group-append">
                          <button className="btn btn-secondary btn-block" type="submit" id="button-addon2">Submit</button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/*-----body container*/}
          <div className="container mt-5 mb-8">
            <div className="row">
              <div className="col-md-4">
                {/* Left side content here */}
                <div className="card">
                  <div className="card-body">
                    <div className="row">
                      <div className="col">
                        <h5><a href="home.html">Home</a></h5>
                      </div>
                    </div>
                    <hr className="my-1" /> {/* Horizontal divider after Row 1 */}
                    <div className="row">
                      <div className="col">
                        <div className="dropdown">
                          <h6 className="dropdown-toggle text-primary" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Getting Started</h6>
                          <div className="dropdown-menu">
                            <a className="dropdown-item" href="#">Managing Your Feed</a>
                            <a className="dropdown-item" href="#">Post a Job</a>
                            <a className="dropdown-item" href="#">Post a Project</a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <hr className="my-1" /> {/* Horizontal divider after Row 2 */}
                    <div className="row">
                      <div className="col">
                        <div className="dropdown">
                          <h6 className="dropdown-toggle text-primary" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Manage your Account</h6>
                          <div className="dropdown-menu">
                            <a className="dropdown-item" href="#">Account Account</a>
                            <a className="dropdown-item" href="#">Account Setting</a>
                            <a className="dropdown-item" href="#">Privacy</a>
                            <a className="dropdown-item" href="#">Notification</a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <hr className="my-1" />
                    <div className="row">
                      <div className="col">
                        <div className="dropdown">
                          <h6 className="dropdown-toggle text-primary" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Build Your Profile</h6>
                          <div className="dropdown-menu">
                            <a className="dropdown-item" href="#">Build User Profile</a>
                            <a className="dropdown-item" href="#">Build Company Profile</a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <hr className="my-1" />
                    <div className="row">
                      <div className="col">
                        <h6><a href="#">Work With Client</a></h6>
                      </div>
                    </div>
                    <hr className="my-1" />
                    <div className="row">
                      <div className="col">
                        <h6><a href="#">Discovering People</a></h6>
                      </div>
                    </div>
                    <hr className="my-1" />
                    <div className="row">
                      <div className="col">
                        <h6> <a href="#">Reset Account</a></h6>
                      </div>
                    </div>
                    <hr className="my-1" />
                  </div>
                </div>
              </div>
              <div className="col-md-8 mb-5">
                {/* Right side content here */}
                <div className="card">
                  <div className="card-body d-flex justify-content-between align-items-center">
                    <div>
                      <h5>Visit Our Help Forum</h5>
                      <p>View, ask, or answer questions about using LinkedIn. Our moderators and community can help!</p>
                    </div>
                    <button className="btn btn-primary">Visit Forum</button>
                  </div>
                </div>
                <h6 className="mt-4">Popular Action</h6>
                <hr />
                <div className="row">
                  <div className="col-md-6">
                    <ul className="list-unstyled">
                      <li><a href="#">Change or Add Email Address</a></li>
                      <li><a href="#">Reset your password</a></li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <ul className="list-unstyled">
                      <li><a href="#">Build your Profile</a></li>
                      <li><a href="#">Close your account</a></li>
                    </ul>
                  </div>
                </div>
                <h6 className="mt-4">Suggested for you</h6>
                <hr />
                <ul className="list-unstyled">
                  <li><a href="#">Frequently Asked Questions (FAQs)</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        </>
    );
    }

export default HelpCenter;