import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/emergency_service.dart';
import '../providers/user_provider.dart';
import 'appointments_screen.dart';
import 'records_screen.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final userProvider = Provider.of<UserProvider>(context);
    final user = userProvider.user!;
    final theme = Theme.of(context);

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: const Text('MediVerse', style: TextStyle(fontWeight: FontWeight.bold, letterSpacing: -0.5)),
        backgroundColor: Colors.white,
        elevation: 0,
        scrolledUnderElevation: 2,
        actions: [
          IconButton(
            icon: const Icon(Icons.logout_rounded, color: Color(0xFF64748B)),
            onPressed: () => userProvider.logout(),
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text("Hi, ${user['name']}", style: theme.textTheme.displayLarge?.copyWith(fontSize: 28)),
            const SizedBox(height: 4),
            Text("Your health ecosystem is secure.", style: theme.textTheme.bodyLarge),
            
            const SizedBox(height: 32),
            _buildSOSCard(context, user['id'].toString()),
            
            const SizedBox(height: 32),
            _buildMedicineTracker(context, user),
            
            const SizedBox(height: 32),
            const Text("Professional Services", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF1E293B))),
            const SizedBox(height: 16),
            GridView.count(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              crossAxisCount: 2,
              crossAxisSpacing: 16,
              mainAxisSpacing: 16,
              childAspectRatio: 1.3,
              children: [
                _buildActionCard(context, Icons.calendar_month_rounded, "Book Appt", const Color(0xFF3B82F6), () {
                  Navigator.push(context, MaterialPageRoute(builder: (_) => const AppointmentsScreen()));
                }),
                _buildActionCard(context, Icons.history_edu_rounded, "History", const Color(0xFF10B981), () {
                  Navigator.push(context, MaterialPageRoute(builder: (_) => const RecordsScreen()));
                }),
                _buildActionCard(context, Icons.local_pharmacy_rounded, "Pharmacy", const Color(0xFF8B5CF6), () {}),
                _buildActionCard(context, Icons.analytics_rounded, "Lab Data", const Color(0xFF6366F1), () {}),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSOSCard(BuildContext context, String patientId) {
    return Container(
      decoration: BoxDecoration(
        gradient: const LinearGradient(colors: [Color(0xFFEF4444), Color(0xFFDC2626)]),
        borderRadius: BorderRadius.circular(32),
        boxShadow: [BoxShadow(color: const Color(0xFFEF4444).withValues(alpha: 0.3), blurRadius: 20, offset: const Offset(0, 10))],
      ),
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text("SOS RAPID\nASSISTANCE", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 20, height: 1.1)),
              Container(padding: const EdgeInsets.all(10), decoration: BoxDecoration(color: Colors.white.withValues(alpha: 0.2), shape: BoxShape.circle), child: const Icon(Icons.medical_services_rounded, color: Colors.white)),
            ],
          ),
          const SizedBox(height: 16),
          const Text("Instantly alert emergency units and primary contacts.", style: TextStyle(color: Colors.white70, fontSize: 13)),
          const SizedBox(height: 24),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: () => _handleEmergency(context, patientId),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.white,
                foregroundColor: const Color(0xFFDC2626),
                padding: const EdgeInsets.symmetric(vertical: 18),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
              ),
              child: const Text("ACTIVATE SOS", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            ),
          )
        ],
      ),
    );
  }

  void _handleEmergency(BuildContext context, String patientId) async {
    final service = Provider.of<EmergencyService>(context, listen: false);
    
    bool? confirm = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
        title: const Text("Confirm SOS Activation?"),
        content: const Text("This protocol will alert nearby medical facilities and your emergency circle immediately."),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context, false), child: const Text("CANCEL")),
          ElevatedButton(
            onPressed: () => Navigator.pop(context, true), 
            style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFFEF4444)),
            child: const Text("ACTIVATE", style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );

    if (confirm != true) return;
    if (!context.mounted) return;

    showDialog(context: context, barrierDismissible: false, builder: (_) => const Center(child: CircularProgressIndicator()));

    try {
      final result = await service.triggerEmergency(patientId, {'lat': 28.4595, 'lng': 77.0266});
      if (context.mounted) {
        Navigator.pop(context);
        Navigator.push(context, MaterialPageRoute(builder: (_) => AmbulanceTrackingScreen(data: result)));
      }
    } catch (e) {
      if (context.mounted) {
        Navigator.pop(context);
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text("Emergency System Error: $e")));
      }
    }
  }

  Widget _buildMedicineTracker(BuildContext context, Map<String, dynamic> user) {
    // For MVP, we mock the daily prescription. In real app, fetch from API.

    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white, 
        borderRadius: BorderRadius.circular(32), 
        border: Border.all(color: const Color(0xFFE2E8F0)),
        boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.02), blurRadius: 10, offset: const Offset(0,4))],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text("Daily Meds", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: Color(0xFF1E293B))),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(color: const Color(0xFF10B981).withValues(alpha: 0.1), borderRadius: BorderRadius.circular(20)),
                child: Row(
                  children: [
                    const Icon(Icons.shield_rounded, size: 16, color: Color(0xFF10B981)),
                    const SizedBox(width: 4),
                    Text("Streak: ${user['streak'] ?? 0}", style: const TextStyle(color: Color(0xFF10B981), fontWeight: FontWeight.bold, fontSize: 12)),
                  ],
                ),
              )
            ],
          ),
          const SizedBox(height: 20),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              _buildDoseButton(context, 'Morning', true),
              _buildDoseButton(context, 'Afternoon', false),
              _buildDoseButton(context, 'Night', false),
            ],
          ),
          const SizedBox(height: 20),
          const Divider(),
          const SizedBox(height: 12),
          const Text("Doctor's Advice", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
          const SizedBox(height: 8),
          _buildTipRow(Icons.restaurant_rounded, "Avoid spicy food today."),
          const SizedBox(height: 8),
          _buildTipRow(Icons.directions_walk_rounded, "30 mins brisk walking."),
        ],
      ),
    );
  }

  Widget _buildDoseButton(BuildContext context, String label, bool taken) {
    return Column(
      children: [
        InkWell(
          onTap: () {
             ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Dose Recorded')));
          },
          child: Container(
            width: 60,
            height: 60,
            decoration: BoxDecoration(
              color: taken ? const Color(0xFF10B981) : const Color(0xFFF1F5F9),
              shape: BoxShape.circle,
              border: taken ? null : Border.all(color: const Color(0xFFCBD5E1)),
            ),
            child: Icon(
              Icons.medication_rounded, 
              color: taken ? Colors.white : const Color(0xFF94A3B8)
            ),
          ),
        ),
        const SizedBox(height: 8),
        Text(label, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w500, color: Color(0xFF64748B))),
      ],
    );
  }

  Widget _buildTipRow(IconData icon, String text) {
    return Row(
      children: [
        Icon(icon, size: 16, color: const Color(0xFF64748B)),
        const SizedBox(width: 8),
        Text(text, style: const TextStyle(color: Color(0xFF475569), fontSize: 13)),
      ],
    );
  }

  Widget _buildActionCard(BuildContext context, IconData icon, String label, Color color, VoidCallback onTap) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(24),
      child: Container(
        decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(24), border: Border.all(color: const Color(0xFFE2E8F0))),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(padding: const EdgeInsets.all(12), decoration: BoxDecoration(color: color.withValues(alpha: 0.1), shape: BoxShape.circle), child: Icon(icon, color: color, size: 28)),
            const SizedBox(height: 12),
            Text(label, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14, color: Color(0xFF1E293B))),
          ],
        ),
      ),
    );
  }
}

class AmbulanceTrackingScreen extends StatelessWidget {
  final Map<String, dynamic> data;
  const AmbulanceTrackingScreen({super.key, required this.data});

  @override
  Widget build(BuildContext context) {
    final ambulance = data['ambulance'] ?? {};
    final hospital = data['hospital'] ?? {'name': 'Apollo Hospital'};
    
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(title: const Text("Unit Tracking", style: TextStyle(fontWeight: FontWeight.bold)), backgroundColor: const Color(0xFFEF4444), foregroundColor: Colors.white),
      body: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          children: [
            const Icon(Icons.local_shipping_rounded, size: 80, color: Color(0xFFEF4444)),
            const SizedBox(height: 24),
            Text("ETA: ${ambulance['eta'] ?? '8 mins'}", style: const TextStyle(fontSize: 40, fontWeight: FontWeight.bold, letterSpacing: -1)),
            const SizedBox(height: 8),
            const Text("Unit 729 is on the way", style: TextStyle(color: Color(0xFF64748B), fontSize: 16)),
            const SizedBox(height: 48),
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(color: const Color(0xFFF8FAFC), borderRadius: BorderRadius.circular(24)),
              child: Column(
                children: [
                  ListTile(
                    contentPadding: EdgeInsets.zero,
                    leading: const CircleAvatar(backgroundColor: Color(0xFFE2E8F0), child: Icon(Icons.local_hospital, color: Color(0xFF64748B))),
                    title: Text(hospital['name'] as String, style: const TextStyle(fontWeight: FontWeight.bold)),
                    subtitle: const Text("Nearest available trauma center"),
                  ),
                  const Divider(height: 32),
                  ListTile(
                    contentPadding: EdgeInsets.zero,
                    leading: const CircleAvatar(backgroundColor: Color(0xFFE2E8F0), child: Icon(Icons.person, color: Color(0xFF64748B))),
                    title: Text(ambulance['driver'] ?? 'Rajesh Kumar', style: const TextStyle(fontWeight: FontWeight.bold)),
                    subtitle: Text(ambulance['phone'] ?? '+91 98765 43210'),
                    trailing: const IconButton(icon: Icon(Icons.phone_rounded, color: Color(0xFF10B981)), onPressed: null),
                  ),
                ],
              ),
            ),
            const Spacer(),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () => Navigator.pop(context),
                style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF0EA5E9), foregroundColor: Colors.white),
                child: const Text("RETURN TO DASHBOARD", style: TextStyle(fontWeight: FontWeight.bold)),
              ),
            )
          ],
        ),
      ),
    );
  }
}
