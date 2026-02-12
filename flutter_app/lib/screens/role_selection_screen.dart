import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/user_provider.dart';
import 'login_screen.dart';

class RoleSelectionScreen extends StatelessWidget {
  const RoleSelectionScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 40),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const SizedBox(height: 40),
              // Logo/Brand
              Center(
                child: Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: Theme.of(context).primaryColor.withOpacity(0.1),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(Icons.local_hospital_rounded, size: 64, color: Theme.of(context).primaryColor),
                ),
              ),
              const SizedBox(height: 24),
              Text(
                'MediVerse',
                textAlign: TextAlign.center,
                style: Theme.of(context).textTheme.displayLarge?.copyWith(fontSize: 32, color: const Color(0xFF0F172A)),
              ),
              Text(
                'Professional Healthcare Ecosystem',
                textAlign: TextAlign.center,
                style: Theme.of(context).textTheme.bodyLarge?.copyWith(color: const Color(0xFF64748B)),
              ),
              const Spacer(),
              
              Text(
                'Select Your Role',
                textAlign: TextAlign.center,
                style: Theme.of(context).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 24),

              _buildRoleCard(
                context, 
                'Patient', 
                'Access health records & appointments', 
                Icons.person_rounded, 
                const Color(0xFF3B82F6),
                'patient'
              ),
              const SizedBox(height: 16),
              _buildRoleCard(
                context, 
                'Doctor', 
                'Manage patients & prescriptions', 
                Icons.medical_services_rounded, 
                const Color(0xFF10B981),
                'doctor'
              ),
              const SizedBox(height: 16),
              _buildRoleCard(
                context, 
                'Administrator', 
                'System & database management', 
                Icons.admin_panel_settings_rounded, 
                const Color(0xFF6366F1),
                'admin'
              ),
              const Spacer(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildRoleCard(BuildContext context, String title, String subtitle, IconData icon, Color color, String role) {
    return InkWell(
      onTap: () {
        // Set Role in Provider or navigate with argument
        // For simplicity, passing role to LoginScreen
        Navigator.push(context, MaterialPageRoute(builder: (_) => LoginScreen(role: role)));
      },
      borderRadius: BorderRadius.circular(20),
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: const Color(0xFFE2E8F0)),
          boxShadow: [
            BoxShadow(
              color: const Color(0xFF64748B).withOpacity(0.05),
              blurRadius: 10,
              offset: const Offset(0, 4),
            )
          ],
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: color.withOpacity(0.1),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Icon(icon, color: color, size: 28),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF1E293B))),
                  Text(subtitle, style: const TextStyle(fontSize: 13, color: Color(0xFF64748B))),
                ],
              ),
            ),
            Icon(Icons.chevron_right_rounded, color: Colors.grey.shade400),
          ],
        ),
      ),
    );
  }
}
