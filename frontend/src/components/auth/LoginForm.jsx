import { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import Input from '../ui/Input';

export default function LoginForm({ onSubmit, onSwitch }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const validate = () => {
    const errs = {};
    if (!form.username) errs.username = 'Username is required';
    else if (!/^[A-Za-z0-9]{3,20}$/.test(form.username))
      errs.username = '3-20 letters/numbers only';
    if (!form.password) errs.password = 'Password is required';
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
      await onSubmit(form);
    } catch (err) {
      setAlert(err.message || 'Login failed');
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
        <div className="mx-auto mb-4 w-12 h-12 rounded-sm bg-marigold flex items-center justify-center shadow-sm">
          <svg className="w-6 h-6 text-ink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h1 className="text-display-heading text-ink">Welcome Back</h1>
        <p className="mt-1 text-body text-ink-70">Sign in to continue your language journey</p>
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
          placeholder="Enter your username"
          value={form.username}
          onChange={(e) => { setForm({ ...form, username: e.target.value }); setErrors({ ...errors, username: '' }); }}
          error={errors.username}
        />
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={form.password}
          onChange={(e) => { setForm({ ...form, password: e.target.value }); setErrors({ ...errors, password: '' }); }}
          error={errors.password}
        />
        <Button type="submit" variant="primary" size="lg" className="w-full" loading={loading}>
          Sign In
        </Button>
      </form>

      <p className="mt-5 text-center text-caption text-ink-70">
        Don't have an account?{' '}
        <button onClick={onSwitch} className="text-marigold-deep font-semibold hover:text-marigold transition-colors">
          Sign Up
        </button>
      </p>
    </motion.div>
  );
}
