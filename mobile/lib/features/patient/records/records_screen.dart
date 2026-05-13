import 'package:flutter/material.dart';
import 'package:mobile/features/authentication/presentation/widget/customAppBar.dart';

class RecordsScreen extends StatefulWidget {
  const RecordsScreen({super.key});

  @override
  State<RecordsScreen> createState() => _RecordsScreenState();
}

class _RecordsScreenState extends State<RecordsScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: CustomAppBar(title: "Medical Records", color: Colors.white),
      body: const Center(
        child: Text("Medical records content will be displayed here."),
      ),
    );
  }
}