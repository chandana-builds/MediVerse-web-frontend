import 'package:provider/provider.dart';
import '../providers/user_provider.dart';
import 'login_screen.dart';
import 'doctor_patient_view.dart';

class DoctorDashboard extends StatefulWidget {
  const DoctorDashboard({super.key});

  @override
  State<DoctorDashboard> createState() => _DoctorDashboardState();
}

class _DoctorDashboardState extends State<DoctorDashboard> {
  final _searchController = TextEditingController();

  void _logout() {
    Provider.of<UserProvider>(context, listen: false).logout();
    Navigator.of(context).pushAndRemoveUntil(
      MaterialPageRoute(builder: (_) => const LoginScreen(role: 'doctor')),
      (route) => false,
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final user = Provider.of<UserProvider>(context).user;

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: const Text('MediVerse Doctor'),
        backgroundColor: Colors.white,
        foregroundColor: theme.colorScheme.primary,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.logout_rounded),
            onPressed: _logout,
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Welcome,', style: theme.textTheme.bodyLarge),
            Text(user?['name'] ?? 'Dr. Wilson', style: theme.textTheme.displayLarge?.copyWith(fontSize: 28)),
            const SizedBox(height: 32),

            // Patient Search
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(24),
                boxShadow: [
                  BoxShadow(color: Colors.black.withValues(alpha: 0.05), blurRadius: 10, offset: const Offset(0, 4))
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Find Patient', style: theme.textTheme.titleLarge),
                  const SizedBox(height: 16),
                  TextField(
                    controller: _searchController,
                    decoration: InputDecoration(
                      hintText: 'Enter Patient ID or Name',
                      prefixIcon: const Icon(Icons.search_rounded),
                      suffixIcon: Container(
                        margin: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: theme.colorScheme.primary,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: IconButton(
                          icon: const Icon(Icons.arrow_forward_rounded, color: Colors.white),
                          onPressed: () {
                            if (_searchController.text.isNotEmpty) {
                              Navigator.push(context, MaterialPageRoute(builder: (_) => DoctorPatientView(
                                patientId: _searchController.text,
                                patientName: "Patient #${_searchController.text}", // Mock name lookup
                              )));
                            } else {
                              ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Please enter a Patient ID')));
                            }
                          },
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 32),

            Text('Today\'s Appointments', style: theme.textTheme.titleLarge),
            const SizedBox(height: 16),
            
            // Appointment List (Mock for now)
            ListView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: 2,
              itemBuilder: (context, index) {
                return Card(
                  margin: const EdgeInsets.only(bottom: 16),
                  child: ListTile(
                    contentPadding: const EdgeInsets.all(16),
                    leading: CircleAvatar(
                      backgroundColor: theme.colorScheme.primary.withValues(alpha: 0.1),
                      child: Text(index == 0 ? 'JD' : 'AS', style: TextStyle(color: theme.colorScheme.primary, fontWeight: FontWeight.bold)),
                    ),
                    title: Text(index == 0 ? 'John Doe' : 'Alice Smith', style: const TextStyle(fontWeight: FontWeight.bold)),
                    subtitle: Text(index == 0 ? 'General Checkup • 10:30 AM' : 'Follow up • 11:15 AM'),
                    trailing: const Icon(Icons.chevron_right_rounded),
                  ),
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}
