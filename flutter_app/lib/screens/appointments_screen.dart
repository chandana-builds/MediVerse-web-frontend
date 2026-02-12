import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/user_provider.dart';
import '../services/api_service.dart';

class AppointmentsScreen extends StatefulWidget {
  const AppointmentsScreen({super.key});

  @override
  State<AppointmentsScreen> createState() => _AppointmentsScreenState();
}

class _AppointmentsScreenState extends State<AppointmentsScreen> {
  int _currentStep = 0;
  
  final List<String> _hospitals = ['Apollo Hospital', 'Max Healthcare', 'Fortis Hospital', 'Medanta The Medicity'];
  final List<Map<String, String>> _doctors = [
    {'name': 'Dr. Sarah Wilson', 'speciality': 'Cardiologist'},
    {'name': 'Dr. Rajesh Kumar', 'speciality': 'General Physician'},
    {'name': 'Dr. Emily Chen', 'speciality': 'Neurologist'},
    {'name': 'Dr. Michael Ross', 'speciality': 'Dermatologist'},
  ];

  String? _selectedHospital;
  Map<String, String>? _selectedDoctor;
  String? _selectedDate;
  String? _selectedTime;
  bool _isSubmitting = false;

  final List<String> _timeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:30 PM'];

  void _bookAppointment() async {
    setState(() => _isSubmitting = true);

    final userProvider = Provider.of<UserProvider>(context, listen: false);
    final apiService = Provider.of<ApiService>(context, listen: false);
    final user = Map<String, dynamic>.from(userProvider.user!);

    final newAppointment = {
      'docName': _selectedDoctor!['name'],
      'hospital': _selectedHospital,
      'date': _selectedDate,
      'time': _selectedTime,
      'reminder': false,
    };

    List appointments = List.from(user['appointments'] ?? []);
    appointments.add(newAppointment);
    user['appointments'] = appointments;

    try {
      await apiService.updatePatientData(user);
      userProvider.setUser(user, 'patient');
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Protocol Confirmed: Appointment Logged')));
        Navigator.pop(context);
      }
    } catch (e) {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Sync Failure: $e')));
    } finally {
      if (mounted) setState(() => _isSubmitting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: const Text('Book Consultation', style: TextStyle(fontWeight: FontWeight.bold)), 
        backgroundColor: Colors.white, 
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded),
          onPressed: () {
            if (_currentStep > 0) {
              setState(() => _currentStep--);
            } else {
              Navigator.pop(context);
            }
          },
        ),
      ),
      body: Column(
        children: [
          // Progress Indicator
          LinearProgressIndicator(
            value: (_currentStep + 1) / 3,
            backgroundColor: const Color(0xFFF1F5F9),
            valueColor: AlwaysStoppedAnimation<Color>(theme.colorScheme.primary),
          ),
          
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(24),
              child: _buildCurrentStep(theme),
            ),
          ),

          // Bottom Bar
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: Colors.white,
              boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.05), blurRadius: 20, offset: const Offset(0, -5))],
            ),
            child: SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: _canProceed() ? (_currentStep == 2 ? (_isSubmitting ? null : _bookAppointment) : () => setState(() => _currentStep++)) : null,
                style: ElevatedButton.styleFrom(
                  backgroundColor: theme.colorScheme.primary,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 18),
                  disabledBackgroundColor: const Color(0xFFE2E8F0),
                ),
                child: _isSubmitting 
                  ? const SizedBox(height: 24, width: 24, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2)) 
                  : Text(_currentStep == 2 ? "CONFIRM BOOKING" : "CONTINUE", style: const TextStyle(fontWeight: FontWeight.bold, letterSpacing: 1)),
              ),
            ),
          ),
        ],
      ),
    );
  }

  bool _canProceed() {
    if (_currentStep == 0) return _selectedHospital != null;
    if (_currentStep == 1) return _selectedDoctor != null;
    if (_currentStep == 2) return _selectedDate != null && _selectedTime != null;
    return false;
  }

  Widget _buildCurrentStep(ThemeData theme) {
    switch (_currentStep) {
      case 0:
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text("Step 1 of 3", style: TextStyle(color: theme.colorScheme.primary, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            const Text("Select Facility", style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            const Text("Choose a nearby hospital for your visit.", style: TextStyle(color: Color(0xFF64748B))),
            const SizedBox(height: 32),
            ..._hospitals.map((hospital) => _buildSelectionCard(
              title: hospital,
              subtitle: "2.5 km away • Open 24/7",
              isSelected: _selectedHospital == hospital,
              onTap: () => setState(() => _selectedHospital = hospital),
              icon: Icons.local_hospital_rounded,
            )),
          ],
        );
      case 1:
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text("Step 2 of 3", style: TextStyle(color: theme.colorScheme.primary, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            const Text("Select Doctor", style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            Text("Available specialists at $_selectedHospital.", style: const TextStyle(color: Color(0xFF64748B))),
            const SizedBox(height: 32),
            ..._doctors.map((doctor) => _buildSelectionCard(
              title: doctor['name']!,
              subtitle: doctor['speciality']!,
              isSelected: _selectedDoctor == doctor,
              onTap: () => setState(() => _selectedDoctor = doctor),
              icon: Icons.person_rounded,
            )),
          ],
        );
      case 2:
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text("Step 3 of 3", style: TextStyle(color: theme.colorScheme.primary, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            const Text("Schedule Visit", style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            const Text("Choose a convenient date and time slot.", style: TextStyle(color: Color(0xFF64748B))),
            const SizedBox(height: 32),
            
            const Text("Date", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            const SizedBox(height: 12),
            SizedBox(
              height: 60,
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                itemCount: 14,
                itemBuilder: (context, index) {
                  final date = DateTime.now().add(Duration(days: index));
                  final dateStr = "${date.day}/${date.month}";
                  final fullDate = "$dateStr/${date.year}";
                  final isSelected = _selectedDate == fullDate;
                  
                  return Padding(
                    padding: const EdgeInsets.only(right: 12),
                    child: InkWell(
                      onTap: () => setState(() => _selectedDate = fullDate),
                      child: Container(
                        width: 60,
                        decoration: BoxDecoration(
                          color: isSelected ? theme.colorScheme.primary : const Color(0xFFF1F5F9),
                          borderRadius: BorderRadius.circular(16),
                          border: isSelected ? null : Border.all(color: const Color(0xFFE2E8F0)),
                        ),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(dateStr, style: TextStyle(fontWeight: FontWeight.bold, color: isSelected ? Colors.white : const Color(0xFF1E293B))),
                            Text(_getWeekday(date.weekday), style: TextStyle(fontSize: 12, color: isSelected ? Colors.white.withValues(alpha: 0.8) : const Color(0xFF64748B))),
                          ],
                        ),
                      ),
                    ),
                  );
                },
              ),
            ),
            const SizedBox(height: 24),
             const Text("Time Slot", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            const SizedBox(height: 12),
            Wrap(
              spacing: 12,
              runSpacing: 12,
              children: _timeSlots.map((t) {
                final isSelected = _selectedTime == t;
                return InkWell(
                  onTap: () => setState(() => _selectedTime = t),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                    decoration: BoxDecoration(
                      color: isSelected ? theme.colorScheme.primary : Colors.white,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: isSelected ? Colors.transparent : const Color(0xFFE2E8F0)),
                    ),
                    child: Text(t, style: TextStyle(fontWeight: FontWeight.bold, color: isSelected ? Colors.white : const Color(0xFF64748B))),
                  ),
                );
              }).toList(),
            ),
          ],
        );
      default:
        return const SizedBox.shrink();
    }
  }

  Widget _buildSelectionCard({required String title, required String subtitle, required bool isSelected, required VoidCallback onTap, required IconData icon}) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: isSelected ? const Color(0xFF0EA5E9).withValues(alpha: 0.05) : Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: isSelected ? const Color(0xFF0EA5E9) : const Color(0xFFE2E8F0), width: isSelected ? 2 : 1),
      ),
      child: ListTile(
        onTap: onTap,
        contentPadding: const EdgeInsets.all(16),
        leading: Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: isSelected ? const Color(0xFF0EA5E9) : const Color(0xFFF1F5F9),
            shape: BoxShape.circle,
          ),
          child: Icon(icon, color: isSelected ? Colors.white : const Color(0xFF94A3B8)),
        ),
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
        subtitle: Text(subtitle, style: const TextStyle(color: Color(0xFF64748B))),
        trailing: isSelected ? const Icon(Icons.check_circle_rounded, color: Color(0xFF0EA5E9)) : null,
      ),
    );
  }

  String _getWeekday(int weekday) {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days[weekday - 1];
  }
}
