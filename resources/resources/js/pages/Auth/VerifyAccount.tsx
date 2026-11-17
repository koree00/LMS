import React, { useState, useRef, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function VerifyAccount({ email }: { email?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        code: '',
    });

    const [digits, setDigits] = useState(['', '', '', '', '', '']);
    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

    // Security & Rate-limiting state
    const [attempts, setAttempts] = useState(0);
    const [lockoutTime, setLockoutTime] = useState(0); // in seconds
    const [resendCooldown, setResendCooldown] = useState(0); // in seconds
    const [customError, setCustomError] = useState('');

    const MAX_ATTEMPTS = 5;

    // Handle countdown timers for lockout and resend cooldowns
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (lockoutTime > 0) {
            timer = setInterval(() => setLockoutTime(prev => prev - 1), 1000);
        }
        return () => clearInterval(timer);
    }, [lockoutTime]);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (resendCooldown > 0) {
            timer = setInterval(() => setResendCooldown(prev => prev - 1), 1000);
        }
        return () => clearInterval(timer);
    }, [resendCooldown]);

    const handleChange = (index: number, value: string) => {
        if (lockoutTime > 0) return;
        const digit = value.replace(/[^0-9]/g, '').slice(-1);
        const newDigits = [...digits];
        newDigits[index] = digit;
        setDigits(newDigits);
        setData('code', newDigits.join(''));

        if (digit && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (lockoutTime > 0) return;
        if (e.key === 'Backspace' && !digits[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        if (lockoutTime > 0) return;
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
        const newDigits = [...digits];
        
        for (let i = 0; i < pastedData.length; i++) {
            newDigits[i] = pastedData[i];
        }
        
        setDigits(newDigits);
        setData('code', newDigits.join(''));

        const nextIndex = Math.min(pastedData.length, 5);
        inputRefs.current[nextIndex]?.focus();
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (lockoutTime > 0) return;

        // Check if all 6 digits are filled before submitting
        if (data.code.length < 6) {
            setCustomError('Please enter all 6 digits of the verification code.');
            return;
        }

        setCustomError('');

        post('/verify-account', {
            onError: () => {
                const nextAttempts = attempts + 1;
                setAttempts(nextAttempts);

                if (nextAttempts >= MAX_ATTEMPTS) {
                    setLockoutTime(60); // 1 minute lockout
                    setCustomError('Maximum 5 incorrect attempts reached. Please try again in 1 minute.');
                } else {
                    setCustomError(`Incorrect code. Please try again. (${MAX_ATTEMPTS - nextAttempts} attempts remaining)`);
                }
            }
        });
    };

    const handleResend = () => {
        if (resendCooldown > 0 || lockoutTime > 0) return;
        
        setResendCooldown(60); // 60 seconds cooldown for resending
        setCustomError('');
    };

    const isLocked = lockoutTime > 0 || attempts >= MAX_ATTEMPTS;

    return (
        <>
            <Head title="Verify your account — EduQuest AI" />
            <div className="min-h-screen bg-[#F8F6F0] flex flex-col items-center justify-center py-8 px-4 sm:px-6">
                
                {/* Clean, Balanced Card Layout with Muted Lilac Border */}
                <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 sm:p-10 border border-[#E6DEF8]">
                    
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-[#E6DEF8] flex items-center justify-center text-[#7C66B0] font-extrabold text-lg shrink-0 shadow-sm border border-slate-100">
                            EQ
                        </div>
                        <div>
                            <span className="font-extrabold text-[#2C323B] block text-base sm:text-lg leading-tight">EduQuest AI</span>
                            <span className="text-xs sm:text-sm text-[#2C323B]/70 font-semibold mt-0.5 block">SMES Inclusive LMS & SNED Portal</span>
                        </div>
                    </div>

                    <h1 className="text-lg sm:text-xl font-bold text-[#2C323B] mb-1">Check your email</h1>
                    <p className="text-xs sm:text-sm text-[#2C323B] font-medium mb-6 whitespace-nowrap overflow-x-auto">
                        Enter the 6-digit verification code sent to {email ? <span className="font-bold text-[#2C323B]">{email}</span> : 'your account email'}.
                    </p>

                    {/* Form */}
                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-bold text-[#2C323B]">Verification code</label>
                                <button 
                                    type="button" 
                                    onClick={handleResend}
                                    disabled={resendCooldown > 0 || lockoutTime > 0}
                                    className="text-sm font-semibold text-[#7C66B0] hover:underline cursor-pointer disabled:opacity-50 disabled:no-underline">
                                    {resendCooldown > 0 ? `Resend code (${resendCooldown}s)` : 'Resend code'}
                                </button>
                            </div>
                            
                            <div className="flex items-center justify-between gap-2.5" onPaste={handlePaste}>
                                {digits.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={el => { inputRefs.current[index] = el; }}
                                        type="text"
                                        maxLength={1}
                                        value={digit}
                                        disabled={isLocked}
                                        onChange={e => handleChange(index, e.target.value)}
                                        onKeyDown={e => handleKeyDown(index, e)}
                                        className={`w-11 h-12 sm:w-13 sm:h-15 text-center text-lg sm:text-xl font-mono font-bold bg-white border-2 ${
                                            errors.code || customError ? 'border-[#D9534F] focus:ring-[#D9534F] focus:border-[#D9534F]' : 'border-slate-200 focus:ring-[#7C66B0] focus:border-[#7C66B0]-100'
                                        } focus:ring-2 focus:outline-none rounded-xl transition-all shadow-2xs text-[#2C323B] disabled:bg-slate-100 disabled:opacity-60`}
                                        required
                                    /> 
                                ))}
                            </div>

                            {/* Error and Lockout Indicator */}
                            {(customError || errors.code) && (
                                <div className="mt-3 p-3 bg-[#D9534F]/10 border border-[#D9534F]/30 rounded-xl flex items-start gap-2 text-[#D9534F] text-xs sm:text-sm font-semibold">
                                    <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    <div>
                                        {customError || errors.code}
                                        {lockoutTime > 0 && (
                                            <span className="block mt-0.5 font-bold text-[#D9534F]">
                                                Time remaining: {lockoutTime} seconds
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="pt-2">
                            <button 
                                type="submit" 
                                disabled={processing || isLocked}
                                aria-label="Verify account"
                                className="w-full min-h-[48px] py-3 px-4 bg-[#7C66B0] hover:bg-[#68529C] text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-base active:scale-[0.99] cursor-pointer disabled:opacity-70">
                                {processing ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Verifying code...
                                    </>
                                ) : lockoutTime > 0 ? (
                                    `Locked out (${lockoutTime}s)`
                                ) : (
                                    'Verify account'
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Footer Back Link */}
                    <div className="mt-6 pt-5 border-t border-[#E6DEF8] text-center">
                        <Link href="/login" className="text-sm font-semibold text-[#7C66B0] hover:underline inline-block">
                            ← Back to sign in
                        </Link>
                    </div>

                </div>
            </div>
        </>
    );
}