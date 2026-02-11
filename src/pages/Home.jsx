import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import {
    Heart, Activity, Calendar, Plus, PhoneCall,
    History, User, AlertTriangle, Ambulance,
    MapPin, Clock, LogOut, ArrowLeft, Search, Pill, ShoppingCart, CheckCircle, CreditCard, Truck, Camera, Edit2,
    Utensils, Sun, Package, FileText, Upload, ChevronRight, Video
} from 'lucide-react';
import { emergencyService } from '../services/api';

// --- Shared Components ---

const Header = ({ user, logout, role }) => (
    <div className="bg-primary pt-8 pb-12 px-6 rounded-b-[2.5rem] shadow-lg mb-8 relative z-10">
        <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3 text-white">
                <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                    <User className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-blue-100 text-xs font-medium uppercase tracking-wider">{role === 'doctor' ? 'Doctor' : 'Patient'}</p>
                    <h1 className="font-bold text-lg leading-tight">{user?.name || 'Guest'}</h1>
                </div>
            </div>
            <button onClick={logout} className="bg-white/10 p-2 rounded-full text-white hover:bg-white/20 transition-colors">
                <LogOut className="w-5 h-5" />
            </button>
        </div>

        {role === 'patient' && (
            <div className="bg-white rounded-full p-3 flex items-center shadow-lg transform translate-y-2">
                <Search className="text-gray-400 w-5 h-5 ml-2" />
                <input
                    type="text"
                    placeholder="Search doctors, medicines, etc."
                    className="w-full ml-3 outline-none text-gray-700 placeholder-gray-400 text-sm font-medium"
                />
            </div>
        )}
    </div>
);

const SectionTitle = ({ title, action }) => (
    <div className="flex justify-between items-end mb-4 px-2">
        <h2 className="text-xl font-bold text-slate-800">{title}</h2>
        {action && <button className="text-primary text-sm font-bold hover:underline">{action}</button>}
    </div>
);

// --- Sub-Views ---

const BookingView = ({ setActiveView }) => {
    const [step, setStep] = useState(1);
    const [booking, setBooking] = useState({ hospital: '', department: 'General Medicine', date: '', slot: '', reason: '' });

    const [tokenId, setTokenId] = useState(null);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setTokenId(Math.floor(Math.random() * 10000));
    }, []);

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
            <div className="flex items-center gap-4 mb-2 px-2">
                <button onClick={() => setActiveView('dashboard')} className="p-2 -ml-2 hover:bg-slate-100 rounded-full transition-colors">
                    <ArrowLeft className="w-6 h-6 text-slate-700" />
                </button>
                <h2 className="text-2xl font-bold text-slate-800">Book Appointment</h2>
            </div>

            {step === 1 ? (
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-500 ml-1">Select Hospital</label>
                            <select
                                className="w-full bg-slate-50 border-none p-4 rounded-2xl text-slate-700 font-medium focus:ring-2 focus:ring-primary/20"
                                value={booking.hospital}
                                onChange={e => setBooking({ ...booking, hospital: e.target.value })}
                            >
                                <option value="">-- Choose Hospital --</option>
                                {hospitals.map(h => <option key={h} value={h}>{h}</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-500 ml-1">Department</label>
                            <select
                                className="w-full bg-slate-50 border-none p-4 rounded-2xl text-slate-700 font-medium focus:ring-2 focus:ring-primary/20"
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
                            <label className="text-sm font-bold text-slate-500 ml-1">Preferred Date</label>
                            <input
                                type="date"
                                className="w-full bg-slate-50 border-none p-4 rounded-2xl text-slate-700 font-medium focus:ring-2 focus:ring-primary/20"
                                value={booking.date}
                                onChange={e => setBooking({ ...booking, date: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-500 ml-1">Available Slots</label>
                            <div className="grid grid-cols-3 gap-3">
                                {slots.map(slot => (
                                    <button
                                        key={slot}
                                        onClick={() => setBooking({ ...booking, slot })}
                                        className={`py-3 px-2 rounded-2xl text-xs font-bold transition-all ${booking.slot === slot
                                            ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                            : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                                            }`}
                                    >
                                        {slot}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <button onClick={handleBook} className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-primary/30 hover:bg-primary-dark transition-all">
                        Confirm Booking
                    </button>
                </div>
            ) : (
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white p-8 rounded-3xl text-center space-y-6 shadow-sm border border-slate-100"
                >
                    <div className="bg-green-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-12 h-12 text-green-500" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-slate-800 mb-2">Booking Confirmed!</h3>
                        <p className="text-slate-500">Your appointment is scheduled.</p>
                    </div>

                    <div className="bg-slate-50 p-6 rounded-2xl text-left space-y-4">
                        <div className="flex justify-between border-b border-slate-200 pb-3">
                            <span className="text-slate-400 font-medium text-sm">Hospital</span>
                            <span className="font-bold text-slate-700 text-sm">{booking.hospital}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-200 pb-3">
                            <span className="text-slate-400 font-medium text-sm">Date & Time</span>
                            <span className="font-bold text-slate-700 text-sm">{booking.date} at {booking.slot}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400 font-medium text-sm">Token ID</span>
                            <span className="font-bold text-primary text-sm">#MV-{tokenId}</span>
                        </div>
                    </div>
                    <button onClick={() => setActiveView('dashboard')} className="w-full py-4 text-slate-500 font-bold hover:bg-slate-50 rounded-2xl transition-all">Return to Dashboard</button>
                </motion.div>
            )}
        </motion.div>
    );
};

const OrderTracking = ({ setActiveView }) => {
    const steps = [
        { status: 'Order Placed', time: '10:30 AM', active: true, icon: CheckCircle },
        { status: 'Packed', time: '11:45 AM', active: true, icon: Package },
        { status: 'Shipped', time: '02:15 PM', active: false, icon: Truck },
        { status: 'Delivered', time: 'Estimated 05:00 PM', active: false, icon: MapPin },
    ];

    return (
        <div className="space-y-6">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <h3 className="text-xl font-bold text-slate-800 mb-8">Track Order #MED-8892</h3>
                <div className="relative space-y-8 pl-8 border-l-2 border-slate-100 ml-4">
                    {steps.map((step, i) => (
                        <div key={i} className="relative">
                            <div className={`absolute -left-[41px] w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-sm ${step.active ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'}`}>
                                <step.icon className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className={`font-bold ${step.active ? 'text-slate-700' : 'text-slate-400'}`}>{step.status}</h4>
                                <p className="text-xs text-slate-400">{step.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <button onClick={() => setActiveView('dashboard')} className="w-full py-4 text-primary font-bold hover:bg-blue-50 rounded-2xl transition-colors">
                Back to Home
            </button>
        </div>
    );
};

const PharmacyView = ({ setActiveView }) => {
    const [viewMode, setViewMode] = useState('list');
    const [cart, setCart] = useState({});
    const [shipping, setShipping] = useState({ name: '', address: '', city: '', zip: '', phone: '' });
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '', name: '' });

    const meds = [
        { name: 'Paracetamol 500mg', brand: 'Dolo', price: 30 },
        { name: 'Vitamin C', brand: 'Limcee', price: 25 },
        { name: 'Cough Syrup', brand: 'Benadryl', price: 120 },
        { name: 'Amoxicillin', brand: 'Mox', price: 85 },
        { name: 'Pain Relief Gel', brand: 'Volini', price: 150 },
        { name: 'Bandages', brand: 'Hansaplast', price: 10 },
    ];

    const addToCart = (med) => {
        setCart(prev => ({ ...prev, [med.name]: { ...med, qty: (prev[med.name]?.qty || 0) + 1 } }));
    };

    const cartTotal = Object.values(cart).reduce((sum, item) => sum + (item.price * item.qty), 0);
    const tax = Math.round(cartTotal * 0.18);
    const shippingCost = cartTotal > 500 ? 0 : 40;
    const finalTotal = cartTotal + tax + shippingCost;

    const handleCheckout = () => {
        if (!shipping.name || !shipping.address) { alert("Please fill details."); return; }
        setViewMode('payment');
    };

    const handlePayment = () => {
        setTimeout(() => setViewMode('tracking'), 1500);
    };

    if (viewMode === 'tracking') return <OrderTracking setActiveView={setActiveView} />;

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex items-center justify-between mb-2 px-2">
                <div className="flex items-center gap-4">
                    <button onClick={() => {
                        if (viewMode === 'list') setActiveView('dashboard');
                        else if (viewMode === 'cart') setViewMode('list');
                        else if (viewMode === 'checkout') setViewMode('cart');
                        else if (viewMode === 'payment') setViewMode('checkout');
                    }} className="p-2 -ml-2 hover:bg-slate-100 rounded-full transition-colors">
                        <ArrowLeft className="w-6 h-6 text-slate-700" />
                    </button>
                    <h2 className="text-2xl font-bold text-slate-800">
                        {viewMode === 'list' ? 'Pharmacy' : viewMode === 'cart' ? 'Cart' : 'Checkout'}
                    </h2>
                </div>
                {viewMode === 'list' && (
                    <button onClick={() => setViewMode('cart')} className="relative p-3 bg-white rounded-full shadow-sm">
                        <ShoppingCart className="w-5 h-5 text-primary" />
                        {Object.values(cart).length > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold">{Object.values(cart).reduce((a, b) => a + b.qty, 0)}</span>}
                    </button>
                )}
            </div>

            {viewMode === 'list' && (
                <div className="grid grid-cols-2 gap-4">
                    {meds.map((med, i) => (
                        <div key={i} className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between h-40">
                            <div>
                                <div className="bg-blue-50 w-10 h-10 rounded-full flex items-center justify-center mb-3">
                                    <Pill className="w-5 h-5 text-primary" />
                                </div>
                                <h4 className="font-bold text-slate-700 leading-tight">{med.name}</h4>
                                <span className="text-xs text-slate-400">{med.brand}</span>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                                <span className="font-bold text-slate-800">₹{med.price}</span>
                                <button onClick={() => addToCart(med)} className="bg-primary text-white p-2 rounded-xl shadow-lg shadow-primary/20">
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {viewMode === 'cart' && (
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-6">
                    {Object.values(cart).map((item, i) => (
                        <div key={i} className="flex justify-between items-center border-b border-slate-50 pb-4">
                            <div>
                                <h4 className="font-bold text-slate-700">{item.name}</h4>
                                <span className="text-xs text-slate-400">₹{item.price} x {item.qty}</span>
                            </div>
                            <span className="font-bold text-primary">₹{item.price * item.qty}</span>
                        </div>
                    ))}
                    <div className="pt-2">
                        <div className="flex justify-between text-lg font-bold">
                            <span>Total</span>
                            <span className="text-primary">₹{finalTotal}</span>
                        </div>
                    </div>
                    <button onClick={() => setViewMode('checkout')} className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-primary/30">Proceed to Buy</button>
                </div>
            )}

            {viewMode === 'checkout' && (
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-4">
                    <h3 className="font-bold text-slate-700">Shipping Details</h3>
                    <input className="w-full bg-slate-50 p-4 rounded-2xl" placeholder="Full Name" value={shipping.name} onChange={e => setShipping({ ...shipping, name: e.target.value })} />
                    <input className="w-full bg-slate-50 p-4 rounded-2xl" placeholder="Address" value={shipping.address} onChange={e => setShipping({ ...shipping, address: e.target.value })} />
                    <button onClick={handleCheckout} className="w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-lg shadow-primary/30 mt-4">Continue</button>
                </div>
            )}

            {viewMode === 'payment' && (
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-6">
                    <h3 className="font-bold text-slate-700">Payment</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <button onClick={() => setPaymentMethod('cod')} className={`p-4 rounded-2xl border font-bold text-sm ${paymentMethod === 'cod' ? 'border-primary bg-blue-50 text-primary' : 'border-slate-100 text-slate-400'}`}>COD</button>
                        <button onClick={() => setPaymentMethod('card')} className={`p-4 rounded-2xl border font-bold text-sm ${paymentMethod === 'card' ? 'border-primary bg-blue-50 text-primary' : 'border-slate-100 text-slate-400'}`}>Card</button>
                    </div>
                    <button onClick={handlePayment} className="w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-lg shadow-primary/30">Pay ₹{finalTotal}</button>
                </div>
            )}
        </motion.div>
    );
};

const ReportsView = ({ setActiveView }) => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState(null);

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected) {
            setFile(selected);
            setPreview(URL.createObjectURL(selected));
            setResult(null);
        }
    };

    const handleUpload = () => {
        if (!file) return;
        setAnalyzing(true);
        setTimeout(() => {
            setAnalyzing(false);
            setResult({
                status: 'Normal',
                summary: 'All vital parameters appear to be within healthy ranges.',
                date: new Date().toLocaleDateString()
            });
        }, 2000);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 mb-2 px-2">
                <button onClick={() => setActiveView('dashboard')} className="p-2 -ml-2 hover:bg-slate-100 rounded-full transition-colors">
                    <ArrowLeft className="w-6 h-6 text-slate-700" />
                </button>
                <h2 className="text-2xl font-bold text-slate-800">Lab Reports</h2>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-dashed border-slate-300 text-center hover:bg-slate-50 transition-colors relative cursor-pointer">
                {!preview ? (
                    <>
                        <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                        <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Camera className="w-8 h-8 text-primary" />
                        </div>
                        <p className="font-bold text-slate-700">Tap to Upload Report</p>
                        <p className="text-xs text-slate-400">JPG, PNG (Max 5MB)</p>
                    </>
                ) : (
                    <div className="space-y-4">
                        <img src={preview} alt="Preview" className="w-full h-48 object-cover rounded-2xl" />
                        {!result && <button onClick={handleUpload} disabled={analyzing} className="w-full bg-primary text-white py-3 rounded-2xl font-bold shadow-lg shadow-primary/30">{analyzing ? 'Analyzing...' : 'Analyze Now'}</button>}
                    </div>
                )}
            </div>

            {result && (
                <div className="bg-green-50 p-6 rounded-3xl border border-green-100">
                    <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <h3 className="font-bold text-green-800">Analysis Complete</h3>
                    </div>
                    <p className="text-sm text-green-700">{result.summary}</p>
                </div>
            )}
        </div>
    );
};

const HealthyTipsView = ({ handleHealthyHabit }) => (
    <div className="grid grid-cols-2 gap-4">
        {[
            { title: 'Morning Warmup', icon: Sun, color: 'text-orange-500', bg: 'bg-orange-50' },
            { title: 'Balanced Diet', icon: Utensils, color: 'text-green-500', bg: 'bg-green-50' },
            { title: 'Hydration', icon: Activity, color: 'text-primary', bg: 'bg-blue-50' },
            { title: 'Sleep Well', icon: User, color: 'text-purple-500', bg: 'bg-purple-50' },
        ].map((tip, i) => (
            <div key={i} onClick={() => handleHealthyHabit(tip)} className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-3 cursor-pointer hover:bg-slate-50 transition-colors">
                <div className={`${tip.bg} p-3 rounded-full`}>
                    <tip.icon className={`w-5 h-5 ${tip.color}`} />
                </div>
                <span className="font-bold text-sm text-slate-700 leading-tight">{tip.title}</span>
            </div>
        ))}
    </div>
);


// --- Dashboards ---

const DoctorDashboard = ({ user, logout }) => {
    return (
        <div className="min-h-screen app-container">
            <Header user={user} logout={logout} role="doctor" />
            <div className="px-6 -mt-6 relative z-20 space-y-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { label: 'Patients', count: '12', color: 'text-primary' },
                        { label: 'Pending', count: '5', color: 'text-orange-500' },
                        { label: 'Alerts', count: '2', color: 'text-red-500' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white p-4 rounded-2xl shadow-sm flex flex-col items-center justify-center h-28">
                            <span className={`text-3xl font-bold ${stat.color}`}>{stat.count}</span>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">{stat.label}</span>
                        </div>
                    ))}
                </div>

                {/* Appointments List */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b border-slate-50">
                        <SectionTitle title="Today's Appointments" />
                    </div>
                    <div className="divide-y divide-slate-50">
                        {[
                            { name: 'John Doe', time: '09:00 AM', tag: 'Checkup' },
                            { name: 'Sarah Smith', time: '10:30 AM', tag: 'Consultation' },
                            { name: 'Robert Brown', time: '11:15 AM', tag: 'Report' },
                        ].map((p, i) => (
                            <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="bg-slate-100 p-3 rounded-full text-slate-400">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-700">{p.name}</h4>
                                        <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md font-medium">{p.tag}</span>
                                    </div>
                                </div>
                                <span className="font-bold text-primary text-sm">{p.time}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};



const PatientDashboard = ({ user, logout, activeView, setActiveView, emergencyData, handleEmergency, handleVideoCall, loading, familyMember, setEditFamily, inputFamily, setInputFamily, saveFamilyMember, editFamily, smartwatchConnected, connectSmartwatch, healthMetrics, handleHealthyHabit }) => {
    if (activeView !== 'dashboard') {

        return (
            <div className="min-h-screen app-container p-6 bg-slate-50">
                {activeView === 'booking' ? <BookingView setActiveView={setActiveView} /> :
                    activeView === 'pharmacy' ? <PharmacyView setActiveView={setActiveView} /> :
                        <ReportsView setActiveView={setActiveView} />}
            </div>
        );
    }

    return (
        <div className="min-h-screen app-container bg-slate-50">
            <Header user={user} logout={logout} role="patient" />


            <div className="px-6 -mt-6 relative z-20 space-y-8 pb-12">
                {/* Hero Feature Cards */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-5 rounded-3xl shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => setActiveView('booking')}>
                        <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                            <User className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="font-bold text-slate-800 leading-tight">Physical<br />Appointment</h3>
                        <p className="text-xs text-slate-400 mt-2">At Hospital</p>
                    </div>

                    <div className="bg-white p-5 rounded-3xl shadow-sm hover:shadow-md transition-shadow cursor-pointer relative overflow-hidden" onClick={handleVideoCall}>
                        <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-xl">FAST</div>
                        <div className="bg-purple-50 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                            <Video className="w-6 h-6 text-purple-600" />
                        </div>
                        <h3 className="font-bold text-slate-800 leading-tight">Instant Video<br />Consult</h3>
                        <p className="text-xs text-slate-400 mt-2">Connect in 2 mins</p>
                    </div>


                    {/* Connect Smartwatch Card - NEW */}
                    <div className={`p-5 rounded-3xl shadow-sm hover:shadow-md transition-shadow cursor-pointer col-span-2 flex items-center justify-between ${smartwatchConnected ? 'bg-slate-900 border border-slate-700' : 'bg-white'}`} onClick={connectSmartwatch}>
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${smartwatchConnected ? 'bg-green-500/20' : 'bg-slate-900'}`}>
                                <Activity className={`w-6 h-6 ${smartwatchConnected ? 'text-green-400' : 'text-green-400'}`} />
                            </div>
                            <div>
                                <h3 className={`font-bold leading-tight ${smartwatchConnected ? 'text-white' : 'text-slate-800'}`}>
                                    {smartwatchConnected ? 'Galaxy Watch 6' : 'Connect Smartwatch'}
                                </h3>
                                <p className={`text-xs ${smartwatchConnected ? 'text-slate-400' : 'text-slate-400'}`}>
                                    {smartwatchConnected ? 'Live: 72 BPM | 120/80' : 'Sync health data'}
                                </p>
                            </div>
                        </div>
                        {smartwatchConnected ? (
                            <div className="flex gap-4 text-white text-xs">
                                <div className="text-center">
                                    <span className="block font-bold text-lg text-red-400">{healthMetrics?.bpm || 72}</span>
                                    <span className="text-slate-500">BPM</span>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-slate-100 p-2 rounded-full">
                                <Plus className="w-5 h-5 text-slate-600" />
                            </div>
                        )}
                    </div>





                </div>

                {/* Services Row */}
                <div>
                    <SectionTitle title="Services" />
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-white p-4 rounded-3xl shadow-sm flex flex-col items-center gap-2 cursor-pointer" onClick={() => setActiveView('pharmacy')}>
                            <div className="bg-orange-50 p-3 rounded-full"><Pill className="text-orange-500 w-6 h-6" /></div>
                            <span className="text-xs font-bold text-slate-700">Medicines</span>
                        </div>
                        <div className="bg-white p-4 rounded-3xl shadow-sm flex flex-col items-center gap-2 cursor-pointer" onClick={() => setActiveView('reports')}>
                            <div className="bg-blue-50 p-3 rounded-full"><FileText className="text-primary w-6 h-6" /></div>
                            <span className="text-xs font-bold text-slate-700">Lab Reports</span>
                        </div>
                        <div className="bg-white p-4 rounded-3xl shadow-sm flex flex-col items-center gap-2 cursor-pointer">
                            <div className="bg-red-50 p-3 rounded-full"><Activity className="text-red-500 w-6 h-6" /></div>
                            <span className="text-xs font-bold text-slate-700">Surgeries</span>
                        </div>
                    </div>
                </div>

                {/* Emergency Card - Prominent */}
                <div className="bg-red-500 rounded-3xl p-6 text-white shadow-xl shadow-red-500/20 relative overflow-hidden">
                    <div className="absolute -right-5 -top-5 w-24 h-24 bg-white/20 rounded-full blur-2xl"></div>
                    <div className="relative z-10 flex justify-between items-center">
                        <div className="w-full">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-xl">Emergency?</h3>
                                {familyMember && !editFamily && (
                                    <button onClick={() => setEditFamily(true)} className="text-xs bg-white/20 px-2 py-1 rounded-lg hover:bg-white/30 transition-colors">
                                        Edit Contact
                                    </button>
                                )}
                            </div>

                            {!familyMember || editFamily ? (
                                <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm space-y-3 mt-2">
                                    <p className="text-xs font-medium text-red-100">Setup Family Contact for SOS</p>
                                    <input
                                        placeholder="Contact Name"
                                        className="w-full bg-white/90 text-slate-800 text-sm p-3 rounded-xl placeholder:text-slate-400 outline-none"
                                        value={inputFamily.name}
                                        onChange={e => setInputFamily({ ...inputFamily, name: e.target.value })}
                                    />
                                    <input
                                        placeholder="Phone Number"
                                        className="w-full bg-white/90 text-slate-800 text-sm p-3 rounded-xl placeholder:text-slate-400 outline-none"
                                        value={inputFamily.phone}
                                        onChange={e => setInputFamily({ ...inputFamily, phone: e.target.value })}
                                    />
                                    <button
                                        onClick={saveFamilyMember}
                                        className="w-full bg-white text-red-600 font-bold py-3 rounded-xl text-sm shadow-sm hover:bg-red-50 transition-colors"
                                    >
                                        Save Contact
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <p className="text-red-100 text-xs mb-4">Notify {familyMember.name} & Dispatch Ambulance</p>
                                    <button
                                        onClick={handleEmergency}
                                        disabled={loading}
                                        className="bg-white text-red-600 px-6 py-3 rounded-xl font-bold text-sm shadow-sm w-full flex items-center justify-center gap-2 hover:bg-red-50 transition-colors"
                                    >
                                        <PhoneCall className="w-4 h-4 animate-pulse" />
                                        {loading ? 'Dispatching...' : 'Tap for SOS'}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                {/* Emergency Status */}
                <AnimatePresence>
                    {emergencyData && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-3xl shadow-xl border-2 border-primary">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="bg-blue-50 p-2 rounded-full"><Ambulance className="w-6 h-6 text-primary" /></div>
                                <div>
                                    <h4 className="font-bold text-slate-800">Ambulance Dispatched</h4>
                                    <p className="text-xs text-slate-500">ETA: {emergencyData.ambulance?.eta || '10 mins'}</p>
                                </div>
                            </div>
                            <div className="h-1 bg-slate-100 rounded-full w-full overflow-hidden">
                                <div className="h-full bg-primary w-2/3 animate-pulse"></div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>


                {/* Tips */}
                <div id="healthy-habits">
                    <SectionTitle title="Healthy Habits" />
                    <HealthyTipsView handleHealthyHabit={handleHealthyHabit} />
                </div>

            </div>
        </div>
    );
};

// --- Main Container ---

const Home = ({ user, logout, role }) => {
    const [emergencyData, setEmergencyData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [activeView, setActiveView] = useState('dashboard');
    const [familyMember, setFamilyMember] = useState(null);
    const [editFamily, setEditFamily] = useState(false);
    const [inputFamily, setInputFamily] = useState({ name: '', phone: '' });


    const [smartwatchConnected, setSmartwatchConnected] = useState(false);
    const [healthMetrics, setHealthMetrics] = useState(null);

    useEffect(() => {
        const savedFam = localStorage.getItem('mediverse_family');
        if (savedFam) {
            setFamilyMember(JSON.parse(savedFam));
            setInputFamily(JSON.parse(savedFam));
        }
        // Always show edit if no family member, OR if explicit edit requested
        if (!savedFam) {
            setEditFamily(true);
        }

        const savedEmergency = localStorage.getItem('mediverse_emergency');
        if (savedEmergency) {
            setEmergencyData(JSON.parse(savedEmergency));
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps


    const connectSmartwatch = () => {
        const confirmConnect = window.confirm("Search for nearby Smartwatch?");
        if (!confirmConnect) return;

        alert("Scanning for devices...");
        setTimeout(() => {
            setSmartwatchConnected(true);
            setHealthMetrics({
                bpm: '72',
                bp: '120/80',
                steps: '4,500'
            });
            alert("Connected to 'Galaxy Watch 6'!");
        }, 2000);
    };

    const handleHealthyHabit = (tip) => {
        // Mock data from "internet"
        const details = {
            'Morning Warmup': "Do 10 mins of stretching: Neck rolls, arm circles, and touching toes. It improves blood flow!",
            'Balanced Diet': "Eat a rainbow! Include spinach, carrots, and berries. Avoid processed sugar.",
            'Hydration': "Drink at least 8 glasses (2 liters) of water daily. Keep a bottle near your desk.",
            'Sleep Well': "Avoid screens 1 hour before bed. Try reading a book for deep REM sleep."
        };
        alert(`${tip.title} Tip:\n\n${details[tip.title] || "Stay consistent for best results!"}`);
    };



    const saveFamilyMember = () => {
        if (!inputFamily.name || !inputFamily.phone) return alert("Please fill details");
        localStorage.setItem('mediverse_family', JSON.stringify(inputFamily));
        setFamilyMember(inputFamily);
        setEditFamily(false);
    };



    const handleEmergency = async () => {
        if (!familyMember) return window.alert("Please setup family contact first!");

        const confirmed = window.confirm("ARE YOU SURE you want to trigger an Emergency Alert?");
        if (!confirmed) return;

        setLoading(true);
        // Simulate API
        setTimeout(() => {
            const mockRes = {
                hospital: { name: 'City Hospital' },
                ambulance: { eta: '8 mins', driver_name: 'Rahul', contact: '9876543210' }
            };
            setEmergencyData(mockRes);
            setLoading(false);

            // Detailed Alert as requested
            window.alert(`🚨 EMERGENCY ALERT SENT 🚨\n\nFamily Member (${familyMember.name}) has been notified.\n\n🚑 Ambulance Dispatched!\nDriver: ${mockRes.ambulance.driver_name}\nContact: ${mockRes.ambulance.contact}\nETA: ${mockRes.ambulance.eta}\n\n🏥 Destination: ${mockRes.hospital.name}`);
        }, 1500);
    };




    const handleVideoCall = () => {
        alert("Starting Secure Video Consultation...");
        // Mock video call - opens a new meeting for demo
        window.open("https://meet.google.com/new", "_blank");
    };

    if (role === 'doctor') return <DoctorDashboard user={user} logout={logout} />;


    return <PatientDashboard
        user={user}
        logout={logout}
        activeView={activeView}
        setActiveView={setActiveView}
        emergencyData={emergencyData}
        handleEmergency={handleEmergency}
        handleVideoCall={handleVideoCall}
        loading={loading}
        familyMember={familyMember}
        setEditFamily={setEditFamily}
        editFamily={editFamily}
        inputFamily={inputFamily}
        setInputFamily={setInputFamily}
        saveFamilyMember={saveFamilyMember}

        // Pass new props
        smartwatchConnected={smartwatchConnected}
        connectSmartwatch={connectSmartwatch}
        healthMetrics={healthMetrics}
        handleHealthyHabit={handleHealthyHabit}
    />;


};


export default Home;
