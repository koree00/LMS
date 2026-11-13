import React, { useState, useRef, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { FoxMascot, PastelCoin } from '@/Components/StudentVisuals';

interface NotificationItem {
    id: number;
    text: string;
    time: string;
    unread: boolean;
    link: string;
}

interface ShopItem {
    id: string;
    name: string;
    category: 'hat' | 'shirt' | 'accessory';
    price: number;
    isOwned: boolean;
}

export default function StudentAvatar({ notifications = [] }: { notifications?: NotificationItem[] }) {
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(() => {
        if (typeof window !== 'undefined') return window.innerWidth >= 768;
        return true;
    });

    const [notifOpen, setNotifOpen] = useState<boolean>(false);
    const notifRef = useRef<HTMLDivElement>(null);

    const [totalCoins, setTotalCoins] = useState<number>(120);
    const [shopNotice, setShopNotice] = useState<string | null>(null);

    const [equippedHat, setEquippedHat] = useState<string>('hat-1');
    const [equippedShirt, setEquippedShirt] = useState<string>('shirt-1');
    const [equippedAccessory, setEquippedAccessory] = useState<string>('acc-1');

    const [shopItems, setShopItems] = useState<ShopItem[]>([
        { id: 'hat-1', name: 'Graduation Cap', category: 'hat', price: 0, isOwned: true },
        { id: 'hat-2', name: 'Explorer Sun Hat', category: 'hat', price: 50, isOwned: false },
        { id: 'hat-3', name: 'Starlight Crown', category: 'hat', price: 100, isOwned: false },
        
        { id: 'shirt-1', name: 'Sage Polo Shirt', category: 'shirt', price: 0, isOwned: true },
        { id: 'shirt-2', name: 'Sky Blue Tunic', category: 'shirt', price: 75, isOwned: false },
        { id: 'shirt-3', name: 'Lavender Sweater', category: 'shirt', price: 120, isOwned: false },

        { id: 'acc-1', name: 'Gold Star Pin', category: 'accessory', price: 0, isOwned: true },
        { id: 'acc-2', name: 'Hero Medal', category: 'accessory', price: 60, isOwned: false },
        { id: 'acc-3', name: 'Reading Glasses', category: 'accessory', price: 40, isOwned: false },
    ]);

    const renderItemPreview = (id: string) => {
        switch (id) {
            case 'hat-1':
                return (
                    <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none">
                        <path d="M6 18L20 11L34 18L20 24L6 18Z" fill="#3B4D5E" stroke="#263340" strokeWidth="1.8" strokeLinejoin="round" />
                        <path d="M12 20V25C12 25 16 27 20 27C24 27 28 25 28 25V20" fill="#3B4D5E" />
                        <path d="M31 19V27" stroke="#E5B85C" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                );
            case 'hat-2':
                return (
                    <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none">
                        <ellipse cx="20" cy="24" rx="16" ry="4.5" fill="#E5C687" stroke="#BA9B5C" strokeWidth="1.8" />
                        <path d="M11 24C11 17 14 14 20 14C26 14 29 17 29 24" fill="#EED39B" stroke="#BA9B5C" strokeWidth="1.8" />
                        <path d="M11 22H29" stroke="#5D9C7C" strokeWidth="2.5" />
                    </svg>
                );
            case 'hat-3':
                return (
                    <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none">
                        <path d="M8 27L11 15L16 21L20 12L24 21L29 15L32 27H8Z" fill="#EBC267" stroke="#B88E35" strokeWidth="1.8" strokeLinejoin="round" />
                    </svg>
                );
            case 'shirt-1':
                return <div className="w-7 h-7 rounded-lg bg-[#5D9C7C] border-2 border-[#42785C]" />;
            case 'shirt-2':
                return <div className="w-7 h-7 rounded-lg bg-[#6A9EC2] border-2 border-[#4D7C9E]" />;
            case 'shirt-3':
                return <div className="w-7 h-7 rounded-lg bg-[#9B87B5] border-2 border-[#766391]" />;
            case 'acc-3':
                return (
                    <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none" stroke="#475569" strokeWidth="2">
                        <circle cx="13" cy="20" r="5.5" fill="#EEF4F8" />
                        <circle cx="27" cy="20" r="5.5" fill="#EEF4F8" />
                        <line x1="18.5" y1="20" x2="21.5" y2="20" />
                    </svg>
                );
            case 'acc-2':
                return (
                    <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none">
                        <path d="M15 8L20 18L25 8" stroke="#C97A6B" strokeWidth="2.5" strokeLinecap="round" />
                        <circle cx="20" cy="24" r="7" fill="#EBC267" stroke="#B88E35" strokeWidth="1.8" />
                    </svg>
                );
            default:
                return (
                    <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none">
                        <circle cx="20" cy="20" r="7" fill="#EBC267" stroke="#B88E35" strokeWidth="1.8" />
                    </svg>
                );
        }
    };

    const handleBuyOrEquipItem = (item: ShopItem) => {
        setShopNotice(null);
        if (item.isOwned) {
            if (item.category === 'hat') setEquippedHat(item.id);
            if (item.category === 'shirt') setEquippedShirt(item.id);
            if (item.category === 'accessory') setEquippedAccessory(item.id);
        } else {
            if (totalCoins >= item.price) {
                setTotalCoins(prev => prev - item.price);
                setShopItems(prev => prev.map(i => i.id === item.id ? { ...i, isOwned: true } : i));
                if (item.category === 'hat') setEquippedHat(item.id);
                if (item.category === 'shirt') setEquippedShirt(item.id);
                if (item.category === 'accessory') setEquippedAccessory(item.id);
            } else {
                setShopNotice('Not enough coins yet. Play more activities or daily games to collect coins!');
            }
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
                setNotifOpen(false);
            }
        };
        if (notifOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [notifOpen]);

    return (
        <>
            <Head title="EduQuestAI Avatar & Shop · San Mateo Elementary"/>
            <div className="min-h-screen bg-[#F8FAFC] flex text-slate-700 w-full overflow-x-hidden relative font-sans box-border">
                
                {sidebarOpen && (
                    <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-slate-900/15 z-40 md:hidden transition-opacity" />
                )}

                <aside className={`
                    fixed inset-y-0 left-0 z-50 bg-white border-r border-slate-200/80 p-4 md:p-5 flex flex-col justify-between transition-all duration-200 shrink-0
                    ${sidebarOpen ? 'w-64 translate-x-0' : '-translate-x-full md:translate-x-0 md:w-20'}
                `}>
                    <div className="space-y-6 overflow-y-auto overflow-x-hidden flex-1 pr-1">
                        <div className={`flex items-center pb-4 border-b border-slate-100 ${sidebarOpen ? 'justify-between' : 'flex-col gap-3'}`}>
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className="w-9 h-9 rounded-xl bg-[#EEF5F0] text-[#35634C] border border-[#D5E6DC] flex items-center justify-center font-bold text-xs shrink-0">EQ</div>
                                {sidebarOpen && (
                                    <div className="truncate">
                                        <span className="font-bold text-slate-900 block text-xs leading-tight">EduQuestAI</span>
                                        <span className="text-[11px] text-slate-500 font-medium">San Mateo Elementary</span>
                                    </div>
                                )}
                            </div>
                            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer shrink-0 border border-transparent hover:border-slate-200">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M4 6h16M4 12h16M4 18h16" /></svg>
                            </button>
                        </div>
                        <div>
                            {sidebarOpen && <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2 px-1">Student Hub</div>}
                            <nav className="space-y-1.5">
                                <Link href="/student/overview" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-600 font-medium text-xs border border-transparent hover:border-slate-200/70 transition-colors ${!sidebarOpen ? 'md:justify-center px-0' : ''}`} title="Overview">
                                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
                                    {sidebarOpen && <span>Overview</span>}
                                </Link>
                                <Link href="/student/activities" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-600 font-medium text-xs border border-transparent hover:border-slate-200/70 transition-colors ${!sidebarOpen ? 'md:justify-center px-0' : ''}`} title="Gamified Activities">
                                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                    {sidebarOpen && <span>Gamified Activities</span>}
                                </Link>
                                 <Link href="/student/grades" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-600 font-medium text-xs border border border-transparent hover:border-slate-200/70 transition-colors ${!sidebarOpen ? 'md:justify-center px-0' : ''}`} title="My Grades">
                                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                                    {sidebarOpen && <span>My Grades</span>}
                                </Link>
                                <Link href="/student/daily-games" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-600 font-medium text-xs border border-transparent hover:border-slate-200/70 transition-colors ${!sidebarOpen ? 'md:justify-center px-0' : ''}`} title="Daily Games">
                                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                    {sidebarOpen && <span>Daily Games</span>}
                                </Link>
                                <Link href="/student/avatar" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#EEF5F0] text-[#2B523F] font-semibold text-xs border border-[#D5E6DC] transition-colors ${!sidebarOpen ? 'md:justify-center px-0' : ''}`} title="My Avatar & Shop">
                                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                                    {sidebarOpen && <span>My Avatar & Shop</span>}
                                </Link>
                                <Link href="/student/rewards" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-600 font-medium text-xs border border-transparent hover:border-slate-200/70 transition-colors ${!sidebarOpen ? 'md:justify-center px-0' : ''}`} title="Rewards & Badges">
                                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>
                                    {sidebarOpen && <span>Rewards & Badges</span>}
                                </Link>
                                <Link href="/student/feedback" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-600 font-medium text-xs border border-transparent hover:border-slate-200/70 transition-colors ${!sidebarOpen ? 'md:justify-center px-0' : ''}`} title="Teacher Feedback">
                                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/></svg>
                                    {sidebarOpen && <span>Teacher Feedback</span>}
                                </Link>
                                <Link href="/student/settings" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-600 font-medium text-xs border border-transparent hover:border-slate-200/70 transition-colors ${!sidebarOpen ? 'md:justify-center px-0' : ''}`} title="User Settings">
                                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                                    {sidebarOpen && <span>User Settings</span>}
                                </Link>
                            </nav>
                        </div>
                    </div>
                    <div className="space-y-2.5 pt-4 border-t border-slate-100 shrink-0 bg-white">
                        <Link href="/login" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-rose-50/60 text-slate-700 font-medium text-xs border border-transparent hover:border-rose-200/70 transition-colors ${!sidebarOpen ? 'md:justify-center px-0' : ''}`} title="Sign out">
                            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                            {sidebarOpen && <span>Sign out</span>}
                        </Link>
                    </div>
                </aside>

                <main className={`flex-1 w-full min-w-0 py-5 px-4 sm:px-8 lg:px-10 space-y-6 transition-all duration-200 ${sidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
                    
                    <div className="flex items-center justify-between bg-white p-3.5 sm:px-6 rounded-xl border border-slate-200/80 w-full box-border">
                        <div className="flex items-center gap-3 min-w-0">
                            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg text-slate-600 hover:bg-slate-50 border border-slate-200 cursor-pointer shrink-0">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M4 6h16M4 12h16M4 18h16"/></svg>
                            </button>
                            <span className="text-xs font-semibold text-slate-500 truncate">EduQuestAI / My Avatar & Shop</span>
                        </div>

                        <div className="flex items-center gap-2.5 shrink-0">
                            <Link href="/student/overview" className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/70 text-slate-700 font-semibold text-xs transition-colors cursor-pointer border border-slate-200">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
                                <span>Home</span>
                            </Link>
                            <div className="flex items-center gap-1.5 bg-[#FBF6EC] border border-[#EBDEC4] px-3.5 py-2 rounded-xl text-xs font-bold text-[#6E5630]">
                                <PastelCoin className="w-4 h-4" />
                                <span>{totalCoins} Coins</span>
                            </div>
                        </div>
                    </div>

                    {shopNotice && (
                        <div className="bg-[#FBF6EC] border border-[#EBDEC4] text-[#6E5630] px-4 py-3 rounded-xl text-xs font-medium flex items-center justify-between">
                            <span>{shopNotice}</span>
                            <button onClick={() => setShopNotice(null)} className="text-xs font-bold underline cursor-pointer">Dismiss</button>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        
                        {/* Live Interactive Fox Character */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 text-center space-y-5 flex flex-col items-center justify-between">
                            <div className="space-y-1.5">
                                <span className="inline-block text-[11px] font-semibold text-[#2B523F] bg-[#EEF5F0] px-2.5 py-0.5 rounded-full border border-[#D5E6DC]">
                                    My Character
                                </span>
                                <h1 className="text-base font-bold text-slate-900">Leonardo's Fox</h1>
                            </div>

                            <FoxMascot
                                className="w-44 h-44"
                                hat={equippedHat}
                                shirt={equippedShirt}
                                accessory={equippedAccessory}
                            />

                            <div className="w-full bg-[#FBF6EC] p-3.5 rounded-xl border border-[#EBDEC4] text-xs flex items-center justify-center gap-2">
                                <PastelCoin className="w-5 h-5" />
                                <span className="font-bold text-[#6E5630] text-sm">{totalCoins} Coins Available</span>
                            </div>
                        </div>

                        {/* Wardrobe & Shop */}
                        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Avatar Wardrobe & Coin Shop</h2>
                                <span className="text-xs text-slate-500">Tap an item to dress up your fox</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {shopItems.map(item => {
                                    const isEquipped = (
                                        (item.category === 'hat' && equippedHat === item.id) ||
                                        (item.category === 'shirt' && equippedShirt === item.id) ||
                                        (item.category === 'accessory' && equippedAccessory === item.id)
                                    );

                                    return (
                                        <div 
                                            key={item.id}
                                            className={`p-4 rounded-2xl border flex flex-col justify-between space-y-3.5 transition-colors ${
                                                isEquipped ? 'bg-[#EEF5F0]/70 border-slate-200' : 'bg-slate-50/50 border-slate-200/80 hover:bg-white'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="w-12 h-12 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center">
                                                    {renderItemPreview(item.id)}
                                                </div>
                                                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border flex items-center gap-1 ${
                                                    item.isOwned ? 'bg-[#EEF5F0] text-[#2B523F] border-[#D5E6DC]' : 'bg-[#FBF6EC] text-[#6E5630] border-[#EBDEC4]'
                                                }`}>
                                                    {item.isOwned ? 'Owned' : (
                                                        <>
                                                            <PastelCoin className="w-3.5 h-3.5" /> {item.price}
                                                        </>
                                                    )}
                                                </span>
                                            </div>

                                            <div>
                                                <h3 className="text-xs font-bold text-slate-900">{item.name}</h3>
                                                <span className="text-[11px] text-slate-400 capitalize">{item.category}</span>
                                            </div>

                                            <button 
    onClick={() => handleBuyOrEquipItem(item)}
    className={`w-full py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
        isEquipped
            ? 'bg-[#DCECE2] text-[#264D39] border border-slate-300'
            : item.isOwned
            ? 'bg-slate-200/80 hover:bg-slate-300/70 text-slate-800'
            : 'bg-emerald-700/30 border border-slate-200 text-black'
    }`}
>
    {isEquipped ? 'Wearing' : item.isOwned ? 'Wear Item' : 'Unlock Item'}
</button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                    </div>

                </main>
            </div>
        </>
    );
}