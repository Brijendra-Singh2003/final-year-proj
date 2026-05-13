import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'package:mobile/core/theme/theme.dart';

import 'package:mobile/features/appointment/presentation/screen/pastwidget.dart';

import 'package:mobile/features/appointment/presentation/screen/upcomingWidget.dart';

import 'package:mobile/features/authentication/presentation/widget/customAppBar.dart';

import 'package:mobile/riverpod/appointment/appointment_provider.dart';

class AppointmentsScreen extends ConsumerStatefulWidget {
  const AppointmentsScreen({super.key});

  @override
  ConsumerState<AppointmentsScreen> createState() => _AppointmentsScreenState();
}

class _AppointmentsScreenState extends ConsumerState<AppointmentsScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();

    // 🔥 Initialize TabController
    _tabController = TabController(length: 2, vsync: this);

    // 🔥 Fetch appointments
    Future.microtask(() {
      ref.read(appointmentProvider.notifier).fetchAppointments();
    });
  }

  @override
  void dispose() {
    _tabController.dispose();

    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: CustomAppBar(title: "Appointments", color: Colors.white),

      body: Column(
        children: [
          // 🔥 Tabs
          Material(
            color: Colors.white,

            child: TabBar(
              controller: _tabController,

              labelColor: AppTheme.lightTheme().primaryColor,

              unselectedLabelColor: Colors.grey,

              indicatorColor: AppTheme.lightTheme().primaryColor,

              tabs: const [
                Tab(text: "Upcoming"),

                Tab(text: "Past"),
              ],
            ),
          ),

          // 🔥 Tab Screens
          Expanded(
            child: TabBarView(
              controller: _tabController,

              children: const [
                UpcomingAppointmentsWidget(),

                PastAppointmentsWidget(),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
