'use client';
import { useState } from 'react';
import { InputForm } from '@/components/ui/InputForm';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';

const SignUpPage = () => {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => { //Asincron perquè fem una crida al backend
    e.preventDefault();
    setError(''); // Netegem errors previs 

    // Validació al Front-end 
    if (password !== confirmPassword) {
      setError('Les contrasenyes no coincideixen.');
      return;
    }

    if (password.length < 6) {
      setError('La contrasenya ha de tenir almenys 6 caràcters.');
      return;
    }

    // Comprovem si NO hi ha cap majúscula (de la A a la Z)
    if (!/[A-Z]/.test(password)) {
      setError('La contrasenya ha de contenir almenys una lletra majúscula.');
      return;
    }

    // Comprovem si NO hi ha cap número (del 0 al 9)
    if (!/[0-9]/.test(password)) {
      setError('La contrasenya ha de contenir almenys un número.');
      return;
    }

    setIsLoading(true); // Bloquegem el botó mentre carrega

    try {
      // Cridem a l'API del Backend 
      const response = await fetch('http://localhost:8080/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: fullName,
          email: email,
          password: password,
        }),
      });

      // Gestionem la resposta
      if (response.ok) {
        // Si el backend ens diu que OK (codi 200 o 201), anem al login
        router.push('/login');
      } else {
        // Si hi ha un error, mostrem el missatge
        const errorData = await response.json();
        setError(errorData.message || 'Error en crear el compte.');
      }
    } catch {
      setError('No s\'ha pogut connectar amb el servidor.');
    } finally {
      setIsLoading(false); // Tornem a habilitar el botó
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4 py-8 font-sans text-white sm:px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl bg-black/80 p-6 backdrop-blur-sm sm:p-8"
      >
        <div className="mb-6 text-center">
          <p className="mb-2 text-center text-3xl font-bold sm:text-4xl text-white">Crea el teu compte</p>
        </div>
        {/* Bloc del nom i cognoms */}
        <div className="space-y-5">
          <div className="w-full">
            <p className="pb-2 text-sm font-semibold text-zinc-200">Nom i cognoms</p>
            <InputForm
              type="text"
              placeholder="Nom complet"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          {/* Bloc de l'email */}
          <div className="w-full">
            <p className="pb-2 text-sm font-semibold text-zinc-200">Correu electrònic</p>
            <InputForm
              type="email"
              placeholder="nom@empresa.cat"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        {/* Bloc de la contrasenya */}
        <div className="mt-6 space-y-5">
            <div className="w-full">
              <p className="pb-2 text-sm font-semibold text-zinc-200">
                Contrasenya
              </p>
              <div className="relative">
                <input
                  type={showPasswords ? 'text' : 'password'} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="block w-full rounded-lg border border-white/15 bg-black px-3 py-3 pr-11 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(!showPasswords)} // Togleja l'estat
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
                  aria-label={showPasswords ? 'Amagar contrasenya' : 'Mostrar contrasenya'}
                >
                  {showPasswords ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Bloc de repetir la contrasenya */}
            <div className="w-full">
              <p className="pb-2 text-sm font-semibold text-zinc-200">
                Repeteix la contrasenya
              </p>
              <div className="relative">
                <input
                  type={showPasswords ? 'text' : 'password'} 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="block w-full rounded-lg border border-white/15 bg-black px-3 py-3 pr-11 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(!showPasswords)} 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
                  aria-label={showPasswords ? 'Amagar contrasenya' : 'Mostrar contrasenya'}
                >
                  {showPasswords ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>
        {/* Bloc del checkbox */}
        <label className="mt-6 flex items-start gap-3 text-sm text-zinc-300">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 rounded border border-white/20 bg-black"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            required
          />
          Accepto els termes d&apos;ús i la política de privacitat.
        </label>

        {/* Mostrem el text vermell només si hi ha un error */}
        {error && (
          <p className="mt-4 text-center text-sm font-semibold text-red-500">
            {error}
          </p>
        )}

        <div className="mt-6 w-full">
          <Button type="submit" disabled={!acceptTerms || isLoading}>
            {isLoading ? 'Creant compte...' : 'Crear compte'}
          </Button>
        </div>

        <div className="mt-3 text-center">
          <p className="text-sm text-zinc-300 sm:text-base">
            Ja tens usuari?{' '}
            <a href="/login" className="link">
              Inicia sessió
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}

export default SignUpPage;
