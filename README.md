# Login_Camera_Geotag_App

### Technical Assessment – Mobile App (Ionic + Capacitor)

This project demonstrates an end-to-end mobile application built using **Ionic Angular** and **Capacitor**, featuring:

- User Login with validation  
- Camera capture and image storage  
- Geolocation tagging (latitude & longitude)  
- Local storage persistence  
- Delete & Logout functionality  

---

## Tech Stack

- **Framework:** Ionic Angular  
- **Plugins:**
  - `@capacitor/camera` – capture photo from camera  
  - `@capacitor/geolocation` – fetch location (latitude, longitude)  
  - `@capacitor/preferences` – store metadata locally  
  - `@capacitor/filesystem` – manage local files  
  - `navigator.mediaDevices` – webcam access for web testing  

---

## Setup & Run Instructions

### Clone the repository
```bash
git clone https://github.com/bhoomikapmgithub/Login_Camera_Geotag_App.git
cd Login_Camera_Geotag_App


## Example Stored Data
Below is an example of how image data is stored locally in JSON format:

```json
[
  {
    "path": "file:///storage/emulated/0/Pictures/capture_1.jpg",
    "timestamp": "2025-10-27T13:45:12Z",
    "latitude": 12.9716,
    "longitude": 77.5946
  }
]


