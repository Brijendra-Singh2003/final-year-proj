/* import 'package:flutter/material.dart';
import 'package:mobile/features/appointment/presentation/screen/appointment_screen.dart';
import 'package:mobile/features/patient/presentation/patient_profile_screen.dart';
import 'package:mobile/features/patient/records/records_screen.dart';
import 'patient_dashboard_screen.dart';

class MainScreen extends StatefulWidget {
  const MainScreen({super.key});

  @override
  State<MainScreen> createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  int currentIndex = 0;

  final List<Widget> screens = const [
    PatientDashboardScreen(),
    AppointmentsScreen(),
    RecordsScreen(),
    PatientProfileScreen()
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: screens[currentIndex],

      bottomNavigationBar: BottomNavigationBar(
        currentIndex: currentIndex,
        onTap: (index) {
          setState(() {
            currentIndex = index;
          });
        },
        type: BottomNavigationBarType.fixed,
        selectedItemColor: Colors.blue,
        unselectedItemColor: Colors.grey,

        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: "Home",
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.calendar_today),
            label: "Appointments",
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.description),
            label: "Records",
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person),
            label: "Profile",
          ),
        ],
      ),
    );
  }
} */
import 'package:flutter/material.dart';

import 'package:mobile/core/theme/theme.dart';

import 'package:mobile/features/appointment/presentation/screen/appointment_screen.dart';

import 'package:mobile/features/patient/presentation/patient_profile_screen.dart';

import 'package:mobile/features/patient/records/records_screen.dart';

import 'patient_dashboard_screen.dart';

class MainScreen extends StatefulWidget {

  const MainScreen({super.key});

  @override
  State<MainScreen> createState() =>
      _MainScreenState();
}

class _MainScreenState
    extends State<MainScreen> {

  int currentIndex = 0;

  final List<Widget> screens =
      const [

    PatientDashboardScreen(),

    AppointmentsScreen(),

    RecordsScreen(),

    PatientProfileScreen(),
  ];

  @override
  Widget build(BuildContext context) {

    return Scaffold(

      backgroundColor:
          AppTheme.bgPrimary,

      body:
          screens[currentIndex],

      bottomNavigationBar:
          Container(

        decoration:
            BoxDecoration(

          color:
              Colors.white,

          boxShadow: [

            BoxShadow(

              color: Colors.black
                  .withOpacity(0.05),

              blurRadius: 10,

              offset:
                  const Offset(0, -2),
            ),
          ],
        ),

        child: BottomNavigationBar(

          currentIndex:
              currentIndex,

          onTap: (index) {

            setState(() {

              currentIndex =
                  index;
            });
          },

          type:
              BottomNavigationBarType.fixed,

          backgroundColor:
              Colors.white,

          elevation: 0,

          selectedItemColor:
              AppTheme.primaryGreen,

          unselectedItemColor:
              AppTheme.textMuted,

          selectedLabelStyle:
              const TextStyle(

            fontWeight:
                FontWeight.w600,
          ),

          unselectedLabelStyle:
              const TextStyle(

            fontWeight:
                FontWeight.w500,
          ),

          items: const [

            BottomNavigationBarItem(

              icon:
                  Icon(Icons.home),

              label: "Home",
            ),

            BottomNavigationBarItem(

              icon: Icon(
                Icons.calendar_today,
              ),

              label:
                  "Appointments",
            ),

            BottomNavigationBarItem(

              icon: Icon(
                Icons.description,
              ),

              label:
                  "Records",
            ),

            BottomNavigationBarItem(

              icon:
                  Icon(Icons.person),

              label: "Profile",
            ),
          ],
        ),
      ),
    );
  }
}