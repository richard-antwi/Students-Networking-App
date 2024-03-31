return (
    <div>
      <nav className="navbar navbar-expand-md navbar-dark bg-secondary mt-3">
        <div className="container d-flex justify-content-center">
          <span className="navbar-text">
            About Us
          </span>
        </div>
      </nav>
      <nav className="navbar navbar-expand-md navbar-dark bg-secondary" style={{backgroundImage: 'url("img/cover-Photo2.avif")', backgroundSize: 'cover', height: '250px'}}>
        <div className="container position-relative d-flex justify-content-center">
          <span className="navbar-text text-white position-absolute top-50 start-50 translate-middle" style={{backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: '20px'}}>
            <h2> Student social networking Platform.</h2>
            <p>We connect students and staff on the University of Cape Coast Campus</p>
          </span>
        </div>
      </nav>
      <div className="container mt-5">
        <div className="row">
          <div className="col-md-6">
            {/* Left side content with text and heading */}
            <h2>The Project Overview</h2>
            <p>The Student Social Networking Web Application aims to create a platform for university students to connect, collaborate, and share resources within their academic community. The web application will provide various features tailored to the needs of students, including profile creation, messaging, file sharing, event organization, and discussion forums.
            </p>
          </div>
          <div className="col-md-6 d-flex justify-content-end">
            {/* Right side content with image */}
            <img src="img/connect-photo.png" className="img-fluid" alt="Image" style={{marginRight: '20px'}} />
          </div>
        </div>
      </div>
      <div className="container mt-5 mb-5">
        <h2 className="text-center mb-4">About Us</h2>
        <div className="row ml-3">
          <div className="col-md-2 mr-3">
            <div className="card">
              <img src="img/person1.jpg" className="card-img-top" alt="Picture 1" />
              <div className="card-body">
                <h5 className="card-title">Theophilus</h5>
                <p className="card-text">Back-End Dev</p>
              </div>
            </div>
          </div>
          <div className="col-md-2 mr-3 ml-3">
            <div className="card">
              <img src="img/person2.jpg" className="card-img-top" alt="Picture 2" />
              <div className="card-body">
                <h5 className="card-title">Patrick</h5>
                <p className="card-text">Lead Documentarian</p>
              </div>
            </div>
          </div>
          <div className="col-md-2  mr-3 ml-3">
            <div className="card">
              <img src="img/person3.jpg" className="card-img-top" alt="Picture 3" />
              <div className="card-body">
                <h5 className="card-title">Thadus</h5>
                <p className="card-text">Documentarian</p>
              </div>
            </div>
          </div>
          <div className="col-md-2 mr-3 ml-3">
            <div className="card">
              <img src="img/person4.jpg" className="card-img-top" alt="Picture 4" />
              <div className="card-body">
                <h5 className="card-title">Nicholas</h5>
                <p className="card-text">Designer</p>
              </div>
            </div>
          </div>
          <div className="col-md-2 ml-3">
            <div className="card">
              <img src="img/person5.jpg" className="card-img-top" alt="Picture 5" />
              <div className="card-body">
                <h5 className="card-title">Richard</h5>
                <p className="card-text">Front-End Dev.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
});