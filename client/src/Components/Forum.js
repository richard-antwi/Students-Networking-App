import avatar from '../Images/avatar.webp';
import {Link} from 'react-router-dom';
import 'bootstrap'; 
// import NavBar from '../Components/NavBar';

function Forum() {
    return (
        <>
        {/* <NavBar />  */}
         <nav className="navbar navbar-expand-md navbar-dark bg-white mt-4">
            <div className="collapse navbar-collapse " id="navbarNav">
              <ul className="navbar-nav mr-auto ml-5">
                <li className="nav-item">
                  <div className="d-flex flex-column align-items-center">
                    <Link to="/" className="nav-link" id="color" >Latest</Link>
                  </div>
                </li>
                <li className="nav-item">
                  <div className="d-flex flex-column align-items-center">
                    <Link to="/" className="nav-link " id="color" >Unanswered</Link>
                  </div>  
                </li>
                <li className="nav-item">
                  <div className="d-flex flex-column align-items-center">
                    <Link className="nav-link" id="color" >Trending</Link>
                  </div>
                </li>
                <li className="nav-item">
                  <div className="d-flex flex-column align-items-center">
                    <Link to="/" className="nav-link" id="color" >Popular This Week</Link>
                  </div>
                </li>
                <li className="nav-item">
                  <div className="d-flex flex-column align-items-center">
                    <Link to="/" className="nav-link" id="color" >Popular of Month</Link>
                  </div>
                </li>
                <li className="nav-item">
                  <div className="d-flex flex-column align-items-center">
                    <i className="fas fa-message" style={{color: 'white'}} />
                    <a className="nav-link" href="messages.html">Messages</a>
                  </div>
                </li>
              </ul>
            </div>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon" />
            </button>

            <button class="btn btn-primary text-white" type="submit">Ask a Question</button>
          </nav>
        
        <div>
          <div className="container mt-5">
            <div className="row">
              {/* Left Column with a larger width */}
              <div className="col-lg-8">
                <div className="card">
                  <div className="card-body">
                    <div className="row">
                      {/* Left Section (Avatar) */}
                      <div className="col-md-2">
                        <img src={avatar} className="img-fluid rounded-circle" alt="Avatar" />
                      </div>
                      {/* Center Section (Text) */}
                      <div className="col-md-7">
                        <p>Your text goes here. Lorem ipsum dolor sit amet.</p>
                        {/* Vote, Comment, and View Icons */}
                        <div className="d-flex justify-content-between mt-3">
                          <div>
                            <i className="fas fa-heart" />
                            <span className="ml-1">Vote</span>
                            <span className="ml-1">10</span>
                          </div>
                          <div>
                            <i className="fas fa-comment" />
                            <span className="ml-1">Comment</span>
                            <span className="ml-1">5</span>
                          </div>
                          <div>
                            <i className="fas fa-eye" />
                            <span className="ml-1">View</span>
                            <span className="ml-1">20</span>
                          </div>
                        </div>
                        {/* Buttons */}
                        <div className="mt-3">
                          <button type="button" className="btn btn-primary">Work</button>
                          <button type="button" className="btn btn-success ml-2">Php</button>
                          <button type="button" className="btn btn-info ml-2">Design</button>
                        </div>
                      </div>
                      {/* Right Section (Time) */}
                      <div className="col-md-3 text-right">
                        <p>Posted at: 2024-01-30 12:34 PM</p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Horizontal Line */}
                <hr className="my-3" />
                {/* Second Card (Repeat the structure) */}
                <div className="card">
                  <div className="card-body">
                    <div className="row">
                      {/* Left Section (Avatar) */}
                      <div className="col-md-2">
                        <img src={avatar} className="img-fluid rounded-circle" alt="" />
                      </div>
                      <div className="col-md-7">
                        <p>Your text goes here. Lorem ipsum dolor sit amet.</p>
                        {/* Vote, Comment, and View Icons */}
                        <div className="d-flex justify-content-between mt-3">
                          <div>
                            <i className="fas fa-heart" />
                            <span className="ml-1">Vote</span>
                            <span className="ml-1">10</span>
                          </div>
                          <div>
                            <i className="fas fa-comment" />
                            <span className="ml-1">Comment</span>
                            <span className="ml-1">5</span>
                          </div>
                          <div>
                            <i className="fas fa-eye" />
                            <span className="ml-1">View</span>
                            <span className="ml-1">20</span>
                          </div>
                        </div>
                        {/* Buttons */}
                        <div className="mt-3">
                          <button type="button" className="btn btn-primary">Work</button>
                          <button type="button" className="btn btn-success ml-2">Php</button>
                          <button type="button" className="btn btn-info ml-2">Design</button>
                        </div>
                      </div>
                      {/* Right Section (Time) */}
                      <div className="col-md-3 text-right">
                        <p>Posted at: 2024-01-30 02:45 PM</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Right Column with a smaller width */}
              <div className="col-lg-4">
                <div className="card">
                  <div className="card-body">
                    <div className="card-header d-flex justify-content-between align-items-center" style={{backgroundColor: '#fff'}}>
                      {/* Heading on the left */}
                      <h5 className="mb-0">Top User of the Week</h5>
                      {/* Three dots on the right */}
                      <span>⋮</span>
                    </div>
                    <div className="card-body">
                      {/* Avatar, Name, and Interest */}
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        {/* Avatar on the left */}
                        <img src={avatar} alt="" className="img-fluid rounded-circle mr-3" style={{width: '40px', height: '40px'}} />
                        {/* Name and Interest */}
                        <div className="text-left">
                          <h6 className="mb-1">John Doe</h6>
                          <p className="mb-0 text-muted">Web Developer</p>
                        </div>
                        {/* Icon at the extreme right */}
                        <div className="d-flex justify-content-end align-items-center">
                          {/* Badge/crest icon for popular */}
                          <i className="fas fa-certificate text-warning mr-1" />
                          {/* Number */}
                          <p className="mb-0 ml-1">1185</p>
                        </div>
                      </div>
                      <div className="d-flex justify-content-between align-items-center my-3 mb-4">
                        {/* Avatar on the left */}
                        <img src={avatar} alt="User Avatar" className="img-fluid rounded-circle mr-3" style={{width: '40px', height: '40px'}} />
                        {/* Name and Interest */}
                        <div className="text-left">
                          <h6 className="mb-1">John Doe</h6>
                          <p className="mb-0 text-muted">Web Developer</p>
                        </div>
                        {/* Icon at the extreme right */}
                        <div className="d-flex justify-content-end align-items-center mt-3">
                          {/* Badge/crest icon for popular */}
                          <i className="fas fa-certificate text-warning mr-1" />
                          {/* Number */}
                          <p className="mb-0 ml-1">1185</p>
                        </div>
                      </div>
                      <div className="d-flex justify-content-between align-items-center my-3 mb-4">
                        {/* Avatar on the left */}
                        <img src={avatar} alt="" className="img-fluid rounded-circle mr-3" style={{width: '40px', height: '40px'}} />
                        {/* Name and Interest */}
                        <div className="text-left">
                          <h6 className="mb-1">John Doe</h6>
                          <p className="mb-0 text-muted">Web Developer</p>
                        </div>
                        {/* Icon at the extreme right */}
                        <div className="d-flex justify-content-end align-items-center mt-3">
                          {/* Badge/crest icon for popular */}
                          <i className="fas fa-certificate text-warning mr-1" />
                          {/* Number */}
                          <p className="mb-0 ml-1">1185</p>
                        </div>
                      </div>
                      <div className="d-flex justify-content-between align-items-center my-3 mb-4">
                        {/* Avatar on the left */}
                        <img src={avatar} alt="" className="img-fluid rounded-circle mr-3" style={{width: '40px', height: '40px'}} />
                        {/* Name and Interest */}
                        <div className="text-left">
                          <h6 className="mb-1">John Doe</h6>
                          <p className="mb-0 text-muted">Web Developer</p>
                        </div>
                        {/* Icon at the extreme right */}
                        <div className="d-flex justify-content-end align-items-center mt-3">
                          {/* Badge/crest icon for popular */}
                          <i className="fas fa-certificate text-warning mr-1" />
                          {/* Number */}
                          <p className="mb-0 ml-1">1185</p>
                        </div>
                      </div>
                      <div className="d-flex justify-content-between align-items-center my-3">
                        {/* Avatar on the left */}
                        <img src={avatar} alt="" className="img-fluid rounded-circle mr-3" style={{width: '40px', height: '40px'}} />
                        {/* Name and Interest */}
                        <div className="text-left">
                          <h6 className="mb-1">John Doe</h6>
                          <p className="mb-0 text-muted">Web Developer</p>
                        </div>
                        {/* Icon at the extreme right */}
                        <div className="d-flex justify-content-end align-items-center mt-3">
                          {/* Badge/crest icon for popular */}
                          <i className="fas fa-certificate text-warning mr-1" />
                          {/* Number */}
                          <p className="mb-0 ml-1">1185</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>  
              </div>
            </div>
          </div>
          <div className="container mt-5 mb-5">
            <div className="row">
              <div className="col-md-12">
                <div className="bg-white text-left p-2 font-weight-bold">
                  {/* Content for the top container */}
                  <p>Something Here</p>
                </div>
              </div>
            </div>
          </div>
        </div>
       
        </>
          );
}

export default Forum;