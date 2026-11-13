import React, { createContext, useContext, useState, useEffect } from 'react';

export interface SensoryPreferences {
    voiceReadAloud: boolean;
    calmPastelMode: boolean;
    textSize: 'standard' | 'large';
    gentleChimes: boolean;
    stepHints: boolean;
}

interface SensoryContextValue {
    prefs: SensoryPreferences;
    toggleVoiceReadAloud: () => void;
    toggleCalmPastelMode: () => void;
    toggleTextSize: () => void;
    toggleGentleChimes: () => void;
    toggleStepHints: () => void;
    speak: (text: string, force?: boolean) => void;
    playGentleChime: (type?: 'tap' | 'success') => void;
}

const DEFAULT_PREFS: SensoryPreferences = {
    voiceReadAloud: true,
    calmPastelMode: true,
    textSize: 'large',
    gentleChimes: true,
    stepHints: true,
};

const STORAGE_KEY = 'eduquest_sensory_prefs_v1';

const SensoryPreferencesContext = createContext<SensoryContextValue | null>(null);

export function SensoryPreferencesProvider({ children }: { children: React.ReactNode }) {
    const [prefs, setPrefs] = useState<SensoryPreferences>(() => {
        if (typeof window === 'undefined') return DEFAULT_PREFS;
        try {
            const saved = window.localStorage.getItem(STORAGE_KEY);
            return saved ? { ...DEFAULT_PREFS, ...JSON.parse(saved) } : DEFAULT_PREFS;
        } catch {
            return DEFAULT_PREFS;
        }
    });

    useEffect(() => {
        if (typeof window === 'undefined') return;
        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
        } catch {
            // ignore storage errors
        }

        const root = document.documentElement;
        root.classList.toggle('eduquest-large-text', prefs.textSize === 'large');
        root.classList.toggle('eduquest-calm-pastel', prefs.calmPastelMode);
    }, [prefs]);

    const triggerChime = (enabled: boolean, type: 'tap' | 'success' = 'tap') => {
        if (!enabled || typeof window === 'undefined') return;
        try {
            const AudioCtx =
                window.AudioContext ||
                (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
            const ctx = new AudioCtx();
            if (ctx.state === 'suspended') ctx.resume();
            const now = ctx.currentTime;

            const playTone = (freq: number, offset: number, duration: number) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, now + offset);

                gain.gain.setValueAtTime(0.001, now + offset);
                gain.gain.exponentialRampToValueAtTime(0.12, now + offset + 0.02);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + duration);

                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now + offset);
                osc.stop(now + offset + duration);
            };

            if (type === 'success') {
                playTone(523.25, 0, 0.25);
                playTone(659.25, 0.12, 0.35);
            } else {
                playTone(587.33, 0, 0.2);
            }
        } catch {
            // ignore audio errors
        }
    };

    const triggerSpeech = (enabled: boolean, text: string) => {
        if (!enabled || typeof window === 'undefined') return;
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.92;
            window.speechSynthesis.speak(utterance);
        }
    };

    const playGentleChime = (type: 'tap' | 'success' = 'tap') => {
        triggerChime(prefs.gentleChimes, type);
    };

    const speak = (text: string, force = false) => {
        triggerSpeech(prefs.voiceReadAloud || force, text);
    };

    const toggleVoiceReadAloud = () => {
        const next = !prefs.voiceReadAloud;
        setPrefs(prev => ({ ...prev, voiceReadAloud: next }));
        triggerChime(prefs.gentleChimes, 'tap');
        if (next) {
            triggerSpeech(true, 'Voice Read-Aloud is now turned on.');
        } else if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
    };

    const toggleCalmPastelMode = () => {
        const next = !prefs.calmPastelMode;
        setPrefs(prev => ({ ...prev, calmPastelMode: next }));
        triggerChime(prefs.gentleChimes, 'tap');
        triggerSpeech(prefs.voiceReadAloud, next ? 'Calm Pastel View is on.' : 'Standard view is on.');
    };

    const toggleTextSize = () => {
        const next = prefs.textSize === 'large' ? 'standard' : 'large';
        setPrefs(prev => ({ ...prev, textSize: next }));
        triggerChime(prefs.gentleChimes, 'tap');
        triggerSpeech(prefs.voiceReadAloud, next === 'large' ? 'Big letters turned on.' : 'Regular letter size turned on.');
    };

    const toggleGentleChimes = () => {
        const next = !prefs.gentleChimes;
        setPrefs(prev => ({ ...prev, gentleChimes: next }));
        triggerChime(next, 'success');
        triggerSpeech(prefs.voiceReadAloud, next ? 'Gentle chimes turned on.' : 'Gentle chimes turned off.');
    };

    const toggleStepHints = () => {
        const next = !prefs.stepHints;
        setPrefs(prev => ({ ...prev, stepHints: next }));
        triggerChime(prefs.gentleChimes, 'tap');
        triggerSpeech(prefs.voiceReadAloud, next ? 'Visual step hints turned on.' : 'Visual step hints turned off.');
    };

    return (
        <SensoryPreferencesContext.Provider
            value={{
                prefs,
                toggleVoiceReadAloud,
                toggleCalmPastelMode,
                toggleTextSize,
                toggleGentleChimes,
                toggleStepHints,
                speak,
                playGentleChime,
            }}
        >
            {children}
        </SensoryPreferencesContext.Provider>
    );
}

export function useSensoryPreferences() {
    const ctx = useContext(SensoryPreferencesContext);
    if (!ctx) {
        throw new Error('useSensoryPreferences must be used inside SensoryPreferencesProvider');
    }
    return ctx;
}