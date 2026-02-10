import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Heart, Activity, Calendar, Plus, PhoneCall,
    History, User, AlertTriangle, Ambulance,
    ShieldCheck, MapPin, Clock, LogOut, ArrowLeft, Search, Pill
} from 'lucide-react';
import { emergencyService, patientService } from '../services/api';

// --- Sub-Views (Defined outside to prevent re-renders) ---
const BookingView = ({ setActiveView }) => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="flex items-center gap-4 mb-6">
            <button onClick={() => setActiveView('dashboard')} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <ArrowLeft className="w-6 h-6 text-[#333333]" />
            </button>
            <h2 className="text-2xl font-bold text-[#333333]">Book Appointment</h2>
        </div>

        <div className="bg-white p-8 rounded-[16px] border border-slate-200 shadow-sm space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-600">Select Department</label>
                    <select className="input-field w-full">
                        <option>General Medicine</option>
                        <option>Cardiology</option>
                        <option>Orthopedics</option>
                        <option>Pediatrics</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-600">Preferred Date</label>
                    <input type="date" className="input-field w-full" />
                </div>
                <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-semibold text-slate-600">Reason for Visit</label>
                    <textarea className="input-field w-full h-32 resize-none" placeholder="Describe your symptoms..."></textarea>
                </div>
            </div>
            <button className="w-full btn-primary py-4 text-lg">Confirm Booking</button>
        </div>
    </motion.div>
);

const PharmacyView = ({ setActiveView }) => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="flex items-center gap-4 mb-6">
            <button onClick={() => setActiveView('dashboard')} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <ArrowLeft className="w-6 h-6 text-[#333333]" />
            </button>
            <h2 className="text-2xl font-bold text-[#333333]">Online Pharmacy</h2>
        </div>

        <div className="bg-white p-6 rounded-[16px] border border-slate-200 shadow-sm">
            <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input className="input-field w-full pl-12" placeholder="Search medicines..." />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                    { name: 'Paracetamol 500mg', brand: 'Dolo', price: '₹30' },
                    { name: 'Vitamin C', brand: 'Limcee', price: '₹25' },
                    { name: 'Cough Syrup', brand: 'Benadryl', price: '₹120' },
                    { name: 'Amoxicillin', brand: 'Mox', price: '₹85' },
                ].map((med, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:border-[#1e88e5] transition-colors cursor-pointer group">
                        <div className="flex items-center gap-3">
                            <div className="bg-purple-50 p-2 rounded-lg">
                                <Pill className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <h4 className="font-bold text-[#333333]">{med.name}</h4>
                                <span className="text-xs text-slate-500">{med.brand}</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="block font-bold text-[#1e88e5]">{med.price}</span>
                            <span className="text-xs text-slate-400 group-hover:text-[#1e88e5]">Add +</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </motion.div>
);

const Home = ({ user, setUser, logout }) => {
    const [emergencyData, setEmergencyData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [activeView, setActiveView] = useState('dashboard'); // dashboard, booking, pharmacy

    const handleEmergency = async () => {
        if (!window.confirm('🚨 EMERGENCY ALERT: This will dispatch an ambulance and notify family. Continue?')) return;
        setLoading(true);
        try {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    try {
                        const res = await emergencyService.trigger(user.id, { lat: latitude, lng: longitude });
                        setEmergencyData(res);
                    } catch (apiErr) {
                        alert('Emergency Trigger Failed. Call 108/911 immediately.');
                    } finally {
                        setLoading(false);
                    }
                },
                async (geoErr) => {
                    console.warn("Geolocation failed", geoErr);
                    const location = { lat: 28.4595, lng: 77.0266 };
                    const res = await emergencyService.trigger(user.id, location);
                    setEmergencyData(res);
                    setLoading(false);
                }
            );
        } catch (err) {
            alert('Emergency Dispatch Failed. Please call emergency services directly.');
            setLoading(false);
        }
    };

    const updateStreak = async () => {
        const updated = { ...user, streak: (user.streak || 0) + 1 };
        try {
            const res = await patientService.updateData(updated);
            if (res.success) {
                setUser(res.user);
                localStorage.setItem('mediverse_user', JSON.stringify(res.user));
            }
        } catch (err) {
            console.error('Streak update failed');
        }
    };

    return (
        <div className="min-h-screen bg-white text-[#333333] font-sans p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
            {/* Header */}
            <nav className="flex items-center justify-between bg-white border border-slate-200 shadow-sm p-6 rounded-[16px]">
                <div className="flex items-center gap-4">
                    <div className="bg-[#1e88e5]/10 p-2 rounded-xl">
                        <Heart className="text-[#1e88e5] w-6 h-6" fill="currentColor" />
                    </div>
                    <span className="text-2xl font-bold tracking-tight text-[#1e88e5]">MediVerse</span>
                </div>
                <div className="flex items-center gap-6">
                    <div className="hidden md:flex flex-col items-end">
                        <span className="text-sm text-slate-500">Welcome,</span>
                        <span className="font-semibold text-slate-800">{user?.name}</span>
                    </div>
                    <button onClick={logout} className="p-3 hover:bg-slate-50 rounded-full transition-colors">
                        <LogOut className="w-5 h-5 text-slate-500" />
                    </button>
                </div>
            </nav>

            {/* Main Content Area */}
            {activeView === 'booking' ? <BookingView setActiveView={setActiveView} /> :
                activeView === 'pharmacy' ? <PharmacyView setActiveView={setActiveView} /> : (
                    /* Dashboard View */
                    <div className="space-y-8">
                        {/* 1. Top Section: Today's Status (Blue Card) */}
                        <motion.div
                            whileHover={{ scale: 1.01 }}
                            className="w-full bg-[#1e88e5] text-white p-8 rounded-[16px] shadow-lg relative overflow-hidden flex flex-col md:flex-row items-center justify-between"
                        >
                            <div className="relative z-10 space-y-4">
                                <div>
                                    <p className="text-blue-100 font-medium mb-1">Daily Health Streak</p>
                                    <h1 className="text-5xl font-bold mb-2">{user?.streak || 0} Days</h1>
                                    <p className="text-blue-100 text-sm">Keep it up! Your consistency is improving your health score.</p>
                                </div>
                                <button
                                    onClick={updateStreak}
                                    className="bg-white text-[#1e88e5] px-6 py-3 rounded-[16px] font-bold flex items-center gap-2 hover:bg-blue-50 transition-colors shadow-md"
                                >
                                    <ShieldCheck className="w-5 h-5" />
                                    Mark Today's Dose
                                </button>
                            </div>
                            <Activity className="w-48 h-48 text-white/10 absolute -right-8 -bottom-8" />
                        </motion.div>

                        {/* 2. Middle Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-6">
                                <section>
                                    <h3 className="text-xl font-bold text-[#333333] mb-4 px-1">Quick Actions</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {[
                                            { icon: Calendar, label: 'Book Visit', color: 'text-blue-600', bg: 'bg-blue-50', action: 'booking' },
                                            { icon: User, label: 'Pharmacy', color: 'text-purple-600', bg: 'bg-purple-50', action: 'pharmacy' },
                                            { icon: History, label: 'History', color: 'text-teal-600', bg: 'bg-teal-50', action: 'history' },
                                            { icon: Plus, label: 'Reports', color: 'text-indigo-600', bg: 'bg-indigo-50', action: 'reports' },
                                        ].map((item, i) => (
                                            <motion.button
                                                key={i}
                                                onClick={() => item.action && setActiveView(item.action)}
                                                whileHover={{ y: -2 }}
                                                className="bg-white border border-slate-200 p-6 rounded-[16px] shadow-sm flex flex-col items-center gap-3 hover:shadow-md transition-all group"
                                            >
                                                <div className={`${item.bg} p-4 rounded-xl group-hover:scale-110 transition-transform`}>
                                                    <item.icon className={`w-6 h-6 ${item.color}`} />
                                                </div>
                                                <span className="text-sm font-semibold text-[#333333]">{item.label}</span>
                                            </motion.button>
                                        ))}
                                    </div>
                                </section>

                                <section>
                                    <div className="flex items-center justify-between px-1 mb-4">
                                        <h3 className="text-xl font-bold text-[#333333]">Recent Activity</h3>
                                        <button className="text-[#1e88e5] text-sm font-semibold hover:underline">View All</button>
                                    </div>
                                    <div className="bg-white border border-slate-200 rounded-[16px] shadow-sm overflow-hidden">
                                        {(Array.isArray(user?.appointments) ? user.appointments : []).map((appt, i) => (
                                            <div key={i} className="p-4 border-b border-slate-100 last:border-0 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                                <div className="flex items-center gap-4">
                                                    <div className="bg-slate-100 p-3 rounded-full">
                                                        <User className="w-5 h-5 text-slate-600" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-[#333333]">{appt.docName}</h4>
                                                        <p className="text-xs text-slate-500">{appt.hospital} • {appt.date}</p>
                                                    </div>
                                                </div>
                                                <span className="bg-blue-50 text-[#1e88e5] px-3 py-1 rounded-[8px] text-xs font-bold">
                                                    {appt.time}
                                                </span>
                                            </div>
                                        ))}
                                        {!user?.appointments?.length && (
                                            <div className="p-8 text-center text-slate-400">
                                                No recent activity found.
                                            </div>
                                        )}
                                    </div>
                                </section>
                            </div>

                            {/* 3. Emergency Section */}
                            <div className="space-y-6">
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    className="bg-[#FFFFFF] border-2 border-red-100 p-8 rounded-[16px] shadow-lg relative overflow-hidden group"
                                >
                                    <div className="relative z-10 text-center">
                                        <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <AlertTriangle className="text-red-600 w-8 h-8" />
                                        </div>
                                        <h2 className="text-2xl font-bold mb-2 text-red-600">Emergency</h2>
                                        <p className="text-slate-500 text-sm mb-6">Need immediate help? Press below to alert nearby ambulances.</p>
                                        <button
                                            onClick={handleEmergency}
                                            disabled={loading}
                                            className="bg-red-600 hover:bg-red-700 text-white w-full py-4 rounded-[16px] font-bold text-lg flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-red-600/20"
                                        >
                                            <PhoneCall className="w-6 h-6 animate-pulse" />
                                            {loading ? 'Dispatching...' : 'Call Ambulance'}
                                        </button>
                                    </div>
                                </motion.div>

                                <AnimatePresence>
                                    {emergencyData && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 20 }}
                                            className="bg-white border-2 border-[#1e88e5] p-6 rounded-[16px] shadow-xl"
                                        >
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="bg-blue-50 p-2 rounded-lg">
                                                    <Ambulance className="w-6 h-6 text-[#1e88e5]" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-[#333333]">Ambulance En Route</h4>
                                                    <span className="text-xs text-slate-500">Tracking ID: #SOS-8892</span>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="flex justify-between items-end">
                                                    <span className="text-slate-500 text-sm">Estimated Arrival</span>
                                                    <span className="text-2xl font-bold text-[#1e88e5]">{emergencyData.ambulance.eta}</span>
                                                </div>
                                                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                                    <div className="bg-[#1e88e5] h-full w-[60%] animate-pulse"></div>
                                                </div>

                                                <div className="bg-slate-50 p-4 rounded-[12px] space-y-2">
                                                    <div className="flex items-center gap-3 text-sm">
                                                        <MapPin className="w-4 h-4 text-slate-400" />
                                                        <span className="font-medium">{emergencyData.hospital.name}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-sm">
                                                        <User className="w-4 h-4 text-slate-400" />
                                                        <span>Driver: {emergencyData.ambulance.driver_name}</span>
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => setEmergencyData(null)}
                                                    className="w-full py-3 text-slate-400 text-sm font-semibold hover:text-slate-600"
                                                >
                                                    Dismiss Tracking
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                )}
        </div>
    );
};

export default Home;
