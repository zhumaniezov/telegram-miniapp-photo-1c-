const input = document.getElementById('cameraInput');
const preview = document.getElementById('preview');
const sendBtn = document.getElementById('sendBtn');
const status = document.getElementById('status');
const filenameText = document.getElementById('filename');

const scanBtn = document.getElementById('scanBtn');
const qrReader = document.getElementById('qr-reader');
const pinflInput = document.getElementById('pinfl');
const birthdateInput = document.getElementById('birthdate');

let selectedFile = null;

// QR-сканер
scanBtn.addEventListener('click', () => {
  qrReader.style.display = 'block';
  const html5QrCode = new Html5Qrcode("qr-reader");

  Html5Qrcode.getCameras().then(devices => {
    if (devices && devices.length) {
      const cameraId = devices[0].id;
      html5QrCode.start(
        cameraId,
        { fps: 10, qrbox: 250 },
        (decodedText, decodedResult) => {
          html5QrCode.stop().then(() => {
            qrReader.style.display = 'none';
            const pinfl = decodedText.trim();

            if (/^[3-4]\d{13}$/.test(pinfl)) {
              pinflInput.value = pinfl;

              const day = pinfl.substring(1, 3);
              const month = pinfl.substring(3, 5);
              const yearSuffix = pinfl.substring(5, 7);
              const fullYear = parseInt(yearSuffix, 10) > 30 ? '19' + yearSuffix : '20' + yearSuffix;
              const birthdate = `${day}.${month}.${fullYear}`;
              birthdateInput.value = birthdate;

              status.textContent = '✅ ПИНФЛ и дата рождения считаны';
            } else {
              status.textContent = '❌ Неверный ПИНФЛ';
            }
          });
        },
        errorMessage => {
          // не выводим
        }
      ).catch(err => {
        status.textContent = 'Ошибка запуска камеры: ' + err;
      });
    }
  }).catch(err => {
    status.textContent = 'Не удалось получить доступ к камере';
  });
});

// Фото и отправка
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
