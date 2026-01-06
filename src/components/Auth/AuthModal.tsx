import { useState } from 'react';
import { X } from 'lucide-react';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}

export function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>

        {mode === 'login' ? (
          <LoginForm onToggleForm={() => setMode('signup')} onClose={onClose} />
        ) : (
          <SignupForm onToggleForm={() => setMode('login')} onClose={onClose} />
        )}
      </div>
    </div>
  );
}
