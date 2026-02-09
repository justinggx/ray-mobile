(() => {
  const MODULE = 'ray_mobile';
  const S = () => SillyTavern.getContext(); // 获取当前上下文

  // 设置头像和聊天内容
  const characters = {
    raymond: 'https://i.postimg.cc/50H4ky1R/5e22d430e6a72b4ad5bb75e11531c863(20260209-114057).jpg', // Raymond头像
    gaspard: 'https://i.postimg.cc/RFjSrmZC/46296D95-1C47-41CE-8F60-694E5A452352(20260209-114.jpg)'  // Gaspard头像
  };

  // UI样式：适配屏幕，修复消息气泡显示问题
  const STYLE = `
    #rayFab{position:fixed;right:18px;bottom:18px;z-index:99999}
    #rayFab button{width:54px;height:54px;border-radius:9999px;border:none;box-shadow:0 10px 30px rgba(0,0,0,.35);background:#111;color:#e9e9ea;font-size:22px;cursor:pointer}
    #rayPhone{position:fixed;inset:0;display:none;place-items:center;background:rgba(0,0,0,.35);backdrop-filter:saturate(110%) blur(4px);z-index:99998}
    #rayPhone .phone{width:min(380px,92vw);aspect-ratio:9/19.5;border-radius:36px;background:#0f0f10;box-shadow:0 30px 80px rgba(0,0,0,.6), inset 0 0 0 1px rgba(255,255,255,.06);position:relative;overflow:hidden;color:#e9e9ea;font-family:"Noto Sans SC",system-ui}
    #rayPhone .status{position:absolute;inset:10px 14px auto 14px;height:24px;display:flex;align-items:center;justify-content:space-between;font-weight:600;font-size:13px}
    #rayPhone .pill{position:absolute;top:18px;left:50%;transform:translateX(-50%);width:110px;height:32px;border-radius:20px;background:#000;box-shadow:0 2px 12px rgba(0,0,0,.6)}
    #rayPhone .screen{position:absolute;inset:56px 0 0 0;overflow:auto;padding-bottom:60px}
    #rayPhone .chat{display:flex;flex-direction:column;gap:12px;padding:12px;overflow-y:auto;max-height:60vh;}
    .chat-bubble{background-color:#151515;padding:12px 16px;border-radius:15px;max-width:70%;display:inline-block;word-wrap:break-word}
    .raymond-bubble{background-color:#c9a14d;color:white;border-radius:15px 15px 0 15px;align-self:flex-start;}
    .gaspard-bubble{background-color:#444;color:white;border-radius:15px 15px 15px 0;align-self:flex-end;}
    .input-box{position:fixed;bottom:10px;width:calc(100% - 40px);padding:12px 16px;background:#333;border-radius:20px;color:white;border:none;resize:none;box-sizing:border-box;}
    #sendBtn{background-color:#c9a14d;padding:8px 16px;border-radius:10px;color:white;cursor:pointer;border:none;}
  `;

  function mountUI() {
    if (document.getElementById('rayFab')) return;

    const style = document.createElement('style');
    style.id = 'rayMobileStyle';
    style.textContent = STYLE;
    document.head.appendChild(style);

    const fab = document.createElement('div');
    fab.id = 'rayFab';
    fab.innerHTML = `<button title="Ray Mobile">📱</button>`;
    document.body.appendChild(fab);

    const overlay = document.createElement('div');
    overlay.id = 'rayPhone';
    overlay.innerHTML = `
      <div class="phone">
        <button class="close" title="关闭">×</button>
        <div class="status"><span>9:41</span><span>LTE ▮▮▮▮  78%</span></div>
        <div class="pill"></div>
        <div class="screen">
          <div class="chat" id="chatAreaRaymond">
            <div class="chat-bubble raymond-bubble">
              <img src="${characters.raymond}" style="width:30px;height:30px;border-radius:50%;vertical-align:middle;margin-right:10px;" />
              <span>Raymond: 你好，我是Raymond。</span>
            </div>
          </div>
          <div class="chat" id="chatAreaGaspard">
            <div class="chat-bubble gaspard-bubble">
              <img src="${characters.gaspard}" style="width:30px;height:30px;border-radius:50%;vertical-align:middle;margin-right:10px;" />
              <span>Gaspard: 嘿，Raymond！你怎么样了？</span>
            </div>
          </div>
          <textarea class="input-box" id="userInput" placeholder="输入消息..."></textarea>
          <button id="sendBtn">发送</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    overlay.querySelector('#sendBtn').addEventListener('click', sendMessage);
    overlay.querySelector('.close').addEventListener('click', () => show(false));
    fab.querySelector('button').addEventListener('click', () => show(true));
  }

  function show(v) {
    const el = document.getElementById('rayPhone');
    if (el) el.style.display = v ? 'grid' : 'none';
  }

  function sendMessage() {
    const userMessage = document.getElementById('userInput').value.trim();
    if (userMessage) {
      const chatAreaRaymond = document.getElementById('chatAreaRaymond');
      const chatAreaGaspard = document.getElementById('chatAreaGaspard');
      const bubbleRaymond = document.createElement('div');
      const bubbleGaspard = document.createElement('div');

      // Send message to Raymond
      bubbleRaymond.classList.add('chat-bubble', 'raymond-bubble');
      bubbleRaymond.innerHTML = `
        <img src="${characters.raymond}" style="width:30px;height:30px;border-radius:50%;vertical-align:middle;margin-right:10px;" />
        <span>Raymond: ${userMessage}</span>
      `;
      chatAreaRaymond.appendChild(bubbleRaymond);
      chatAreaRaymond.scrollTop = chatAreaRaymond.scrollHeight;

      // Send message to Gaspard
      bubbleGaspard.classList.add('chat-bubble', 'gaspard-bubble');
      bubbleGaspard.innerHTML = `
        <img src="${characters.gaspard}" style="width:30px;height:30px;border-radius:50%;vertical-align:middle;margin-right:10px;" />
        <span>Gaspard: ${userMessage}</span>
      `;
      chatAreaGaspard.appendChild(bubbleGaspard);
      chatAreaGaspard.scrollTop = chatAreaGaspard.scrollHeight;

      document.getElementById('userInput').value = '';
    }
  }

  // 挂载UI与事件
  const { eventSource, event_types } = S();
  eventSource.on(event_types.APP_READY, mountUI);
})();
