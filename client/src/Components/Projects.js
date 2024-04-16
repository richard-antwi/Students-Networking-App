import 'bootstrap';
import "../App.css";
import avatar from '../Images/avatar.webp';

function Projects() {
      return (
        <>
        <div>
          <div className="container mt-5">
            <form className="form-inline">
              <div className="input-group" style={{width: '100%'}}>
                <input className="form-control" type="search" placeholder="Search...." aria-label="Search" style={{width: '90%'}} />
                <div className="input-group-append">
                  <button className="btn btn-primary" type="submit">Search</button>
                </div>
              </div>
            </form>
          </div>
          <div className="container  mt-5">
            <div className="row">
              <div className="col-md-3">
                {/* Left column content here */}
                <div className="card">
                  <div className="card-header d-flex justify-content-between align-items-center" style={{backgroundColor: '#fff'}}>
                    {/* Heading on the left */}
                    <h6 className="mb-0">Filters</h6>
                    {/* Three dots on the right */}
                    <h6>Clear all fliters</h6>
                  </div>
                  <div className="card-body">
                    <div className="card-title d-flex justify-content-between align-items-center" style={{backgroundColor: '#fff'}}>
                      <h6 className="mb-0">Skills</h6>
                      <h6>Clear</h6>
                    </div>
                    <hr />
                    <form className="form-inline my-2 my-lg-0">
                      <div className="input-group">
                        <input className="form-control" type="search" placeholder="Search Skills" aria-label="Search" />
                        <div className="input-group-append">
                          <button className="btn btn-primary" type="submit">Search</button>
                        </div>
                      </div>
                    </form>
                    <div className="card-title d-flex justify-content-between align-items-center mt-3" style={{backgroundColor: '#fff'}}>
                      <h6 className="mb-0">Availability</h6>
                      <h6>Clear</h6>
                    </div>
                    <hr />
                    <form action="/submit-job-type" method="post">
                      <label>
                        <input type="radio" name="job_type" defaultValue="hourly" /> Hourly
                      </label><br />
                      <label>
                        <input type="radio" name="job_type" defaultValue="part_time" /> Part Time
                      </label><br />
                      <label>
                        <input type="radio" name="job_type" defaultValue="full_time" /> Full Time
                      </label><br />
                    </form>
                    <div className="card-title d-flex justify-content-between align-items-center mt-3" style={{backgroundColor: '#fff'}}>
                      <h6 className="mb-0">Job Type</h6>
                      <h6>Clear</h6>
                    </div>
                    <hr />
                    <form className="form-inline my-2 my-lg-0">
                      <div className="input-group">
                        <input className="form-control" type="search" placeholder="Select a job type" aria-label="Search" />
                        <div className="input-group-append">
                          <button className="btn btn-outline-secondary" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <i className="fas fa-ellipsis-v" />
                          </button>
                          <div className="dropdown-menu">
                            {/* Dropdown menu content here */}
                          </div>
                        </div>
                      </div>
                    </form>
                    <div className="card-title d-flex justify-content-between align-items-center mt-3" style={{backgroundColor: '#fff'}}>
                      <h6 className="mb-0">Pay Rate/Hr ($)</h6>
                      <h6>Clear</h6>
                    </div>
                    <hr />
                    <span className="range">
                      <span className="number1">5</span> - <span className="number2">10</span>
                    </span>
                    <div className="range-slider">
                      <input type="range" min={0} max={100} defaultValue={0} className="slider left-slider" id="leftRange" />
                      <input type="range" min={0} max={100} defaultValue={100} className="slider right-slider" id="rightRange" />
                      <p>Range: <span id="range-value">(0 - 100)</span></p>
                    </div>
                    <div className="card-title d-flex justify-content-between align-items-center mt-3" style={{backgroundColor: '#fff'}}>
                      <h6 className="mb-0">Experience level</h6>
                      <h6>Clear</h6>
                    </div>
                    <hr />
                    <form className="form-inline my-2 my-lg-0">
                      <div className="input-group">
                        <input className="form-control" type="search" placeholder="Select Experience Level" aria-label="Search" />
                        <div className="input-group-append">
                          <button className="btn btn-outline-secondary" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <i className="fas fa-ellipsis-v" />
                          </button>
                          <div className="dropdown-menu">
                            {/* Dropdown menu content here */}
                          </div>
                        </div>
                      </div>
                    </form>
                    <div className="card-title d-flex justify-content-between align-items-center mt-3" style={{backgroundColor: '#fff'}}>
                      <h6 className="mb-0">Country</h6>
                      <h6>Clear</h6>
                    </div>
                    <hr />
                    <form className="form-inline my-2 my-lg-0">
                      <div className="input-group">
                        <input className="form-control" type="search" placeholder="Select a country" aria-label="Search" />
                        <div className="input-group-append">
                          <button className="btn btn-outline-secondary" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <i className="fas fa-ellipsis-v" />
                          </button>
                          <div className="dropdown-menu">
                            {/* Dropdown menu content here */}
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                {/* Middle column content here */}
                <div className="card ">
                  <div className="card-body">
                    <div className="d-flex align-items-center justify-content-between">
                      {/* Avatar on the left */}
                      <img src={avatar} alt="User Avatar" className="img-fluid rounded-circle mr-3" style={{width: '50px', height: '50px'}} />
                      {/* User details */}
                      <div className="flex-grow-1 d-flex flex-column">
                        {/* Name */}
                        <div>
                          <h6 className="mb-0">John Doe</h6>
                        </div>
                        {/* Timer icon below the name */}
                        <div className="text-muted">
                          <i className="fa-solid fa-clock" /> 3 min ago
                        </div>
                      </div>
                      {/* Vertical three dots on the right */}
                      <div className="ml-auto">
                        <span>⋮</span>
                      </div>
                    </div>
                    {/* User interests and location */}
                    <div className="d-flex align-items-center mb-2">
                      {/* User interest icon and text */}
                      <div className="mr-2">
                        <i className="fas fa-graduation-cap text-danger" />
                      </div>
                      <div>
                        <p className="mb-0">Epic Developer</p>
                      </div>
                      {/* Location icon and text */}
                      <div className="ml-4 mr-2">
                        <i className="fas fa-map-marker-alt text-success" />
                      </div>
                      <div>
                        <p className="mb-0">Ghana</p>
                      </div>
                      {/* Favourite and message icons on the right */}
                      <div className="ml-auto">
                        <div className="mr-3">
                          <i className="far fa-bookmark text-white" style={{border: '#13a550 solid 10px', background: '#13a550', borderRadius: '3px'}} />
                          <i className="far fa-envelope text-white" style={{border: '#3e7df3 solid 10px', background: '#3e7df3', borderRadius: '3px'}} />
                        </div>
                      </div>
                    </div>
                    <div>
                      <br />
                      <h5>
                        Senior Wordpress Developer
                      </h5>
                    </div>
                    <div className="ml-auto">
                      <span className="badge bg-success rounded-pill text-white p-2">Full Time</span>
                      {/* Price per hour */}
                      <span className="ml-2 ">$30/hr</span>
                    </div>
                    <br />
                    <div>
                      {/* User's dynamic content */}
                      <p className="mb-0 truncated-text" id="longText">
                        {/* User's lengthy text content here */}
                        {/* Assume this text is fetched dynamically from the database */}
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, libero vel consectetur luctus, odio nisi aliquam risus, vel volutpat orci felis at dolor Lorem ipsum dolor sit amet, 
                        consectetur adipiscing elit. Sed euismod, libero vel consectetur luctus, odio nisi aliquam risus, vel volutpat orci felis at dolor Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, libero vel consectetur luctus, odio nisi aliquam risus, vel volutpat orci felis at dolor...
                      </p>
                      {/* "Read More" link */}
                      <a href="#" className="text-primary" id="readMoreLink" role="button" onclick="toggleText()">
                        Read More
                      </a>
                    </div>
                    <div className="mb-3" style={{marginTop: '8px'}}>
                      <span className="badge badge-secondary rounded-pill p-2" style={{borderRadius: '12px'}}>HTML</span>
                      <span className="badge badge-secondary rounded-pill p-2" style={{borderRadius: '12px'}}>Python</span>
                      <span className="badge badge-secondary rounded-pill p-2" style={{borderRadius: '12px'}}>C++</span>
                      <span className="badge badge-secondary rounded-pill p-2" style={{borderRadius: '12px'}}>JavaScript</span>
                    </div>
                    <hr />
                    <div className="d-flex align-items-center justify-content-between">
                      {/* Like Section */}
                      <div className="d-flex align-items-center">
                        <i className="fas fa-heart text-danger mr-2" />
                        <span className="mr-3">Like</span>
                        <div className="rounded-circle bg-secondary text-white px-2">10</div>
                      </div>
                      {/* Comment Section */}
                      <a data-toggle="collapse" href="#commentCollapse" role="button" aria-expanded="false" aria-controls="commentCollapse">
                        <div className="d-flex align-items-center">
                          <i className="fas fa-comment text-primary mr-2" />
                          <span className="mr-3">Comment</span>
                          <div className="rounded-circle bg-secondary text-white px-2">5</div>
                        </div>
                      </a>
                      {/* View Section */}
                      <div className="d-flex align-items-center">
                        <i className="fas fa-eye text-success mr-2" />
                        <span>View</span>
                        <div className="rounded-circle bg-secondary text-white px-2">90</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                {/* Right column content here */}
                <div className="card">
                  <div className="card">
                    <div className="card-header d-flex justify-content-between align-items-center" style={{backgroundColor: '#fff'}}>
                      {/* Heading on the left */}
                      <h5 className="mb-0">Top Jobs</h5>
                      {/* Three dots on the right */}
                      <span>⋮</span>
                    </div>
                    <div className="card-body">
                      {/* Job details */}
                      <div className="d-flex justify-content-between">
                        {/* Job title and text on the left */}
                        <div className="text-left">
                          <h6 className="card-title">Senior Product Designer</h6>
                          <p className="card-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                        </div>
                        {/* Price per hour on the right */}
                        <div className="text-right ">
                          <p className="font-weight-bold">$50/hr</p>
                        </div>
                      </div>
                      <div className="d-flex justify-content-between mt-4">
                        {/* Job title and text on the left */}
                        <div className="text-left">
                          <h6 className="card-title">Senior UI/UX Designer</h6>
                          <p className="card-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                        </div>
                        {/* Price per hour on the right */}
                        <div className="text-right mb-3">
                          <p className="font-weight-bold">$50/hr</p>
                        </div>
                      </div>
                      <div className="d-flex justify-content-between mt-4">
                        {/* Job title and text on the left */}
                        <div className="text-left">
                          <h6 className="card-title">Senior Programmer</h6>
                          <p className="card-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                        </div>
                        {/* Price per hour on the right */}
                        <div className="text-right mb-3">
                          <p className="font-weight-bold">$50/hr</p>
                        </div>
                      </div>
                      <div className="d-flex justify-content-between mt-4">
                        {/* Job title and text on the left */}
                        <div className="text-left">
                          <h6 className="card-title">Senior Front-End Developer</h6>
                          <p className="card-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                        </div>
                        {/* Price per hour on the right */}
                        <div className="text-right mb-3">
                          <p className="font-weight-bold">$50/hr</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </>
       );
       }
 
 export default Projects;