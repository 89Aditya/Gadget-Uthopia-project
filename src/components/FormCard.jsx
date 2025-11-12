import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

/* ----------------------------
   Validators
-----------------------------*/
const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || "").trim());
const isPhone10 = (v) => /^\d{10}$/.test(String(v || "").trim());
const strongPassword = (v) =>
  v.length >= 8 && /[a-z]/.test(v) && /[A-Z]/.test(v) && /\d/.test(v) && /[^A-Za-z0-9]/.test(v);
const minLen = (v, n) => String(v || "").trim().length >= n;

/* ----------------------------
   Initial form + options
-----------------------------*/
const initial = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  gender: "",
  phone: "",
  address: "",
  state: "",
  city: "",
  country: "",
  description: "",
};

const countries = [
  "India",
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "Other",
];

/* ----------------------------
   CENTRAL VALIDATION LOGIC
-----------------------------*/
function validateField(field, value, form) {
  switch (field) {
    case "name":
      return /^[A-Za-z\s'-]+$/.test(value)
        ? undefined
        : "Name should contain only letters.";
    case "email":
      return isEmail(value) ? undefined : "Enter a valid email";
    case "password":
      return strongPassword(value)
        ? undefined
        : "Password must be 8+ chars incl. upper, lower, number, special";
    case "confirmPassword":
      return value === form.password ? undefined : "Passwords do not match";
    case "phone":
      return /^\d+$/.test(value)
        ? isPhone10(value)
          ? undefined
          : "Phone must be 10 digits"
        : "Phone must contain digits only (no letters)";
    case "country":
      return String(value || "").trim() ? undefined : "Country is required";
    default:
      return undefined;
  }
}

function validateAll(form) {
  const fields = [
    "name",
    "email",
    "password",
    "confirmPassword",
    "phone",
    "country",
  ];
  const next = {};
  for (const f of fields) {
    const err = validateField(f, form[f], form);
    if (err) next[f] = err;
  }
  return next;
}

/* ----------------------------
   Component
-----------------------------*/
export default function FormCard() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Live validation trigger
  const isValid = useMemo(
    () =>
      Object.keys(errors).length === 0 &&
      ["name", "email", "password", "confirmPassword", "phone", "country"].every(
        (k) => String(form[k] || "").trim().length > 0
      ),
    [errors, form]
  );

  useEffect(() => {
    const saved = localStorage.getItem("latestUser");
    if (saved) {
      try {
        const obj = JSON.parse(saved);
        setForm((prev) => ({ ...prev, ...obj }));
        setErrors(validateAll({ ...initial, ...obj }));
      } catch {}
    }
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const nextForm = { ...prev, [name]: value };
      const fieldErr = validateField(name, value, nextForm);
      setErrors((prevErrs) => {
        const n = { ...prevErrs };
        if (name === "password" && nextForm.confirmPassword) {
          const cpErr = validateField(
            "confirmPassword",
            nextForm.confirmPassword,
            nextForm
          );
          if (cpErr) n.confirmPassword = cpErr;
          else delete n.confirmPassword;
        }
        if (fieldErr) n[name] = fieldErr;
        else delete n[name];
        return n;
      });
      if (message?.type === "success") setMessage(null);
      return nextForm;
    });
  };

  const reset = () => {
    setForm(initial);
    setErrors(validateAll(initial));
    setMessage(null);
  };

  const saveToLocalStorage = (obj) =>
    localStorage.setItem("latestUser", JSON.stringify(obj));

  const submit = async (e) => {
    e.preventDefault();
    setMessage(null);
    const finalErrors = validateAll(form);
    setErrors(finalErrors);
    if (Object.keys(finalErrors).length > 0) return;

    const payload = {
      ...form,
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      state: form.state.trim(),
      city: form.city.trim(),
      description: form.description.trim(),
    };

    saveToLocalStorage(payload);

    try {
      setLoading(true);
      await axios.post("http://localhost:4000/api/users", payload);
      setMessage({ type: "success", text: "Registration successful!" });
    } catch (err) {
      setMessage({
        type: "error",
        text: "Saved locally ✔ (server sync failed; is backend running?)",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="card">
        <div className="card-header">
          <div className="badge">Orange & Blue</div>
          <h1 className="card-title">User Registration</h1>
          <div className="card-subtitle">
            Fields marked <span className="required">*</span> are compulsory.
          </div>
        </div>

        <form className="card-body" onSubmit={submit} noValidate>
          <div className="grid">
            {/* Name */}
            <div className="col-6">
              <div className="field">
                <label className="label">
                  Name <span className="required">*</span>
                </label>
                <input
                  className="input"
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  placeholder="Your full name"
                />
                {errors.name && <div className="error">{errors.name}</div>}
              </div>
            </div>

            {/* Email */}
            <div className="col-6">
              <div className="field">
                <label className="label">
                  Email <span className="required">*</span>
                </label>
                <input
                  className="input"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={onChange}
                  placeholder="you@example.com"
                />
                {errors.email && <div className="error">{errors.email}</div>}
              </div>
            </div>

            {/* Password */}
            <div className="col-6">
              <div className="field">
                <label className="label">
                  Password <span className="required">*</span>
                </label>
                <input
                  className="input"
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={onChange}
                  placeholder="Strong password"
                />
                <div className="hint">
                  Min 8 chars incl upper, lower, number, special.
                </div>
                {errors.password && (
                  <div className="error">{errors.password}</div>
                )}
              </div>
            </div>

            {/* Confirm Password */}
            <div className="col-6">
              <div className="field">
                <label className="label">
                  Confirm Password <span className="required">*</span>
                </label>
                <input
                  className="input"
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={onChange}
                  placeholder="Re-enter password"
                />
                {errors.confirmPassword && (
                  <div className="error">{errors.confirmPassword}</div>
                )}
              </div>
            </div>

            {/* Gender */}
            <div className="col-6">
              <div className="field">
                <label className="label">Gender</label>
                <select
                  className="select"
                  name="gender"
                  value={form.gender}
                  onChange={onChange}
                >
                  <option value="">Select gender</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                  <option>Prefer not to say</option>
                </select>
              </div>
            </div>

            {/* Phone */}
            <div className="col-6">
              <div className="field">
                <label className="label">
                  Phone Number <span className="required">*</span>
                </label>
                <input
                  className="input"
                  name="phone"
                  value={form.phone}
                  onChange={onChange}
                  placeholder="10-digit number"
                />
                {errors.phone && <div className="error">{errors.phone}</div>}
              </div>
            </div>

            {/* Country */}
            <div className="col-6">
              <div className="field">
                <label className="label">
                  Country <span className="required">*</span>
                </label>
                <select
                  className="select"
                  name="country"
                  value={form.country}
                  onChange={onChange}
                >
                  <option value="">Select country</option>
                  {countries.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
                {errors.country && <div className="error">{errors.country}</div>}
              </div>
            </div>

            {/* Address */}
            <div className="col-12">
              <div className="field">
                <label className="label">Address</label>
                <input
                  className="input"
                  name="address"
                  value={form.address}
                  onChange={onChange}
                  placeholder="Street, area, etc."
                />
              </div>
            </div>

            {/* State / City */}
            <div className="col-6">
              <div className="field">
                <label className="label">State</label>
                <input
                  className="input"
                  name="state"
                  value={form.state}
                  onChange={onChange}
                  placeholder="State"
                />
              </div>
            </div>

            <div className="col-6">
              <div className="field">
                <label className="label">City</label>
                <input
                  className="input"
                  name="city"
                  value={form.city}
                  onChange={onChange}
                  placeholder="City"
                />
              </div>
            </div>

            {/* Description */}
            <div className="col-12">
              <div className="field">
                <label className="label">Description</label>
                <textarea
                  className="textarea"
                  name="description"
                  value={form.description}
                  onChange={onChange}
                  placeholder="Tell us something..."
                />
              </div>
            </div>
          </div>

          <hr className="hr" />
          <div className="actions">
            <button className="btn btn-primary" type="submit" disabled={loading || !isValid}>
              {loading ? "Saving..." : "Save"}
            </button>
            <button className="btn btn-outline" type="button" onClick={reset} disabled={loading}>
              Clear
            </button>
            <button className="btn btn-outline" type="button" onClick={() => navigate("/")}>
              Back to Login
            </button>
          </div>

          {message?.type === "success" && (
            <div className="success" style={{ marginTop: 14 }}>
              {message.text}
            </div>
          )}
          {message?.type === "error" && (
            <div className="error" style={{ marginTop: 14 }}>
              {message.text}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

