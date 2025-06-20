// public/js/run.js

require.config({ paths: { vs: 'https://unpkg.com/monaco-editor@latest/min/vs' } });

let editor;

require(['vs/editor/editor.main'], () => {
  editor = monaco.editor.create(document.getElementById('editor'), {
    value: '// write your code here',
    language: 'javascript',
    theme: 'vs-dark',
    automaticLayout: true
  });
});

const timerEl = document.getElementById('timer');
let timeLeft = timerEl.textContent.split(':').reduce((m, s) => parseInt(m) * 60 + parseInt(s), 0);
const intervalID = setInterval(() => {
  if (timeLeft <= 0) {
    clearInterval(intervalID);
    document.getElementById('run-btn').disabled = true;
    timerEl.textContent = 'Time Up';
  } else {
    const m = Math.floor(timeLeft / 60);
    const s = String(timeLeft % 60).padStart(2, '0');
    timerEl.textContent = `${m}:${s}`;
    timeLeft--;
  }
}, 1000);

document.getElementById('lang').addEventListener('change', function () {
  const langMap = {
    javascript: 'javascript',
    python3: 'python',
    java: 'java'
  };
  monaco.editor.setModelLanguage(editor.getModel(), langMap[this.value]);
});

// You can customize test cases per problem (this is for Two Sum and 3Sum as examples)
const testCases = [
  JSON.stringify([2, 7, 11, 15]),   // Two Sum
  JSON.stringify([-1, 0, 1, 2, -1, -4]), // 3Sum
  JSON.stringify([0, 0, 0]),
  JSON.stringify([1, 2, -3, 4, -4]),
  JSON.stringify([3, 0, -3])
];

document.getElementById('run-btn').addEventListener('click', async () => {
  const code = editor.getValue();
  const lang = document.getElementById('lang').value;
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = '';

  for (let i = 0; i < testCases.length; i++) {
    const payload = {
      source_code: btoa(code),
      language_id: lang,
      stdin: btoa(testCases[i])
    };

    try {
      const resp = await fetch('/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await resp.json();
      const out = atob(json.stdout || '');
      resultsDiv.innerHTML += `
        <div class="test-case">
          Test #${i + 1}: ${out || json.stderr || 'No output'}
        </div>`;
    } catch (err) {
      resultsDiv.innerHTML += `<div class="test-case">⚠️ Network Error</div>`;
    }
  }
});
