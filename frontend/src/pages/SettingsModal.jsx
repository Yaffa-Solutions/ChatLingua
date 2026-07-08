import { useState, useEffect } from 'react';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import { LANGS } from '../lib/constants';
import { api } from '../lib/api';

export default function SettingsModal({ isOpen, onClose, profile, onUpdate }) {
  const [form, setForm] = useState({
    native_language_id: 0,
    learning_language_id: 0,
    image: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (profile) {
      setForm({
        native_language_id: profile.native_id || 0,
        learning_language_id: profile.learn_id || 0,
        image: profile.image || '',
      });
    }
  }, [profile]);

  const handleSave = async () => {
    setError(null);
    if (form.native_language_id === form.learning_language_id) {
      setError('Native and learning languages cannot be the same');
      return;
    }
    setLoading(true);
    try {
      await api.updateProfile({
        native_language_id: form.native_language_id,
        learning_language_id: form.learning_language_id,
        image: form.image,
      });
      onUpdate?.(form);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Settings" size="sm">
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="block text-caption font-medium text-ink">Native Language</label>
          <select
            value={form.native_language_id}
            onChange={(e) => setForm({ ...form, native_language_id: Number(e.target.value) })}
            className="w-full rounded-sm border border-stone-line bg-white px-4 py-2.5 text-body text-ink outline-none focus:border-marigold focus:ring-2 focus:ring-marigold/20"
          >
            {LANGS.map((lang, i) => (
              <option key={i} value={i}>{lang}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="block text-caption font-medium text-ink">Learning Language</label>
          <select
            value={form.learning_language_id}
            onChange={(e) => setForm({ ...form, learning_language_id: Number(e.target.value) })}
            className="w-full rounded-sm border border-stone-line bg-white px-4 py-2.5 text-body text-ink outline-none focus:border-marigold focus:ring-2 focus:ring-marigold/20"
          >
            {LANGS.map((lang, i) => (
              <option key={i} value={i}>{lang}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="block text-caption font-medium text-ink">Profile Image URL</label>
          <input
            type="url"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
            className="w-full rounded-sm border border-stone-line bg-white px-4 py-2.5 text-body text-ink placeholder-ink-40 outline-none focus:border-marigold focus:ring-2 focus:ring-marigold/20"
            placeholder="https://example.com/avatar.jpg"
          />
        </div>

        {error && (
          <div className="p-3 rounded-sm bg-redline/10 border border-redline/20 text-redline text-caption">
            {error}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <Button variant="ghost" size="md" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="md" className="flex-1" loading={loading} onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </div>
    </Modal>
  );
}
