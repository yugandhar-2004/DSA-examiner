// index.js

document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('#topic-nav a');
  const container = document.getElementById('question-container');

  const topics = {
    arrays: [
      { id: 'two-sum', title: 'Two Sum (Easy)' },
      { id: 'three-sum', title: '3Sum (Medium)' }
    ],
    stack: [
      { id: 'valid-parentheses', title: 'Valid Parentheses (Easy)' },
      { id: 'trapping-rain-water', title: 'Trapping Rain Water (Hard)' }
    ],
    linkedlist: [],
    queue: [],
    tree: [],
    graph: [],
    dp: [],
    greedy: [],
    backtracking: [],
    sorting: []
  };

  function loadTopic(topicKey) {
    navLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.topic === topicKey);
    });

    const list = topics[topicKey] || [];
    container.innerHTML = '';

    if (!list.length) {
      container.innerHTML = '<p>No questions available.</p>';
      return;
    }

    const qlist = document.createElement('div');
    qlist.className = 'question-list';

    list.forEach(q => {
      const item = document.createElement('div');
      item.className = 'question-item';
      item.textContent = q.title;
      item.onclick = () => {
        window.location.href = `questions/${q.id}.html`;
      };
      qlist.appendChild(item);
    });

    container.appendChild(qlist);
  }

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const topic = link.dataset.topic;
      loadTopic(topic);
    });
  });

  loadTopic('arrays'); // Load Arrays by default on page load
});
