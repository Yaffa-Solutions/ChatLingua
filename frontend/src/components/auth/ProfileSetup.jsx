import { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import { LANGS } from '../../lib/constants';

export default function ProfileSetup({ onSubmit }) {
  const [form, setForm] = useState({
    native_language_id: 0,
    learning_language_id: 0,
    image: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const validate = () => {
    const errs = {};
    if (!form.native_language_id) errs.native = 'Select your native language';
    if (!form.learning_language_id) errs.learning = 'Select a language to learn';
    if (form.native_language_id && form.learning_language_id && form.native_language_id === form.learning_language_id)
      errs.learning = 'Must be different from native language';
    if (!form.image) errs.image = 'Enter an image URL';
    else if (!/^https?:\/\/.+/.test(form.image)) errs.image = 'Must be a valid URL';
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
      setAlert(err.message || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  const set = (key) => (e) => {
    setForm({ ...form, [key]: e.target.value });
    setErrors({ ...errors, [key]: '' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-lg mx-auto"
    >
      <div className="glass rounded-2xl p-8">
        <div className="text-center mb-6">
          <motion.div
            className="mx-auto mb-4 w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-2xl"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </motion.div>
          <h2 className="text-2xl font-bold gradient-text">Create Your Profile</h2>
          <p className="mt-2 text-gray-400 text-sm">Set up your language learning preferences</p>
        </div>

        {alert && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {alert}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-300">Native Language</label>
            <select
              value={form.native_language_id}
              onChange={set('native_language_id')}
              className={`input-field ${errors.native ? 'border-red-500/50' : ''}`}
            >
              {LANGS.map((lang, i) => (
                <option key={i} value={i} className="bg-dark-400">{lang}</option>
              ))}
            </select>
            {errors.native && <p className="text-xs text-red-400">{errors.native}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-300">Learning Language</label>
            <select
              value={form.learning_language_id}
              onChange={set('learning_language_id')}
              className={`input-field ${errors.learning ? 'border-red-500/50' : ''}`}
            >
              {LANGS.map((lang, i) => (
                <option key={i} value={i} className="bg-dark-400">{lang}</option>
              ))}
            </select>
            {errors.learning && <p className="text-xs text-red-400">{errors.learning}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-300">Profile Image URL</label>
            <input
              type="url"
              value={form.image}
              onChange={set('image')}
              placeholder="https://example.com/avatar.jpg"
              className={`input-field ${errors.image ? 'border-red-500/50' : ''}`}
            />
            {errors.image && <p className="text-xs text-red-400">{errors.image}</p>}
          </div>

          {form.native_language_id > 0 || form.learning_language_id > 0 ? (
            <div className="flex gap-2 flex-wrap">
              {form.native_language_id > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/20 text-primary px-3 py-1 text-xs">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m0 4h6m-6 4h6m-6 4h6" />
                  </svg>
                  Native: {LANGS[form.native_language_id]}
                </span>
              )}
              {form.learning_language_id > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-secondary/20 text-secondary px-3 py-1 text-xs">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Learning: {LANGS[form.learning_language_id]}
                </span>
              )}
            </div>
          ) : null}

          <div className="rounded-xl bg-white/5 border border-white/10 p-4 text-xs text-gray-400">
            <strong className="text-gray-300">Tip:</strong> You can change these later in settings. Choose your native language and the one you want to practice.
          </div>

          <Button type="submit" variant="gradient" size="lg" className="w-full" loading={loading}>
            Get Started
          </Button>
        </form>
      </div>
    </motion.div>
  );
}
