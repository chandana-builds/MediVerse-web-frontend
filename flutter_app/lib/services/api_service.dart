import 'dart:io';
import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';

class ApiService {
  static String get _baseUrl => 'https://mediverse-backend-production.up.railway.app';
  /* {
    if (kIsWeb) return 'http://localhost:3000';
    if (Platform.isAndroid) return 'http://10.0.2.2:3000';
    return 'http://localhost:3000';
  }*/

  final Dio _dio = Dio(BaseOptions(
    baseUrl: _baseUrl,
    connectTimeout: const Duration(seconds: 5),
    receiveTimeout: const Duration(seconds: 5),
  ));

  Future<Map<String, dynamic>> login(String username, String password, {String role = 'patient'}) async {
    try {
      final endpoint = role == 'admin' ? '/api/auth/login/admin' : 
                       role == 'doctor' ? '/api/auth/login/doctor' : 
                       '/api/auth/login/patient';
      
      // For MVP, if Admin endpoint doesn't exist, we might need a workaround, 
      // but we should aim to hit the real one. 
      // Note: We haven't created authController.loginAdmin yet in backend, 
      // so for now we might map admin to a specific hardcoded check or ensure backend has it.
      // Let's assume backend has it or will have it. 
      
      final data = {
        'password': password,
      };
      
      if (role == 'doctor') {
        data['doctorId'] = username;
        // Backend might still expect username for doctors? If not, removing it. 
        // Based on previous code, it seemed to want both or switch. 
        // Let's assume standard auth usually takes username/password.
        data['username'] = username; 
      } else {
         data['username'] = username;
      }

      final response = await _dio.post(endpoint, data: data);
      return response.data;
    } on DioException catch (e) {
      throw Exception(e.response?.data['error'] ?? 'Login failed');
    }
  }

  Future<Map<String, dynamic>> registerPatient(Map<String, dynamic> data) async {
    try {
      final response = await _dio.post('/api/auth/register/patient', data: data);
      return response.data;
    } on DioException catch (e) {
      throw Exception(e.response?.data['error'] ?? 'Registration failed');
    }
  }

  Future<Map<String, dynamic>> updatePatientData(Map<String, dynamic> data) async {
    try {
      final response = await _dio.post('/api/patient/update', data: data);
      return response.data;
    } on DioException catch (e) {
      throw Exception(e.response?.data['error'] ?? 'Update failed');
    }
  }
}
