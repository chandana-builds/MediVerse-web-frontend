import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:dio/dio.dart';

class EmergencyService {
  static String get _baseUrl {
    if (kIsWeb) return 'http://localhost:3000';
    if (Platform.isAndroid) return 'http://10.0.2.2:3000';
    return 'http://localhost:3000';
  }

  final Dio _dio = Dio(BaseOptions(
    baseUrl: _baseUrl,
    connectTimeout: const Duration(seconds: 5),
    receiveTimeout: const Duration(seconds: 5),
  ));

  Future<Map<String, dynamic>> triggerEmergency(String patientId, Map<String, double> gps) async {
    try {
      final response = await _dio.post('/api/emergency/trigger', data: {
        'patientId': patientId,
        'gps': gps,
      });

      if (response.statusCode == 200) {
        return response.data;
      } else {
        throw Exception('Failed to trigger emergency: ${response.statusMessage}');
      }
    } catch (e) {
      throw Exception('Emergency Service Error: $e');
    }
  }
}
