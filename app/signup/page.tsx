'use client';

import { useRouter } from 'next/router';
import { useState } from 'react';
import { LoginRequest, register } from '../services/auth';
import { InputForm } from '@/components/ui/InputForm';

const SignUpPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // try {
    //   const data: LoginRequest = await register(name, email, password); // { token, role }
    // } catch (err: unknown) {
    //   console.error('Login error:', err);
    //   setError(err instanceof Error ? err.message : 'An error occurred');
    // } finally {
    //   setIsSubmitting(false);
    // }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4 py-8 font-sans text-white sm:px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl bg-black/80 p-5 backdrop-blur-sm sm:p-7"
      >
        <div className="mb-6 text-center">
          <p className="mb-2 text-center text-3xl font-bold sm:text-4xl text-white">
            Inicia sessió
          </p>
          <p className="text-sm font-light text-zinc-400 sm:text-base">
            Introdueix les teves credencials per accedir
          </p>
        </div>

        {error && (
          <p className="mb-4 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {error}
          </p>
        )}

        <div>
          <div className="mb-5 w-full">
            <p className="font-semibold pb-2 text-zinc-100">
              Correu electrònic
            </p>
            <InputForm
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default SignUpPage;
