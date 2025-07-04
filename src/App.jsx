import React, { useRef, useState, useEffect } from 'react';
import EducationLevelStep from './components/EducationLevelStep';
import ProgramSelectionStep from './components/ProgramSelectionStep';
import CountrySelectionStep from './components/CountrySelectionStep';
import IntakeSelectionStep from './components/IntakeSelectionStep';
import EnglishPassportStep from './components/EnglishPassportStep';
import CitySelectionStep from './components/CitySelectionStep';
import PhoneOtpStep from './components/PhoneOtpStep';
import CompletionStep, { WarmDisqualificationStep } from './components/CompletionStep';
import AcademicDetailsStep from './components/AcademicDetailsStep';
import AcademicJourneyComplete from './components/AcademicJourneyComplete';
import BudgetStep from './components/BudgetStep';
import FinanceStep from './components/FinanceStep';
import UniversityPreferenceStep from './components/UniversityPreferenceStep';
import ApplicationTimelineStep from './components/ApplicationTimelineStep';
import EnglishTestDetailsStep from './components/EnglishTestDetailsStep';
import { getCountryEligibility } from './components/BudgetStep';
import WarmDisqualificationPage from './components/WarmDisqualificationPage';
import './App.css';

// Mapping of education to recommended programs (from your script.js)
const programOptionsMap = {
  '10th': [
    { value: 'bachelors', label: "Bachelor's Degree", icon: '🎓', recommended: true },
    { value: 'masters', label: "Master's Degree", icon: '🎯', disabled: true },
    { value: 'mba', label: "MBA Program", icon: '💼', disabled: true },
    { value: 'phd', label: "PhD Program", icon: '🔬', disabled: true }
  ],
  '12th': [
    { value: 'bachelors', label: "Bachelor's Degree", icon: '🎓', recommended: true },
    { value: 'diploma', label: "PG Diploma", icon: '📜', disabled: true },
    { value: 'masters', label: "Master's Degree", icon: '🎯', disabled: true },
    { value: 'mba', label: "MBA Program", icon: '💼', disabled: true },
    { value: 'phd', label: "PhD Program", icon: '🔬', disabled: true }
  ],
  'non-final-bachelors': [
    { value: 'masters', label: "Master's Degree", icon: '🎯', recommended: true },
    { value: 'mba', label: "MBA Program", icon: '💼', recommended: true },
    { value: 'bachelors', label: "Another Bachelor's", icon: '🎓' },
    { value: 'diploma', label: "PG Diploma", icon: '📜' },
    { value: 'phd', label: "PhD Program", icon: '🔬' }
  ],
  'final-bachelors': [
    { value: 'masters', label: "Master's Degree", icon: '🎯', recommended: true },
    { value: 'mba', label: "MBA Program", icon: '💼', recommended: true },
    { value: 'bachelors', label: "Another Bachelor's", icon: '🎓' },
    { value: 'diploma', label: "PG Diploma", icon: '📜' },
    { value: 'phd', label: "PhD Program", icon: '🔬' }
  ],
  'completed-bachelors': [
    { value: 'masters', label: "Master's Degree", icon: '🎯', recommended: true },
    { value: 'mba', label: "MBA Program", icon: '💼', recommended: true },
    { value: 'bachelors', label: "Another Bachelor's", icon: '🎓' },
    { value: 'diploma', label: "PG Diploma", icon: '📜' },
    { value: 'phd', label: "PhD Program", icon: '🔬' }
  ],
  'masters': [
    { value: 'phd', label: "PhD Program", icon: '🔬', recommended: true },
    { value: 'masters', label: "Another Master's", icon: '🎯' },
    { value: 'mba', label: "MBA Program", icon: '💼' },
    { value: 'diploma', label: "PG Diploma", icon: '📜' },
    { value: 'bachelors', label: "Bachelor's Degree", icon: '🎓', disabled: true }
  ],
  'mbbs': [
    { value: 'masters', label: "Master's in Medicine", icon: '🎯', recommended: true },
    { value: 'specialization', label: "Medical Specialization", icon: '⚕️', recommended: true },
    { value: 'phd', label: "PhD in Medicine", icon: '🔬' },
    { value: 'mba', label: "Healthcare MBA", icon: '💼' },
    { value: 'bachelors', label: "Bachelor's Degree", icon: '🎓', disabled: true }
  ]
};

const logoUrl = 'https://ik.imagekit.io/onsnhxjshmp/LeapScholar/new-header-logo_7i5sVUf9VF.svg';

// Example university lists (should be replaced with real data)
const universityData = {
  usa: [
    { id: 'mit', name: 'Massachusetts Institute of Technology', icon: '🎓', rank: '#1' },
    { id: 'stanford', name: 'Stanford University', icon: '🎓', rank: '#2' },
    { id: 'harvard', name: 'Harvard University', icon: '🎓', rank: '#3' },
    { id: 'berkeley', name: 'University of California, Berkeley', icon: '🎓', rank: '#4' },
    { id: 'cmu', name: 'Carnegie Mellon University', icon: '🎓', rank: '#5' },
    // ... more ...
  ],
  uk: [
    { id: 'oxford', name: 'University of Oxford', icon: '🎓', rank: '#1' },
    { id: 'cambridge', name: 'University of Cambridge', icon: '🎓', rank: '#2' },
    { id: 'imperial', name: 'Imperial College London', icon: '🎓', rank: '#3' },
    // ... more ...
  ],
  canada: [
    { id: 'toronto', name: 'University of Toronto', icon: '🎓', rank: '#1' },
    { id: 'ubc', name: 'University of British Columbia', icon: '🎓', rank: '#2' },
    // ... more ...
  ],
  any: [
    // Top universities from multiple countries (long list for scroll)
    { id: 'mit', name: 'Massachusetts Institute of Technology', icon: '🎓', rank: 'USA #1' },
    { id: 'stanford', name: 'Stanford University', icon: '🎓', rank: 'USA #2' },
    { id: 'oxford', name: 'University of Oxford', icon: '🎓', rank: 'UK #1' },
    { id: 'cambridge', name: 'University of Cambridge', icon: '🎓', rank: 'UK #2' },
    { id: 'toronto', name: 'University of Toronto', icon: '🎓', rank: 'Canada #1' },
    { id: 'ubc', name: 'University of British Columbia', icon: '🎓', rank: 'Canada #2' },
    // ... add many more for scroll ...
  ],
  // ... add more countries as needed ...
};

function FinalCongratulationsPage({ universityCount = 42 }) {
  return (
    <div style={{ minHeight: '80vh', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', borderRadius: 28, boxShadow: '0 8px 32px rgba(99,102,241,0.13)', maxWidth: 480, width: '100%', padding: '48px 36px 36px 36px', margin: '0 auto', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ fontSize: 64, marginBottom: 12 }}>🎉</div>
        <h2 style={{ fontSize: 28, fontWeight: 800, color: '#6366f1', marginBottom: 10 }}>Congratulations!</h2>
        <div style={{ color: '#374151', fontSize: 18, marginBottom: 18, fontWeight: 500 }}>
          You've completed the initial assessment.<br />Let's move forward with university shortlisting.
        </div>
        <div style={{ background: '#f8fafc', borderRadius: 16, padding: 18, margin: '18px 0', width: '100%', boxShadow: '0 2px 8px rgba(99,102,241,0.06)' }}>
          <h3 style={{ color: '#6366f1', fontWeight: 700, fontSize: 18, marginBottom: 8 }}>What's Next?</h3>
          <ul style={{ textAlign: 'left', color: '#4b5563', fontSize: 16, margin: 0, padding: 0, listStyle: 'none' }}>
            <li style={{ marginBottom: 8 }}>✅ We'll analyze your preferences</li>
            <li style={{ marginBottom: 8 }}>✅ Create a personalized university list</li>
            <li style={{ marginBottom: 8 }}>✅ Match you with suitable programs</li>
            <li style={{ marginBottom: 8 }}>✅ Help you with application process</li>
          </ul>
        </div>
        <div style={{ display: 'flex', gap: 18, justifyContent: 'center', margin: '18px 0 0 0', width: '100%' }}>
          <div style={{ background: '#f3f4f6', borderRadius: 14, padding: '18px 24px', fontWeight: 700, color: '#6366f1', fontSize: 20, minWidth: 120, boxShadow: '0 2px 8px rgba(99,102,241,0.06)' }}>
            <div style={{ fontSize: 32, marginBottom: 4 }}>🏫</div>
            {universityCount}+
            <div style={{ fontSize: 14, color: '#64748b', fontWeight: 500 }}>Universities Matched</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 16, marginTop: 32, width: '100%', justifyContent: 'center' }}>
          <button style={{ background: 'linear-gradient(90deg, #6366f1 0%, #a78bfa 100%)', color: '#fff', border: 'none', borderRadius: 12, padding: '15px 0', fontSize: 17, fontWeight: 700, cursor: 'pointer', width: 180, boxShadow: '0 2px 8px rgba(99,102,241,0.08)', transition: 'background 0.2s', letterSpacing: 1 }} onClick={() => alert('Download coming soon!')}>
            ⬇️ Download Report
          </button>
          <button style={{ background: '#fff', color: '#6366f1', border: '2px solid #6366f1', borderRadius: 12, padding: '15px 0', fontSize: 17, fontWeight: 700, cursor: 'pointer', width: 180, boxShadow: '0 2px 8px rgba(99,102,241,0.04)', transition: 'background 0.2s', letterSpacing: 1 }} onClick={() => alert('View report coming soon!')}>
            📄 View Report
          </button>
        </div>
      </div>
    </div>
  );
}

const TOTAL_STEPS = 12;
function ProgressBar({ step }) {
  return (
    <div className="ls-progress-bar-outer" style={{ margin: '0 auto 18px auto' }}>
      <div
        className="ls-progress-bar-inner"
        style={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
      />
    </div>
  );
}

function isCountryEligible(country, backlogCount) {
  const eligibility = getCountryEligibility(backlogCount).find(c => c.code === country || c.value === country);
  return eligibility ? eligibility.isEligible : true;
}

function App() {
  const [education, setEducation] = useState(null);
  const [program, setProgram] = useState(null);
  const [country, setCountry] = useState(null);
  const [step, setStep] = useState(0); // Use only this for navigation
  const [intake, setIntake] = useState(null);
  const [english, setEnglish] = useState(null);
  const [passport, setPassport] = useState(null);
  const [city, setCity] = useState(null);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const programFoldRef = useRef(null);
  const [applicationSaved, setApplicationSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [buttonLoading, setButtonLoading] = useState({ download: false, view: false });
  const [academicDetails, setAcademicDetails] = useState({});
  const [budget, setBudget] = useState(null);
  const [financeMode, setFinanceMode] = useState(null);
  const [selectedUniversities, setSelectedUniversities] = useState([]);
  const [timeline, setTimeline] = useState(null);
  const [englishTestDetails, setEnglishTestDetails] = useState(null);
  const [graduationYear, setGraduationYear] = useState(null);
  const [graduationMonth, setGraduationMonth] = useState(null);
  const [disqualifiedReason, setDisqualifiedReason] = useState(null);

  // Scroll to program fold when education is selected
  useEffect(() => {
    if (education && programFoldRef.current) {
      programFoldRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [education]);

  // Dynamic question for program fold
  const programQuestion = education
    ? `What do you want to study after your ${{
        '10th': '10th Grade',
        '12th': '12th Grade',
        'non-final-bachelors': "Bachelor's (Not Final Year)",
        'final-bachelors': "Bachelor's (Final Year)",
        'completed-bachelors': "Completed Bachelor's",
        'masters': "Master's",
        'mbbs': "MBBS"
      }[education] || 'education'}?`
    : 'What do you want to study?';

  // Get program options for selected education
  const programOptions = education ? programOptionsMap[education] || [] : [];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  // Save application to backend when step === 6 and not already saved
  useEffect(() => {
    if (step === 6 && !applicationSaved && phone) {
      setSaving(true);
      fetch('http://localhost:5000/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          education,
          program,
          country,
          intake,
          city,
          phone,
          english,
          passport,
        }),
      })
        .then(res => res.json())
        .then(() => setApplicationSaved(true))
        .catch(() => {})
        .finally(() => setSaving(false));
    }
  }, [step, applicationSaved, phone, education, program, country, intake, city, english, passport]);

  // Helper to log click
  const logClick = async (type) => {
    if (!phone) return;
    await fetch('http://localhost:5000/api/applications/click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, type }),
    });
  };

  // Disqualification navigation logic
  useEffect(() => {
    if (
      step >= 5 &&
      (education === '10th' || education === '12th' || education === 'mbbs')
    ) {
      setDisqualifiedReason(
        education === '10th'
          ? 'Currently, our partner universities require a minimum of 12th grade or equivalent for study abroad programs. Complete your 12th and come back—we will be here to help you take the next step!'
          : education === '12th'
          ? 'You are just one step away! Please complete your 12th grade and return to explore global opportunities with us.'
          : 'Currently, we are unable to support MBBS profiles for study abroad. If you are planning to pursue further studies, please reach out after your graduation.'
      );
      setStep('disqualified');
    } else if (step >= 5 && passport === 'yet-to-apply') {
      setDisqualifiedReason('A valid passport or an application in process is required to proceed. Please apply for a passport and return—we will be ready to help you with your study abroad journey!');
      setStep('disqualified');
    }
  }, [step, education, passport]);

  // Main render
  return (
    <div
      className="container"
      style={{
        background: '#f9fafb',
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
      }}
    >
      {/* Logo at the top, outside all cards, no white background */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', margin: '32px 0 18px 0' }}>
        <img src={logoUrl} alt="Leap Scholar" style={{ height: 48, maxWidth: 220 }} />
      </div>

      {/* Step 0: Education */}
      {step === 0 && (
        <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.06)', maxWidth: 500, width: '100%', padding: '32px 24px', margin: '5px 0', display: 'flex', flexDirection: 'column', gap: 0 }}>
          <ProgressBar step={step} />
          <div style={{ textAlign: 'center', fontSize: 18, fontWeight: 500, color: '#6366f1', marginBottom: 4 }}>
            Your study abroad dream starts here
          </div>
          <div style={{ textAlign: 'center', fontSize: 16, color: '#374151', marginBottom: 0 }}>
            Tell us about your educational background
          </div>
          <div style={{ marginTop: 8 }}>
            <EducationLevelStep
              onSelect={(value) => {
                setEducation(value);
                setProgram(null);
                setCountry(null);
              }}
              selected={education}
            />
          </div>
          {education && (
            <div ref={programFoldRef} style={{ marginTop: 18, width: '100%' }}>
              <div className="fold active" style={{ width: '100%', background: 'transparent', boxShadow: 'none', border: 'none', padding: 0 }}>
                <h3 className="fold-title" style={{ fontSize: 18, fontWeight: 600, margin: '10px 0 12px 0', color: '#1e293b', textAlign: 'center' }}>{programQuestion}</h3>
                <ProgramSelectionStep
                  visible={true}
                  onSelect={(value) => {
                    setProgram(value);
                    setStep(1);
                  }}
                  initialValue={program}
                  options={programOptions}
                  question={programQuestion}
                  asPanel
                />
              </div>
            </div>
          )}
        </div>
      )}
      {/* Step 1: Country Selection */}
      {step === 1 && (
        <div style={{ marginTop: 0, background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.06)', maxWidth: 500, width: '100%', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: 0 }}>
          <ProgressBar step={step} />
          <CountrySelectionStep
            visible={true}
            onSelect={(value) => {
              setCountry(value);
              setStep(2);
            }}
            initialValue={country}
          />
        </div>
      )}
      {/* Step 2: English Proficiency & Passport */}
      {step === 2 && (
        <div style={{ marginTop: 0, background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.06)', maxWidth: 500, width: '100%', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: 0 }}>
          <ProgressBar step={step} />
          <div style={{ textAlign: 'center', fontSize: 18, fontWeight: 500, color: '#6366f1', marginBottom: 4 }}>
            English Proficiency & Passport
          </div>
          <EnglishPassportStep
            visible={true}
            english={english}
            passport={passport}
            onEnglishSelect={(value) => setEnglish(value)}
            onPassportSelect={(value) => {
              setPassport(value);
              setStep(3);
            }}
          />
        </div>
      )}
      {/* Step 3: City Selection */}
      {step === 3 && (
        <div style={{ marginTop: 0, background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.06)', maxWidth: 500, width: '100%', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: 0 }}>
          <ProgressBar step={step} />
          <div style={{ textAlign: 'center', fontSize: 18, fontWeight: 500, color: '#6366f1', marginBottom: 4 }}>
            Which city are you from?
          </div>
          <div style={{ textAlign: 'center', fontSize: 16, color: '#374151', marginBottom: 0 }}>
            Select your city or search below
          </div>
          <CitySelectionStep
            visible={true}
            selectedCity={city}
            onSelect={(value) => {
              setCity(value);
              setStep(4);
            }}
          />
        </div>
      )}
      {/* Step 4: Phone & OTP */}
      {step === 4 && (
        <div style={{ marginTop: 0, background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.06)', maxWidth: 500, width: '100%', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: 0 }}>
          <ProgressBar step={step} />
          <div style={{ textAlign: 'center', fontSize: 18, fontWeight: 500, color: '#6366f1', marginBottom: 4 }}>
            Verify Your Phone Number
          </div>
          <div style={{ textAlign: 'center', fontSize: 16, color: '#374151', marginBottom: 0 }}>
            We'll send you a verification code
          </div>
          <PhoneOtpStep
            visible={true}
            phone={phone}
            otp={otp}
            showOtpPopup={showOtpPopup}
            onPhoneSubmit={(value) => {
              setPhone(value);
              setShowOtpPopup(true);
            }}
            onOtpSubmit={(value) => {
              setOtp(value);
              setShowOtpPopup(false);
              setStep(5);
            }}
            onCloseOtpPopup={() => setShowOtpPopup(false)}
          />
        </div>
      )}
      {/* Step 5: Completion */}
      {step === 5 && (
        <div style={{ marginTop: 0, background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.06)', maxWidth: 500, width: '100%', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: 0 }}>
          <ProgressBar step={step} />
          <CompletionStep
            education={education}
            program={program}
            country={country}
            intake={intake}
            city={city}
            phone={phone}
            english={english}
            passport={passport}
            onDownloadReport={async () => {
              setButtonLoading((b) => ({ ...b, download: true }));
              await logClick('download');
              setTimeout(() => setButtonLoading((b) => ({ ...b, download: false })), 800);
              alert('Download coming soon!');
            }}
            onViewReport={async () => {
              setButtonLoading((b) => ({ ...b, view: true }));
              await logClick('view');
              setTimeout(() => setButtonLoading((b) => ({ ...b, view: false })), 800);
              alert('View report coming soon!');
            }}
            buttonLoading={buttonLoading}
            saving={saving}
            onContinue={() => setStep(6)}
          />
        </div>
      )}
      {/* Step 6: Academic Details */}
      {step === 6 && (
        <div style={{ marginTop: 0, background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.06)', maxWidth: 500, width: '100%', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: 0 }}>
          <ProgressBar step={step} />
          <AcademicDetailsStep
            highestEducation={education}
            initialDetails={academicDetails}
            onSubmit={details => {
              setAcademicDetails(details);
              setGraduationYear(details.graduationYear);
              setGraduationMonth(details.graduationMonth);
              setStep(7);
            }}
          />
        </div>
      )}
      {/* Step 7: Academic Journey Complete */}
      {step === 7 && (
        <div style={{ marginTop: 0, background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.06)', maxWidth: 500, width: '100%', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: 0 }}>
          <ProgressBar step={step} />
          <AcademicJourneyComplete onContinue={() => setStep(8)} />
        </div>
      )}
      {/* Step 8: Budget/Finance/University Pref */}
      {step === 8 && !budget && (
        <div style={{ marginTop: 0, background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.06)', maxWidth: 500, width: '100%', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: 0 }}>
          <ProgressBar step={step} />
          <BudgetStep
            country={country}
            backlogCount={(() => {
              const val = academicDetails.backlogs;
              if (!val) return 0;
              if (val === '0') return 0;
              if (val === '1-2') return 2;
              if (val === '3-5') return 5;
              if (val === '6-10') return 10;
              if (val === '10+') return 11;
              return parseInt(val) || 0;
            })()}
            onBudgetSelected={(budgetValue) => {
              setBudget(budgetValue);
            }}
            onExploreOtherCountries={() => {
              setCountry('any');
              setBudget(null);
              setFinanceMode(null);
              setStep(8);
            }}
          />
        </div>
      )}
      {step === 8 && budget && !financeMode && (
        <div style={{ marginTop: 0, background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.06)', maxWidth: 500, width: '100%', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: 0 }}>
          <ProgressBar step={step} />
          <FinanceStep
            onSelect={(mode) => {
              setFinanceMode(mode);
            }}
            initialValue={financeMode}
          />
        </div>
      )}
      {step === 8 && budget && financeMode && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.06)', maxWidth: 500, padding: '32px 24px', marginTop: 0 }}>
          <ProgressBar step={step} />
          <UniversityPreferenceStep
            country={country}
            universitiesList={universityData[country] || universityData['any']}
            onSelect={(universities) => setSelectedUniversities(universities)}
            initialSelected={selectedUniversities}
          />
          <div style={{ marginTop: 32, width: '100%', display: 'flex', justifyContent: 'center' }}>
            <ApplicationTimelineStep
              onSelect={(val) => {
                setTimeline(val);
                setStep(9);
              }}
              initialValue={timeline}
            />
          </div>
        </div>
      )}
      {/* Step 9: Intake Selection */}
      {step === 9 && budget && financeMode && (
        <div style={{ marginTop: 0, background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.06)', maxWidth: 500, width: '100%', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: 0 }}>
          <ProgressBar step={step} />
          <IntakeSelectionStep
            visible={true}
            country={country}
            graduationYear={graduationYear}
            graduationMonth={graduationMonth}
            onSelect={(value) => {
              setIntake(value);
              // Calculate backlog count
              const val = academicDetails.backlogs;
              let backlogCount = 0;
              if (val === '0') backlogCount = 0;
              else if (val === '1-2') backlogCount = 2;
              else if (val === '3-5') backlogCount = 5;
              else if (val === '6-10') backlogCount = 10;
              else if (val === '10+') backlogCount = 11;
              else backlogCount = parseInt(val) || 0;

              // If country is not eligible or is 'any', go to country selection step
              if (!isCountryEligible(country, backlogCount) || country === 'any') {
                setStep(9.5);
              } else {
                setStep(10);
              }
            }}
          />
        </div>
      )}
      {/* Step 9.5: Country Selection after Intake for ineligible or 'any' country */}
      {step === 9.5 && (
        <div style={{ marginTop: 0, background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.06)', maxWidth: 500, width: '100%', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: 0 }}>
          <ProgressBar step={step} />
          <CountrySelectionStep
            visible={true}
            restrictToEligible={true}
            eligibleCountries={(() => {
              const val = academicDetails.backlogs;
              let backlogCount = 0;
              if (val === '0') backlogCount = 0;
              else if (val === '1-2') backlogCount = 2;
              else if (val === '3-5') backlogCount = 5;
              else if (val === '6-10') backlogCount = 10;
              else if (val === '10+') backlogCount = 11;
              else backlogCount = parseInt(val) || 0;
              return getCountryEligibility(backlogCount).filter(c => c.isEligible);
            })()}
            ineligibleCountries={(() => {
              const val = academicDetails.backlogs;
              let backlogCount = 0;
              if (val === '0') backlogCount = 0;
              else if (val === '1-2') backlogCount = 2;
              else if (val === '3-5') backlogCount = 5;
              else if (val === '6-10') backlogCount = 10;
              else if (val === '10+') backlogCount = 11;
              else backlogCount = parseInt(val) || 0;
              return getCountryEligibility(backlogCount).filter(c => !c.isEligible);
            })()}
            onSelect={(value) => {
              setCountry(value);
              setStep(10);
            }}
            initialValue={country}
          />
        </div>
      )}
      {/* Step 10: English Test Details */}
      {step === 10 && budget && financeMode && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.06)', maxWidth: 500, padding: '32px 24px', marginTop: 0 }}>
          <ProgressBar step={step} />
          <EnglishTestDetailsStep
            englishTestStatus={english}
            onSubmit={details => {
              // Check if offline counselling is needed
              const offlineCities = ['chennai', 'bangalore', 'ludhiana', 'pune'];
              const normalizedCity = (city || '').toLowerCase();
              const needsCounselling =
                offlineCities.includes(normalizedCity) &&
                (!details.counsellingType || (normalizedCity === 'bangalore' && details.counsellingType === 'offline' && !details.bangaloreBranch));
              setEnglishTestDetails(details);
              if (!needsCounselling) {
                setStep(11);
              }
              // If needsCounselling, stay on this step so the user can finish the counselling selection
            }}
            selectedCity={city}
            intake={intake}
            onEditIntake={() => setStep(9)}
          />
        </div>
      )}
      {/* Step 11: Final Congratulations or Warm Disqualification */}
      {step === 11 && (
        <div style={{ marginTop: 0, background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.06)', maxWidth: 500, width: '100%', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: 0 }}>
          <ProgressBar step={step} />
          <FinalCongratulationsPage universityCount={42} />
        </div>
      )}
      {/* Render the disqualification page if needed */}
      {step === 'disqualified' && (
        <WarmDisqualificationPage reasonType={
          (passport === 'yet-to-apply' && (education === '10th' || education === '12th' || education === 'mbbs'))
            ? 'both'
            : passport === 'yet-to-apply'
            ? 'passport'
            : undefined
        } />
      )}
    </div>
  );
}

export default App;