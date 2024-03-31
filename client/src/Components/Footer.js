function Footer() {
    return (
      <>
    <footer className="bg-white text-dark py-3">
      <div className="container">
        <div className="row">
          <div className="col-md-10 mx-0">
            <ul className="list-inline">
              <li className="list-inline-item"><a href="help_center.html" className="text-muted">Help Center |</a></li>
              <li className="list-inline-item"><a href="about.html" className="text-muted">About |</a></li>
              <li className="list-inline-item"><a href="privacy_policy.html" className="text-muted">Privacy Policy |</a></li>
              <li className="list-inline-item"><a href="cookies_policy.html" className="text-muted">Cookies Policy |</a></li>
              <li className="list-inline-item"><a href="forum.html" className="text-muted">Forum |</a></li>
              <li className="list-inline-item"><a href="copyright_policy.html" className="text-muted">Copyright Policy</a></li>
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