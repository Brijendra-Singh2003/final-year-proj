import 'package:flutter/material.dart';

import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'package:mobile/features/authentication/presentation/widget/customAppBar.dart';

import 'package:mobile/riverpod/records/record_provider.dart';

class RecordsScreen
    extends ConsumerStatefulWidget {

  const RecordsScreen({
    super.key,
  });

  @override
  ConsumerState<RecordsScreen>
      createState() =>
          _RecordsScreenState();
}

class _RecordsScreenState
    extends ConsumerState<RecordsScreen> {

  @override
  void initState() {

    super.initState();

    Future.microtask(() {

      ref
          .read(
            recordProvider.notifier,
          )
          .fetchRecords();
    });
  }

  @override
  Widget build(
    BuildContext context,
  ) {

    final state =
        ref.watch(recordProvider);

    return Scaffold(

      appBar: CustomAppBar(
        title: "Records",
        color: Colors.white,
      ),

      body: Builder(
        builder: (context) {

          // 🔥 Loading
          if (state.isLoading) {

            return const Center(
              child:
                  CircularProgressIndicator(),
            );
          }

          // 🔥 Error
          if (state.error != null) {

            return Center(
              child: Text(
                state.error!,
              ),
            );
          }

          // 🔥 Empty state
          final validRecords =
    state.records.where(
  (record) {

    return record
            .reports
            .isNotEmpty ||

        record
            .testResultFiles
            .isNotEmpty;
  },
).toList();
          if (validRecords.isEmpty) {

            return const Center(
              child: Column(

                mainAxisAlignment:
                    MainAxisAlignment.center,

                children: [

                  Icon(
                    Icons.folder_open,
                    size: 80,
                    color: Colors.grey,
                  ),

                  SizedBox(height: 16),

                  Text(
                    "No documents found",
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight:
                          FontWeight.w600,
                    ),
                  ),

                  SizedBox(height: 8),

                  Text(
                    "Medical records will appear here",
                    style: TextStyle(
                      color: Colors.grey,
                    ),
                  ),
                ],
              ),
            );
          }

          // 🔥 Records list
          return ListView.builder(

            padding:
                const EdgeInsets.all(16),

            itemCount:
                validRecords.length,

            itemBuilder:
                (context, index) {

              final record =
                  state.records[index];

              return Card(

                margin:
                    const EdgeInsets.only(
                  bottom: 16,
                ),

                elevation: 4,

                shape:
                    RoundedRectangleBorder(
                  borderRadius:
                      BorderRadius.circular(
                    16,
                  ),
                ),

                child: ListTile(

                  contentPadding:
                      const EdgeInsets.all(
                    16,
                  ),

                  leading: CircleAvatar(

                    radius: 28,

                    backgroundColor:
                        Colors.blue.shade100,

                    child: Icon(
                      Icons.description,
                      color:
                          Colors.blue.shade700,
                    ),
                  ),

                  title: Text(

                    record.summary,

                    style: const TextStyle(
                      fontWeight:
                          FontWeight.bold,
                    ),
                  ),

                  subtitle: Padding(

                    padding:
                        const EdgeInsets.only(
                      top: 8,
                    ),

                    child: Text(
                      record.createdAt,
                    ),
                  ),

                  trailing: const Icon(
                    Icons.arrow_forward_ios,
                    size: 18,
                  ),
                ),
              );
            },
          );
        },
      ),
    );
  }
}