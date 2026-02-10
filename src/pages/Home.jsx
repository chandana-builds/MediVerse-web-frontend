import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Heart, Activity, Calendar, Plus, PhoneCall,
    History, User, AlertTriangle, Ambulance,
    ShieldCheck, MapPin, Clock, LogOut
} from 'lucide-react';
import { emergencyService, patientService } from '../services/api';

const Home = ({ user, setUser, logout }) => {
    const [emergencyData, setEmergencyData] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleEmergency = async () => {
        if (!window.confirm('🚨 EMERGENCY ALERT: This will dispatch an ambulance and notify family. Continue?')) return;
        setLoading(true);
        try {
            // Mocking GPS logic for now as requested or using browser API if needed
            // Ideally: navigator.geolocation.getCurrentPosition(...)
            const location = { lat: 28.4595, lng: 77.0266 };
            const res = await emergencyService.trigger(user.id, location);
            setEmergencyData(res);
        } catch (err) {
            alert('Emergency Dispatch Failed. Please call emergency services directly.');
        } finally {
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
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 min-h-screen bg-slate-50 text-slate-900 font-sans">
            {/* Header */}
            <nav className="flex items-center justify-between bg-white shadow-sm p-6 rounded-2xl">
                <div className="flex items-center gap-4">
                    <div className="bg-blue-600/10 p-2 rounded-xl">
                        <Heart className="text-[#1e88e5] w-6 h-6" fill="currentColor" />
                    </div>
                    <span className="text-2xl font-bold tracking-tight text-[#1e88e5]">MediVerse</span>
                </div>
                <div className="flex items-center gap-6">
                    <div className="hidden md:flex flex-col items-end">
                        <span className="text-sm text-slate-500">Welcome back,</span>
                        <span className="font-semibold text-slate-800">{user?.name}</span>
                    </div>
                    <button onClick={logout} className="p-3 hover:bg-slate-100 rounded-full transition-colors">
                        <LogOut className="w-5 h-5 text-slate-500" />
                    </button>
                </div>
            </nav>

            {/* Hero Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <motion.div
                    whileHover={{ scale: 1.01 }}
                    className="bg-white p-6 rounded-2xl shadow-sm col-span-1 md:col-span-2 relative overflow-hidden border border-slate-100"
                >
                    <div className="relative z-10">
                        <p className="text-slate-500 mb-1 font-medium">Daily Health Streak</p>
                        <h1 className="text-5xl font-bold text-[#1e88e5] mb-4">{user?.streak || 0} Days</h1>
                        <button onClick={updateStreak} className="bg-[#1e88e5] text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:bg-blue-600 transition-colors shadow-lg shadow-blue-600/20">
                            <ShieldCheck className="w-4 h-4" />
                            Mark Today's Dose
                        </button>
                    </div>
                    <Activity className="w-32 h-32 text-blue-50 absolute -right-4 -bottom-4" />
                </motion.div>

                <div className="bg-white p-6 rounded-2xl shadow-sm flex flex-col justify-center border border-slate-100">
                    <div className="bg-orange-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                        <AlertTriangle className="text-orange-500 w-6 h-6" />
                    </div>
                    <p className="text-slate-500 mb-1 font-medium">Health Alerts</p>
                    <h3 className="text-2xl font-bold text-slate-800">All Clear</h3>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm flex flex-col justify-center border border-slate-100">
                    <div className="bg-emerald-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                        <ShieldCheck className="text-emerald-500 w-6 h-6" />
                    </div>
                    <p className="text-slate-500 mb-1 font-medium">Policy Status</p>
                    <h3 className="text-2xl font-bold text-slate-800">Active</h3>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Quick Actions */}
                    <section className="space-y-4">
                        <h3 className="text-xl font-bold text-slate-800 px-1">Quick Actions</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { icon: Calendar, label: 'Book Visit', color: 'bg-blue-500', shadow: 'shadow-blue-500/20' },
                                { icon: History, label: 'History', color: 'bg-teal-500', shadow: 'shadow-teal-500/20' },
                                { icon: User, label: 'Pharmacy', color: 'bg-purple-500', shadow: 'shadow-purple-500/20' },
                                { icon: Plus, label: 'Reports', color: 'bg-indigo-500', shadow: 'shadow-indigo-500/20' },
                            ].map((item, i) => (
                                <motion.button
                                    key={i}
                                    whileHover={{ y: -2 }}
                                    className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center gap-3 hover:shadow-md transition-all"
                                >
                                    <div className={`${item.color} p-3 rounded-xl ${item.shadow} shadow-lg`}>
                                        <item.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <span className="text-sm font-semibold text-slate-700">{item.label}</span>
                                </motion.button>
                            ))}
                        </div>
                    </section>

                    {/* Appointments Preview */}
                    <section className="space-y-4">
                        <div className="flex items-center justify-between px-1">
                            <h3 className="text-xl font-bold text-slate-800">Upcoming Visits</h3>
                            <button className="text-[#1e88e5] text-sm font-semibold hover:underline">View Schedule</button>
                        </div>
                        <div className="space-y-3">
                            {(Array.isArray(user?.appointments) ? user.appointments : []).map((appt, i) => (
                                <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-slate-100 p-3 rounded-full">
                                            <User className="w-5 h-5 text-slate-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-800">{appt.docName}</h4>
                                            <p className="text-sm text-slate-500">{appt.hospital} • {appt.date}</p>
                                        </div>
                                    </div>
                                    <div className="bg-blue-50 text-[#1e88e5] px-4 py-2 rounded-xl text-sm font-semibold">
                                        {appt.time}
                                    </div>
                                </div>
                            ))}
                            {!user?.appointments?.length && (
                                <div className="p-8 text-center text-slate-400 bg-white rounded-2xl border border-slate-100 border-dashed">
                                    No upcoming appointments scheduled.
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    {/* Emergency Card - CRITICAL FEATURE */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-red-50 p-8 rounded-2xl border border-red-100 relative overflow-hidden group shadow-lg shadow-red-500/10"
                    >
                        <div className="relative z-10">
                            <h2 className="text-2xl font-bold mb-2 text-red-900">Emergency</h2>
                            <p className="text-red-700/80 text-sm mb-6">Press below to request immediate ambulance assistance.</p>
                            <button
                                onClick={handleEmergency}
                                disabled={loading}
                                className="bg-red-600 hover:bg-red-700 text-white w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-red-600/30"
                            >
                                <PhoneCall className="w-6 h-6 animate-pulse" />
                                {loading ? 'Requesting...' : 'Call Ambulance'}
                            </button>
                        </div>
                        <Ambulance className="w-32 h-32 text-red-600/10 absolute -right-6 -bottom-6 group-hover:scale-110 transition-transform" />
                    </motion.div>

                    {/* Emergency Tracking */}
                    <AnimatePresence>
                        {emergencyData && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                className="bg-white p-6 rounded-2xl border border-blue-100 shadow-lg shadow-blue-500/5 relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-1 h-full bg-[#1e88e5]"></div>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="bg-blue-600/10 p-2 rounded-lg">
                                        <Ambulance className="w-5 h-5 text-[#1e88e5]" />
                                    </div>
                                    <h4 className="font-bold text-slate-800">Dispatch Update</h4>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-500">Estimated Arrival</span>
                                        <span className="font-bold text-[#1e88e5] text-lg">{emergencyData.ambulance.eta}</span>
                                    </div>
                                    <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: '0%' }}
                                            animate={{ width: '65%' }}
                                            className="absolute top-0 left-0 h-full bg-[#1e88e5]"
                                        />
                                    </div>

                                    <div className="pt-4 border-t border-slate-100 space-y-3">
                                        <div className="flex items-center gap-3">
                                            <MapPin className="w-4 h-4 text-slate-400" />
                                            <span className="text-sm font-medium text-slate-700">{emergencyData.hospital.name}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <User className="w-4 h-4 text-slate-400" />
                                            <span className="text-sm text-slate-600">Driver: {emergencyData.ambulance.driver_name}</span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setEmergencyData(null)}
                                    className="w-full mt-6 py-3 text-slate-400 hover:text-slate-600 text-sm font-semibold transition-colors"
                                >
                                    Close Tracking
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <h4 className="font-bold mb-4 text-slate-800">Family Circle</h4>
                        <div className="space-y-4">
                            {(Array.isArray(user?.family_members) ? user.family_members : []).map((member, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center">
                                            <span className="font-bold text-purple-600 text-sm">{member.name.charAt(0)}</span>
                                        </div>
                                        <span className="text-sm font-medium text-slate-700">{member.name}</span>
                                    </div>
                                    <a href={`tel:${member.phone}`} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
                                        <PhoneCall className="w-4 h-4 text-slate-400" />
                                    </a>
                                </div>
                            ))}
                            {!user?.family_members?.length && (
                                <p className="text-sm text-slate-400 italic">No family members added.</p>
                            )}
                        </div>
                        <button className="w-full mt-6 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
                            Add Member
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
