// import React, { useState, useEffect } from 'react';
import 'bootstrap';
// import avatar from '../Images/avatar.webp';
// import coverPhoto from '../Images/coverPhoto.jpg';

function Register() {
    return (
        <>
         <link
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/mdb-ui-kit/7.1.0/mdb.min.css"
        rel="stylesheet"
      />
        <div>
          {/* Tabs navigation */}
          <ul className="nav nav-tabs" id="myTabs">
            <li className="nav-item">
              <a className="nav-link active" id="login-tab" data-bs-toggle="tab" href="#login">Login</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" id="register-tab" data-bs-toggle="tab" href="#register">Register</a>
            </li>
          </ul>
          {/* Tabs content */}
          <div className="tab-content">
            <div className="tab-pane fade show active" id="login">
              {/* Login form content */}
              <section className="vh-100" style={{backgroundColor: 'hsl(0, 0%, 96%)'}}>
                <div className="container py-5 h-100">
                  <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                      <div className="card shadow-2-strong" style={{borderRadius: '1rem'}}>
                        <div className="card-body p-5 text-center">
                          <h3 className="mb-5">Sign in</h3>
                          <div className="form-outline mb-4">
                            <input type="email" id="typeEmailX-2" className="form-control form-control-lg" />
                            <label className="form-label" htmlFor="typeEmailX-2">Email</label>
                          </div>
                          <div className="form-outline mb-4">
                            <input type="password" id="typePasswordX-2" className="form-control form-control-lg" />
                            <label className="form-label" htmlFor="typePasswordX-2">Password</label>
                          </div>
                          {/* Checkbox */}
                          <div className="form-check d-flex justify-content-start mb-4">
                            <input className="form-check-input" type="checkbox" defaultValue id="form1Example3" />
                            <label className="form-check-label" htmlFor="form1Example3"> Remember password </label>
                          </div>
                          <button className="btn btn-primary btn-lg btn-block" type="submit">Login</button>
                          <hr className="my-4" />
                          <button className="btn btn-lg btn-block btn-primary" style={{backgroundColor: '#dd4b39'}} type="submit"><i className="fab fa-google me-2" /> Sign in with google</button>
                          <button className="btn btn-lg btn-block btn-primary mb-2" style={{backgroundColor: '#3b5998'}} type="submit"><i className="fab fa-facebook-f me-2" />Sign in with facebook</button>
                          <a href="reset.html">Forgot password?</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
            <div className="tab-pane fade" id="register">
              {/* Register form content */}
              {/* <p>Register form content goes here.</p> */}
              {/* Section: Design Block */}
              <section className>
                {/* Jumbotron */}
                <div className="px-4 py-5 px-md-5 text-center text-lg-start" style={{backgroundColor: 'hsl(0, 0%, 96%)'}}>
                  <div className="container">
                    <div className="row gx-lg-5 align-items-center">
                      <div className="col-lg-6 mb-5 mb-lg-0">
                        <h1 className="my-5 display-3 fw-bold ls-tight">
                          The best Web App <br />
                          <span className="text-primary">for Stuedent Collaboration</span>
                        </h1>
                        <p style={{color: 'hsl(217, 10%, 50.8%)'}}>
                          The Student Social Networking Web Application aims to create a platform for university students to connect, collaborate, and share resources within their academic community. The web application will provide various features tailored to the needs of students, including profile creation, messaging, file sharing, event organization, and discussion forums.
                        </p>
                      </div>
                      <div className="col-lg-6 mb-5 mb-lg-0">
                        <div className="card">
                          <div className="card-body py-5 px-md-5">
                            <form>
                              {/* 2 column grid layout with text inputs for the first and last names */}
                              <div className="row">
                                <div className="col-md-6 mb-4">
                                  <div className="form-outline">
                                    <input type="text" id="form3Example1" className="form-control" />
                                    <label className="form-label" htmlFor="form3Example1">First name</label>
                                  </div>
                                </div>
                                <div className="col-md-6 mb-4">
                                  <div className="form-outline">
                                    <input type="text" id="form3Example2" className="form-control" />
                                    <label className="form-label" htmlFor="form3Example2">Last name</label>
                                  </div>
                                </div>
                              </div>
                              <div className="row">
                                {/* Email input */}
                                <div className="col-md-6 mb-4">
                                  <div className="form-outline">
                                    <input type="email" id="form3Example3" className="form-control" />
                                    <label className="form-label" htmlFor="form3Example3">Email address</label>
                                  </div>
                                </div>
                                {/* Date of Birth input */}
                                <div className="col-md-6 mb-4">
                                  <div className="form-outline">
                                    <input type="text" id="form3Example5" className="form-control" />
                                    <label className="form-label" htmlFor="form3Example5">Date of Birth</label>
                                  </div>
                                </div>
                              </div>
                              {/* Password input */}
                              <div className="form-outline mb-4">
                                <input type="password" id="form3Example4" className="form-control" />
                                <label className="form-label" htmlFor="form3Example4">Password</label>
                              </div>
                              {/*program select input*/}
                              <div className="form-outline mb-4">
                                <select id="genderSelect" className="form-control">
                                  {/* <option value="male">BSC. Information Technology</option>
                          <option value="female">Bed. Information Technolgy</option>
                          <option value="other">BA. Communication Studies</option> */}
                                </select>
                                <label className="form-label" htmlFor="genderSelect">Program of Study</label>
                              </div>
                              {/* Checkbox */}
                              <div className="form-check d-flex justify-content-center mb-4">
                                <input className="form-check-input me-2" type="checkbox" defaultValue id="form2Example33" defaultChecked />
                                <label className="form-check-label" htmlFor="form2Example33">
                                  Subscribe to our newsletter
                                </label>
                              </div>
                              {/* Submit button */}
                              <button type="submit" className="btn btn-primary btn-block mb-4">
                                Sign up
                              </button>
                              {/* Register buttons */}
                              <div className="text-center">
                                <p>or sign up with:</p>
                                <button type="button" className="btn btn-link btn-floating mx-1">
                                  <i className="fab fa-facebook-f" />
                                </button>
                                <button type="button" className="btn btn-link btn-floating mx-1">
                                  <i className="fab fa-google" />
                                </button>
                                <button type="button" className="btn btn-link btn-floating mx-1">
                                  <i className="fab fa-twitter" />
                                </button>
                                <button type="button" className="btn btn-link btn-floating mx-1">
                                  <i className="fab fa-github" />
                                </button>
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Jumbotron */}
              </section>
              {/* Section: Design Block */}
            </div>
          </div>
        </div>
      
      </>
      );
      }

export default Register;
