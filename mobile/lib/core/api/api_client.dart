import 'package:dio/dio.dart';
import '../storage/secure_storage.dart';

class ApiClient {
  late Dio dio;

  ApiClient() {
    dio = Dio(
      BaseOptions(
        baseUrl: "https://patient-management-vku0.onrender.com",
        connectTimeout: const Duration(seconds: 10),
      ),
    );

    dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          final token = await SecureStorage.getToken();

          if (token != null) {
            options.headers["Authorization"] = "Bearer $token";
          }

          return handler.next(options);
        },
        onError:(e, handler){
          //print("API Error: ${e.message}");
          return handler.next(e);
        }
      ),
    );
  }
}