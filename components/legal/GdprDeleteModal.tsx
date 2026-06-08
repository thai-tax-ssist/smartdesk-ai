'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface GdprDeleteModalProps {
  conversationCount: number;
  onClose: () => void;
}

export function GdprDeleteModal({ conversationCount, onClose }: GdprDeleteModalProps) {
  const [step, setStep] = useState(1);
  const [confirmation, setConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleDelete() {
    if (confirmation !== 'DELETE') return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/gdpr/delete-account', { method: 'POST' });
      if (!res.ok) throw new Error('Failed to delete account');
      router.push('/');
    } catch {
      setError('Something went wrong. Please try again or contact support@smartdesk.ai.');
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-md w-full shadow-2xl">
        {step === 1 ? (
          <>
            <div className="text-3xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-white mb-3">Delete Your Account</h2>
            <p className="text-gray-400 text-sm mb-4">This will permanently delete:</p>
            <ul className="space-y-1.5 mb-6">
              {[
                'Your profile and all personal data',
                `All conversation history (${conversationCount} conversations)`,
                'Your subscription (cancelled immediately)',
                'Any saved responses',
              ].map(item => (
                <li key={item} className="flex items-start gap-2 text-sm text-gray-300">
                  <span className="text-red-400 mt-0.5">•</span> {item}
                </li>
              ))}
            </ul>
            <p className="text-red-400 text-sm font-medium mb-6">This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={onClose} className="flex-1 py-2.5 border border-gray-600 text-gray-300 hover:text-white rounded-lg text-sm transition-colors">
                Cancel
              </button>
              <button onClick={() => setStep(2)} className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors">
                I understand, continue →
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-xl font-bold text-white mb-4">Confirm Deletion</h2>
            <p className="text-gray-400 text-sm mb-4">
              Type <span className="text-white font-mono font-bold">DELETE</span> to confirm:
            </p>
            <input
              value={confirmation}
              onChange={e => setConfirmation(e.target.value)}
              placeholder="DELETE"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white mb-4 focus:outline-none focus:border-red-500 font-mono"
            />
            {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
            <div className="flex gap-3">
              <button onClick={onClose} className="flex-1 py-2.5 border border-gray-600 text-gray-300 hover:text-white rounded-lg text-sm transition-colors">
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={confirmation !== 'DELETE' || loading}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-40"
              >
                {loading ? 'Deleting...' : 'Delete My Account Permanently'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default GdprDeleteModal;
