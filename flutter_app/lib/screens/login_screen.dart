import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import '../services/api_service.dart';
import '../providers/user_provider.dart';
import 'register_screen.dart';

class LoginScreen extends StatefulWidget {
  final String role; // 'patient', 'doctor', 'admin'
  const LoginScreen({super.key, this.role = 'patient'});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _usernameController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _isLoading = false;

  void _login() async {
    if (_usernameController.text.isEmpty || _passwordController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Verification credentials required')),
      );
      return;
    }

    setState(() => _isLoading = true);

    try {
      final apiService = Provider.of<ApiService>(context, listen: false);
      final userProvider = Provider.of<UserProvider>(context, listen: false);

      // Call role-specific login
      final result = await apiService.login(
        _usernameController.text.trim(),
        _passwordController.text,
        role: widget.role
      );

      if (result['success']) {
        userProvider.setUser(result['user'], widget.role);
        // Navigation is handled by Main wrapper
        Navigator.popUntil(context, (route) => route.isFirst);
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Access Denied: ${e.toString().replaceAll('Exception:', '')}')),
      );
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final roleTitle = widget.role[0].toUpperCase() + widget.role.substring(1);
    
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(backgroundColor: Colors.transparent, elevation: 0),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 32),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                width: 64,
                height: 64,
                decoration: BoxDecoration(
                  color: theme.colorScheme.primary,
                  borderRadius: BorderRadius.circular(20),
                ),
                child: const Icon(Icons.health_and_safety_rounded, color: Colors.white, size: 36),
              ),
              const SizedBox(height: 32),
              Text('MediVerse\n$roleTitle Portal', 
                style: theme.textTheme.displayLarge?.copyWith(height: 1.1, fontSize: 36)
              ),
              const SizedBox(height: 12),
              Text('Secure access for ${widget.role}s.', 
                style: theme.textTheme.bodyLarge
              ),
              const SizedBox(height: 48),
              
              TextField(
                controller: _usernameController,
                decoration: const InputDecoration(
                  hintText: 'Username / ID',
                  prefixIcon: Icon(Icons.account_circle_outlined, size: 24),
                ),
              ),
              const SizedBox(height: 20),
              TextField(
                controller: _passwordController,
                obscureText: true,
                decoration: const InputDecoration(
                  hintText: 'Password',
                  prefixIcon: Icon(Icons.lock_outline_rounded, size: 24),
                ),
              ),
              const SizedBox(height: 40),
              
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: _isLoading ? null : _login,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: theme.colorScheme.primary,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 20),
                  ),
                  child: _isLoading
                      ? const SizedBox(height: 24, width: 24, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                      : const Text('AUTHENTICATE', style: TextStyle(fontWeight: FontWeight.bold, letterSpacing: 1.2)),
                ),
              ),
              const SizedBox(height: 24),
              if (widget.role == 'patient')
                Center(
                  child: TextButton(
                    onPressed: () {
                      Navigator.push(context, MaterialPageRoute(builder: (_) => const RegisterScreen()));
                    },
                    child: Text('Register New Patient Account', 
                      style: TextStyle(color: theme.colorScheme.primary, fontWeight: FontWeight.w600)
                    ),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}
