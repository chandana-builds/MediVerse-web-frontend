import 'package:flutter/material.dart';

class UserProvider extends ChangeNotifier {
  Map<String, dynamic>? _user;
  String? _userType; // 'patient', 'doctor', 'admin'

  Map<String, dynamic>? get user => _user;
  String? get userType => _userType;

  void setUser(Map<String, dynamic> user, String type) {
    _user = user;
    _userType = type;
    notifyListeners();
  }

  void logout() {
    _user = null;
    _userType = null;
    notifyListeners();
  }

  bool get isLoggedIn => _user != null;
  bool get isPatient => _userType == 'patient';
  bool get isDoctor => _userType == 'doctor';
  bool get isAdmin => _userType == 'admin';
}
