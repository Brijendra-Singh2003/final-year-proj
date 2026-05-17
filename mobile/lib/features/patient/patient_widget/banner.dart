import 'package:flutter/material.dart';
import 'package:mobile/core/theme/theme.dart';

class BannerWidget extends StatelessWidget {

  const BannerWidget({
    super.key,
  });

  @override
  Widget build(BuildContext context) {

    return Container(

      width: double.infinity,

      padding:
          const EdgeInsets.symmetric(
        horizontal: 20,
        vertical: 20,
      ),

      decoration: BoxDecoration(

        gradient:
            LinearGradient(

          colors: [

            AppTheme.primaryGreen,

            AppTheme.lightGreen,
          ],

          begin:
              Alignment.topLeft,

          end:
              Alignment.bottomRight,
        ),

        borderRadius:
            BorderRadius.circular(20),

        boxShadow: [

          BoxShadow(

            color:
                AppTheme.primaryGreen
                    .withOpacity(0.20),

            blurRadius: 16,

            offset:
                const Offset(0, 6),
          ),
        ],
      ),

      child: Column(

        mainAxisSize:
            MainAxisSize.min,

        crossAxisAlignment:
            CrossAxisAlignment.start,

        children: [

          Container(

            padding:
                const EdgeInsets.symmetric(
              horizontal: 10,
              vertical: 5,
            ),

            decoration: BoxDecoration(

              color:
                  Colors.white
                      .withOpacity(0.18),

              borderRadius:
                  BorderRadius.circular(
                20,
              ),
            ),

            child: const Text(

              "LIMITED TIME",

              style: TextStyle(

                color: Colors.white,

                fontWeight:
                    FontWeight.w600,

                fontSize: 11,
              ),
            ),
          ),

          const SizedBox(height: 14),

          const Text(

            "Health Checkup\nat 20% OFF",

            style: TextStyle(

              fontSize: 22,

              fontWeight:
                  FontWeight.bold,

              color: Colors.white,

              height: 1.25,
            ),
          ),

          const SizedBox(height: 10),

          Text(

            "Book your appointment today",

            style: TextStyle(

              fontSize: 13,

              color:
                  Colors.white
                      .withOpacity(0.9),
            ),
          ),
        ],
      ),
    );
  }
}
