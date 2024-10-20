# 1.1.0

- Added optional translate OCR text blocks response (without translate separated blocks and translate separated words)
- Main logic to work with Translation API moved to `@toil/translate` lib (config, utils, and some types are no longer exported)
- The structure for a successful scan response has been changed. Now, the response data is returned immediately `{ ..., text: ... }`, and not as before `{ success: true, data: ... }`

# 1.0.0

- Initial release
