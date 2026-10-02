import { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import Input from '../ui/Input';

export default function SignupForm({ onSubmit, onSwitch }) {
  const [form, setForm] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const validate = (fieldValues = form) => {
    const errs = {};
    if (!fieldValues.username) {
      errs.username = 'Username is required';
    } else if (!/^[A-Za-z0-9_]{3,20}$/.test(fieldValues.username)) {
      errs.username = '3-20 letters, numbers, or underscores';
    }

    if (!fieldValues.password) {
      errs.password = 'Password is required';
    } else if (fieldValues.password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    } else if (fieldValues.password.length > 128) {
      errs.password = 'Password must be 128 characters or fewer';
    }

    if (!fieldValues.confirmPassword) {
      errs.confirmPassword = 'Please confirm your password';
    } else if (fieldValues.password !== fieldValues.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }
    return errs;
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const errs = validate();
    setErrors((prev) => ({ ...prev, [field]: errs[field] }));
  };

  const handleChange = (field, value) => {
    const updatedForm = { ...form, [field]: value };
    setForm(updatedForm);
    if (touched[field]) {
      const errs = validate(updatedForm);
      setErrors((prev) => ({ ...prev, [field]: errs[field] }));
    }
    if (alert) setAlert(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);
    setTouched({ username: true, password: true, confirmPassword: true });
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    try {
      await onSubmit({ username: form.username, password: form.password });
    } catch (err) {
      setAlert(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const isUsernameValid =
    touched.username && !errors.username && form.username.length >= 3;
  const isPasswordValid =
    touched.password && !errors.password && form.password.length >= 6;
  const isConfirmValid =
    touched.confirmPassword &&
    !errors.confirmPassword &&
    form.confirmPassword.length >= 6;

  // Simple password strength calculation
  const getStrength = (pass) => {
    if (!pass) return 0;
    if (pass.length < 6) return 1;
    if (pass.length >= 8 && /[A-Z]/.test(pass) && /[0-9]/.test(pass)) return 3;
    return 2;
  };
  const strength = getStrength(form.password);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      {/* Header Icon & Title */}
      <div className="text-center">
        <div className="mx-auto mb-3.5 w-12 h-12 rounded-lg bg-sprout flex items-center justify-center shadow-xs text-white">
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
            />
          </svg>
        </div>
        <h2 className="text-display-heading text-ink text-2xl font-display font-semibold">
          Create Account
        </h2>
        <p className="mt-1 text-caption text-ink-70">
          Join thousands of language learners exchanging conversations
        </p>
      </div>

      {/* Alert Error Message */}
      {alert && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-3.5 rounded-md bg-redline/10 border border-redline/25 text-redline text-caption font-medium flex items-center gap-2 shadow-2xs"
        >
          <svg
            className="w-4 h-4 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span>{alert}</span>
        </motion.div>
      )}

      {/* Form Fields */}
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <Input
          label="Username"
          placeholder="Choose a unique username"
          value={form.username}
          onChange={(e) => handleChange('username', e.target.value)}
          onBlur={() => handleBlur('username')}
          error={touched.username ? errors.username : ''}
          success={isUsernameValid}
          icon={
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          }
          autoComplete="username"
        />

        <div className="space-y-1">
          <Input
            label="Password"
            type="password"
            placeholder="At least 6 characters"
            value={form.password}
            onChange={(e) => handleChange('password', e.target.value)}
            onBlur={() => handleBlur('password')}
            error={touched.password ? errors.password : ''}
            success={isPasswordValid}
            icon={
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            }
            autoComplete="new-password"
          />

          {/* Password Strength Micro Indicator */}
          {form.password.length > 0 && (
            <div className="pt-1 flex items-center gap-1.5 px-0.5">
              <div className="flex-1 h-1 rounded-full bg-stone-line/60 overflow-hidden flex gap-1">
                <div
                  className={`h-full flex-1 transition-all duration-300 ${strength >= 1 ? (strength === 1 ? 'bg-redline' : strength === 2 ? 'bg-marigold' : 'bg-sprout') : 'bg-transparent'}`}
                />
                <div
                  className={`h-full flex-1 transition-all duration-300 ${strength >= 2 ? (strength === 2 ? 'bg-marigold' : 'bg-sprout') : 'bg-transparent'}`}
                />
                <div
                  className={`h-full flex-1 transition-all duration-300 ${strength >= 3 ? 'bg-sprout' : 'bg-transparent'}`}
                />
              </div>
              <span className="text-[11px] text-ink-70 font-medium">
                {strength === 1 ? 'Weak' : strength === 2 ? 'Medium' : 'Strong'}
              </span>
            </div>
          )}
        </div>

        <Input
          label="Confirm Password"
          type="password"
          placeholder="Re-enter your password"
          value={form.confirmPassword}
          onChange={(e) => handleChange('confirmPassword', e.target.value)}
          onBlur={() => handleBlur('confirmPassword')}
          error={touched.confirmPassword ? errors.confirmPassword : ''}
          success={isConfirmValid}
          icon={
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
          autoComplete="new-password"
        />

        <div className="pt-1">
          <Button
            type="submit"
            variant="sprout"
            size="lg"
            className="w-full font-semibold shadow-xs text-body py-3.5"
            loading={loading}
          >
            {!loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="w-4 h-4 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>

                <span>Create Free Account</span>
              </span>
            ) : null}
          </Button>
        </div>
      </form>

      {/* Switch Link */}
      <div className="pt-2 text-center border-t border-stone-line/70">
        <p className="text-caption text-ink-70">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onSwitch}
            className="text-marigold-deep font-semibold hover:underline focus:outline-none transition-colors"
          >
            Sign In Instead
          </button>
        </p>
      </div>
    </motion.div>
  );
}
