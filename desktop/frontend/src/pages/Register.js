import "font-awesome/css/font-awesome.min.css";
import { Formik } from "formik";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as Yup from "yup";
import useAuth from "../hooks/useAuth";
import "./login.css";
const initialValues = {
  fullname: "",
  username: "",
  email: "",
  phone: "",
  password: "",
};

const validationSchema = Yup.object().shape({
  fullname: Yup.string().required("Full name is required"),
  username: Yup.string().required("Username is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  phone: Yup.string()
    .matches(/^[0-9]+$/, "Phone Number must contain only digits")
    .min(10, "Phone Number must be at least 10 digits")
    .max(15, "Phone Number must be at most 15 digits")
    .required("Phone number is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const handleFormSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await register(
        values.fullname,
        values.phone,
        values.username,
        values.email,
        values.password
      );

      if (!response || !response.status) {
        throw new Error("Invalid response from server.");
      }

      if (response.status === 201) {
        toast.success("Registration successful!");
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else {
        toast.error("Registration failed!");
      }
    } catch (error) {
      toast.error("An error occurred during registration.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // const redirectToGoogle = () => {
  //   console.log("Redirecting to Google OAuth...");
  //   window.location.href = `${process.env.REACT_APP_API_URL}/api/google`;
  // };

  // useEffect(() => {
  //   console.log("GoogleOauth useEffect triggered");
  //   console.log("Full URL:", window.location.href);

  //   const urlParams = new URLSearchParams(window.location.search);
  //   const accessToken = urlParams.get("accessToken");
  //   const refreshToken = urlParams.get("refreshToken");

  //   console.log("Extracted Tokens from URL:", { accessToken, refreshToken });

  //   if (accessToken && refreshToken) {
  //     console.log("Tokens found! Storing them in localStorage.");
  //     localStorage.setItem("jwtToken", accessToken);
  //     localStorage.setItem("refreshToken", refreshToken);
  //     axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

  //     console.log("Tokens saved! Navigating to /vision...");
  //     navigate("/dashboard", { replace: true });
  //   } else {
  //     console.log("No valid tokens found in URL. Staying on /login.");
  //   }
  // }, [navigate]);
  return (
  <>
    <ToastContainer position="top-center" />

    <div className="register-page">

      {/* TOP BAR */}
      <div className="register-topbar">
        <div className="topbar-left">
          <span className="back-arrow">←</span>
          <span className="app-title">EdSofta Desktop</span>
        </div>

        <div className="auth-toggle">
          <button className="active">Sign Up</button>
          <button onClick={() => navigate("/login")}>Sign In</button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="register-content">

        {/* LEFT TEXT */}
        <div className="register-left">
          <h1>Create a new account</h1>
          <p>Your first time? lets get you started</p>
        </div>

        {/* RIGHT FORM */}
        <div className="register-right">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleFormSubmit}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
            }) => (
              <form onSubmit={handleSubmit} className="register-form">

                <div className="form-group">
                  <label>Firstname</label>
                  <input
                    type="text"
                    name="fullname"
                    value={values.fullname}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>

                <div className="form-group">
                  <label>Surname</label>
                  <input type="text" />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>

                <div className="form-group">
                  <label>Phone number</label>
                  <input
                    type="text"
                    name="phone"
                    value={values.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>

                <div className="form-group">
                  <label>Password</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>

                <div className="form-group">
                  <label>Confirm Password</label>
                  <input type="password" />
                </div>

                <div className="submit-row">
                  <button type="submit" disabled={loading}>
                    {loading ? "Submitting..." : "Submit"}
                  </button>
                </div>

              </form>
            )}
          </Formik>
        </div>

      </div>
    </div>
  </>
);

};

export default Register;
