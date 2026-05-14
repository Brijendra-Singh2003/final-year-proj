import 'package:flutter/material.dart';
import 'package:mobile/core/theme/card_theme.dart';

class AppTheme {

  // 🌿 Primary Colors
  static const Color primaryGreen =
      Color(0xFF16A34A);

  static const Color lightGreen =
      Color(0xFF22C55E);

  static const Color darkGreen =
      Color(0xFF15803D);

  static const Color subtleGreen =
      Color(0xFFDCFCE7);

  static const Color mediumGreen =
      Color(0xFFBBF7D0);

  // 🎨 Backgrounds
  static const Color bgPrimary =
      Color(0xFFF8FAFC);

  static const Color bgSecondary =
      Color(0xFFF0FDF4);

  static const Color cardColor =
      Colors.white;

  static const Color cardHover =
      Color(0xFFDCFCE7);

  // 📝 Text Colors
  static const Color textPrimary =
      Color(0xFF0F172A);

  static const Color textSecondary =
      Color(0xFF475569);

  static const Color textMuted =
      Color(0xFF94A3B8);

  // ⚠️ Status Colors
  static const Color success =
      Color(0xFF16A34A);

  static const Color warning =
      Color(0xFFD97706);

  static const Color danger =
      Color(0xFFDC2626);

  // 🔲 Border Colors
  static const Color border =
      Color.fromRGBO(0, 0, 0, 0.08);

  static const Color borderStrong =
      Color.fromRGBO(0, 0, 0, 0.15);

  // 🌞 Light Theme
  static ThemeData lightTheme() {

    return ThemeData(

      useMaterial3: true,

      scaffoldBackgroundColor:
          bgPrimary,

      primaryColor:
          primaryGreen,

      colorScheme:
          ColorScheme.light(

        primary:
            primaryGreen,

        secondary:
            lightGreen,

        surface:
            cardColor,

        error:
            danger,
      ),

      appBarTheme:
          const AppBarTheme(

        backgroundColor:
            Colors.white,

        foregroundColor:
            textPrimary,

        elevation: 0,

        centerTitle: true,
      ),

      /* cardTheme: */
          /* CardTheme(

        color: cardColor,

        elevation: 2,

        shadowColor:
            Colors.black12,

        shape:
            RoundedRectangleBorder(
          borderRadius:
              BorderRadius.circular(16),
        ),
      ),
 */
      cardTheme: CustomCardTheme.lightCardTheme,
      elevatedButtonTheme:
          ElevatedButtonThemeData(

        style:
            ElevatedButton.styleFrom(

          backgroundColor:
              primaryGreen,

          foregroundColor:
              Colors.white,

          elevation: 4,

          shadowColor:
              primaryGreen
                  .withOpacity(0.35),

          shape:
              RoundedRectangleBorder(
            borderRadius:
                BorderRadius.circular(10),
          ),

          padding:
              const EdgeInsets.symmetric(
            vertical: 16,
            horizontal: 20,
          ),

          textStyle:
              const TextStyle(
            fontSize: 16,
            fontWeight:
                FontWeight.bold,
          ),
        ),
      ),

      inputDecorationTheme:
          InputDecorationTheme(

        filled: true,

        fillColor:
            Colors.white,

        contentPadding:
            const EdgeInsets.symmetric(
          horizontal: 16,
          vertical: 14,
        ),

        border:
            OutlineInputBorder(

          borderRadius:
              BorderRadius.circular(12),

          borderSide:
              const BorderSide(
            color: border,
          ),
        ),

        enabledBorder:
            OutlineInputBorder(

          borderRadius:
              BorderRadius.circular(12),

          borderSide:
              const BorderSide(
            color: border,
          ),
        ),

        focusedBorder:
            OutlineInputBorder(

          borderRadius:
              BorderRadius.circular(12),

          borderSide:
              const BorderSide(
            color: primaryGreen,
            width: 2,
          ),
        ),

        hintStyle:
            const TextStyle(
          color: textMuted,
        ),
      ),

      textTheme:
          const TextTheme(

        headlineLarge:
            TextStyle(
          color: textPrimary,
          fontWeight:
              FontWeight.bold,
        ),

        bodyLarge:
            TextStyle(
          color: textPrimary,
        ),

        bodyMedium:
            TextStyle(
          color: textSecondary,
        ),
      ),

      dividerColor:
          border,
    );
  }
}