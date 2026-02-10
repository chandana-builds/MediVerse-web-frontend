import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Heart, Activity, Calendar, Plus, PhoneCall,
    History, User, AlertTriangle, Ambulance,
    ShieldCheck, MapPin, Clock, LogOut, ArrowLeft, Search, Pill, ShoppingCart, CheckCircle, CreditCard, Truck, Camera, Edit2,
    Utensils, Dumbbell, Sun, ChevronRight, ChevronLeft
} from 'lucide-react';
import { emergencyService, patientService } from '../services/api';

// --- Sub-Views ---

const BookingView = ({ setActiveView, user }) => {
    const [step, setStep] = useState(1);
    const [booking, setBooking] = useState({ hospital: '', department: 'General Medicine', date: '', slot: '', reason: '' });

    const hospitals = ['City General Hospital', 'St. Mary\'s Medical Center', 'Apex Heart Institute', 'Green Valley Clinic'];
    const slots = ['09:00 AM', '10:30 AM', '02:00 PM', '04:30 PM', '06:00 PM'];

    const handleBook = () => {
        if (!booking.hospital || !booking.date || !booking.slot) {
            alert("Please fill all details.");
            return;
        }
        setTimeout(() => setStep(2), 1000);
    };

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
                <button onClick={() => setActiveView('dashboard')} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
                    <ArrowLeft className="w-6 h-6 text-[#1e88e5]" />
                </button>
                <h2 className="text-2xl font-bold text-[#1e88e5]">Book Appointment</h2>
            </div>

            {step === 1 ? (
                <div className="bg-white p-8 rounded-[24px] border border-slate-100 shadow-sm space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-semibold text-slate-500">Select Hospital</label>
                            <select
                                className="input-field w-full border-slate-200 focus:border-[#1e88e5] focus:ring-[#1e88e5]/20 rounded-[16px]"
                                value={booking.hospital}
                                onChange={e => setBooking({ ...booking, hospital: e.target.value })}
                            >
                                <option value="">-- Choose Hospital --</option>
                                {hospitals.map(h => <option key={h} value={h}>{h}</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-500">Department</label>
                            <select
                                className="input-field w-full border-slate-200 focus:border-[#1e88e5] focus:ring-[#1e88e5]/20 rounded-[16px]"
                                value={booking.department}
                                onChange={e => setBooking({ ...booking, department: e.target.value })}
                            >
                                <option>General Medicine</option>
                                <option>Cardiology</option>
                                <option>Orthopedics</option>
                                <option>Pediatrics</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-500">Preferred Date</label>
                            <input
                                type="date"
                                className="input-field w-full border-slate-200 focus:border-[#1e88e5] focus:ring-[#1e88e5]/20 rounded-[16px]"
                                value={booking.date}
                                onChange={e => setBooking({ ...booking, date: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-semibold text-slate-500">Available Slots</label>
                            <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                                {slots.map(slot => (
                                    <button
                                        key={slot}
                                        onClick={() => setBooking({ ...booking, slot })}
                                        className={`py-3 px-4 rounded-[16px] text-sm font-bold transition-all ${booking.slot === slot
                                                ? 'bg-[#1e88e5] text-white shadow-md shadow-blue-200'
                                                : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                                            }`}
                                    >
                                        {slot}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <button onClick={handleBook} className="w-full btn-primary py-4 text-lg bg-[#1e88e5] text-white rounded-[16px] font-bold shadow-lg shadow-blue-200 hover:shadow-blue-300 transition-all">
                        Confirm Booking
                    </button>
                </div>
            ) : (
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-blue-50 border border-blue-100 p-8 rounded-[24px] text-center space-y-6"
                >
                    <div className="bg-white w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                        <CheckCircle className="w-12 h-12 text-[#1e88e5]" />
                    </div>
                    <div>
                        <h3 className="text-3xl font-bold text-[#1e88e5] mb-2">Booking Confirmed!</h3>
                        <p className="text-slate-500">Your appointment is scheduled.</p>
                    </div>

                    <div className="bg-white p-6 rounded-[20px] shadow-sm max-w-md mx-auto text-left space-y-4 border border-slate-100">
                        <div className="flex justify-between border-b border-slate-50 pb-3">
                            <span className="text-slate-400 font-medium">Hospital</span>
                            <span className="font-bold text-slate-700">{booking.hospital}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-50 pb-3">
                            <span className="text-slate-400 font-medium">Date & Time</span>
                            <span className="font-bold text-slate-700">{booking.date} at {booking.slot}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400 font-medium">Token ID</span>
                            <span className="font-bold text-[#1e88e5]">#MV-{Math.floor(Math.random() * 10000)}</span>
                        </div>
                    </div>
                    <button onClick={() => setActiveView('dashboard')} className="mt-8 text-[#1e88e5] font-bold hover:underline">Return to Dashboard</button>
                </motion.div>
            )}
        </motion.div>
    );
};

const PharmacyView = ({ setActiveView }) => {
    const [viewMode, setViewMode] = useState('list');
    const [cart, setCart] = useState({});
    const [shipping, setShipping] = useState({ address: '', payment: 'cod' });

    const meds = [
        { name: 'Paracetamol 500mg', brand: 'Dolo', price: 30 },
        { name: 'Vitamin C', brand: 'Limcee', price: 25 },
        { name: 'Cough Syrup', brand: 'Benadryl', price: 120 },
        { name: 'Amoxicillin', brand: 'Mox', price: 85 },
    ];

    const addToCart = (med) => {
        setCart(prev => ({ ...prev, [med.name]: { ...med, qty: (prev[med.name]?.qty || 0) + 1 } }));
    };

    const cartTotal = Object.values(cart).reduce((sum, item) => sum + (item.price * item.qty), 0);

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <button onClick={() => viewMode === 'list' ? setActiveView('dashboard') : setViewMode('list')} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
                        <ArrowLeft className="w-6 h-6 text-[#1e88e5]" />
                    </button>
                    <h2 className="text-2xl font-bold text-[#1e88e5]">
                        {viewMode === 'list' ? 'Online Pharmacy' : viewMode === 'cart' ? 'Your Cart' : 'Checkout'}
                    </h2>
                </div>
                {viewMode === 'list' && (
                    <button onClick={() => setViewMode('cart')} className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full hover:bg-blue-100 transition-colors">
                        <ShoppingCart className="w-5 h-5 text-[#1e88e5]" />
                        <span className="font-bold text-[#1e88e5]">{Object.values(cart).reduce((a, b) => a + b.qty, 0)} Items</span>
                    </button>
                )}
            </div>

            {viewMode === 'list' && (
                <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {meds.map((med, i) => (
                            <div key={i} className="flex items-center justify-between p-4 border border-slate-100 rounded-[16px] hover:border-[#1e88e5] transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className="bg-blue-50 p-2 rounded-xl">
                                        <Pill className="w-6 h-6 text-[#1e88e5]" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-700">{med.name}</h4>
                                        <span className="text-xs text-slate-400">{med.brand}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <span className="font-bold text-[#1e88e5]">₹{med.price}</span>
                                    <button
                                        onClick={() => addToCart(med)}
                                        className="bg-blue-50 text-[#1e88e5] px-4 py-2 rounded-[12px] text-xs font-bold hover:bg-[#1e88e5] hover:text-white transition-colors"
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {viewMode === 'cart' && (
                <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm space-y-6">
                    {Object.values(cart).map((item, i) => (
                        <div key={i} className="flex justify-between items-center border-b border-slate-50 pb-4">
                            <div>
                                <h4 className="font-bold text-slate-700">{item.name}</h4>
                                <span className="text-sm text-slate-400">₹{item.price} x {item.qty}</span>
                            </div>
                            <span className="font-bold text-[#1e88e5]">₹{item.price * item.qty}</span>
                        </div>
                    ))}
                    <div className="flex justify-between items-center text-xl font-bold pt-4">
                        <span>Total:</span>
                        <span className="text-[#1e88e5]">₹{cartTotal}</span>
                    </div>
                    <button onClick={() => setViewMode('checkout')} className="w-full btn-primary py-4 bg-[#1e88e5] text-white rounded-[16px] shadow-lg shadow-blue-200">Proceed to Buy</button>
                </div>
            )}
            {/* Checkout View Simplified */}
            {viewMode === 'checkout' && (
                <div className="text-center p-8 bg-blue-50 rounded-[24px]">
                    <h3 className="text-xl font-bold text-[#1e88e5]">Checkout Flow Placeholder</h3>
                    <button onClick={() => setViewMode('summary')} className="mt-4 bg-[#1e88e5] text-white px-6 py-3 rounded-[16px]">Confirm (Demo)</button>
                </div>
            )}
            {viewMode === 'summary' && (
                <div className="text-center p-8 bg-green-50 rounded-[24px]">
                    <h3 className="text-xl font-bold text-green-600">Order Confirmed!</h3>
                    <button onClick={() => setActiveView('dashboard')} className="mt-4 text-green-700 font-bold underline">Home</button>
                </div>
            )}
        </motion.div>
    );
};

const ReportsView = ({ setActiveView }) => {
    return (
        <div className="bg-white p-8 rounded-[24px] border border-slate-100 shadow-sm text-center">
            <h2 className="text-2xl font-bold text-[#1e88e5] mb-4">Lab Reports</h2>
            <div className="border-2 border-dashed border-slate-200 rounded-[16px] p-12 flex flex-col items-center gap-4">
                <Camera className="w-12 h-12 text-slate-300" />
                <p className="text-slate-400">Upload feature coming soon.</p>
            </div>
            <button onClick={() => setActiveView('dashboard')} className="mt-6 text-[#1e88e5] font-bold">Back</button>
        </div>
    );
};


const CalendarView = ({ onClose, streak }) => {
    const now = new Date();
    const currentMonth = now.toLocaleString('default', { month: 'long' });
    const year = now.getFullYear();
    const daysInMonth = new Date(year, now.getMonth() + 1, 0).getDate();
    const startDay = new Date(year, now.getMonth(), 1).getDay();

    // Generate array for grid: empty slots for startDay + days
    const gridSlots = Array(startDay).fill(null).concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white rounded-[32px] p-8 max-w-md w-full shadow-2xl border border-white/50">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h3 className="text-2xl font-bold text-[#1e88e5]">My Progress</h3>
                        <p className="text-slate-400 text-sm font-medium">Keep it up!</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full text-slate-400 transition-colors">✕</button>
                </div>

                <div className="flex items-center justify-between mb-6 px-2">
                    <button className="p-2 hover:bg-slate-50 rounded-full text-slate-400"><ChevronLeft className="w-5 h-5" /></button>
                    <span className="text-lg font-bold text-slate-700">{currentMonth} {year}</span>
                    <button className="p-2 hover:bg-slate-50 rounded-full text-slate-400"><ChevronRight className="w-5 h-5" /></button>
                </div>

                {/* Professional Calendar Grid - Circular Style */}
                <div className="mb-8">
                    {/* Weekday Headers */}
                    <div className="grid grid-cols-7 mb-4">
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                            <div key={d} className="text-center text-xs font-bold text-slate-400">{d}</div>
                        ))}
                    </div>
                    {/* Days */}
                    <div className="grid grid-cols-7 gap-y-4 gap-x-2">
                        {gridSlots.map((d, i) => (
                            <div key={i} className="flex flex-col items-center justify-center gap-1">
                                {d ? (
                                    <>
                                        <div
                                            className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-semibold transition-all
                                                ${d <= streak
                                                    ? 'bg-[#1e88e5] text-white shadow-md shadow-blue-200'
                                                    : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                                        >
                                            {d}
                                        </div>
                                    </>
                                ) : (
                                    <div className="w-10 h-10"></div> // Spacer
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-[20px] flex items-center gap-4">
                    <div className="bg-[#1e88e5] p-3 rounded-full text-white">
                        <Activity className="w-6 h-6" />
                    </div>
                    <div>
                        <span className="block text-2xl font-bold text-slate-700">{streak} Days</span>
                        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Current Streak</span>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

const HealthyTipsView = () => {
    const tips = [
        { title: 'Morning Warmup', icon: Sun, color: 'text-orange-500', bg: 'bg-orange-50', desc: '15 mins stretching' },
        { title: 'Balanced Diet', icon: Utensils, color: 'text-green-500', bg: 'bg-green-50', desc: 'Protein & Fiber rich' },
        { title: 'Daily Steps', icon: User, color: 'text-blue-500', bg: 'bg-blue-50', desc: 'Goal: 10,000 steps' },
        { title: 'Hydration', icon: Activity, color: 'text-cyan-500', bg: 'bg-cyan-50', desc: '8 glasses of water' },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {tips.map((tip, i) => (
                <div key={i} className="bg-white p-4 rounded-[20px] border border-slate-100 shadow-sm flex flex-col items-center text-center gap-3 hover:shadow-md transition-shadow">
                    <div className={`${tip.bg} p-3 rounded-full`}>
                        <tip.icon className={`w-6 h-6 ${tip.color}`} />
                    </div>
                    <div>
                        <h4 className="font-bold text-[#333333] text-sm">{tip.title}</h4>
                        <span className="text-xs text-slate-400">{tip.desc}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};


// --- Doctor Dashboard ---
const DoctorDashboard = ({ user, logout }) => {
    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-8 font-sans text-[#333333] max-w-7xl mx-auto space-y-8">
            <nav className="flex items-center justify-between bg-white border border-slate-100 shadow-sm p-6 rounded-[24px]">
                <div className="flex items-center gap-4">
                    <div className="bg-blue-50 p-2 rounded-xl">
                        <Activity className="text-[#1e88e5] w-6 h-6" />
                    </div>
                    <span className="text-2xl font-bold tracking-tight text-[#1e88e5]">MediVerse Doc</span>
                </div>
                <div className="flex items-center gap-6">
                    <div className="hidden md:flex flex-col items-end">
                        <span className="text-sm text-slate-400">Doctor</span>
                        <span className="font-semibold text-slate-700">{user?.name}</span>
                    </div>
                    <button onClick={logout} className="p-3 hover:bg-slate-50 rounded-full transition-colors">
                        <LogOut className="w-5 h-5 text-slate-400" />
                    </button>
                </div>
            </nav>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-100">
                    <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-2">Today's Patients</h3>
                    <span className="text-5xl font-bold text-[#1e88e5]">12</span>
                </div>
                <div className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-100">
                    <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-2">Pending Reports</h3>
                    <span className="text-5xl font-bold text-[#1e88e5]">5</span>
                </div>
                <div className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-100">
                    <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-2">Emergency Alerts</h3>
                    <span className="text-5xl font-bold text-red-500">2</span>
                </div>

                <div className="md:col-span-3 bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden p-6">
                    <h3 className="text-xl font-bold text-[#333333] mb-6">Upcoming Appointments</h3>
                    <div className="space-y-4">
                        {[
                            { name: 'John Doe', time: '09:00 AM', type: 'Checkup', status: 'In Progress' },
                            { name: 'Sarah Smith', time: '10:30 AM', type: 'Consultation', status: 'Waiting' },
                            { name: 'Robert Brown', time: '11:15 AM', type: 'Report Review', status: 'Scheduled' },
                        ].map((p, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-[16px] hover:bg-blue-50 transition-colors group">
                                <div className="flex items-center gap-4">
                                    <div className="bg-white p-3 rounded-full shadow-sm text-slate-400 group-hover:text-[#1e88e5]">
                                        <User className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-700 mb-1">{p.name}</h4>
                                        <span className="text-xs bg-white text-slate-500 px-2 py-1 rounded-md font-medium border border-slate-100">{p.type}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="block font-bold text-[#1e88e5] text-lg">{p.time}</span>
                                    <span className="text-xs text-slate-400 font-bold uppercase">{p.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const Home = ({ user, setUser, logout, role }) => {
    const [emergencyData, setEmergencyData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [activeView, setActiveView] = useState('dashboard');
    const [familyMember, setFamilyMember] = useState(null);
    const [showCalendar, setShowCalendar] = useState(false);
    const [editFamily, setEditFamily] = useState(false);
    const [inputFamily, setInputFamily] = useState({ name: '', phone: '' });

    useEffect(() => {
        const savedFam = localStorage.getItem('mediverse_family');
        if (savedFam) {
            setFamilyMember(JSON.parse(savedFam));
            setInputFamily(JSON.parse(savedFam));
        }

        const savedEmergency = localStorage.getItem('mediverse_emergency');
        if (savedEmergency) {
            setEmergencyData(JSON.parse(savedEmergency));
        }
    }, []);

    const saveFamilyMember = () => {
        localStorage.setItem('mediverse_family', JSON.stringify(inputFamily));
        setFamilyMember(inputFamily);
        setEditFamily(false);
    };

    const handleEmergency = async () => {
        console.log("Starting Emergency Trigger...");
        if (!familyMember) {
            alert("Please add a Family Member first!");
            return;
        }
        if (!window.confirm(`🚨 DISPATCHING AMBULANCE & NOTIFYING ${familyMember.name} (${familyMember.phone}).`)) return;

        setLoading(true);
        try {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    console.log("Got Location:", position.coords);
                    try {
                        const res = await emergencyService.trigger(user.id, { lat: position.coords.latitude, lng: position.coords.longitude });
                        console.log("Emergency Response:", res);
                        setEmergencyData(res);
                        localStorage.setItem('mediverse_emergency', JSON.stringify(res));
                    } catch (e) {
                        console.error("Emergency API Error:", e);
                        alert('Emergency Signal Failed. Calling 911...');
                    }
                    finally { setLoading(false); }
                },
                async (err) => {
                    console.warn("Geolocation denied/failed, using fallback:", err);
                    try {
                        const res = await emergencyService.trigger(user.id, { lat: 28.0, lng: 77.0 });
                        setEmergencyData(res);
                        localStorage.setItem('mediverse_emergency', JSON.stringify(res));
                    } catch (e) {
                        console.error("Fallback Emergency API Error:", e);
                        alert('Emergency Signal Failed. Calling 911...');
                    }
                    setLoading(false);
                }
            );
        } catch (err) {
            console.error("Unexpected Error:", err);
            setLoading(false);
        }
    };

    const clearEmergency = () => {
        setEmergencyData(null);
        localStorage.removeItem('mediverse_emergency');
    };

    const updateStreak = async () => {
        const lastDate = localStorage.getItem('last_streak_date');
        const today = new Date().toISOString().split('T')[0];

        if (lastDate === today) {
            alert("You have already marked your dose for today!");
            return;
        }

        const updated = { ...user, streak: (user.streak || 0) + 1 };
        try {
            setUser(updated);
            localStorage.setItem('mediverse_user', JSON.stringify(updated));
            localStorage.setItem('last_streak_date', today);
            await patientService.updateData(updated);
        } catch (err) { console.error(err); }
    };

    if (role === 'doctor') {
        return <DoctorDashboard user={user} logout={logout} />;
    }

    return (
        <div className="min-h-screen bg-white text-[#333333] font-sans p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
            <nav className="flex items-center justify-between bg-white border border-slate-100 shadow-sm p-6 rounded-[24px]">
                <div className="flex items-center gap-4">
                    <div className="bg-[#1e88e5]/10 p-2 rounded-xl">
                        <Heart className="text-[#1e88e5] w-6 h-6" fill="currentColor" />
                    </div>
                    <span className="text-2xl font-bold tracking-tight text-[#1e88e5]">MediVerse</span>
                </div>
                <div className="flex items-center gap-6">
                    <div className="hidden md:flex flex-col items-end">
                        <span className="text-sm text-slate-400">Welcome,</span>
                        <span className="font-semibold text-slate-700">{user?.name}</span>
                    </div>
                    <button onClick={logout} className="p-3 hover:bg-slate-50 rounded-full transition-colors">
                        <LogOut className="w-5 h-5 text-slate-400" />
                    </button>
                </div>
            </nav>

            {activeView === 'booking' ? <BookingView setActiveView={setActiveView} user={user} /> :
                activeView === 'pharmacy' ? <PharmacyView setActiveView={setActiveView} /> :
                    activeView === 'reports' ? <ReportsView setActiveView={setActiveView} /> :
                        activeView === 'history' ? <div onClick={() => setActiveView('dashboard')}>History Placeholder (Back)</div> :
                            (
                                <div className="space-y-8">
                                    <motion.div
                                        whileHover={{ scale: 1.01 }}
                                        className="w-full bg-[#1e88e5] text-white p-8 rounded-[24px] shadow-lg shadow-blue-200 relative overflow-hidden flex flex-col md:flex-row items-center justify-between"
                                    >
                                        <div className="relative z-10 space-y-4">
                                            <div>
                                                <p className="text-blue-100 font-medium mb-1">Daily Health Streak</p>
                                                <h1 className="text-5xl font-bold mb-2">{user?.streak || 0} Days</h1>
                                                <p className="text-blue-100 text-sm">Keep going! Consistency is key.</p>
                                            </div>
                                            <div className="flex gap-4">
                                                <button
                                                    onClick={updateStreak}
                                                    className="bg-white text-[#1e88e5] px-6 py-3 rounded-[16px] font-bold flex items-center gap-2 hover:bg-blue-50 transition-colors shadow-md"
                                                >
                                                    <ShieldCheck className="w-5 h-5" />
                                                    Mark Today
                                                </button>
                                                <button
                                                    onClick={() => setShowCalendar(true)}
                                                    className="bg-[#1565c0] text-white px-6 py-3 rounded-[16px] font-bold hover:bg-[#0d47a1] transition-colors"
                                                >
                                                    My Progress
                                                </button>
                                            </div>
                                        </div>
                                        <Activity className="w-48 h-48 text-white/10 absolute -right-8 -bottom-8" />
                                    </motion.div>

                                    {/* Healthy Tips Section */}
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-700 mb-4 px-2">Healthy Habits</h3>
                                        <HealthyTipsView />
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                        <div className="lg:col-span-2 space-y-8">
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                {[
                                                    { icon: Calendar, label: 'Book Visit', color: 'text-[#1e88e5]', bg: 'bg-blue-50', action: 'booking' },
                                                    { icon: Pill, label: 'Pharmacy', color: 'text-[#1e88e5]', bg: 'bg-blue-50', action: 'pharmacy' },
                                                    { icon: History, label: 'History', color: 'text-[#1e88e5]', bg: 'bg-blue-50', action: 'history' },
                                                    { icon: Plus, label: 'Reports', color: 'text-[#1e88e5]', bg: 'bg-blue-50', action: 'reports' },
                                                ].map((item, i) => (
                                                    <motion.button
                                                        key={i}
                                                        onClick={() => item.action && setActiveView(item.action)}
                                                        whileHover={{ y: -2 }}
                                                        className="bg-white border border-slate-100 p-6 rounded-[24px] shadow-sm flex flex-col items-center gap-3 hover:shadow-md transition-all group"
                                                    >
                                                        <div className={`${item.bg} p-4 rounded-full group-hover:scale-110 transition-transform`}>
                                                            <item.icon className={`w-6 h-6 ${item.color}`} />
                                                        </div>
                                                        <span className="text-sm font-bold text-slate-600 group-hover:text-[#1e88e5]">{item.label}</span>
                                                    </motion.button>
                                                ))}
                                            </div>

                                            <section className="bg-white border border-slate-100 p-6 rounded-[24px] shadow-sm">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h3 className="text-lg font-bold text-slate-700">Family Emergency Contact</h3>
                                                    {familyMember && !editFamily && (
                                                        <button onClick={() => setEditFamily(true)} className="text-[#1e88e5] text-sm font-bold flex items-center gap-1">
                                                            <Edit2 className="w-4 h-4" /> Edit
                                                        </button>
                                                    )}
                                                </div>

                                                {(!familyMember || editFamily) ? (
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                                                        <div className="space-y-1">
                                                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Name</label>
                                                            <input
                                                                className="input-field border-slate-200 focus:border-[#1e88e5] focus:ring-[#1e88e5]/20 rounded-[12px]"
                                                                value={inputFamily.name}
                                                                onChange={e => setInputFamily({ ...inputFamily, name: e.target.value })}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Phone</label>
                                                            <input
                                                                className="input-field border-slate-200 focus:border-[#1e88e5] focus:ring-[#1e88e5]/20 rounded-[12px]"
                                                                value={inputFamily.phone}
                                                                onChange={e => setInputFamily({ ...inputFamily, phone: e.target.value })}
                                                            />
                                                        </div>
                                                        <button onClick={saveFamilyMember} className="btn-primary py-3 text-sm bg-[#1e88e5] hover:bg-blue-600 shadow-md shadow-blue-200">Save Contact</button>
                                                    </div>
                                                ) : (
                                                    <div className="bg-slate-50 p-4 rounded-[20px] flex items-center gap-4 border border-slate-100">
                                                        <div className="bg-blue-100 p-3 rounded-full">
                                                            <User className="w-6 h-6 text-[#1e88e5]" />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-slate-700">{familyMember.name}</h4>
                                                            <p className="text-sm text-slate-400">{familyMember.phone}</p>
                                                        </div>
                                                        <span className="ml-auto text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold">Active</span>
                                                    </div>
                                                )}
                                            </section>
                                        </div>

                                        <div className="space-y-6">
                                            <motion.div
                                                whileHover={{ scale: 1.02 }}
                                                className="bg-white border-2 border-red-50 p-8 rounded-[24px] shadow-lg relative overflow-hidden group"
                                            >
                                                <div className="relative z-10 text-center">
                                                    <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                                        <AlertTriangle className="text-red-500 w-10 h-10" />
                                                    </div>
                                                    <h2 className="text-2xl font-bold mb-2 text-slate-700">Medical Emergency?</h2>
                                                    <p className="text-slate-400 text-sm mb-6">Press below to alert nearby ambulances immediately.</p>
                                                    <button
                                                        onClick={handleEmergency}
                                                        disabled={loading}
                                                        className="bg-red-500 hover:bg-red-600 text-white w-full py-5 rounded-[20px] font-bold text-lg flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-red-500/30"
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
                                                        className="bg-white border-2 border-[#1e88e5] p-6 rounded-[24px] shadow-xl"
                                                    >
                                                        <div className="flex items-center gap-3 mb-4">
                                                            <div className="bg-blue-50 p-3 rounded-xl">
                                                                <Ambulance className="w-6 h-6 text-[#1e88e5]" />
                                                            </div>
                                                            <div>
                                                                <h4 className="font-bold text-slate-700">Ambulance En Route</h4>
                                                                <span className="text-xs text-slate-400">Tracking ID: #{emergencyData.requestId || 'SOS-8892'}</span>
                                                            </div>
                                                        </div>

                                                        <div className="space-y-4">
                                                            <div className="flex justify-between items-end">
                                                                <span className="text-slate-400 text-sm">Estimated Arrival</span>
                                                                <span className="text-2xl font-bold text-[#1e88e5]">{emergencyData.ambulance.eta}</span>
                                                            </div>
                                                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                                                <div className="bg-[#1e88e5] h-full w-[60%] animate-pulse"></div>
                                                            </div>

                                                            <div className="bg-slate-50 p-4 rounded-[20px] space-y-2">
                                                                <div className="flex items-center gap-3 text-sm">
                                                                    <MapPin className="w-4 h-4 text-slate-400" />
                                                                    <span className="font-medium text-slate-600">{emergencyData.hospital.name}</span>
                                                                </div>
                                                                <div className="flex items-center gap-3 text-sm">
                                                                    <User className="w-4 h-4 text-slate-400" />
                                                                    <span className="text-slate-600">Driver: {emergencyData.ambulance.driver_name}</span>
                                                                </div>
                                                            </div>

                                                            <button
                                                                onClick={clearEmergency}
                                                                className="w-full py-3 text-slate-400 text-sm font-bold hover:text-slate-600 border border-slate-200 rounded-[16px] transition-colors hover:bg-slate-50"
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

            {showCalendar && <CalendarView onClose={() => setShowCalendar(false)} streak={user?.streak || 0} />}
        </div>
    );
};

export default Home;
