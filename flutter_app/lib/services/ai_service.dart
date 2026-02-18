import 'dart:convert';
import 'package:http/http.dart' as http;

class AIService {
  final String _baseUrl = 'http://10.0.2.2:8000/api/ai'; // Android Emulator localhost

  Future<String> sendMessage(String message) async {
    try {
      final response = await http.post(
        Uri.parse('$_baseUrl/chat'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'message': message}),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return data['reply'];
      } else {
        throw Exception('Failed to load AI response');
      }
    } catch (e) {
      throw Exception('Error: $e');
    }
  }
}
