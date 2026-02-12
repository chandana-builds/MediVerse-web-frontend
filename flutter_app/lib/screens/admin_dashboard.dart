import 'package:provider/provider.dart';
import '../providers/user_provider.dart';
import 'login_screen.dart';
import 'admin_database_view.dart';

class AdminDashboard extends StatelessWidget {
  const AdminDashboard({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return Scaffold(
      backgroundColor: const Color(0xFFF1F5F9),
      appBar: AppBar(
        title: const Text('Admin Console'),
        backgroundColor: Colors.white,
        foregroundColor: const Color(0xFF0F172A),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout_rounded),
            onPressed: () {
               Provider.of<UserProvider>(context, listen: false).logout();
               Navigator.of(context).pushAndRemoveUntil(
                  MaterialPageRoute(builder: (_) => const LoginScreen(role: 'admin')),
                  (route) => false,
                );
            },
          )
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          children: [
            // Stats Grid
            Row(
              children: [
                Expanded(child: _buildStatCard(context, 'Total Patients', '1,284', Colors.blue)),
                const SizedBox(width: 16),
                Expanded(child: _buildStatCard(context, 'Active Doctors', '42', Colors.teal)),
              ],
            ),
            const SizedBox(height: 32),

            // Database Access
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: () {
                   Navigator.push(context, MaterialPageRoute(builder: (_) => const AdminDatabaseView()));
                },
                icon: const Icon(Icons.table_view_rounded),
                label: const Text('VIEW DATABASE RECORDS'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF1E293B),
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.all(20),
                ),
              ),
            ),
            const SizedBox(height: 32),
            
            // Recent Activity List
            Container(
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(24),
              ),
              padding: const EdgeInsets.all(24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('System Logs', style: theme.textTheme.titleLarge),
                  const SizedBox(height: 16),
                  _buildLogItem('New Patient Registered: John Doe', '2 mins ago'),
                  _buildLogItem('Emergency Triggered: ID #9921', '15 mins ago'),
                  _buildLogItem('Dr. Sarah login', '1 hour ago'),
                ],
              ),
            )
          ],
        ),
      ),
    );
  }

  Widget _buildStatCard(BuildContext context, String title, String value, Color color) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: color.withValues(alpha: 0.1), width: 2),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title, style: TextStyle(color: Colors.grey.shade600, fontSize: 13)),
          const SizedBox(height: 8),
          Text(value, style: TextStyle(color: color, fontSize: 28, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }

  Widget _buildLogItem(String title, String time) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(title, style: const TextStyle(fontWeight: FontWeight.w500)),
          Text(time, style: TextStyle(color: Colors.grey.shade400, fontSize: 12)),
        ],
      ),
    );
  }
}
