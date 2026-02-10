import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Stethoscope, User } from 'lucide-react';
import { authService } from './services/api';
import Home from './pages/Home';
import './index.css';

const App = () => {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('landing'); // landing, login, register, dashboard
  const [role, setRole] = useState(null); // 'patient' or 'doctor'
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [registerData, setRegisterData] = useState({
    name: '', email: '', age: '', phone: '',
    address: '', username: '', password: '',
    department: '', hospital_name: '' // Added for doctors
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('mediverse_user');
    if (saved) {
      const parsedUser = JSON.parse(saved);
      setUser(parsedUser);
      setRole(parsedUser.role || 'patient');
      setView('dashboard');
    }
  }, []);

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setView('login');
    // Reset credentials/register data logic if needed
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let res;
      if (role === 'doctor') {
        res = await authService.loginDoctor(credentials);
      } else {
        res = await authService.loginPatient(credentials);
      }

      if (res.success) {
        const userData = { ...res.user, role }; // Attach selected role
        setUser(userData);
        localStorage.setItem('mediverse_user', JSON.stringify(userData));
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
      let res;
      if (role === 'doctor') {
        // Ensure we send correct fields for doctor
        res = await authService.registerDoctor({ ...registerData, role });
      } else {
        res = await authService.registerPatient({ ...registerData, role });
      }

      if (res.success) {
        alert('Registration Successful! Please login.');
        setView('login');
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Registration Failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    localStorage.removeItem('mediverse_user');
    setView('landing');
  };

  const goBack = () => {
    if (view === 'login' || view === 'register') {
      setView('landing');
      setRole(null);
    }
  };

  if (view === 'dashboard' && user) {
    return <Home user={user} setUser={setUser} logout={logout} role={role} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-white font-sans text-[#333333]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 w-full max-w-2xl shadow-xl rounded-[16px] border border-slate-200 relative"
      >
        <div className="flex justify-center mb-6">
          <div className="bg-[#1e88e5]/10 p-4 rounded-full">
            <Heart className="text-[#1e88e5] w-12 h-12" fill="currentColor" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-center mb-2 text-[#333333]">MediVerse</h2>
        <p className="text-slate-500 text-center mb-8">Professional Healthcare Ecosystem</p>

        {view === 'landing' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleRoleSelect('patient')}
              className="flex flex-col items-center justify-center p-8 rounded-[16px] border-2 border-slate-100 hover:border-[#1e88e5] hover:bg-blue-50 transition-all gap-4 group"
            >
              <div className="bg-blue-100 p-4 rounded-full group-hover:bg-[#1e88e5] transition-colors">
                <User className="w-8 h-8 text-[#1e88e5] group-hover:text-white" />
              </div>
              <span className="text-xl font-bold text-slate-700 group-hover:text-[#1e88e5]">I am a Patient</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleRoleSelect('doctor')}
              className="flex flex-col items-center justify-center p-8 rounded-[16px] border-2 border-slate-100 hover:border-teal-500 hover:bg-teal-50 transition-all gap-4 group"
            >
              <div className="bg-teal-100 p-4 rounded-full group-hover:bg-teal-500 transition-colors">
                <Stethoscope className="w-8 h-8 text-teal-600 group-hover:text-white" />
              </div>
              <span className="text-xl font-bold text-slate-700 group-hover:text-teal-600">I am a Doctor</span>
            </motion.button>
          </div>
        )}

        {(view === 'login' || view === 'register') && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="mb-6 flex items-center justify-between">
              <button onClick={goBack} className="text-sm text-slate-400 hover:text-[#1e88e5] transition-colors">
                ← Back to Role Selection
              </button>
              <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-bold uppercase text-slate-600 tracking-wider">
                {role} Portal
              </span>
            </div>

            <form onSubmit={view === 'login' ? handleLogin : handleRegister} className="space-y-6">
              {/* Registration Form */}
              {view === 'register' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    className="input-field"
                    placeholder="Full Name"
                    required
                    onChange={e => setRegisterData({ ...registerData, name: e.target.value })}
                  />
                  <input
                    className="input-field"
                    type="email"
                    placeholder="Email Address"
                    onChange={e => setRegisterData({ ...registerData, email: e.target.value })}
                  />
                  {/* Role Specific Fields */}
                  {role === 'patient' ? (
                    <>
                      <input
                        className="input-field"
                        placeholder="Age"
                        type="number"
                        required
                        onChange={e => setRegisterData({ ...registerData, age: e.target.value })}
                      />
                      <input
                        className="input-field"
                        placeholder="Phone Number"
                        required
                        onChange={e => setRegisterData({ ...registerData, phone: e.target.value })}
                      />
                      <input
                        className="input-field"
                        placeholder="Address"
                        required
                        onChange={e => setRegisterData({ ...registerData, address: e.target.value })}
                      />
                    </>
                  ) : (
                    <>
                      {/* Doctor Fields */}
                      <input
                        className="input-field"
                        placeholder="Specialization (Department)"
                        required
                        onChange={e => setRegisterData({ ...registerData, department: e.target.value })}
                      />
                      <input
                        className="input-field"
                        placeholder="Hospital Name"
                        required
                        onChange={e => setRegisterData({ ...registerData, hospital_name: e.target.value })}
                      />
                      <input
                        className="input-field"
                        placeholder="Phone Number"
                        required
                        onChange={e => setRegisterData({ ...registerData, phone: e.target.value })}
                      />
                    </>
                  )}

                  <input
                    className="input-field"
                    placeholder="Username"
                    required
                    onChange={e => setRegisterData({ ...registerData, username: e.target.value })}
                  />
                  <input
                    className="input-field md:col-span-2"
                    type="password"
                    placeholder="Create Password"
                    required
                    onChange={e => setRegisterData({ ...registerData, password: e.target.value })}
                  />
                </div>
              )}

              {view === 'login' && (
                <div className="space-y-4">
                  <input
                    className="input-field w-full text-lg p-3"
                    placeholder={role === 'doctor' ? "Email / Username" : "Username"}
                    required
                    onChange={e => setCredentials({ ...credentials, username: e.target.value })}
                  />
                  <input
                    className="input-field w-full text-lg p-3"
                    type="password"
                    placeholder="Password"
                    required
                    onChange={e => setCredentials({ ...credentials, password: e.target.value })}
                  />
                </div>
              )}

              <button className="w-full py-4 bg-[#1e88e5] hover:bg-blue-600 text-white rounded-[16px] font-bold text-lg shadow-md transition-all active:scale-95" disabled={loading}>
                {loading ? 'Processing...' : (view === 'login' ? `Login as ${role === 'doctor' ? 'Doctor' : 'Patient'}` : `Register as ${role === 'doctor' ? 'Doctor' : 'Patient'}`)}
              </button>
            </form>

            <p className="text-center mt-6 text-slate-500">
              {view === 'login' ? "New to MediVerse? " : "Already registered? "}
              <span
                className="text-[#1e88e5] cursor-pointer font-semibold hover:underline"
                onClick={() => setView(view === 'login' ? 'register' : 'login')}
              >
                {view === 'login' ? "Create Account" : "Login"}
              </span>
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default App;
