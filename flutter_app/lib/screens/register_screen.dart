import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/api_service.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _ageController = TextEditingController();
  final _phoneController = TextEditingController();
  final _addressController = TextEditingController();
  final _usernameController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _isLoading = false;

  void _register() async {
    if (_nameController.text.isEmpty ||
        _emailController.text.isEmpty ||
        _ageController.text.isEmpty ||
        _phoneController.text.isEmpty ||
        _addressController.text.isEmpty ||
        _usernameController.text.isEmpty ||
        _passwordController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('All fields are mandatory')),
      );
      return;
    }

    setState(() => _isLoading = true);

    try {
      final apiService = Provider.of<ApiService>(context, listen: false);
      final result = await apiService.registerPatient({
        'name': _nameController.text.trim(),
        'email': _emailController.text.trim(),
        'age': int.parse(_ageController.text),
        'phone': _phoneController.text.trim(),
        'address': _addressController.text.trim(),
        'username': _usernameController.text.trim(),
        'password': _passwordController.text,
      });

      if (result['success']) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Registration complete. Verification pending.')),
          );
          Navigator.pop(context);
        }
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Registration failure: $e')),
      );
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: const Text('Create Account', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: Colors.white,
        elevation: 0,
        foregroundColor: const Color(0xFF020617),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 24),
        child: Column(
          children: [
            Text('Join the MediVerse ecosystem to manage your health with professional precision.', 
              style: theme.textTheme.bodyLarge
            ),
            const SizedBox(height: 40),
            _buildField(Icons.person_outline, 'Full Name', _nameController),
            const SizedBox(height: 16),
            _buildField(Icons.email_outlined, 'Email Address', _emailController, type: TextInputType.emailAddress),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(child: _buildField(Icons.calendar_today_rounded, 'Age', _ageController, type: TextInputType.number)),
                const SizedBox(width: 16),
                Expanded(flex: 2, child: _buildField(Icons.phone_outlined, 'Phone', _phoneController)),
              ],
            ),
            const SizedBox(height: 16),
            _buildField(Icons.location_on_outlined, 'Residential Address', _addressController),
            const SizedBox(height: 16),
            _buildField(Icons.account_circle_outlined, 'Username', _usernameController),
            const SizedBox(height: 16),
            _buildField(Icons.security_rounded, 'Security Token', _passwordController, obscure: true),
            const SizedBox(height: 40),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: _isLoading ? null : _register,
                style: ElevatedButton.styleFrom(
                  backgroundColor: theme.colorScheme.primary,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 20),
                ),
                child: _isLoading
                    ? const SizedBox(height: 24, width: 24, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                    : const Text('COMPLETE REGISTRATION', style: TextStyle(fontWeight: FontWeight.bold, letterSpacing: 1.2)),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildField(IconData icon, String hint, TextEditingController controller, {bool obscure = false, TextInputType? type}) {
    return TextField(
      controller: controller,
      obscureText: obscure,
      keyboardType: type,
      decoration: InputDecoration(
        hintText: hint,
        prefixIcon: Icon(icon, size: 24),
      ),
    );
  }
}
