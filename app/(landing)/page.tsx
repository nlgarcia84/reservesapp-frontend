'use client';

import { useAuth } from '@/app/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { HeroCard } from './components/HeroCard';

/**
 * Pàgina de ruta raíz (localhost:3000)
 *
 * Aquesta pàgina actua com a dispatcher:
 * - Si l'usuari té token vàlid → redirig al seu dashboard (admin/employee)
 * - Si NO té token o està expirat → mostra la landing page
 */
export default function LandingPage() {
  const { token, role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Si hi ha token, redirigir al dashboard corresponent segons el rol
    if (token) {
      const normalizedRole = role?.toLowerCase();
      if (normalizedRole === 'admin') {
        router.push('/dashboard/admin');
      } else if (normalizedRole === 'employee') {
        router.push('/dashboard/employee');
      } else {
        router.push('/login');
      }
    }
  }, [token, role, router]);

  // Landing page per a usuaris no autenticats
  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-50 border-b backdrop-blur-sm"
        style={{
          borderColor: 'var(--border-primary)',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
        }}
      >
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6">
          <div className="flex items-center justify-between">
            <div
              className="text-lg font-semibold tracking-tight sm:text-2xl"
              style={{ color: 'var(--text-primary)' }}
            >
              RoomyApp
            </div>
            <nav className="flex items-center gap-6 sm:gap-8">
              <a
                href="/login"
                className="rounded-md border px-3 py-1.5 text-sm font-semibold transition-colors sm:px-4 sm:py-2"
                style={{
                  borderColor: 'var(--accent-primary)',
                  color: 'var(--text-primary)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-secondary)';
                  e.currentTarget.style.backgroundColor = 'var(--bg-card)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-primary)';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                Inicia sessió
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="text-center">
          <h1
            className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl"
            style={{ color: 'var(--text-primary)' }}
          >
            Gestiona les teves reserves
            <span className="block bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              amb facilitat
            </span>
          </h1>
          <p
            className="mb-10 max-w-2xl text-lg sm:text-xl mx-auto"
            style={{ color: 'var(--text-secondary)' }}
          >
            Una plataforma moderna per administrar sales, usuaris i reserves amb
            un sistema de rols inteligent i segur.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/signup')}
              className="rounded-lg px-6 py-3 font-semibold text-white active:scale-95 transition-all duration-150"
              style={{
                backgroundColor: 'var(--accent-primary)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  'var(--accent-primary-dark)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--accent-primary)';
              }}
            >
              Comença gratuïtament
            </button>
            <button
              onClick={() => router.push('/login')}
              className="rounded-lg border px-6 py-3 font-semibold transition-colors"
              style={{
                borderColor: 'var(--border-primary)',
                color: 'var(--text-primary)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-secondary)';
                e.currentTarget.style.backgroundColor = 'var(--bg-card)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-primary)';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              Més informació
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="border-t"
        style={{
          borderColor: 'var(--border-primary)',
          backgroundColor: 'var(--bg-tertiary)',
        }}
      >
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="mb-16 text-center">
            <h2
              className="text-3xl font-bold tracking-tight sm:text-4xl"
              style={{ color: 'var(--text-primary)' }}
            >
              Per que escollirnos?
            </h2>
            <p className="mt-4" style={{ color: 'var(--text-secondary)' }}>
              Totes les eines que necessites per gestionar eficientment.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <HeroCard
              icon={
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  style={{ color: 'var(--accent-primary)' }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              }
              title="Senzill de fer servir"
              description="Interfície intuitiva que tots els usuaris podem aprendre ràpidament, sense necessitat de formació complexa."
            />

            <HeroCard
              icon={
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  style={{ color: 'var(--accent-primary)' }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                  />
                </svg>
              }
              title="Control total"
              description="Els administradors podem gestionar sales, usuaris i visualitzar totes les reserves en temps real."
            />

            <HeroCard
              icon={
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  style={{ color: 'var(--accent-primary)' }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              }
              title="Segur i privat"
              description="Sistema de permisos basat en rols que protegeix les dades i assegura accés controlat a la informació."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24 text-center">
        <h2
          className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl"
          style={{ color: 'var(--text-primary)' }}
        >
          Comença avui
        </h2>
        <p className="mb-10 text-lg" style={{ color: 'var(--text-secondary)' }}>
          Uneix-te a les organitzacions que confien en RoomyApp per gestionar
          les seves reserves de forma eficient.
        </p>
        <button
          onClick={() => router.push('/signup')}
          className="rounded-lg px-8 py-3 font-semibold text-white active:scale-95 transition-all duration-150"
          style={{
            backgroundColor: 'var(--accent-primary)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor =
              'var(--accent-primary-dark)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--accent-primary)';
          }}
        >
          Crear compte gratuït
        </button>
      </section>

      {/* Footer */}
      <footer
        className="border-t backdrop-blur-sm py-12"
        style={{
          borderColor: 'var(--border-primary)',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
        }}
      >
        <div
          className="mx-auto max-w-7xl px-4 text-center text-sm sm:px-6"
          style={{ color: 'var(--text-secondary)' }}
        >
          <p>© 2026 RoomyApp. Tots els drets reservats.</p>
        </div>
      </footer>
    </div>
  );
}
