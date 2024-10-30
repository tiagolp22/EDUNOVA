import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "assets/imgs/EduNova_logo.png";
import signup from "assets/imgs/signup.png";
import Button from "components/Button/Button";

export default function Signup({ t }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "", // Changed from name to username
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (
      !formData.username || // Changed from name to username
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError(t("please_fill_all_fields"));
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError(t("passwords_dont_match"));
      return false;
    }

    if (formData.password.length < 8) {
      // Updated to match model validation
      setError(t("password_too_short"));
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username, // Changed from name to username
          email: formData.email,
          password: formData.password,
          privilege_id: 3,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error creating account");
      }

      // Redirect to login page on success
      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
      <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div>
            <img src={logo} className="w-48 mx-auto" alt="EduNova Logo" />
          </div>
          <div className="mt-12 flex flex-col items-center">
            <h1 className="text-2xl xl:text-3xl font-extrabold">
              {t("signup_create")}
            </h1>
            <form onSubmit={handleSubmit} className="w-full flex-1 mt-8">
              <div className="mx-auto max-w-xs">
                {error && (
                  <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg">
                    {error}
                  </div>
                )}

                <input
                  className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                  type="text"
                  placeholder={t("signup_username")} // Updated placeholder
                  name="username" // Changed from name to username
                  value={formData.username} // Changed from name to username
                  onChange={handleChange}
                />
                <input
                  className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
                <input
                  className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                  type="password"
                  placeholder={t("signup_password")}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <input
                  className="w-full px-8 py-4 mb-2 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                  type="password"
                  placeholder={t("signup_password_confirm")}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? t("signing_up") : t("sign_up")}
                </Button>

                <p className="text-[0.7rem]">
                  {t("have-account")}
                  <Link to={"/login"}>{t("click_login")}</Link>
                </p>
              </div>
            </form>
          </div>
        </div>
        <div className="flex-1 text-center hidden lg:flex">
          <div
            className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${signup})`,
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}
