import 'package:flutter/material.dart';

class AdminDatabaseView extends StatefulWidget {
  const AdminDatabaseView({super.key});

  @override
  State<AdminDatabaseView> createState() => _AdminDatabaseViewState();
}

class _AdminDatabaseViewState extends State<AdminDatabaseView> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  Map<String, dynamic> _data = {};
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
    _fetchData();
  }

  void _fetchData() async {
    // In a real app, we would fetch from /api/admin/database
    // For MVP, we'll mock the response to match the fields
    await Future.delayed(const Duration(seconds: 1));
    if (mounted) {
      setState(() {
        _data = {
          'patients': [
             {'id': 1, 'name': 'John Doe', 'age': 45, 'diagnosis': 'Hypertension'},
             {'id': 2, 'name': 'Jane Smith', 'age': 32, 'diagnosis': 'Migraine'},
             {'id': 3, 'name': 'Robert Brown', 'age': 58, 'diagnosis': 'Diabetes Type 2'},
          ],
          'doctors': [
             {'id': 101, 'name': 'Dr. Sarah Wilson', 'speciality': 'Cardiology'},
             {'id': 102, 'name': 'Dr. Rajesh Kumar', 'speciality': 'General Medicine'},
          ],
          'ambulances': [
             {'id': 729, 'driver': 'Rajesh Kumar', 'status': 'Active', 'location': 'Sector 62'},
             {'id': 850, 'driver': 'Amit Singh', 'status': 'Idle', 'location': 'Sector 18'},
          ]
        };
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: const Text('System Database', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: Colors.white,
        foregroundColor: const Color(0xFF0F172A),
        elevation: 0,
        bottom: TabBar(
          controller: _tabController,
          labelColor: Colors.blue,
          unselectedLabelColor: Colors.grey,
          tabs: const [
            Tab(text: "Patients"),
            Tab(text: "Doctors"),
            Tab(text: "Ambulances"),
          ],
        ),
      ),
      body: _isLoading 
        ? const Center(child: CircularProgressIndicator())
        : TabBarView(
            controller: _tabController,
            children: [
              _buildTable(_data['patients'], ['id', 'name', 'age', 'diagnosis']),
              _buildTable(_data['doctors'], ['id', 'name', 'speciality']),
              _buildTable(_data['ambulances'], ['id', 'driver', 'status', 'location']),
            ],
          ),
    );
  }

  Widget _buildTable(List<dynamic>? data, List<String> columns) {
    if (data == null || data.isEmpty) return const Center(child: Text("No records found"));

    return SingleChildScrollView(
      scrollDirection: Axis.vertical,
      child: SingleChildScrollView(
        scrollDirection: Axis.horizontal,
        child: DataTable(
          columns: columns.map((col) => DataColumn(label: Text(col.toUpperCase(), style: const TextStyle(fontWeight: FontWeight.bold)))).toList(),
          rows: data.map((row) {
            return DataRow(
              cells: columns.map((col) => DataCell(Text(row[col].toString()))).toList(),
            );
          }).toList(),
        ),
      ),
    );
  }
}
