    const form = document.getElementById('uploadForm');
    const fileInput = document.getElementById('fileInput');
    const downloadLink = document.getElementById('downloadLink');
    const dragDropArea = document.getElementById('dragDropArea');

    form.addEventListener('submit', (event) => {
      event.preventDefault();

downloadLink.textContent = "File uploading is under progress.... Please don't close or refresh the tab";
      
      const formData = new FormData();
      formData.append('file', fileInput.files[0]);

      fetch('/upload', {
        method: 'POST',
        body: formData
      })
      .then(response => response.text())
      .then(data => {
        downloadLink.innerHTML = data;
        form.reset();
      })
      .catch(error => {
        console.error('Error:', error);
      });
    });

    dragDropArea.addEventListener('dragover', (event) => {
      event.preventDefault();
      dragDropArea.classList.add('dragging');
    });

    dragDropArea.addEventListener('dragleave', () => {
      dragDropArea.classList.remove('dragging');
    });

    dragDropArea.addEventListener('drop', (event) => {
      event.preventDefault();
      dragDropArea.classList.remove('dragging');
      fileInput.files = event.dataTransfer.files;
    });


function copyToClipboard(button) {
    const downloadLink = button.getAttribute('data-download-link');

    const textArea = document.createElement('textarea');
    textArea.value = downloadLink;

    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);

    const copyButton = document.getElementById('copyButton');
    copyButton.textContent = "Copied!";
    setTimeout(() => {
        copyButton.textContent = "Copy Download Link";
    }, 3000); // Reset to "Copy Link" after 3 seconds
}

if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('serviceWorkers.js')
                .then(registration => {
                    console.log('Service Worker registered with scope:', registration.scope);
                })
                .catch(error => {
                    console.error('Service Worker registration failed:', error);
                });
        }