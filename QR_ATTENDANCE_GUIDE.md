# How to Use QR Attendance Module

This guide explains how to use the QR Code Attendance system for both students and staff.

## 1. Getting Started

The QR Attendance module allows quick, touch-free attendance tracking using generated QR codes. It supports:
- **Student Class Attendance**: Marking students as 'Present' for a specific class.
- **Staff Check-In/Out**: Tracking daily work hours for teachers and staff.

To access the module, navigate to the **Attendance** section in the Admin Dashboard.

---

## 2. Generating QR ID Cards

Before users can scan in, they need their unique QR ID cards.

1. Go to **Attendance** > **Print QR Cards**.
2. You will see two tabs:
   - **Students**: Lists all active students with their generated QR codes.
   - **Staff**: Lists all active teachers/staff.
3. Click the **Print (Ctrl+P)** button or use your browser's print function.
4. **Tip**: For best results, print on cardstock or laminate the cut-out cards for durability.

The QR code contains the user's unique System ID, which creates a secure link to their record.

---

## 3. Using the Kiosk Mode

The Kiosk Mode is designed to run on a tablet, laptop, or phone with a camera, placed at a classroom entrance or school reception.

1. Go to **Attendance** > **Open Kiosk Mode**.
2. Allow browser permission to access the camera if prompted.

### For Student Attendance (Classroom Mode)
1. Select the **Student** tab in the *Settings* panel.
2. **Crucial**: Select the **Active Class** from the dropdown menu (e.g., "10-A Science").
   - *Note: Students must be enrolled in this specific class to be marked present.*
3. Students simply show their QR card to the camera.
4. **Success**: A green "Attendance Marked" confirmation will appear with the student's name.
5. **Error**: If a student is not enrolled or the code is invalid, a red error message will appear.

### For Staff Attendance (Reception Mode)
1. Select the **Staff** tab in the *Settings* panel.
2. Select the Action:
   - **Check In**: For arrival at the start of the day.
   - **Check Out**: For departure at the end of the day.
3. Staff members scan their QR card.
4. The system records the exact timestamp of the scan.

---

## 4. Troubleshooting

- **Camera not working?** 
  - Ensure the browser has permission to use the camera.
  - Check if the camera is being used by another application (like Zoom/Teams).
  - Try reloading the page.

- **Student "Not Found" or "Not Enrolled"?**
  - Verify the student is active in the **Students** module.
  - Verification the student is assigned to the selected class in the **Classes** module.
  - Ensure you are scanning the correct QR card for that specific student.

- **Double Scanning?**
  - The system has a built-in delay (2 seconds) to prevent accidental double scans.
  - Re-scanning a student who is already marked present for that day/class will simply update the timestamp or confirm they are present.
