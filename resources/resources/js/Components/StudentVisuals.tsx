import React from 'react';

export const FoxMascot = ({ className = 'w-12 h-12', hat, shirt, accessory }: { className?: string; hat?: string; shirt?: string; accessory?: string }) => (
    <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Background Circle */}
        <circle cx="60" cy="60" r="56" fill="#EAF3EE" stroke="#CBE0D4" strokeWidth="3" />
        
        {/* Shirt / Outfit */}
        {shirt === 'shirt-2' ? (
            <path d="M30 105C30 88 43 78 60 78C77 78 90 88 90 105" fill="#6A9EC2" stroke="#4D7C9E" strokeWidth="2.5" />
        ) : shirt === 'shirt-3' ? (
            <path d="M30 105C30 88 43 78 60 78C77 78 90 88 90 105" fill="#9B87B5" stroke="#766391" strokeWidth="2.5" />
        ) : (
            <path d="M32 105C32 89 44 80 60 80C76 80 88 89 88 105" fill="#5D9C7C" stroke="#42785C" strokeWidth="2.5" />
        )}

        {/* Fox Ears */}
        <path d="M32 48L26 22L48 34Z" fill="#D98A5B" stroke="#B56B40" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M88 48L94 22L72 34Z" fill="#D98A5B" stroke="#B56B40" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M35 44L31 28L45 36Z" fill="#F6DFC8" />
        <path d="M85 44L89 28L75 36Z" fill="#F6DFC8" />

        {/* Fox Head */}
        <path d="M28 56C28 38 42 28 60 28C78 28 92 38 92 56C92 72 76 84 60 84C44 84 28 72 28 56Z" fill="#E39768" stroke="#B56B40" strokeWidth="2.5" />
        
        {/* Cheeks / Snout Cream Patch */}
        <path d="M29 58C35 58 46 64 60 64C74 64 85 58 91 58C89 73 75 83 60 83C45 83 31 73 29 58Z" fill="#FDF8F2" />

        {/* Eyes */}
        <circle cx="46" cy="52" r="4" fill="#334155" />
        <circle cx="74" cy="52" r="4" fill="#334155" />
        <circle cx="47.2" cy="50.8" r="1.3" fill="#FFFFFF" />
        <circle cx="75.2" cy="50.8" r="1.3" fill="#FFFFFF" />

        {/* Nose & Gentle Smile */}
        <ellipse cx="60" cy="64" rx="4.5" ry="3.2" fill="#334155" />
        <path d="M54 70C56.5 73 63.5 73 66 70" stroke="#334155" strokeWidth="2.2" strokeLinecap="round" />

        {/* Hats */}
        {hat === 'hat-1' && (
            <g>
                <path d="M36 28L60 18L84 28L60 36L36 28Z" fill="#3B4D5E" stroke="#263340" strokeWidth="2" strokeLinejoin="round" />
                <path d="M46 31V37C46 37 53 40 60 40C67 40 74 37 74 37V31" fill="#3B4D5E" />
                <path d="M80 29V40" stroke="#E5B85C" strokeWidth="2.5" strokeLinecap="round" />
            </g>
        )}
        {hat === 'hat-2' && (
            <g>
                <ellipse cx="60" cy="30" rx="32" ry="7" fill="#E5C687" stroke="#BA9B5C" strokeWidth="2" />
                <path d="M44 30C44 20 50 16 60 16C70 16 76 20 76 30" fill="#EED39B" stroke="#BA9B5C" strokeWidth="2" />
                <path d="M44 27H76" stroke="#5D9C7C" strokeWidth="3.5" />
            </g>
        )}
        {hat === 'hat-3' && (
            <path d="M42 30L46 16L54 24L60 13L66 24L74 16L78 30H42Z" fill="#EBC267" stroke="#B88E35" strokeWidth="2" strokeLinejoin="round" />
        )}

        {/* Accessories */}
        {accessory === 'acc-3' && (
            <g stroke="#475569" strokeWidth="2.2" fill="#FFFFFF" fillOpacity="0.35">
                <circle cx="46" cy="52" r="8.5" />
                <circle cx="74" cy="52" r="8.5" />
                <line x1="54.5" y1="52" x2="65.5" y2="52" />
            </g>
        )}
        {accessory === 'acc-2' && (
            <g>
                <circle cx="60" cy="94" r="7" fill="#EBC267" stroke="#B88E35" strokeWidth="2" />
                <path d="M56 80L60 88L64 80" stroke="#C97A6B" strokeWidth="2.5" />
            </g>
        )}
        {accessory === 'acc-1' && (
            <circle cx="72" cy="91" r="4.5" fill="#EBC267" stroke="#B88E35" strokeWidth="1.5" />
        )}
    </svg>
);

export const SubjectIllustration = ({ id, className = 'w-8 h-8' }: { id: string; className?: string }) => {
    switch (id) {
        case 'math':
            return (
                <svg viewBox="0 0 48 48" className={className} fill="none">
                    <rect x="6" y="6" width="16" height="16" rx="4" fill="#7AB394" stroke="#4B8B6B" strokeWidth="2" />
                    <rect x="26" y="6" width="16" height="16" rx="4" fill="#EBC267" stroke="#B88E35" strokeWidth="2" />
                    <rect x="6" y="26" width="16" height="16" rx="4" fill="#7FAEC9" stroke="#4D7C9E" strokeWidth="2" />
                    <rect x="26" y="26" width="16" height="16" rx="4" fill="#E09486" stroke="#B36557" strokeWidth="2" />
                    <path d="M14 11V17M11 14H17" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" />
                    <path d="M31 14H37" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" />
                    <circle cx="14" cy="34" r="2.5" fill="#FFFFFF" />
                    <path d="M31 32H37M31 36H37" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" />
                </svg>
            );
        case 'reading':
            return (
                <svg viewBox="0 0 48 48" className={className} fill="none">
                    <path d="M8 12C8 10.3 9.3 9 11 9H21C22.7 9 24 10.3 24 12V37C24 35.3 22.7 34 21 34H11C9.3 34 8 35.3 8 37V12Z" fill="#9BC3DC" stroke="#4D7C9E" strokeWidth="2" />
                    <path d="M40 12C40 10.3 38.7 9 37 9H27C25.3 9 24 10.3 24 12V37C24 35.3 25.3 34 27 34H37C38.7 34 40 35.3 40 37V12Z" fill="#CBE0EE" stroke="#4D7C9E" strokeWidth="2" />
                    <path d="M13 16H19M13 21H19M29 16H35M29 21H35" stroke="#365973" strokeWidth="2" strokeLinecap="round" />
                </svg>
            );
        case 'language':
            return (
                <svg viewBox="0 0 48 48" className={className} fill="none">
                    <rect x="6" y="8" width="24" height="18" rx="6" fill="#F2D398" stroke="#B88E35" strokeWidth="2" />
                    <path d="M12 26L10 32L17 26" fill="#F2D398" stroke="#B88E35" strokeWidth="2" strokeLinejoin="round" />
                    <rect x="18" y="18" width="24" height="18" rx="6" fill="#9BC3DC" stroke="#4D7C9E" strokeWidth="2" />
                    <circle cx="26" cy="27" r="1.8" fill="#365973" />
                    <circle cx="30" cy="27" r="1.8" fill="#365973" />
                    <circle cx="34" cy="27" r="1.8" fill="#365973" />
                </svg>
            );
        case 'gmrc':
            return (
                <svg viewBox="0 0 48 48" className={className} fill="none">
                    <path d="M24 39C24 39 9 29.5 9 18.5C9 13.8 12.8 10 17.5 10C20.3 10 22.8 11.4 24 13.5C25.2 11.4 27.7 10 30.5 10C35.2 10 39 13.8 39 18.5C39 29.5 24 39 24 39Z" fill="#E8A598" stroke="#B86B5D" strokeWidth="2" strokeLinejoin="round" />
                    <path d="M24 27V19M24 23C24 20.5 26.5 19 29 19C29 21.5 27.5 23 24 23ZM24 25C24 22.5 21.5 21 19 21C19 23.5 20.5 25 24 25Z" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            );
        default:
            return (
                <svg viewBox="0 0 48 48" className={className} fill="none">
                    <path d="M8 22L24 10L40 22V39H8V22Z" fill="#F4E2BE" stroke="#B88E35" strokeWidth="2" strokeLinejoin="round" />
                    <rect x="19" y="27" width="10" height="12" rx="2" fill="#88B89E" stroke="#4B8B6B" strokeWidth="2" />
                    <circle cx="24" cy="19" r="3" fill="#E09486" stroke="#B36557" strokeWidth="1.5" />
                </svg>
            );
    }
};

export const PastelStar = ({ className = 'w-6 h-6', filled = true }: { className?: string; filled?: boolean }) => (
    <svg viewBox="0 0 32 32" className={className} fill="none">
        <path
            d="M16 3L19.8 10.9L28.5 12.1L22.2 18.2L23.7 26.9L16 22.8L8.3 26.9L9.8 18.2L3.5 12.1L12.2 10.9L16 3Z"
            fill={filled ? '#F2C96B' : '#E2E8F0'}
            stroke={filled ? '#C7962E' : '#CBD5E1'}
            strokeWidth="2"
            strokeLinejoin="round"
        />
    </svg>
);

export const PastelCoin = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg viewBox="0 0 28 28" className={className} fill="none">
        <circle cx="14" cy="14" r="11" fill="#F5D57A" stroke="#C4962C" strokeWidth="2" />
        <circle cx="14" cy="14" r="7.5" stroke="#D9AA3E" strokeWidth="1.5" strokeDasharray="2 2" />
        <path d="M14 9.5V18.5M11.5 12H16.5" stroke="#9C7114" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

export const AppleIllustration = ({ className = 'w-12 h-12' }: { className?: string }) => (
    <svg viewBox="0 0 48 48" className={className} fill="none">
        <path d="M24 13C24 9 27 6 31 6" stroke="#6E5630" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M24 12C21 8 15 8 14 12C17 14 21 14 24 12Z" fill="#7AB394" stroke="#4B8B6B" strokeWidth="1.8" />
        <path d="M24 15C17 13 10 18 10 26C10 35 17 41 22 41C23.5 41 24 40 24 40C24 40 24.5 41 26 41C31 41 38 35 38 26C38 18 31 13 24 15Z" fill="#E38B7D" stroke="#B55D4F" strokeWidth="2" />
        <path d="M16 21C15 23 15 26 16 28" stroke="#FADAD4" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
);