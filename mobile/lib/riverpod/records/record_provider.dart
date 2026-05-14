import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_riverpod/legacy.dart';

import '../../features/patient/records/record_api.dart';

import 'record_controller.dart';

import 'record_state.dart';

final recordProvider =
    StateNotifierProvider<
        RecordController,
        RecordState>(
  (ref) {

    return RecordController(
      RecordApi(),
    );
  },
);