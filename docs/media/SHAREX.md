## Custom Sharex OCR

To use it in sharex instead of the usual OCR, you must:

1. Install Node.js 18+ or Bun.sh (and don't forget to select "Add to PATH")
2. Download this repository

![download button](https://github.com/user-attachments/assets/c4f82616-ec23-4ad2-9686-961d17543f13)

3. In the folder, type `npm install` or `bun install` (depending on what you are using)
4. Open ShareX Settings and go to Task Settings.

![sharex settings](https://github.com/user-attachments/assets/958eb80c-2350-4850-a819-2b61feb5eb73)

5. Go to the "Actions" tab and click "Add..."

![add action](https://github.com/user-attachments/assets/9269a144-ac01-4dc8-9267-a17e4a2fe8b1)

6. Fill out the form as shown in the screenshot (do not forget to change the paths to your own)

![creating action](https://github.com/user-attachments/assets/ec74aeb4-6fda-4fae-8cfe-cd08ef1f9a8d)

`File path` - path to Node.js or Bun.sh exe file

`Arguments` - path to ya-ocr folder + "/sharex.js" at the end

7. Save and make sure that the "ya-ocr" checkbox is selected

8. Now you can use your hotkey to capture a region and it will OCR it using Google Lens API (once it shows screenshot on your screen, text should be copied to your clipboard).

9. In the "After capture tasks" settings, enable "Perform actions"

![perform actions checkbox](https://github.com/user-attachments/assets/ec74aeb4-6fda-4fae-8cfe-cd08ef1f9a8d)

10. Done

![result](https://github.com/user-attachments/assets/fadc0c2b-6b30-446d-bfd9-5dafae93c6a0)
