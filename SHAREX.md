## Custom Sharex OCR

To use it in sharex instead of the usual OCR, you must:

1. Install Node.js 18+ or Bun.sh
2. Download/clone this repository

![download button](https://github.com/user-attachments/assets/c4f82616-ec23-4ad2-9686-961d17543f13)

3. In the folder, type `npm install` or `bun install` (depending on what you are using)
4. Get dist folder

You can build with Bun:

```bash
bun run build:bun
```

or you can download pre-built dist from actions:

4.1. Go to [Actions](https://github.com/FOSWLY/ya-ocr/actions/workflows/release.yml)

4.2. Select latest run

4.3. Download `ya-ocr` artifact

4.4. Unzip to `dist` folder

5.  Open ShareX Settings and go to Task Settings.

![sharex settings](https://github.com/user-attachments/assets/958eb80c-2350-4850-a819-2b61feb5eb73)

6. Go to the "Actions" tab and click "Add..."

![add action](https://github.com/user-attachments/assets/9269a144-ac01-4dc8-9267-a17e4a2fe8b1)

7. Fill out the form as shown in the screenshot (do not forget to change the paths to your own)

![creating action](https://github.com/user-attachments/assets/ec74aeb4-6fda-4fae-8cfe-cd08ef1f9a8d)

`File path` - path to Node.js or Bun.sh `.exe` file

`Arguments` - path to `ya-ocr` folder + `/sharex.js` at the end

8. Save and make sure that the `ya-ocr` checkbox is selected

9. Now you can use your hotkey to capture a region and it will OCR it using Yandex Translate API (once it shows screenshot on your screen, text should be copied to your clipboard).

10. In the "After capture tasks" settings, enable "Perform actions"

![enable perform actions](https://github.com/user-attachments/assets/04ae1ec3-b3fe-4246-9bd9-16e871241b51)

11. Done

![result](https://github.com/user-attachments/assets/fadc0c2b-6b30-446d-bfd9-5dafae93c6a0)
