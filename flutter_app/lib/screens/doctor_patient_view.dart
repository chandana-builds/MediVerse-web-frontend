import 'package:flutter/material.dart';

class DoctorPatientView extends StatefulWidget {
  final String patientId;
  final String patientName;

  const DoctorPatientView({super.key, required this.patientId, required this.patientName});

  @override
  State<DoctorPatientView> createState() => _DoctorPatientViewState();
}

class _DoctorPatientViewState extends State<DoctorPatientView> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  final _medicineController = TextEditingController();
  final _foodController = TextEditingController();
  final _exerciseController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  void _addPrescription() async {
    // Implement API call to add prescription
    // For MVP, just show success
    ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Prescription Added Successfully')));
    Navigator.pop(context);
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: Text(widget.patientName, style: const TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: Colors.white,
        foregroundColor: const Color(0xFF0F172A),
        elevation: 0,
        bottom: TabBar(
          controller: _tabController,
          labelColor: theme.colorScheme.primary,
          unselectedLabelColor: const Color(0xFF64748B),
          indicatorColor: theme.colorScheme.primary,
          tabs: const [
            Tab(text: "Prescribe"),
            Tab(text: "History"),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildPrescriptionForm(theme),
          _buildHistoryView(),
        ],
      ),
    );
  }

  Widget _buildPrescriptionForm(ThemeData theme) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text("New Consultation", style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
          const SizedBox(height: 24),
          
          _buildSectionHeader("Medicine", Icons.medication_rounded, Colors.blue),
          TextField(
            controller: _medicineController,
            maxLines: 3,
            decoration: const InputDecoration(hintText: 'e.g. Paracetamol 500mg (Morning, Night)'),
          ),
          const SizedBox(height: 24),

          _buildSectionHeader("Dietary Advice", Icons.restaurant_rounded, Colors.orange),
          TextField(
            controller: _foodController,
            maxLines: 2,
            decoration: const InputDecoration(hintText: 'e.g. Low salt diet, avoid spicy food'),
          ),
          const SizedBox(height: 24),

          _buildSectionHeader("Exercise Plan", Icons.directions_run_rounded, Colors.green),
          TextField(
            controller: _exerciseController,
            maxLines: 2,
            decoration: const InputDecoration(hintText: 'e.g. 30 mins brisk walking daily'),
          ),
          const SizedBox(height: 32),

          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: _addPrescription,
              style: ElevatedButton.styleFrom(
                backgroundColor: theme.colorScheme.primary,
                foregroundColor: Colors.white,
              ),
              child: const Text("SAVE PRESCRIPTION"),
            ),
          )
        ],
      ),
    );
  }

  Widget _buildHistoryView() {
    return ListView(
      padding: const EdgeInsets.all(24),
      children: [
        _buildHistoryItem("10 Oct 2023", "Viral Fever", "Paracetamol, Rest"),
        _buildHistoryItem("15 Sep 2023", "Routine Checkup", "Vitamin D supplements"),
      ],
    );
  }

  Widget _buildSectionHeader(String title, IconData icon, Color color) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        children: [
          Icon(icon, color: color, size: 20),
          const SizedBox(width: 8),
          Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
        ],
      ),
    );
  }

  Widget _buildHistoryItem(String date, String diagnosis, String prescription) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16), side: const BorderSide(color: Color(0xFFE2E8F0))),
      elevation: 0,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(diagnosis, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                Text(date, style: const TextStyle(color: Color(0xFF64748B), fontSize: 12)),
              ],
            ),
            const SizedBox(height: 8),
            Text(prescription, style: const TextStyle(color: Color(0xFF475569))),
          ],
        ),
      ),
    );
  }
}
