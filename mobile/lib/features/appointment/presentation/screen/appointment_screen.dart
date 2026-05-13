import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobile/core/theme/theme.dart';
import 'package:mobile/features/appointment/presentation/screen/pastwidget.dart';
import 'package:mobile/features/appointment/presentation/screen/upcomingWidget.dart';
import 'package:mobile/features/authentication/presentation/widget/customAppBar.dart';

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

    _tabController = TabController(length: 2, vsync: this);

    // TODO:
    // fetch appointments here later
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    // TODO:
    // Replace with provider state later

    final upcomingAppointments = [];
    final pastAppointments = [];

    return Scaffold(
      appBar: CustomAppBar(title: "Appointments", color: Colors.white),

      body: Column(
        children: [
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

          Expanded(
            child: TabBarView(
              controller: _tabController,
              children: [
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
