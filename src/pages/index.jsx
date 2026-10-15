import React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import "./Home.css";

//const heroImages = ["/images/pharmacy-3.png", "/images/pharmacy-1.png"];
const landingTabs = ["Home", "About Us", "Services", "Contact Us"];
const serviceCards = [
  {
    icon: "✚",
    title: "Medicine and Inventory Management",
    description:
      "Organize medicine details and keep inventory information easy to review.",
  },
  {
    icon: "▤",
    title: "Sales and Billing",
    description:
      "Support clear sales and billing workflows for day-to-day pharmacy operations.",
  },
  {
    icon: "♧",
    title: "Supplier Management",
    description:
      "Keep supplier information organized and accessible when managing stock.",
  },
  {
    icon: "◷",
    title: "Medicine Expiry Tracking",
    description:
      "Review expiry dates to help staff identify medicines that need attention.",
  },
  {
    icon: "!",
    title: "Low-Stock Monitoring",
    description:
      "Highlight stock levels that may need a timely review or replenishment.",
  },
  {
    icon: "▥",
    title: "Reports and Analytics",
    description:
      "Present operational information in a clear format for easier review.",
  },
];
const accountTypes = ["Customer", "Supplier", "Doctor"];
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function LogoMark({ small = false }) {
  return (
    <span className={`home-logo-mark${small ? " home-logo-mark-small" : ""}`} aria-hidden="true">
      <span>✚</span>
    </span>
  );
}

function Home() {
  const [activeTab, setActiveTab] = useState("Home");
  const [darkMode, setDarkMode] = useState(true);
  // const [heroIndex, setHeroIndex] = useState(0);
  // const [heroVisible, setHeroVisible] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [step, setStep] = useState("login");
  const [email, setEmail] = useState("");
  const [loginEmailError, setLoginEmailError] = useState("");
  const [fullName, setFullName] = useState("");
  const [accountType, setAccountType] = useState("Customer");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [seconds, setSeconds] = useState(300);
  const [authMessage, setAuthMessage] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactErrors, setContactErrors] = useState({});
  const [contactNotice, setContactNotice] = useState("");
  const [contactLoading, setContactLoading] = useState(false);
  const contactTimer = useRef(null);
  const otpInputs = useRef([]);
  const sectionRefs = useRef({});
  const carouselTimer = useRef(null);
  const switchTimer = useRef(null);

  const closeAuth = useCallback(() => {
    setAuthOpen(false);
    setStep("login");
    setEmail("");
    setLoginEmailError("");
    setPassword("");
    setOtp(["", "", "", ""]);
    setNewPassword("");
    setConfirmPassword("");
    setSeconds(300);
    setAuthMessage("");
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(media.matches);
    update();
    media.addEventListener?.("change", update);
    return () => media.removeEventListener?.("change", update);
  }, []);

  // const switchImage = useCallback(
  //   (index) => {
  //     if (index === heroIndex) return;
  //     window.clearTimeout(switchTimer.current);
  //     if (reduceMotion) {
  //       setHeroIndex(index);
  //       return;
  //     }
  //     setHeroVisible(false);
  //     switchTimer.current = window.setTimeout(() => {
  //       setHeroIndex(index);
  //       requestAnimationFrame(() => setHeroVisible(true));
  //     }, 400);
  //   },
  //   [heroIndex, reduceMotion],
  // );

  // useEffect(() => {
  //   carouselTimer.current = window.setTimeout(
  //     () => switchImage((heroIndex + 1) % heroImages.length),
  //     6000,
  //   );
  //   return () => {
  //     window.clearTimeout(carouselTimer.current);
  //     window.clearTimeout(switchTimer.current);
  //   };
  // }, [heroIndex, reduceMotion, switchImage]);

  useEffect(() => {
    const sectionElements = landingTabs
      .filter((tab) => tab !== "Home")
      .map((tab) => sectionRefs.current[tab])
      .filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) {
          setActiveTab(visible.target.dataset.landingSection);
        } else if (window.scrollY < 100) {
          setActiveTab("Home");
        }
      },
      { root: null, rootMargin: "-18% 0px -65% 0px", threshold: [0, 0.1, 0.3] },
    );
    sectionElements.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!authOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event) => {
      if (event.key === "Escape") closeAuth();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [authOpen, closeAuth]);

  useEffect(
    () => () => {
      window.clearTimeout(contactTimer.current);
    },
    [],
  );

  const navigateTab = (tab) => {
    setActiveTab(tab);
    const section = sectionRefs.current[tab];
    if (tab === "Home") {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    } else if (section) {
      const navHeight = document.querySelector(".home-navbar")?.offsetHeight || 80;
      window.scrollTo({
        top: window.scrollY + section.getBoundingClientRect().top - navHeight - 12,
        behavior: reduceMotion ? "auto" : "smooth",
      });
    }
  };

  const openLogin = () => {
    setAuthMessage("");
    setLoginEmailError("");
    setStep("login");
    setAuthOpen(true);
  };

  const openSignup = () => {
    setFullName("");
    setNewPassword("");
    setConfirmPassword("");
    setAccountType("Customer");
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    setAuthMessage("");
    setStep("signup");
  };

  const validateEmail = (value) => {
    if (!value.trim()) return "Please enter your email address.";
    if (!emailPattern.test(value.trim())) return "Please enter a valid email address.";
    return "";
  };

  const passwordValid =
    newPassword.length >= 8 &&
    /[A-Z]/.test(newPassword) &&
    /[a-z]/.test(newPassword) &&
    /[0-9]/.test(newPassword);

  const handleLogin = (event) => {
    event.preventDefault();
    const error = validateEmail(email);
    setLoginEmailError(error);
    if (error) return;
    if (!password.trim()) {
      setAuthMessage("Password Required — Please enter your password.");
      return;
    }
    setAuthMessage("");
    setStep("login-success");
  };

  const handleSignup = (event) => {
    event.preventDefault();
    if (!fullName.trim()) return setAuthMessage("Name Required — Please enter your full name.");
    const emailError = validateEmail(email);
    if (emailError) return setAuthMessage(emailError.replace("Please ", "Email — please "));
    if (!passwordValid) return setAuthMessage("Invalid Password — Please meet all password requirements.");
    if (newPassword !== confirmPassword) return setAuthMessage("Password Mismatch — Your passwords must match.");
    setAuthMessage("");
    setStep("signup-success");
  };

  const handleForgot = (event) => {
    event.preventDefault();
    const error = validateEmail(email);
    if (error) return setAuthMessage(error);
    setAuthMessage("");
    setSeconds(300);
    setOtp(["", "", "", ""]);
    setStep("otp");
  };

  useEffect(() => {
    if (step !== "otp" || seconds <= 0) return undefined;
    const timer = window.setInterval(() => setSeconds((current) => Math.max(0, current - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [step, seconds]);

  const updateOtp = (value, index) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    setOtp((current) => current.map((item, i) => (i === index ? digit : item)));
    if (digit && index < 3) otpInputs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (event, index) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      otpInputs.current[index - 1]?.focus();
    }
  };

  const verifyOtp = () => {
    if (otp.join("").length !== 4) return setAuthMessage("Invalid OTP — Please enter the complete 4-digit code.");
    setAuthMessage("");
    setStep("otp-success");
  };

  const handleResetPassword = (event) => {
    event.preventDefault();
    if (!newPassword) return setAuthMessage("Password Required — Please enter a new password.");
    if (!passwordValid) return setAuthMessage("Invalid Password — Please meet all password requirements.");
    if (!confirmPassword) return setAuthMessage("Confirm Password — Please confirm your password.");
    if (newPassword !== confirmPassword) return setAuthMessage("Password Mismatch — New password and confirm password must match.");
    setAuthMessage("");
    setStep("reset-success");
  };

  const submitContact = (event) => {
    event.preventDefault();
    if (contactLoading) return;
    const errors = {};
    if (!contactName.trim()) errors.name = "Please enter your name.";
    if (!contactEmail.trim()) errors.email = "Please enter your email address.";
    else if (!emailPattern.test(contactEmail.trim())) errors.email = "Please enter a valid email address.";
    if (!contactMessage.trim()) errors.message = "Please enter a message.";
    setContactErrors(errors);
    setContactNotice("");
    if (Object.keys(errors).length) return;
    setContactName(contactName.trim());
    setContactEmail(contactEmail.trim());
    setContactLoading(true);
    contactTimer.current = window.setTimeout(() => {
      setContactLoading(false);
      setContactNotice("Thanks for reaching out. This is a frontend demo, so your message has not been sent.");
    }, 650);
  };

  const clearContactNotice = () => setContactNotice("");

  const renderPasswordRequirements = () => (
    <ul className="home-password-requirements" aria-label="Password requirements">
      {[
        [newPassword.length >= 8, "At least 8 characters"],
        [/[A-Z]/.test(newPassword), "One uppercase letter (A-Z)"],
        [/[a-z]/.test(newPassword), "One lowercase letter (a-z)"],
        [/[0-9]/.test(newPassword), "One number (0-9)"],
      ].map(([passed, label]) => (
        <li className={passed ? "is-passed" : ""} key={label}>
          <span aria-hidden="true">{passed ? "✓" : "○"}</span> {label}
        </li>
      ))}
    </ul>
  );

  const renderPrimaryButton = (label, action, disabled = false, type = "button") => (
    <button className="home-modal-primary" type={type} onClick={type === "button" ? action : undefined} disabled={disabled}>
      {label}
    </button>
  );

  const renderRecoveryProgress = (activeStep) => (
    <div className="home-recovery-progress" role="progressbar" aria-label={`Password recovery step ${activeStep} of 3`} aria-valuemin="1" aria-valuemax="3" aria-valuenow={activeStep}>
      {["Email", "Verify", "Reset"].map((label, index) => {
        const number = index + 1;
        return (
          <div className={`home-progress-step${number <= activeStep ? " is-current" : ""}`} key={label}>
            <span className="home-progress-node">{number < activeStep ? "✓" : number}</span>
            <span>{label}</span>
          </div>
        );
      })}
      <span className="home-progress-rail"><span style={{ width: `${((activeStep - 1) / 2) * 100}%` }} /></span>
    </div>
  );

  const renderAuthStep = () => {
    const titleByStep = {
      login: "Welcome Back",
      signup: "Create Account",
      forgot: "Forgot Password?",
      otp: "Verification Code",
      "otp-success": "Verification Code",
      reset: "Create New Password",
      "reset-success": "Password Updated",
      "signup-success": "Account Created Successfully!",
      "login-success": "Login Successful!",
    };
    const subtitleByStep = {
      login: "Sign in to continue to MEDICARE",
      signup: "Sign up to get started with MEDICARE",
      forgot: "Enter your registered email and we will send a 4-digit code.",
      otp: "Enter the 4-digit code sent to your registered email.",
      "otp-success": "Your email has been verified.",
      reset: "Create a strong password for your MEDICARE account.",
      "reset-success": "Your password has been changed successfully. You can now log in with your new credentials.",
      "signup-success": "Your MEDICARE registration form has been completed successfully.",
      "login-success": "You have successfully signed in to MEDICARE.",
    };
    const success = ["otp-success", "reset-success", "signup-success", "login-success"].includes(step);
    return (
      <>
        {["forgot", "otp", "otp-success", "reset"].includes(step) && renderRecoveryProgress(
          step === "forgot" ? 1 : step === "otp" || step === "otp-success" ? 2 : 3,
        )}
        {success && <div className="home-success-icon" aria-hidden="true">✓</div>}
        {step === "login" || step === "signup" ? <LogoMark small /> : null}
        <h2 className="home-modal-title" id="home-auth-title">{titleByStep[step]}</h2>
        <p className="home-modal-subtitle">{subtitleByStep[step]}</p>
        <p className="home-demo-auth-note">Demo flow only — no account details are submitted.</p>
        {authMessage && <p className="home-auth-message" role="alert">{authMessage}</p>}

        {step === "login" && (
          <form onSubmit={handleLogin} noValidate>
            <label className="home-field-label" htmlFor="auth-login-email">Email Address</label>
            <input id="auth-login-email" className="home-modal-input" type="email" autoComplete="email" placeholder="Enter your email" value={email} onChange={(event) => {
              setEmail(event.target.value);
              if (loginEmailError) setLoginEmailError(validateEmail(event.target.value));
              setAuthMessage("");
            }} />
            {loginEmailError && <span className="home-field-error">{loginEmailError}</span>}
            <label className="home-field-label" htmlFor="auth-login-password">Password</label>
            <div className="home-password-wrap">
              <input id="auth-login-password" className="home-modal-input" type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="Enter your password" value={password} onChange={(event) => setPassword(event.target.value)} />
              <button type="button" className="home-password-toggle" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? "Hide" : "Show"}</button>
            </div>
            <button type="button" className="home-text-link home-forgot-link" onClick={() => { setAuthMessage(""); setStep("forgot"); }}>Forgot Password?</button>
            {renderPrimaryButton("Sign In", undefined, false, "submit")}
            <p className="home-security-text">🔒 Secure access • Role-based authentication</p>
            <div className="home-auth-prompt">New to MEDICARE? <button type="button" className="home-text-link" onClick={openSignup}>Create account</button></div>
          </form>
        )}

        {step === "signup" && (
          <form onSubmit={handleSignup} noValidate>
            <label className="home-field-label" htmlFor="auth-full-name">
              Full Name
            </label>
            <input 
              id="auth-full-name" 
              className="home-modal-input" 
              autoComplete="name" 
              placeholder="Enter your full name" 
              value={fullName} 
              onChange={(event) => setFullName(event.target.value)}
            />

            <label className="home-field-label" htmlFor="auth-signup-email">
              Email Address
            </label>
            <input 
              id="auth-signup-email" 
              className="home-modal-input" 
              type="email" 
              autoComplete="email" 
              placeholder="Enter your email" 
              value={email} 
              onChange={(event) => setEmail(event.target.value)}
            />
            <label className="home-field-label" htmlFor="auth-account-type">
              Account Type
            </label>
            <select 
              id="auth-account-type" 
              className="home-modal-input home-account-select"
              value={accountType} 
              onChange={(event) => setAccountType(event.target.value)}
            >
              {accountTypes.map((type) => <option key={type}>{type}</option>)}
            </select>

            <label className="home-field-label" htmlFor="auth-signup-password">Password</label>
            <div className="home-password-wrap">
              <input 
                id="auth-signup-password" 
                className="home-modal-input" 
                type={showNewPassword ? "text" : "password"} 
                autoComplete="new-password" 
                placeholder="Create a password" 
                value={newPassword} 
                onChange={(event) => setNewPassword(event.target.value)} 
              />
              <button type="button" 
              className="home-password-toggle"
                onClick={() => setShowNewPassword((value) => !value)} 
                aria-label={showNewPassword ? "Hide password" : "Show password"}
                >
                {showNewPassword ? "Hide" : "Show"}
                </button>
            </div>
            {renderPasswordRequirements()}
            <label className="home-field-label" htmlFor="auth-confirm-password">Confirm Password</label>
            <div className="home-password-wrap">
              <input id="auth-confirm-password" className="home-modal-input" type={showConfirmPassword ? "text" : "password"} autoComplete="new-password" placeholder="Confirm your password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />
              <button type="button" className="home-password-toggle" onClick={() => setShowConfirmPassword((value) => !value)} aria-label={showConfirmPassword ? "Hide password" : "Show password"}>{showConfirmPassword ? "Hide" : "Show"}</button>
            </div>
            {confirmPassword && newPassword !== confirmPassword && <span className="home-field-error">Passwords do not match.</span>}
            {renderPrimaryButton("Create Account", undefined, false, "submit")}
            <button type="button" className="home-back-button" onClick={() => { setAuthMessage(""); setStep("login"); }}>← Back to Sign In</button>
          </form>
        )}

        {step === "forgot" && (
          <form onSubmit={handleForgot} noValidate>
            <label className="home-field-label" htmlFor="auth-forgot-email">Email Address</label>
            <input id="auth-forgot-email" className="home-modal-input" type="email" autoComplete="email" placeholder="Enter your email" value={email} onChange={(event) => setEmail(event.target.value)} />
            {renderPrimaryButton("Send OTP", undefined, false, "submit")}
            <button type="button" className="home-back-button" onClick={() => { setAuthMessage(""); setStep("login"); }}>← Back to Login</button>
          </form>
        )}

        {step === "otp" && (
          <div>
            <p className="home-otp-email">{email}</p>
            <div className="home-otp-inputs" aria-label="Four digit verification code">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(element) => { otpInputs.current[index] = element; }}
                  aria-label={`Verification code digit ${index + 1}`}
                  className={`home-otp-input${digit ? " has-value" : ""}`}
                  inputMode="numeric"
                  autoComplete={index === 0 ? "one-time-code" : "off"}
                  maxLength={1}
                  value={digit}
                  onChange={(event) => updateOtp(event.target.value, index)}
                  onKeyDown={(event) => handleOtpKeyDown(event, index)}
                />
              ))}
            </div>
            <p className="home-otp-timer">{seconds > 0 ? `OTP expires in ${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}` : "OTP expired"}</p>
            {renderPrimaryButton("Verify OTP", verifyOtp, seconds <= 0)}
            <button type="button" className="home-text-link home-resend" disabled={seconds > 0} onClick={() => { setOtp(["", "", "", ""]); setSeconds(300); setAuthMessage("OTP Sent — A new OTP has been sent to your email."); }}>Resend OTP</button>
            <button type="button" className="home-back-button" onClick={() => { setAuthMessage(""); setStep("forgot"); }}>← Change Email</button>
          </div>
        )}

        {step === "otp-success" && (
          <div className="home-success-step">
            <span className="home-verified-label">🔒 Verified and secure</span>
            {renderPrimaryButton("Continue", () => { setAuthMessage(""); setStep("reset"); })}
          </div>
        )}

        {step === "reset" && (
          <form onSubmit={handleResetPassword} noValidate>
            <label className="home-field-label" htmlFor="auth-new-password">New Password</label>
            <div className="home-password-wrap">
              <input id="auth-new-password" className="home-modal-input" type={showNewPassword ? "text" : "password"} autoComplete="new-password" placeholder="Enter new password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} />
              <button type="button" className="home-password-toggle" onClick={() => setShowNewPassword((value) => !value)} aria-label={showNewPassword ? "Hide password" : "Show password"}>{showNewPassword ? "Hide" : "Show"}</button>
            </div>
            {renderPasswordRequirements()}
            <label className="home-field-label" htmlFor="auth-reset-confirm">Confirm Password</label>
            <div className="home-password-wrap">
              <input id="auth-reset-confirm" className="home-modal-input" type={showConfirmPassword ? "text" : "password"} autoComplete="new-password" placeholder="Confirm your password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />
              <button type="button" className="home-password-toggle" onClick={() => setShowConfirmPassword((value) => !value)} aria-label={showConfirmPassword ? "Hide password" : "Show password"}>{showConfirmPassword ? "Hide" : "Show"}</button>
            </div>
            {confirmPassword && newPassword !== confirmPassword && <span className="home-field-error">Passwords do not match.</span>}
            {renderPrimaryButton("Update Password", undefined, false, "submit")}
            <button type="button" className="home-back-button" onClick={() => { setAuthMessage(""); setStep("login"); }}>← Cancel</button>
          </form>
        )}

        {step === "reset-success" && renderPrimaryButton("Continue to Login", () => { setAuthMessage(""); setStep("login"); })}
        {step === "signup-success" && (
          <div className="home-success-step">
            <p className="home-signup-role">Account Type: {accountType}</p>
            {renderPrimaryButton("Continue to Sign In", () => { setAuthMessage(""); setStep("login"); })}
          </div>
        )}
        {step === "login-success" && renderPrimaryButton("OK", closeAuth)}
      </>
    );
  };

  return (
    <main className={`home-page${darkMode ? " theme-dark" : " theme-light"}`}>
      <header className="home-navbar">
        <div className="home-navbar-inner">
          <button className="home-brand" type="button" onClick={() => navigateTab("Home")} aria-label="MEDICARE home">
            <LogoMark />
            <span className="home-brand-copy">
              <strong>MEDICARE<span className="home-brand-dot">.</span></strong>
              <small>SMART PHARMACY OS</small>
            </span>
          </button>
          <nav className="home-navigation" aria-label="Main navigation">
            {landingTabs.map((tab) => (
              <button key={tab} type="button" className={`home-nav-link${activeTab === tab ? " is-active" : ""}`} aria-current={activeTab === tab ? "page" : undefined} onClick={() => navigateTab(tab)}>
                {activeTab === tab && <span className="home-nav-dot" aria-hidden="true" />}
                {tab}
              </button>
            ))}
          </nav>
          <div className="home-nav-actions">
            <button className="home-sign-in" type="button" onClick={openLogin}><span aria-hidden="true">♙</span> Sign In</button>
            <button className="home-theme-toggle" type="button" onClick={() => setDarkMode((value) => !value)} aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"} title={darkMode ? "Switch to light mode" : "Switch to dark mode"}>
              <span aria-hidden="true">{darkMode ? "☼" : "☾"}</span>
            </button>
          </div>
        </div>
      </header>

      <section className="home-hero" id="home" aria-label="Welcome to MEDICARE">
        {/* <img className={`home-hero-image${heroVisible ? " is-visible" : ""}`} src={heroImages[heroIndex]} alt="" aria-hidden="true" /> */}
        <div className="home-hero-overlay" aria-hidden="true" />
        <div className="home-hero-inner">
          <div className="home-hero-copy">
            <h1>Next-Gen Medicine<br /><span>Shop Management</span></h1>
            <p>Streamline medicine billing, verified inventory tracking, expiry monitoring, and real-time pharmacy operations with intelligent precision.</p>
            <button className="home-get-started" type="button" onClick={openLogin}>Get Started <span aria-hidden="true">→</span></button>
            {/* <div className="home-carousel-bar" aria-label={`Hero image ${heroIndex + 1} of ${heroImages.length}`}>
              <span>VIEW:</span>
              <div className="home-carousel-dots">
                {heroImages.map((image, index) => (
                  <button key={image} type="button" className={`home-carousel-dot${index === heroIndex ? " is-active" : ""}`} aria-label={`Show pharmacy photo ${index + 1}`} aria-pressed={index === heroIndex} onClick={() => switchImage(index)} />
                ))}
              </div>
              <span className="home-carousel-count">0{heroIndex + 1} / 0{heroImages.length}</span>
            </div> */}
          </div>
        </div>
      </section>

      <section className="home-section home-about" id="about-us" data-landing-section="About Us" ref={(element) => { sectionRefs.current["About Us"] = element; }}>
        <div className="home-section-inner">
          <p className="home-eyebrow">OUR PURPOSE</p>
          <h2>About MEDICARE</h2>
          <p className="home-section-description">MEDICARE is a Medicine Shop Management System designed to simplify pharmacy operations. It helps organize medicine inventory, manage sales and billing, track expiry dates, and maintain supplier information in one clear experience.</p>
          <div className="home-highlights">
            {[
              ["▦", "Stay organized", "Bring essential pharmacy information together."],
              ["◷", "Keep an eye on dates", "Make expiry tracking easier to review."],
              ["ϟ", "Simplify daily work", "Support smoother day-to-day shop operations."],
            ].map(([icon, title, text]) => (
              <article className="home-highlight-card" key={title}>
                <span className="home-highlight-icon" aria-hidden="true">{icon}</span>
                <h3>{title}</h3><p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section home-services" id="services" data-landing-section="Services" ref={(element) => { sectionRefs.current.Services = element; }}>
        <div className="home-section-inner">
          <p className="home-eyebrow">WHAT YOU CAN DO</p>
          <h2>Services</h2>
          <p className="home-section-description">Explore tools designed to support common medicine shop workflows. These are frontend demonstrations, not a claim that backend services are connected.</p>
          <div className="home-services-grid">
            {serviceCards.map((service) => (
              <article className="home-service-card" key={service.title}>
                <span className="home-service-icon" aria-hidden="true">{service.icon}</span>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section home-contact" id="contact-us" data-landing-section="Contact Us" ref={(element) => { sectionRefs.current["Contact Us"] = element; }}>
        <div className="home-section-inner home-contact-inner">
          <p className="home-eyebrow">WE’RE HERE TO HELP</p>
          <h2>Contact Us</h2>
          <p className="home-section-description">Have a question or suggestion? Send us a note using this demo form.</p>
          <form className="home-contact-card" onSubmit={submitContact} noValidate>
            <label htmlFor="contact-name">Name</label>
            <input id="contact-name" name="name" autoComplete="name" placeholder="Your name" value={contactName} aria-invalid={Boolean(contactErrors.name)} aria-describedby={contactErrors.name ? "contact-name-error" : undefined} onChange={(event) => { setContactName(event.target.value); if (contactErrors.name && event.target.value.trim()) setContactErrors((current) => ({ ...current, name: undefined })); clearContactNotice(); }} />
            {contactErrors.name && <span id="contact-name-error" className="home-contact-error">{contactErrors.name}</span>}
            <label htmlFor="contact-email">Email</label>
            <input id="contact-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" value={contactEmail} aria-invalid={Boolean(contactErrors.email)} aria-describedby={contactErrors.email ? "contact-email-error" : undefined} onChange={(event) => { const value = event.target.value; setContactEmail(value); if (contactErrors.email) setContactErrors((current) => ({ ...current, email: !value.trim() ? "Please enter your email address." : emailPattern.test(value.trim()) ? undefined : "Please enter a valid email address." })); clearContactNotice(); }} />
            {contactErrors.email && <span id="contact-email-error" className="home-contact-error">{contactErrors.email}</span>}
            <label htmlFor="contact-message">Message</label>
            <textarea id="contact-message" name="message" placeholder="How can we help?" rows="5" value={contactMessage} aria-invalid={Boolean(contactErrors.message)} aria-describedby={contactErrors.message ? "contact-message-error" : undefined} onChange={(event) => { setContactMessage(event.target.value); if (contactErrors.message && event.target.value.trim()) setContactErrors((current) => ({ ...current, message: undefined })); clearContactNotice(); }} />
            {contactErrors.message && <span id="contact-message-error" className="home-contact-error">{contactErrors.message}</span>}
            <button className="home-contact-submit" type="submit" disabled={contactLoading}><span className="home-spinner" aria-hidden="true" hidden={!contactLoading} />{contactLoading ? "Sending..." : "Submit Message"}</button>
            {contactNotice && <p className="home-contact-notice" role="status">{contactNotice}</p>}
          </form>
        </div>
      </section>

      <footer className="home-footer">MEDICARE SMART PHARMACY PLATFORM • ALL RIGHTS RESERVED</footer>

      {authOpen && (
        <div className="home-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) closeAuth(); }}>
          <section className="home-auth-dialog" role="dialog" aria-modal="true" aria-labelledby="home-auth-title">
            <button type="button" className="home-modal-close" onClick={closeAuth} aria-label="Close sign-in dialog">×</button>
            {renderAuthStep()}
          </section>
        </div>
      )}
    </main>
  );
}

export default Home;
