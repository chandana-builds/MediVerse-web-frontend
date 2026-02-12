import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/user_provider.dart';

class RecordsScreen extends StatelessWidget {
  const RecordsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final user = Provider.of<UserProvider>(context).user!;
    final visits = user['visits'] ?? [];
    final history = user['medical_history'] ?? "No active diagnostic history recorded.";
    final theme = Theme.of(context);

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(title: const Text('Diagnostic Data', style: TextStyle(fontWeight: FontWeight.bold)), backgroundColor: Colors.white, elevation: 0),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text("Primary History", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF1E293B))),
            const SizedBox(height: 16),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(color: const Color(0xFFF8FAFC), borderRadius: BorderRadius.circular(24), border: Border.all(color: const Color(0xFFE2E8F0))),
              child: Text(history, style: const TextStyle(fontSize: 15, color: Color(0xFF334155), height: 1.5)),
            ),
            const SizedBox(height: 32),
            const Text("Consultation Logs", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF1E293B))),
            const SizedBox(height: 16),
            if (visits.isEmpty)
              Container(padding: const EdgeInsets.all(32), width: double.infinity, decoration: BoxDecoration(color: const Color(0xFFF8FAFC), borderRadius: BorderRadius.circular(24)), child: const Text("No previous logs available.", textAlign: TextAlign.center, style: TextStyle(color: Color(0xFF64748B))))
            else
              ListView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: visits.length,
                itemBuilder: (context, index) {
                  final visit = visits[index];
                  return Container(
                    margin: const EdgeInsets.only(bottom: 16),
                    decoration: BoxDecoration(color: const Color(0xFFF8FAFC), borderRadius: BorderRadius.circular(24), border: Border.all(color: const Color(0xFFE2E8F0))),
                    child: ExpansionTile(
                      shape: const Border(),
                      tilePadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
                      title: Text(visit['hospital'] as String, style: const TextStyle(fontWeight: FontWeight.bold)),
                      subtitle: Text("${visit['date']} • ${visit['doctorName']}", style: const TextStyle(fontSize: 13)),
                      children: [
                        Padding(
                          padding: const EdgeInsets.fromLTRB(20, 0, 20, 20),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Divider(),
                              const SizedBox(height: 12),
                              _buildResultRow("Practitioner ID", visit['doctorID'] as String),
                              const SizedBox(height: 12),
                              const Text("Laboratory Analysis:", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF1E293B))),
                              const SizedBox(height: 8),
                              _buildResultRow("Glucose Level", visit['results']?['glucose'] ?? 'N/A'),
                              _buildResultRow("Hemoglobin", visit['results']?['hemoglobin'] ?? 'N/A'),
                              _buildResultRow("Authorized By", visit['results']?['by'] ?? 'N/A'),
                            ],
                          ),
                        )
                      ],
                    ),
                  );
                },
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildResultRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(fontSize: 13, color: Color(0xFF64748B))),
          Text(value, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: Color(0xFF1E293B))),
        ],
      ),
    );
  }
}
