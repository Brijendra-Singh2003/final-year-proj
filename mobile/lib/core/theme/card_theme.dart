import 'package:flutter/material.dart';

import 'theme.dart';

class CustomCardTheme {

  static CardThemeData lightCardTheme =
      CardThemeData(

    color: AppTheme.cardColor,

    elevation: 2,

    shadowColor: Colors.black12,

    shape:
        RoundedRectangleBorder(

      borderRadius:
          BorderRadius.circular(16),
    ),
  );
}