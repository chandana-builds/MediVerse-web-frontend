import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import 'screens/home_screen.dart';
import 'screens/role_selection_screen.dart';
import 'services/emergency_service.dart';
import 'services/api_service.dart';
import 'providers/user_provider.dart';

void main() {
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => UserProvider()),
        Provider(create: (_) => EmergencyService()),
        Provider(create: (_) => ApiService()),
      ],
      child: const MediVerseApp(),
    ),
  );
}

class MediVerseApp extends StatelessWidget {
  const MediVerseApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'MediVerse',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF0EA5E9),
          primary: const Color(0xFF0EA5E9),
          secondary: const Color(0xFF10B981),
          surface: const Color(0xFFF8FAFC),
          error: const Color(0xFFEF4444),
          brightness: Brightness.light,
        ),
        textTheme: GoogleFonts.outfitTextTheme(
          Theme.of(context).textTheme,
        ).copyWith(
          displayLarge: GoogleFonts.outfit(fontWeight: FontWeight.bold, fontSize: 32, color: const Color(0xFF020617)),
          titleLarge: GoogleFonts.outfit(fontWeight: FontWeight.w600, fontSize: 20),
          bodyLarge: GoogleFonts.outfit(fontSize: 16, color: const Color(0xFF64748B)),
        ),
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            elevation: 0,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 24),
          ),
        ),
        cardTheme: CardThemeData(
          elevation: 2,
          shadowColor: Colors.black.withValues(alpha: 0.04),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
          color: Colors.white,
        ),
        inputDecorationTheme: InputDecorationTheme(
          filled: true,
          fillColor: const Color(0xFFF1F5F9),
          border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide.none),
          focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: const BorderSide(color: Color(0xFF0EA5E9), width: 2)),
          contentPadding: const EdgeInsets.all(20),
        ),
      ),
      home: Consumer<UserProvider>(
        builder: (context, userProvider, _) {
          if (userProvider.user == null) return const RoleSelectionScreen();
          // Based on role, navigate to respective dashboard
          // For now, we only have Patient Home, others will be added
          if (userProvider.isAdmin) return const Scaffold(body: Center(child: Text("Admin Dashboard (Coming Soon)")));
          if (userProvider.isDoctor) return const Scaffold(body: Center(child: Text("Doctor Dashboard (Coming Soon)")));
          return const HomeScreen();
        },
      ),
    );
  }
}
