// SignUp.jsx
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [user_id, setUser_id] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post(
        "http://10.13.10.12:5001/api/auth/register",
        {
          user_id,
          password,
        }
      );

      setSuccess(res.data.message || "User registered successfully!");
      setError("");
      setTimeout(() => navigate("/signIn"), 1500); // redirect after success
    } catch (err) {
      setError(err.response?.data?.message || "Sign up failed");
      setSuccess("");
    }
  };

  return (
    <div className="signin-container">
      <h2>Sign Up</h2>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <form onSubmit={handleSignUp}>
        <div>
          <input
            type="text"
            placeholder="User ID"
            value={user_id}
            onChange={(e) => setUser_id(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUp;
