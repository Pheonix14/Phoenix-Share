![Logo](https://media.discordapp.net/attachments/1118813311308419162/1133109564158525552/20230725_002143_0000-removebg-preview.png)


# Phoenix Share

This is a simple file sharing system built using Node.js and Express. It allows users to securely upload and share files with others.

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)

## Disclaimer

**IMPORTANT:** Although an encryption system has been added to this file sharing system, it is important to note that it may still have vulnerabilities and potential issues. Therefore, it is crucial to exercise caution when using this system and avoid uploading or sharing sensitive or confidential data. The files uploaded to the server are stored with encryption but things may break anytime. Please be aware that the security and reliability of the system cannot be guaranteed, and you should use it at your own risk.
## Features

- end-to-end encryption: a encryption system that provides more security.
- User authentication: Users can log in with their credentials to access the file sharing system.
- File upload: Users can select and upload files from their devices.
- File download: Uploaded files can be downloaded using unique download links.
- QR code generation: Quick sharing and scanning of files through QR codes.
- File deletion: Automatically deletes files from the server after a set period of time or when downloaded.


## Prerequisites

Before running the system, ensure that you have the following installed:

- Node.js (lts Version)
- npm (Node Package Manager)
## Run Locally

Clone the project:

```bash
  git clone https://github.com/Pheonix14/Phoenix-Share.git
```

Go to the project directory:

```bash
  cd Phoenix-Share
```

Config:

 Fill the file called `config.json` with required details.

Install dependencies:

```bash
  npm install
```

Start the server:

```bash
  node index.js
```
or
```bash
  npm run start
```


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
- You can customize auto deletion time by modifying the `setTimeout` variable.
- To change the server port, update the port number in `config.json` file.
- To change the domain, update the domain url in `config.json`.
- To change the cookie secret, update the secret key in `config.json`. 
## Support

For support, [Join discord server](https://discord.gg/DSdjz5Cgwb)


## License

[MIT License](LICENSE)

Feel free to customize and modify this file sharing system according to your needs. Contributions are welcome!
