import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import axios from "axios"
const SignupPage = () => {
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
  });
  const handleSubmit = async (e) => {
    e.preventDefault(); // stop page reload

    // 1️⃣ Frontend validation
    if (!user.username || !user.email || !user.password) {
      return toast.error("All fields are required");
    }
    if (user.password.length < 6) {
      return toast.error("Password must be at least 6 characters long");
    }
    // 2️⃣ Send data to backend
    try{
        const res = await axios.post("/api/signup", user);
    }catch{}
  };

  return <div></div>;
};

export default SignupPage;
