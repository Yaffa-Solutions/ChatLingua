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
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="text-center mb-8">
        <motion.div
          className="mx-auto mb-4 w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-secondary flex items-center justify-center text-2xl shadow-lg"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </motion.div>
        <h1 className="text-3xl font-bold gradient-text">Welcome Back</h1>
        <p className="mt-2 text-gray-400 text-sm">Sign in to continue your language journey</p>
      </div>

      {alert && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
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
        <Button type="submit" variant="gradient" size="lg" className="w-full" loading={loading}>
          Sign In
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-400">
        Don't have an account?{' '}
        <button onClick={onSwitch} className="text-primary font-semibold hover:text-secondary transition-colors">
          Sign Up
        </button>
      </p>
    </motion.div>
  );
}
