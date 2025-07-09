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

  const config = { fps: 10, qrbox: 250 };

  html5QrCode.start(
    { facingMode: "environment" }, // 🔄 Явно указываем заднюю камеру
    config,
    (decodedText, decodedResult) => {
      html5QrCode.stop().then(() => {
        qrReader.style.display = 'none';

        const raw = decodedText.trim();

        // Ищем 14 цифр перед знаком "<"
          const pinflMatch = raw.match(/(\d{14})</);
          if (pinflMatch) {
            const pinfl = pinflMatch[1]; // пример: 31805958660010
            pinflInput.value = pinfl;

            // ПИНФЛ: 1-я цифра = пол (не используем)
            //        2–7 = дата рождения (ДДММГГ)
            const day = pinfl.substring(1, 3);
            const month = pinfl.substring(3, 5);
            const yearSuffix = pinfl.substring(5, 7);
            const fullYear = parseInt(yearSuffix, 10) > 30 ? '19' + yearSuffix : '20' + yearSuffix;
            const birthdate = `${day}.${month}.${fullYear}`;
            birthdateInput.value = birthdate;

            status.textContent = '✅ ПИНФЛ и дата рождения считаны';
          } else {
            status.textContent = '❌ Не удалось извлечь ПИНФЛ из QR-кода';
          }
        });
      },
      errorMessage => {
        // можно игнорировать или логировать
      }
    ).catch(err => {
      status.textContent = 'Ошибка запуска камеры: ' + err;
    });
  }).catch(err => {
    status.textContent = 'Не удалось получить список камер';
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
