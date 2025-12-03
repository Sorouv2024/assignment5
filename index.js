    // Data: at least 9 cards
    const services = [
      {id:1,
         icon: '<img src="B12-A5-Emergency-Hotline/assets/emergency.png" alt="Police Icon" style="width:30px;height:30px;">',
        name:'National Emergency Number',
        eng:'National Emergency',
        number:'999',
        category:'All'
      },
      {id:2,
       icon: '<img src="B12-A5-Emergency-Hotline/assets/police.png" alt="Police Icon" style="width:30px;height:30px;">',
        name:'Police Helpline Number',
        eng:'Police',
        number:'999',
        category:'Police'
      },
      {id:3,
         icon: '<img src="B12-A5-Emergency-Hotline/assets/fire-service.png" alt="Police Icon" style="width:30px;height:30px;">',
        name:'Fire Service Number',
        eng:'Fire Service',
        number:'999',
        category:'Fire'
      },
      {id:4,
       icon: '<img src="B12-A5-Emergency-Hotline/assets/ambulance.png" alt="Police Icon" style="width:30px;height:30px;">',
        name:'Ambulance Service',
        eng:'Ambulance',
        number:'1994-999999',
        category:'Health'
      },
      {id:5,
         icon: '<img src="B12-A5-Emergency-Hotline/assets/emergency.png" alt="Police Icon" style="width:30px;height:30px;">',
        name:'Women & Child Helpline',
        eng:'Women & Child Helpline',
        number:'109',
        category:'Help'
      },
      {id:6,
         icon: '<img src="B12-A5-Emergency-Hotline/assets/emergency.png" alt="Police Icon" style="width:30px;height:30px;">',
      name:'Anti-Corruption Helpline',
      eng:'Anti-Corruption',
      number:'106',
      category:'Govt'
    },
      {id:7,
         icon: '<img src="B12-A5-Emergency-Hotline/assets/emergency.png" alt="Police Icon" style="width:30px;height:30px;">',
        name:'Electricity Helpline',
        eng:'Electricity Outage',
        number:'16216',
        category:'Electricity'
      },
      {id:8,
         icon: '<img src="B12-A5-Emergency-Hotline/assets/brac.png" alt="Police Icon" style="width:30px;height:30px;">',
        name:'Brac Helpline',
        eng:'Brac',
        number:'16445',
        category:'NGO'
      },
      {id:9,
        icon: '<img src="B12-A5-Emergency-Hotline/assets/Bangladesh-Railway.png" alt="Police Icon" style="width:30px;height:30px;">',
        name:'Bangladesh Railway Helpline',
        eng:'Railway',
        number:'163',
        category:'Travel'
      }
    ];

    // State

    let heartCount = 0;
    let coinCount = 100;
    let copyCount = 0;
    let callHistory = [];

    const cardsEl = document.getElementById('cards');
    const heartCountEl = document.getElementById('heartCount');
    const coinCountEl = document.getElementById('coinCount');
    const copyCountEl = document.getElementById('copyCount');
    const historyListEl = document.getElementById('historyList');
    const clearHistoryBtn = document.getElementById('clearHistory');

    function renderCards(){
      cardsEl.innerHTML = '';

      // show minimum 9 cards

      services.forEach(s=>{
        const card = document.createElement('article');
        card.className = 'card';
        card.dataset.id = s.id;
        card.innerHTML = `
          <div class="icon">${s.icon}</div>
          <button class="heart" aria-label="like">  <img src="./B12-A5-Emergency-Hotline/assets/heart.png" alt="" style="width:24px;height:24px;"></button>
          <h3>${s.name}</h3>
          <p class="subtitle">${s.eng}</p>
          <div class="number">${s.number}</div>
          <div class="badge">${s.category}</div>
          <div class="actions">
            <button class="btn copy" data-number="${s.number}"><i class="fa-solid fa-copy"></i> Copy</button>
            <button class="btn call" data-number="${s.number}" data-name="${s.name}"><i class="fa-solid fa-phone"></i>Call</button>
          </div>
        `;
        cardsEl.appendChild(card);
      });
    }

    // Initial render

    renderCards();
    updateCounters();

    // Event delegation for card buttons and heart

    cardsEl.addEventListener('click', async (e)=>{
      const callBtn = e.target.closest('.call');
      const copyBtn = e.target.closest('.copy');
      const heartBtn = e.target.closest('.heart');
      const card = e.target.closest('.card');

      if(heartBtn && card){
        heartCount++;
        updateCounters();

        // small feedback
        heartBtn.style.transform = 'scale(1.12)';
        setTimeout(()=>heartBtn.style.transform='scale(1)',200);
        return;
      }

      if(copyBtn){
        const number = copyBtn.dataset.number;

        // copy to clipboard

        try{
          await navigator.clipboard.writeText(number);
          copyCount++;
          updateCounters();
          alert('Number copied: '+number);
        }catch(err){

          // fallback

          const ta = document.createElement('textarea');
          ta.value = number;document.body.appendChild(ta);ta.select();
          try{document.execCommand('copy');copyCount++;updateCounters();alert('Number copied: '+number);}catch(e){alert('Copy failed')}
          ta.remove();
        }
        return;
      }

      if(callBtn){
        const number = callBtn.dataset.number;
        const name = callBtn.dataset.name;

        // check coins

        if(coinCount < 20){
          alert('Not enough coins to make a call. Each call costs 20 coins.');
          return;
        }

        // confirm/show alert

        alert('Calling '+name+' — '+number);
        coinCount -= 20; updateCounters();

        // add to history with timestamp

        const now = new Date();
        const timeStr = now.toLocaleTimeString();
        callHistory.unshift({name,number,time:timeStr});
        renderHistory();
        return;
      }
    });

    function updateCounters(){
      heartCountEl.textContent = heartCount;
      coinCountEl.textContent = coinCount;
      copyCountEl.textContent = copyCount;
    }

    function renderHistory(){
      historyListEl.innerHTML = '';
      if(callHistory.length === 0){
        historyListEl.innerHTML = '<div class="muted small">No calls yet</div>';
        return;
      }
      callHistory.forEach(item=>{
        const row = document.createElement('div');
        row.className = 'history-item';
        row.innerHTML = `<div>
            <div style="font-weight:700">${item.name}</div>
            <div class="muted small">${item.number}</div>
          </div>
          <div class="meta small">${item.time}</div>`;
        historyListEl.appendChild(row);
      });
    }

    // Clear history
    
    clearHistoryBtn.addEventListener('click', ()=>{
      callHistory = [];
      renderHistory();
    });

    // Initial history render
    renderHistory();
