const input = document.getElementById('cameraInput');
const preview = document.getElementById('preview');
const sendBtn = document.getElementById('sendBtn');
let selectedFile = null;

input.addEventListener('change', () => {
  const file = input.files[0];
  if (file) {
    selectedFile = file;
    preview.src = URL.createObjectURL(file);
    preview.style.display = 'block';
    sendBtn.disabled = false;
  }
});

sendBtn.addEventListener('click', async () => {
  if (!selectedFile) return;

  const formData = new FormData();
  formData.append('photo', selectedFile);

  try {
    const response = await fetch('/upload', {
      method: 'POST',
      body: formData,
    });
    const result = await response.json();
    alert('Фото отправлено успешно!');
  } catch (error) {
    alert('Ошибка при отправке фото');
    console.error(error);
  }
});
