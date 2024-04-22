import '../App.css';
import 'bootstrap';
import React from 'react';
import {Link} from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';



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
                        <button className="dropdown-toggle text-primary"
                            data-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded="false"
                          style={{
                            background: 'none',
                            color: 'inherit',
                            border: 'none',
                            padding: '0',
                            font: 'inherit',
                            cursor: 'pointer',
                            outline: 'inherit'
                          }}
                        >
                          Getting Started
                        </button>
                          {/* <h6 className="dropdown-toggle text-primary" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Getting Started</h6> */}
                          <div className="dropdown-menu">
                            <Link to="/" className="dropdown-item" href="#">Managing Your Feed</Link>
                            <Link to="/" className="dropdown-item" href="#">Post a Job</Link>
                            <Link to="/" className="dropdown-item" href="#">Post a Project</Link>
                          </div>
                        </div>
                      </div>
                    </div>
                    <hr className="my-1" /> {/* Horizontal divider after Row 2 */}
                    <div className="row">
                      <div className="col">
                        <div className="dropdown">
                        <button className="dropdown-toggle text-primary"
                            data-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded="false"
                          style={{
                            background: 'none',
                            color: 'inherit',
                            border: 'none',
                            padding: '0',
                            font: 'inherit',
                            cursor: 'pointer',
                            outline: 'inherit'
                          }}
                        >
                           Manage your Account
                        </button>
                      
                        

                          <div className="dropdown-menu">
                            <Link to="/" className="dropdown-item" href="#">Account Account</Link>
                            <Link to="accountsettings" className="dropdown-item" >Account Setting</Link>
                            <Link to="policyprivacy" className="dropdown-item">Privacy</Link>
                            <Link to="/" className="dropdown-item" >Notification</Link>
                          </div>
                        </div>
                      </div>
                    </div>
                    <hr className="my-1" />
                    <div className="row">
                      <div className="col">
                        <div className="dropdown">
                        <button className="dropdown-toggle text-primary"
                            data-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded="false"
                          style={{
                            background: 'none',
                            color: 'inherit',
                            border: 'none',
                            padding: '0',
                            font: 'inherit',
                            cursor: 'pointer',
                            outline: 'inherit'
                          }}
                        >
                          Build Your Profile
                        </button>
                          {/* <h6 className="dropdown-toggle text-primary" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Build Your Profile</h6> */}
                          <div className="dropdown-menu">
                            <Link to="/" className="dropdown-item" >Build User Profile</Link>
                            <Link to="/" className="dropdown-item" >Build Company Profile</Link>
                          </div>
                        </div>
                      </div>
                    </div>
                    <hr className="my-1" />
                    <div className="row">
                      <div className="col">
                        <h6><Link to="/" >Work With Client</Link></h6>
                      </div>
                    </div>
                    <hr className="my-1" />
                    <div className="row">
                      <div className="col">
                        <h6><Link to="/" >Discovering People</Link></h6>
                      </div>
                    </div>
                    <hr className="my-1" />
                    <div className="row">
                      <div className="col">
                        <h6> <Link to="/" >Reset Account</Link></h6>
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
                    <Link to="/forum" className="btn btn-primary">Visit Forum</Link>
                  </div>
                </div>
                <h6 className="mt-4">Popular Action</h6>
                <hr />
                <div className="row">
                  <div className="col-md-6">
                    <ul className="list-unstyled">
                      <li><Link to="/" >Change or Add Email Address</Link></li>
                      <li><Link to="/">Reset your password</Link></li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <ul className="list-unstyled">
                      <li><Link to="/">Build your Profile</Link></li>
                      <li><Link to="/">Close your account</Link></li>
                    </ul>
                  </div>
                </div>
                <h6 className="mt-4">Suggested for you</h6>
                <hr />
                <ul className="list-unstyled">
                  <li><Link to="frequentlyaskedquestions">Frequently Asked Questions (FAQs)</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        </>
    );
    }

export default HelpCenter;