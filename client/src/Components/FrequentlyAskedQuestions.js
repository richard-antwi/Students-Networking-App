import '../App.css';
import 'bootstrap';


function FrequentlyAskedQuestions() {
    
      return (
        <>
        <div>
          <div className="container mt-5 col-md-8">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title text-center">Frequently Asked Questions (FAQs)</h5>
                {/* Add your FAQs content here */}
              </div>
            </div>
          </div>
          <div className="container mt-5 col-md-8">
            <div className="accordion" id="faqAccordion">
              <div className="card">
                <div className="card-header" id="headingOne">
                  <h5 className="mb-0">
                    <button className="btn btn-link" type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                      How do I sign up for the Social Networking App?
                    </button>
                  </h5>
                </div>
                <div id="collapseOne" className="collapse" aria-labelledby="headingOne" data-parent="#faqAccordion">
                  <div className="card-body">
                    To sign up for our web app, simply search it from Google,Follow the sign up instructions to create your account using your university email address or any other email.
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="card-header" id="headingTwo">
                  <h5 className="mb-0">
                    <button className="btn btn-link" type="button" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="true" aria-controls="collapseTwo">
                      Is my university email address mandatory for registration?
                    </button>
                  </h5>
                </div>
                <div id="collapseTwo" className="collapse" aria-labelledby="headingTwo" data-parent="#faqAccordion">
                  <div className="card-body">
                    Yes, we require users to sign up using their university email addresses to ensure that only students with valid university affiliations can access our platform.
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="card-header" id="headingThree">
                  <h5 className="mb-0">
                    <button className="btn btn-link" type="button" data-toggle="collapse" data-target="#collapseThree" aria-expanded="true" aria-controls="collapseThree">
                      Can I use the web app if I'm not a university student?
                    </button>
                  </h5>
                </div>
                <div id="collapseThree" className="collapse" aria-labelledby="headingThree" data-parent="#faqAccordion">
                  <div className="card-body">
                    Unfortunately, our web app is exclusively for university students at the moment. We're focused on providing a platform tailored to the needs of students within academic institutions.
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="card-header" id="headingFour">
                  <h5 className="mb-0">
                    <button className="btn btn-link" type="button" data-toggle="collapse" data-target="#collapseFour" aria-expanded="true" aria-controls="collapseFour">
                      How do I connect with other students on the app?
                    </button>
                  </h5>
                </div>
                <div id="collapseFour" className="collapse" aria-labelledby="headingFour" data-parent="#faqAccordion">
                  <div className="card-body">
                    Once you've signed up and verified your account, you can search for other students from your university by their name, course, or interests. You can also join university-specific groups and forums to connect with fellow students.
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="card-header" id="headingFive">
                  <h5 className="mb-0">
                    <button className="btn btn-link" type="button" data-toggle="collapse" data-target="#collapseFive" aria-expanded="true" aria-controls="collapseFive">
                      Is my personal information safe on the app?
                    </button>
                  </h5>
                </div>
                <div id="collapseFive" className="collapse" aria-labelledby="headingFive" data-parent="#faqAccordion">
                  <div className="card-body">
                    Yes, we prioritize the security and privacy of our users' information. We have robust security measures in place to protect your data and ensure that it is not shared with third parties without your consent.
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="card-header" id="headingSix">
                  <h5 className="mb-0">
                    <button className="btn btn-link" type="button" data-toggle="collapse" data-target="#collapseSix" aria-expanded="true" aria-controls="collapseSix">
                      Is there a way to customize my profile and privacy settings?
                    </button>
                  </h5>
                </div>
                <div id="collapseSix" className="collapse" aria-labelledby="headingSix" data-parent="#faqAccordion">
                  <div className="card-body">
                    Yes, you can customize your profile by adding information about your interests, academic background, and extracurricular activities. You also have control over your privacy settings, allowing you to choose who can view your profile and interact with you on the app.
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="card-header" id="headingSeven">
                  <h5 className="mb-0">
                    <button className="btn btn-link" type="button" data-toggle="collapse" data-target="#collapseSeven" aria-expanded="true" aria-controls="collapseSeven">
                      How do I report inappropriate content or behavior?
                    </button>
                  </h5>
                </div>
                <div id="collapseSeven" className="collapse" aria-labelledby="headingSeven" data-parent="#faqAccordion">
                  <div className="card-body">
                    If you come across any content or behavior that violates our community guidelines or makes you feel uncomfortable, you can report it to our moderation team using the built-in reporting feature. We take reports seriously and investigate them promptly.
                  </div>
                </div>
              </div>
              {/* Add more question-answer pairs as needed */}
            </div>
          </div>
        </div>
        </>
    );
    }

export default FrequentlyAskedQuestions;