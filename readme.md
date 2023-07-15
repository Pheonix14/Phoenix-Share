# Phoenix Share

This is a simple file sharing system built using Node.js and Express. It allows users to securely upload and share files with others. Please note that this system does not include encryption for the uploaded files.

## Disclaimer

**IMPORTANT:** Although an encryption system has been added to this file sharing system, it is important to note that it may still have vulnerabilities and potential issues. Therefore, it is crucial to exercise caution when using this system and avoid uploading or sharing sensitive or confidential data. The files uploaded to the server are stored with encryption but things may break. Please be aware that the security and reliability of the system cannot be guaranteed, and you should use it at your own risk.


## Features

- end-to-end encryption: a encryption system that provides more security.
- User authentication: Users can log in with their credentials to access the file sharing system.
- File upload: Users can select and upload files from their devices.
- File download: Uploaded files can be downloaded using unique download links.
- QR code generation: Quick sharing and scanning of files through QR codes.
- File deletion: Automatically deletes files from the server after a set period of time or when downloaded.

## Prerequisites

Before running the system, ensure that you have the following installed:

- Node.js
- npm (Node Package Manager)

## Installation

1. Clone this repository to your local machine.
2. Navigate to the project directory using the command line.
3. Run `npm install` to install the required dependencies.
4. Fill every details in `config.json`
## Usage

1. Run `node index.js` or `npm start` to start the server.
2. Open your web browser and navigate to `http://localhost:3000`.
3. Log in with your credentials.
4. On the upload page, select the file you want to share and click the "Upload" button.
5. Once the upload is successful, you will be provided with a download link and a QR code for sharing.
6. Share the download link or QR code with others to allow them to download the file.
7. The file will be automatically deleted from the server after a set period of time.

## Customization

- You can customize the upload limit by modifying the `uploadLimit` variable.
- To change the server port, update the port number in `config.json` file.
- 
## License

[MIT License](LICENSE)

Feel free to customize and modify this file sharing system according to your needs. Contributions are welcome!