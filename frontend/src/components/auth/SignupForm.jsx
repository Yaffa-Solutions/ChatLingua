import { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import Input from '../ui/Input';

export default function SignupForm({ onSubmit, onSwitch }) {
  const [form, setForm] = useState({ username: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const validate = () => {
    const errs = {};
    if (!form.username) errs.username = 'Username is required';
    else if (!/^[A-Za-z0-9_]{3,20}$/.test(form.username))
      errs.username = '3-20 letters, numbers, underscores';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'At least 6 characters';
    if (!form.confirmPassword) errs.confirmPassword = 'Please confirm your password';
    else if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);
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

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
    >
      <div className="text-center mb-6">
        <div className="mx-auto mb-4 w-12 h-12 rounded-sm bg-sprout flex items-center justify-center shadow-sm">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        </div>
        <h1 className="text-display-heading text-ink">Create Account</h1>
        <p className="mt-1 text-body text-ink-70">Join our community of language learners</p>
      </div>

      {alert && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 rounded-sm bg-redline/10 border border-redline/20 text-redline text-caption"
        >
          {alert}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Username"
          placeholder="Choose a username"
          value={form.username}
          onChange={(e) => { setForm({ ...form, username: e.target.value }); setErrors({ ...errors, username: '' }); }}
          error={errors.username}
        />
        <Input
          label="Password"
          type="password"
          placeholder="Create a password"
          value={form.password}
          onChange={(e) => { setForm({ ...form, password: e.target.value }); setErrors({ ...errors, password: '' }); }}
          error={errors.password}
        />
        <Input
          label="Confirm Password"
          type="password"
          placeholder="Confirm your password"
          value={form.confirmPassword}
          onChange={(e) => { setForm({ ...form, confirmPassword: e.target.value }); setErrors({ ...errors, confirmPassword: '' }); }}
          error={errors.confirmPassword}
        />
        <Button type="submit" variant="sprout" size="lg" className="w-full" loading={loading}>
          Create Account
        </Button>
      </form>

      <p className="mt-5 text-center text-caption text-ink-70">
        Already have an account?{' '}
        <button onClick={onSwitch} className="text-marigold-deep font-semibold hover:text-marigold transition-colors">
          Sign In
        </button>
      </p>
    </motion.div>
  );
}
