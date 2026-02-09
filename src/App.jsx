import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  Activity,
  Calendar,
  Plus,
  PhoneCall,
  History,
  LogOut,
  User,
  AlertTriangle,
  Ambulance,
  ShieldCheck,
  MapPin,
  Clock
} from 'lucide-react';
import { authService, patientService, emergencyService, socket } from './services/api';
import './index.css';

const App = () => {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('login'); // login, register, dashboard
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [registerData, setRegisterData] = useState({ name: '', age: '', phone: '', address: '', username: '', password: '' });
  const [emergencyData, setEmergencyData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('mediverse_user');
    if (saved) {
      setUser(JSON.parse(saved));
      setView('dashboard');
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authService.loginPatient(credentials);
      if (res.success) {
        setUser(res.user);
        localStorage.setItem('mediverse_user', JSON.stringify(res.user));
        setView('dashboard');
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Login Failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authService.registerPatient(registerData);
      if (res.success) {
        alert('Registration Successful! Please login.');
        setView('login');
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Registration Failed');
    } finally {
      setLoading(false);
    }
  };

  const handleEmergency = async () => {
    if (!window.confirm('🚨 EMERGENCY ALERT: This will dispatch an ambulance and notify family. Continue?')) return;
    setLoading(true);
    try {
      const res = await emergencyService.trigger(user.id, { lat: 28.4595, lng: 77.0266 });
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

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mediverse_user');
    setView('login');
  };

  if (view === 'login' || view === 'register') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-8 w-full max-w-md shadow-2xl"
        >
          <div className="flex justify-center mb-6">
            <div className="bg-accent/20 p-4 rounded-3xl">
              <Heart className="text-accent w-12 h-12" fill="currentColor" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-center mb-2">MediVerse</h2>
          <p className="text-text-muted text-center mb-8">Professional Healthcare Ecosystem</p>

          <form onSubmit={view === 'login' ? handleLogin : handleRegister} className="space-y-4">
            {view === 'register' && (
              <>
                <input
                  className="input-field"
                  placeholder="Full Name"
                  required
                  onChange={e => setRegisterData({ ...registerData, name: e.target.value })}
                />
                <div className="grid grid-cols-5 gap-4">
                  <input
                    className="input-field col-span-2"
                    placeholder="Age"
                    type="number"
                    required
                    onChange={e => setRegisterData({ ...registerData, age: e.target.value })}
                  />
                  <input
                    className="input-field col-span-3"
                    placeholder="Phone"
                    required
                    onChange={e => setRegisterData({ ...registerData, phone: e.target.value })}
                  />
                </div>
                <input
                  className="input-field"
                  placeholder="Address"
                  required
                  onChange={e => setRegisterData({ ...registerData, address: e.target.value })}
                />
              </>
            )}
            <input
              className="input-field"
              placeholder="Username"
              required
              onChange={e => view === 'login'
                ? setCredentials({ ...credentials, username: e.target.value })
                : setRegisterData({ ...registerData, username: e.target.value })
              }
            />
            <input
              className="input-field"
              type="password"
              placeholder="Password"
              required
              onChange={e => view === 'login'
                ? setCredentials({ ...credentials, password: e.target.value })
                : setRegisterData({ ...registerData, password: e.target.value })
              }
            />
            <button className="btn-primary w-full py-4 text-lg mt-4" disabled={loading}>
              {loading ? 'Processing...' : (view === 'login' ? 'Authenticate' : 'Join MediVerse')}
            </button>
          </form>

          <p className="text-center mt-6 text-text-muted">
            {view === 'login' ? "New to MediVerse? " : "Already registered? "}
            <span
              className="text-accent cursor-pointer font-semibold"
              onClick={() => setView(view === 'login' ? 'register' : 'login')}
            >
              {view === 'login' ? "Create Account" : "Login"}
            </span>
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <nav className="flex items-center justify-between glass p-6 rounded-[32px]">
        <div className="flex items-center gap-4">
          <div className="bg-accent/20 p-2 rounded-xl">
            <Heart className="text-accent w-6 h-6" fill="currentColor" />
          </div>
          <span className="text-2xl font-bold tracking-tight">MediVerse</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-sm text-text-muted">Welcome back,</span>
            <span className="font-semibold">{user?.name}</span>
          </div>
          <button onClick={logout} className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-colors">
            <LogOut className="w-5 h-5 text-text-muted" />
          </button>
        </div>
      </nav>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="glass-card p-6 rounded-[24px] col-span-1 md:col-span-2 relative overflow-hidden"
        >
          <div className="flex items-start justify-between relative z-10">
            <div>
              <p className="text-text-muted mb-1">Current Health Streak</p>
              <h1 className="text-5xl font-bold text-accent mb-4">{user?.streak || 0} Days</h1>
              <button onClick={updateStreak} className="btn-primary flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                Mark Today's Dose
              </button>
            </div>
            <Activity className="w-24 h-24 text-accent/10 absolute -right-4 -bottom-4" />
          </div>
        </motion.div>

        <div className="glass-card p-6 rounded-[24px] flex flex-col justify-center">
          <div className="bg-orange-500/10 w-12 h-12 rounded-2xl flex items-center justify-center mb-4">
            <AlertTriangle className="text-orange-500 w-6 h-6" />
          </div>
          <p className="text-text-muted mb-1">Active Alerts</p>
          <h3 className="text-2xl font-bold">None Detected</h3>
        </div>

        <div className="glass-card p-6 rounded-[24px] flex flex-col justify-center">
          <div className="bg-success/10 w-12 h-12 rounded-2xl flex items-center justify-center mb-4">
            <ShieldCheck className="text-success w-6 h-6" />
          </div>
          <p className="text-text-muted mb-1">Profile Health</p>
          <h3 className="text-2xl font-bold">Encrypted</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Quick Actions */}
          <section className="space-y-4">
            <h3 className="text-xl font-bold px-2">Medical Services</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Calendar, label: 'Book Doctor', color: 'bg-blue-500' },
                { icon: History, label: 'Visit History', color: 'bg-teal-500' },
                { icon: User, label: 'Pharmacy', color: 'bg-purple-500' },
                { icon: Plus, label: 'Lab Reports', color: 'bg-indigo-500' },
              ].map((item, i) => (
                <button key={i} className="glass-card p-6 rounded-[20px] flex flex-col items-center gap-3">
                  <div className={`${item.color} p-3 rounded-2xl`}>
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Appointments Preview */}
          <section className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-xl font-bold">Recent Consultations</h3>
              <button className="text-accent text-sm font-semibold">View All</button>
            </div>
            <div className="space-y-3">
              {(Array.isArray(user?.appointments) ? user.appointments : []).map((appt, i) => (
                <div key={i} className="glass-card p-5 rounded-[20px] flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-white/5 p-3 rounded-full">
                      <User className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-bold">{appt.docName}</h4>
                      <p className="text-sm text-text-muted">{appt.hospital} • {appt.date}</p>
                    </div>
                  </div>
                  <div className="bg-white/5 px-4 py-2 rounded-xl text-sm font-medium">
                    {appt.time}
                  </div>
                </div>
              ))}
              {!user?.appointments?.length && (
                <div className="p-8 text-center text-text-muted glass-card rounded-[20px]">
                  No upcoming consultations.
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Emergency Card */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-danger/20 p-8 rounded-[32px] border border-danger/20 relative overflow-hidden group"
          >
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-2">SOS Rapid Assistance</h2>
              <p className="text-red-300 text-sm mb-6">Instantly alert nearby ambulances and primary contacts.</p>
              <button
                onClick={handleEmergency}
                className="bg-danger hover:bg-red-600 text-white w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all active:scale-95"
              >
                <PhoneCall className="w-6 h-6" />
                Activate Emergency
              </button>
            </div>
            <Ambulance className="w-32 h-32 text-danger/10 absolute -right-8 -bottom-8 group-hover:scale-110 transition-transform" />
          </motion.div>

          {/* Emergency Tracking */}
          <AnimatePresence>
            {emergencyData && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="glass p-6 rounded-[24px] border border-accent/20"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-accent p-2 rounded-lg">
                    <Ambulance className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="font-bold">Unit Dispatched</h4>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-muted">Estimated Arrival</span>
                    <span className="font-bold text-accent">{emergencyData.ambulance.eta}</span>
                  </div>
                  <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: '0%' }}
                      animate={{ width: '65%' }}
                      className="absolute top-0 left-0 h-full bg-accent"
                    />
                  </div>

                  <div className="pt-4 border-t border-white/5 space-y-3">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-text-muted" />
                      <span className="text-sm">{emergencyData.hospital.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-text-muted" />
                      <span className="text-sm">Response ID: #82910</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setEmergencyData(null)}
                  className="w-full mt-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-semibold transition-colors"
                >
                  Dismiss Tracking
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="glass p-6 rounded-[24px]">
            <h4 className="font-bold mb-4">Family Circle</h4>
            <div className="space-y-4">
              {(Array.isArray(user?.family_members) ? user.family_members : []).map((member, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                      <span className="font-bold text-accent text-sm">JD</span>
                    </div>
                    <span className="text-sm font-medium">{member.name}</span>
                  </div>
                  <span className="text-xs text-text-muted">{member.phone}</span>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-3 border border-white/5 rounded-xl text-sm font-semibold hover:bg-white/5 transition-colors">
              Link New Member
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
