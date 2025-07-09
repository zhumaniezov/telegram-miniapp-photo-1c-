const input = document.getElementById('cameraInput');
const preview = document.getElementById('preview');
const sendBtn = document.getElementById('sendBtn');
const status = document.getElementById('status');
const filenameText = document.getElementById('filename');

let selectedFile = null;

input.addEventListener('change', () => {
  const file = input.files[0];
  if (file) {
    selectedFile = file;
    preview.src = URL.createObjectURL(file);
    preview.style.display = 'block';
    filenameText.textContent = file.name;
    sendBtn.disabled = false;
    status.textContent = '';
  }
});

sendBtn.addEventListener('click', async () => {
  if (!selectedFile) return;

  sendBtn.disabled = true;
  status.textContent = 'Отправка фото...';

  const formData = new FormData();
  formData.append('photo', selectedFile);

  try {
    const response = await fetch('/upload', {
      method: 'POST',
      body: formData,
    });
    const result = await response.json();
    status.textContent = '✅ Фото успешно отправлено в 1С!';
    sendBtn.disabled = false;
  } catch (error) {
    status.textContent = '❌ Ошибка при отправке фото';
    console.error(error);
    sendBtn.disabled = false;
  }
});
