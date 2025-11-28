import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Shield, ArrowLeft } from "lucide-react";
import HiveLogo from "../assets/images/Hive logo.png";
import { useUser } from "../context/UserContext";

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    verifyOTP,
    resendOTP,
    checkAuth,
    loading,
    error: contextError,
  } = useUser();

  // Get userId and email from navigation state
  const { userId, email } = location.state || {};

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Refs for OTP inputs
  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  // Redirect if no userId or email
  useEffect(() => {
    if (!userId || !email) {
      navigate("/login");
    }
  }, [userId, email, navigate]);

  // Timer for resend OTP
  useEffect(() => {
    let interval;
    if (resendTimer > 0 && !canResend) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }

    return () => clearInterval(interval);
  }, [resendTimer, canResend]);

  // Focus first input on mount
  useEffect(() => {
    if (inputRefs[0].current) {
      inputRefs[0].current.focus();
    }
  }, []);

  // Handle OTP input change
  const handleChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Clear errors when user starts typing
    if (errors.otp) {
      setErrors({});
    }

    // Move to next input if value is entered
    if (value && index < 5) {
      inputRefs[index + 1].current?.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        // Move to previous input if current is empty
        inputRefs[index - 1].current?.focus();
      } else {
        // Clear current input
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs[index - 1].current?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs[index + 1].current?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").trim();

    // Only process if it's a 6-digit number
    if (/^\d{6}$/.test(pastedData)) {
      const newOtp = pastedData.split("");
      setOtp(newOtp);

      // Focus last input
      inputRefs[5].current?.focus();
    }
  };

  // Validate OTP
  const validateOTP = () => {
    const otpString = otp.join("");

    if (otpString.length !== 6) {
      setErrors({ otp: "Please enter all 6 digits" });
      return false;
    }

    return true;
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateOTP()) {
      return;
    }

    try {
      const otpString = otp.join("");
      const data = await verifyOTP({
        userId,
        otp: otpString,
      });

      setSuccessMessage("Phone number verified successfully!");

      // Navigate based on user role
      setTimeout(() => {
        const userRole = data.user?.role || data.role;

        if (userRole === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      }, 1500);
    } catch (error) {
      setErrors({
        general: error.message || "Invalid OTP. Please try again.",
      });
      // Clear OTP inputs on error
      setOtp(["", "", "", "", "", ""]);
      inputRefs[0].current?.focus();
    }
  };
  // Handle resend OTP
  const handleResendOTP = async () => {
    if (!canResend) return;

    try {
      await resendOTP({ userId });

      setSuccessMessage("OTP sent successfully!");
      setCanResend(false);
      setResendTimer(60);
      setErrors({});

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      setErrors({
        general: error.message || "Failed to resend OTP. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Back Button */}
        <div className="flex justify-start">
          <button
            onClick={() => navigate("/login")}
            className="flex items-center text-gray-600 hover:text-black transition-colors text-sm"
          >
            <ArrowLeft size={18} className="mr-2" />
            Back to Login
          </button>
        </div>

        {/* Logo */}
        <div className="text-center">
          <Link to="/">
            <img
              src={HiveLogo}
              alt="Hive Logo"
              className="h-12 w-auto mx-auto mb-6"
            />
          </Link>
          <div className="flex justify-center mb-4">
            <div className="bg-black rounded-full p-4">
              <Shield size={32} className="text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-light tracking-wide text-black uppercase">
            Verify Your Phone
          </h2>
          <p className="mt-2 text-sm text-gray-600 tracking-wide">
            We've sent a 6-digit code to your phone number
          </p>
          {email && (
            <p className="mt-1 text-sm font-medium text-black">{email}</p>
          )}
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Success Message */}
          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm">
              {successMessage}
            </div>
          )}

          {/* Error Message */}
          {(errors.general || contextError) && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {errors.general || contextError}
            </div>
          )}

          {/* OTP Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4 text-center tracking-wide">
              Enter OTP Code
            </label>
            <div className="flex justify-center gap-2 sm:gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={inputRefs[index]}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  className={`w-12 h-12 sm:w-14 sm:h-14 text-center text-xl font-semibold border-2 ${
                    errors.otp
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-black focus:ring-black"
                  } rounded-lg focus:outline-none focus:ring-2 transition-all`}
                  disabled={loading}
                />
              ))}
            </div>
            {errors.otp && (
              <p className="mt-3 text-sm text-red-600 text-center">
                {errors.otp}
              </p>
            )}
          </div>

          {/* Resend OTP */}
          <div className="text-center">
            {canResend ? (
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={loading}
                className="text-sm text-black hover:text-gray-700 transition-colors font-medium underline disabled:opacity-50"
              >
                {loading ? "Sending..." : "Resend OTP"}
              </button>
            ) : (
              <p className="text-sm text-gray-600">
                Resend code in{" "}
                <span className="font-semibold text-black">{resendTimer}s</span>
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || otp.join("").length !== 6}
            className="w-full bg-black text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors font-medium tracking-widest uppercase text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

          {/* Help Text */}
          <div className="text-center">
            <p className="text-xs text-gray-500 tracking-wide">
              Didn't receive the code? Check your phone or try resending.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyOTP;
