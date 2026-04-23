'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

function AuthCallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const run = async () => {
            const errorDescription = searchParams.get('error_description') || searchParams.get('error');
            if (errorDescription) {
                setError(decodeURIComponent(errorDescription));
                return;
            }

            try {
                const code = searchParams.get('code');
                if (code) {
                    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
                    if (exchangeError) {
                        setError(exchangeError.message);
                        return;
                    }
                }

                const { data, error: sessionError } = await supabase.auth.getSession();
                if (sessionError) {
                    setError(sessionError.message);
                    return;
                }

                if (data.session) {
                    router.replace('/dashboard');
                } else {
                    setError('Sign-in was not completed.');
                }
            } catch (e: any) {
                setError(e?.message || 'Error completing sign-in');
            }
        };

        run();
    }, [router, searchParams]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-50 p-4">
            <div className="w-full max-w-md bg-white rounded-2xl p-10 shadow-xl border border-zinc-100 text-center">
                {error ? (
                    <>
                        <h1 className="text-xl font-bold text-zinc-900 mb-2">Auth Error</h1>
                        <p className="text-zinc-600 mb-6">{error}</p>
                        <button 
                            onClick={() => router.push('/login')}
                            className="w-full bg-black text-white py-3 rounded-lg"
                        >
                            Back to Login
                        </button>
                    </>
                ) : (
                    <>
                        <div className="w-10 h-10 mx-auto mb-4 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                        <h1 className="text-xl font-bold text-zinc-900 mb-2">Verifying session…</h1>
                        <p className="text-zinc-500">Please wait, redirecting.</p>
                    </>
                )}
            </div>
        </div>
    );
}

export default function AuthCallbackPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-zinc-50">
                <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
            </div>
        }>
            <AuthCallbackContent />
        </Suspense>
    );
}
