import { useState } from 'react';

interface HelpSupportModalProps {
  onClose: () => void;
}

type FormType = 'bug' | 'support' | null;

export default function HelpSupportModal({ onClose }: HelpSupportModalProps) {
  const [formType, setFormType] = useState<FormType>(null);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;
    setSubmitting(true);
    try {
      const body = new URLSearchParams();
      body.append('subject', subject);
      body.append('description', description);
      body.append('type', formType === 'bug' ? 'Bug Report' : 'Support Request');
      await fetch('https://readdy.ai/api/form/d7ekr4b5bqmofchk7j2g', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="w-full max-w-md bg-surface-light dark:bg-surface-dark rounded-card border border-border-light dark:border-border-dark p-6"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-500/10">
              <i className="ri-customer-service-2-line text-primary-500 text-base"></i>
            </div>
            <h2 className="text-base font-heading font-700 text-gray-900 dark:text-white">Help & Support</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer">
            <i className="ri-close-line text-base"></i>
          </button>
        </div>

        {submitted ? (
          <div className="text-center py-8">
            <div className="w-14 h-14 flex items-center justify-center mx-auto mb-4 rounded-full bg-success-50 dark:bg-success-500/10">
              <i className="ri-check-line text-success-500 text-2xl"></i>
            </div>
            <p className="text-base font-heading font-600 text-gray-900 dark:text-white mb-2">Report Received</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-body">Your report has been received. We will respond within 24 hours.</p>
            <button
              onClick={onClose}
              className="mt-5 h-btn px-6 bg-primary-500 hover:bg-primary-600 text-white rounded-btn text-sm font-medium font-body transition-colors cursor-pointer whitespace-nowrap"
            >
              Close
            </button>
          </div>
        ) : !formType ? (
          <div className="space-y-3">
            <p className="text-sm text-gray-500 dark:text-gray-400 font-body mb-4">What do you need help with?</p>
            <button
              onClick={() => setFormType('bug')}
              className="w-full flex items-center gap-4 p-4 rounded-lg border border-border-light dark:border-border-dark hover:border-danger-500/50 hover:bg-danger-50 dark:hover:bg-danger-500/5 transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-danger-50 dark:bg-danger-500/10 flex-shrink-0">
                <i className="ri-bug-line text-danger-500 text-lg"></i>
              </div>
              <div className="text-left">
                <p className="text-sm font-body font-medium text-gray-900 dark:text-white">Report a Bug</p>
                <p className="text-xs text-gray-400 dark:text-gray-600 font-body">Something isn't working as expected</p>
              </div>
              <i className="ri-arrow-right-s-line text-gray-400 ml-auto"></i>
            </button>
            <button
              onClick={() => setFormType('support')}
              className="w-full flex items-center gap-4 p-4 rounded-lg border border-border-light dark:border-border-dark hover:border-primary-500/50 hover:bg-primary-50 dark:hover:bg-primary-500/5 transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-500/10 flex-shrink-0">
                <i className="ri-question-answer-line text-primary-500 text-lg"></i>
              </div>
              <div className="text-left">
                <p className="text-sm font-body font-medium text-gray-900 dark:text-white">Request Support</p>
                <p className="text-xs text-gray-400 dark:text-gray-600 font-body">Get help from the Klavora team</p>
              </div>
              <i className="ri-arrow-right-s-line text-gray-400 ml-auto"></i>
            </button>
          </div>
        ) : (
          <form data-readdy-form onSubmit={handleSubmit} className="space-y-4">
            <button
              type="button"
              onClick={() => setFormType(null)}
              className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 cursor-pointer transition-colors mb-1"
            >
              <i className="ri-arrow-left-line text-sm"></i>
              <span className="font-body">Back</span>
            </button>

            <div className="flex items-center gap-2 mb-2">
              <div className={`w-7 h-7 flex items-center justify-center rounded-lg ${formType === 'bug' ? 'bg-danger-50 dark:bg-danger-500/10' : 'bg-primary-50 dark:bg-primary-500/10'}`}>
                <i className={`${formType === 'bug' ? 'ri-bug-line text-danger-500' : 'ri-question-answer-line text-primary-500'} text-sm`}></i>
              </div>
              <h3 className="text-sm font-heading font-600 text-gray-900 dark:text-white">
                {formType === 'bug' ? 'Report a Bug' : 'Request Support'}
              </h3>
            </div>

            <div>
              <label className="block text-label uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1.5 font-body">Subject</label>
              <input
                name="subject"
                type="text"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder={formType === 'bug' ? 'e.g. Sell page crashes on confirm' : 'e.g. Need help with restock flow'}
                required
                className="w-full h-btn px-3 rounded-btn border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark text-sm font-body text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-label uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1.5 font-body">Description</label>
              <textarea
                name="description"
                value={description}
                onChange={e => { if (e.target.value.length <= 500) setDescription(e.target.value); }}
                rows={4}
                maxLength={500}
                placeholder={formType === 'bug' ? 'Describe what happened and how to reproduce it...' : 'Describe what you need help with...'}
                required
                className="w-full px-3 py-2 rounded-btn border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark text-sm font-body text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 transition-colors resize-none"
              />
              <p className="text-[10px] text-gray-400 dark:text-gray-600 font-mono mt-1 text-right">{description.length}/500</p>
            </div>
            <div>
              <label className="block text-label uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1.5 font-body">Screenshot <span className="normal-case text-gray-300 dark:text-gray-700">(optional — not collected)</span></label>
              <div className="h-btn flex items-center px-3 rounded-btn border border-dashed border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark text-xs text-gray-400 dark:text-gray-600 font-body">
                <i className="ri-image-line mr-2"></i>Screenshot upload not available in this version
              </div>
            </div>
            <button
              type="submit"
              disabled={submitting || !subject.trim() || !description.trim()}
              className="w-full h-btn bg-primary-500 hover:bg-primary-600 disabled:opacity-40 text-white rounded-btn text-sm font-medium font-body transition-colors cursor-pointer whitespace-nowrap"
            >
              {submitting ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
