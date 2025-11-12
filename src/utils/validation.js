// src/utils/validation.js

// ---------------------------
// 1. EMAIL VALIDATION
// ---------------------------
// Ensures proper format + no disposable domains
export const isEmail = (v) => {
  const value = String(v || '').trim()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return false

  // Optional: Block disposable email providers
  const blockedDomains = ['mailinator.com', 'tempmail.com', '10minutemail.com', 'guerrillamail.com']
  const domain = value.split('@')[1]?.toLowerCase()
  if (blockedDomains.includes(domain)) return false

  return true
}

// ---------------------------
// 2. PHONE NUMBER VALIDATION
// ---------------------------
// Only digits, exactly 10 for now (you can adjust later)
// export const isPhone10 = (v) => {
//   const value = String(v || '').trim()
//   // Only digits
//   if (!/^\d+$/.test(value)) return false
//   // Enforce exact 10 digits
//   return value.length === 10
// }

// ---------------------------
// 2. COUNTRY-WISE PHONE VALIDATION
// ---------------------------
// Allows digits only; validates based on country.
// Defaults to 10 digits if country not matched.
export const isPhone10 = (v, country = 'Generic') => {
  const value = String(v || '').trim()

  // ❌ Reject anything non-digit
  if (!/^\d+$/.test(value)) return false

  // Country-based digit length rules
  const countryRules = {
    India: 10,
    'United States': 10,
    'United Kingdom': 11,
    Canada: 10,
    Australia: 9,
    Germany: 11,
    France: 9,
    Other: 10
  }

  const expectedLength = countryRules[country] || 10
  return value.length === expectedLength
}
// ---------------------------
// Helper to validate phone using form object
// ---------------------------
export const validatePhoneWithCountry = (form) => {
  return isPhone10(form.phone, form.country)
}


// ---------------------------
// 3. PASSWORD VALIDATION
// ---------------------------
// Enforce strong password and block weak ones
export const strongPassword = (v) => {
  const value = String(v || '')
  const weakList = ['password', '123456', 'qwerty', 'letmein', 'admin', 'welcome', 'abc123']

  if (weakList.includes(value.toLowerCase())) return false

  return (
    value.length >= 8 &&
    /[a-z]/.test(value) &&
    /[A-Z]/.test(value) &&
    /\d/.test(value) &&
    /[^A-Za-z0-9]/.test(value)
  )
}

// ---------------------------
// 4. NAME VALIDATION (ENHANCED)
// ---------------------------
// Letters, spaces, hyphens, apostrophes — minimum 3 chars
export const isValidName = (v) => /^[A-Za-z\s'-]{3,}$/.test(String(v || '').trim())

// ---------------------------
// 5. GENERIC MIN LENGTH CHECK
// ---------------------------
export const minLen = (v, n) => String(v || '').trim().length >= n
