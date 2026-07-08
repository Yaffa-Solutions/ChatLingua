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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-lg mx-auto"
    >
      <div className="card-raised p-6">
        <div className="text-center mb-6">
          <div className="mx-auto mb-4 w-14 h-14 rounded-sm bg-marigold-tint flex items-center justify-center">
            <svg className="w-7 h-7 text-marigold-deep" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-display-heading text-ink">Create Your Profile</h2>
          <p className="mt-1 text-body text-ink-70">Set up your language learning preferences</p>
        </div>

        {alert && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 p-3 rounded-sm bg-redline/10 border border-redline/20 text-redline text-caption">
            {alert}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-caption font-medium text-ink">Native Language</label>
            <select
              value={form.native_language_id}
              onChange={set('native_language_id')}
              className={`w-full rounded-sm border ${errors.native ? 'border-redline' : 'border-stone-line'} bg-white px-4 py-2.5 text-body text-ink outline-none focus:border-marigold focus:ring-2 focus:ring-marigold/20`}
            >
              {LANGS.map((lang, i) => (
                <option key={i} value={i}>{lang}</option>
              ))}
            </select>
            {errors.native && <p className="text-caption text-redline">{errors.native}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="block text-caption font-medium text-ink">Learning Language</label>
            <select
              value={form.learning_language_id}
              onChange={set('learning_language_id')}
              className={`w-full rounded-sm border ${errors.learning ? 'border-redline' : 'border-stone-line'} bg-white px-4 py-2.5 text-body text-ink outline-none focus:border-marigold focus:ring-2 focus:ring-marigold/20`}
            >
              {LANGS.map((lang, i) => (
                <option key={i} value={i}>{lang}</option>
              ))}
            </select>
            {errors.learning && <p className="text-caption text-redline">{errors.learning}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="block text-caption font-medium text-ink">Profile Image URL</label>
            <input
              type="url"
              value={form.image}
              onChange={set('image')}
              placeholder="https://example.com/avatar.jpg"
              className={`w-full rounded-sm border ${errors.image ? 'border-redline' : 'border-stone-line'} bg-white px-4 py-2.5 text-body text-ink placeholder-ink-40 outline-none focus:border-marigold focus:ring-2 focus:ring-marigold/20`}
            />
            {errors.image && <p className="text-caption text-redline">{errors.image}</p>}
          </div>

          {form.native_language_id > 0 || form.learning_language_id > 0 ? (
            <div className="flex gap-2 flex-wrap">
              {form.native_language_id > 0 && (
                <span className="tag-language">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m0 4h6m-6 4h6m-6 4h6" />
                  </svg>
                  Native: {LANGS[form.native_language_id]}
                </span>
              )}
              {form.learning_language_id > 0 && (
                <span className="tag-language">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Learning: {LANGS[form.learning_language_id]}
                </span>
              )}
            </div>
          ) : null}

          <div className="rounded-sm bg-paper border border-stone-line p-4 text-caption text-ink-70">
            <strong className="text-ink">Tip:</strong> You can change these later in settings.
          </div>

          <Button type="submit" variant="sprout" size="lg" className="w-full" loading={loading}>
            Get Started
          </Button>
        </form>
      </div>
    </motion.div>
  );
}
