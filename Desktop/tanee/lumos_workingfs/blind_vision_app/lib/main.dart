// import 'dart:async';
// import 'dart:convert';
// import 'package:camera/camera.dart';
// import 'package:flutter/material.dart';
// import 'package:flutter_tts/flutter_tts.dart';
// import 'package:http/http.dart' as http;

// void main() async {
//   WidgetsFlutterBinding.ensureInitialized();
//   final cameras = await availableCameras();
//   final firstCamera = cameras.first;
//   runApp(MyApp(camera: firstCamera));
// }

// class MyApp extends StatelessWidget {
//   final CameraDescription camera;
//   const MyApp({required this.camera});

//   @override
//   Widget build(BuildContext context) {
//     return MaterialApp(
//       title: 'Blind Vision',
//       home: LiveVision(camera: camera),
//       debugShowCheckedModeBanner: false,
//     );
//   }
// }

// class LiveVision extends StatefulWidget {
//   final CameraDescription camera;
//   const LiveVision({required this.camera});

//   @override
//   State<LiveVision> createState() => _LiveVisionState();
// }

// class _LiveVisionState extends State<LiveVision> {
//   late CameraController _controller;
//   late Future<void> _initializeControllerFuture;
//   final FlutterTts _tts = FlutterTts();
//   bool _isRunning = false;
//   String _description = "";
//   Timer? _timer;

//   // ⚠️ Replace with your system’s LAN IP where the Node server is running
//   final String serverUrl = "http://192.168.1.5:3000/describe";

//   @override
//   void initState() {
//     super.initState();
//     _controller = CameraController(widget.camera, ResolutionPreset.low);
//     _initializeControllerFuture = _controller.initialize();
//   }

//   Future<void> captureAndDescribe() async {
//     if (!_controller.value.isInitialized) return;

//     try {
//       final picture = await _controller.takePicture();
//       final bytes = await picture.readAsBytes();
//       final base64Image = base64Encode(bytes);

//       final response = await http.post(
//         Uri.parse(serverUrl),
//         headers: {'Content-Type': 'application/json'},
//         body: jsonEncode({'imageBase64': base64Image}),
//       );

//       if (response.statusCode == 200) {
//         final data = jsonDecode(response.body);
//         final desc = data['description'] ?? "No description.";
//         if (desc != _description) {
//           setState(() => _description = desc);
//           _tts.speak(desc);
//         }
//       }
//     } catch (e) {
//       print("Error capturing frame: $e");
//     }
//   }

//   void startVision() {
//     _timer = Timer.periodic(const Duration(seconds: 5), (_) => captureAndDescribe());
//     setState(() => _isRunning = true);
//   }

//   void stopVision() {
//     _timer?.cancel();
//     setState(() => _isRunning = false);
//   }

//   @override
//   void dispose() {
//     _controller.dispose();
//     _timer?.cancel();
//     super.dispose();
//   }

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       body: FutureBuilder<void>(
//         future: _initializeControllerFuture,
//         builder: (context, snapshot) {
//           if (snapshot.connectionState == ConnectionState.done) {
//             return Stack(
//               children: [
//                 CameraPreview(_controller),
//                 Align(
//                   alignment: Alignment.bottomCenter,
//                   child: Container(
//                     color: Colors.black54,
//                     padding: const EdgeInsets.all(16),
//                     child: Column(
//                       mainAxisSize: MainAxisSize.min,
//                       children: [
//                         Text(
//                           _description,
//                           style: const TextStyle(color: Colors.white, fontSize: 18),
//                           textAlign: TextAlign.center,
//                         ),
//                         const SizedBox(height: 12),
//                         ElevatedButton(
//                           style: ElevatedButton.styleFrom(
//                             backgroundColor: _isRunning ? Colors.red : Colors.green,
//                           ),
//                           onPressed: _isRunning ? stopVision : startVision,
//                           child: Text(_isRunning ? "STOP" : "START"),
//                         ),
//                       ],
//                     ),
//                   ),
//                 ),
//               ],
//             );
//           } else {
//             return const Center(child: CircularProgressIndicator());
//           }
//         },
//       ),
//     );
//   }
// }
import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'package:camera/camera.dart';
import 'package:flutter/material.dart';
import 'package:flutter_tts/flutter_tts.dart';
import 'package:http/http.dart' as http;

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  final cameras = await availableCameras();
  final firstCamera = cameras.first;
  runApp(MyApp(camera: firstCamera));
}

class MyApp extends StatelessWidget {
  final CameraDescription camera;
  const MyApp({required this.camera});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Blind Vision',
      debugShowCheckedModeBanner: false,
      theme: ThemeData.dark(),
      home: LiveVision(camera: camera),
    );
  }
}

class LiveVision extends StatefulWidget {
  final CameraDescription camera;
  const LiveVision({required this.camera});

  @override
  State<LiveVision> createState() => _LiveVisionState();
}

class _LiveVisionState extends State<LiveVision> {
  late CameraController _controller;
  late Future<void> _initializeControllerFuture;
  final FlutterTts _tts = FlutterTts();
  bool _isRunning = false;
  String _description = "";
  String _status = "Ready to start";
  bool _isProcessing = false;
  Timer? _timer;

  // ⚠️ Use your computer's IP address when testing on physical device
  final String serverUrl = "http://192.168.68.53:3000/describe";

  @override
  void initState() {
    super.initState();
    _controller = CameraController(
      widget.camera, 
      ResolutionPreset.medium, 
      enableAudio: false,
      imageFormatGroup: ImageFormatGroup.jpeg,
    );
    _initializeControllerFuture = _controller.initialize();
  }

  Future<void> captureAndDescribe() async {
    if (!_controller.value.isInitialized || !_isRunning || _isProcessing) return;

    setState(() {
      _isProcessing = true;
      _status = "Analyzing image...";
    });

    try {
      // Check if camera is still active
      if (!_controller.value.isInitialized) {
        setState(() => _status = "Camera not ready");
        return;
      }

      final picture = await _controller.takePicture();
      final bytes = await picture.readAsBytes();
      final base64Image = base64Encode(bytes);

      // Clean up the temporary file
      final file = File(picture.path);
      if (await file.exists()) await file.delete();

      final response = await http.post(
        Uri.parse(serverUrl),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'imageBase64': base64Image}),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final desc = data['description'] ?? "No objects detected.";

        if (desc != _description) {
          setState(() {
            _description = desc;
            _status = "Object detected!";
          });
          _tts.speak(desc);
        }
      } else {
        setState(() => _status = "Server error: ${response.statusCode}");
        print("Server error: ${response.statusCode} - ${response.body}");
      }
    } catch (e) {
      setState(() => _status = "Error: ${e.toString().substring(0, 50)}...");
      print("Error capturing frame: $e");
    } finally {
      setState(() => _isProcessing = false);
    }
  }

  void startVision() {
    _timer = Timer.periodic(const Duration(seconds: 3), (_) => captureAndDescribe());
    setState(() {
      _isRunning = true;
      _status = "Vision started - Point camera at objects";
    });
  }

  void stopVision() {
    _timer?.cancel();
    setState(() {
      _isRunning = false;
      _status = "Vision stopped";
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: FutureBuilder<void>(
        future: _initializeControllerFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.done) {
            return Stack(
              children: [
                CameraPreview(_controller),
                
                // Status indicator at the top
                Positioned(
                  top: 50,
                  left: 20,
                  right: 20,
                  child: Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: _isProcessing ? Colors.orange.withOpacity(0.8) : 
                             _isRunning ? Colors.green.withOpacity(0.8) : Colors.grey.withOpacity(0.8),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      _status,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ),
                ),

                // Object description in the center
                if (_description.isNotEmpty)
                  Positioned(
                    top: 120,
                    left: 20,
                    right: 20,
                    child: Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: Colors.black87,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: Colors.white, width: 2),
                      ),
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const Text(
                            "OBJECT DETECTED:",
                            style: TextStyle(
                              color: Colors.yellow,
                              fontSize: 14,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            _description,
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                            textAlign: TextAlign.center,
                          ),
                        ],
                      ),
                    ),
                  ),

                // Start/Stop button near bottom
                Positioned(
                  bottom: 50,
                  left: MediaQuery.of(context).size.width * 0.25,
                  right: MediaQuery.of(context).size.width * 0.25,
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      if (_isProcessing)
                        const Padding(
                          padding: EdgeInsets.only(bottom: 10),
                          child: CircularProgressIndicator(
                            color: Colors.white,
                            strokeWidth: 3,
                          ),
                        ),
                      ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: _isRunning ? Colors.red : Colors.green,
                          padding: const EdgeInsets.symmetric(vertical: 15, horizontal: 30),
                          textStyle: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        ),
                        onPressed: _isProcessing ? null : (_isRunning ? stopVision : startVision),
                        child: Text(_isRunning ? "STOP VISION" : "START VISION"),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        _isRunning ? "Tap to stop object recognition" : "Tap to start object recognition",
                        style: const TextStyle(
                          color: Colors.white70,
                          fontSize: 12,
                        ),
                        textAlign: TextAlign.center,
                      ),
                    ],
                  ),
                ),
              ],
            );
          } else {
            return const Center(child: CircularProgressIndicator());
          }
        },
      ),
    );
  }
}
