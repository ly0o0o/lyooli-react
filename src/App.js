import React, { useEffect, useRef, useState } from 'react';
import './styles/App.css';

function App() {
  const treeRef = useRef(null);
  const [fireworks, setFireworks] = useState([]);
  
  const width = 500;
  const height = 600;
  const quantity = 150;
  const types = ['text', 'select', 'progress', 'meter', 'button', 'radio', 'checkbox'];
  const greetings = [
    '小久考研顺利', '一定上岸', '我爱你', '我喜欢你',
    '加油加油', '看好你', '小久最棒', '必胜必胜',
    '前程似锦', '梦想成真', '金榜题名', '未来可期',
    '我永远支持你', '相信自己', '一定成功', '前途无量',
    '心想事成', '小久加油','林野一直在你的身边！！'
  ];

  // 添加烟花效果函数
  const createFirework = (x, y) => {
    const particles = [];
    const colors = ['#ffb3f6', '#7aa0ff', '#ff7373', '#ffd873', '#73ffdf', '#ffffff'];
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
      const angle = (i * 360) / particleCount;
      const velocity = 2 + Math.random() * 4;
      const size = 2 + Math.random() * 4;
      const tx = Math.cos(angle * Math.PI / 180) * 100 * velocity;
      const ty = Math.sin(angle * Math.PI / 180) * 100 * velocity;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const delay = Math.random() * 0.2;

      particles.push({ tx, ty, color, size, delay });
    }

    const newFirework = {
      id: Date.now(),
      x,
      y,
      particles
    };

    setFireworks(prev => [...prev, newFirework]);

    setTimeout(() => {
      setFireworks(prev => prev.filter(fw => fw.id !== newFirework.id));
    }, 1500);
  };

  // 处理点击事件
  const handleClick = (e) => {
    const x = e.clientX;
    const y = e.clientY;
    createFirework(x, y);
  };

  useEffect(() => {
    const tree = treeRef.current;
    tree.style.width = width + 'px';
    tree.style.height = height + 'px';

    // 创建树的装饰元素
    for (let i = 0; i < quantity; i++) {
      let element = null;
      const type = types[Math.floor(Math.random() * types.length)];
      const greeting = greetings[Math.floor(Math.random() * greetings.length)];

      const x = width/2;
      const y = Math.round(Math.random() * height);
      const rx = 0;
      const ry = Math.random() * 360;
      const rz = -Math.random() * 15;
      const elementWidth = 5 + ((y / height) * width / 2);
      const elementHeight = 26;

      switch (type) {
        case 'button':
          element = document.createElement('button');
          element.textContent = greeting;
          element.style.width = elementWidth + 'px';
          element.style.height = elementHeight + 'px';
          break;
        case 'progress':
          element = document.createElement('progress');
          element.style.width = elementWidth + 'px';
          element.style.height = elementHeight + 'px';
          if (Math.random() > 0.5) {
            element.setAttribute('max', '100');
            element.setAttribute('value', Math.round(Math.random() * 100));
          }
          break;
        case 'select':
          element = document.createElement('select');
          element.setAttribute('selected', greeting);
          element.innerHTML = '<option>' + greetings.join('</option><option>') + '</option>';
          element.style.width = elementWidth + 'px';
          element.style.height = elementHeight + 'px';
          break;
        case 'meter':
          element = document.createElement('meter');
          element.setAttribute('min', '0');
          element.setAttribute('max', '100');
          element.setAttribute('value', Math.round(Math.random() * 100));
          element.style.width = elementWidth + 'px';
          element.style.height = elementHeight + 'px';
          break;
        case 'text':
        default:
          element = document.createElement('input');
          element.setAttribute('type', 'text');
          element.setAttribute('value', greeting);
          element.style.width = elementWidth + 'px';
          element.style.height = elementHeight + 'px';
      }

      element.style.transform = `translate3d(${x}px, ${y}px, 0px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)`;
      tree.appendChild(element);
    }

    // 添加雪花效果
    for (let i = 0; i < 200; i++) {
      const element = document.createElement('input');
      element.setAttribute('type', 'radio');

      const spread = window.innerWidth/2;
      const x = Math.round(Math.random() * spread) - (spread / 4);
      const y = Math.round(Math.random() * height);
      const z = Math.round(Math.random() * spread) - (spread / 2);
      const ry = Math.random() * 360;

      if (Math.random() > 0.5) element.setAttribute('checked', '');
      element.style.transform = `translate3d(${x}px, ${y}px, ${z}px) rotateX(0deg) rotateY(${ry}deg) rotateZ(0deg)`;
      tree.appendChild(element);
    }

    // 处理窗口大小调整
    const resize = () => {
      tree.style.top = ((window.innerHeight - height - 100) / 2) + 'px';
    };

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div onClick={handleClick} style={{ width: '100vw', height: '100vh' }}>
      <div className="tree" ref={treeRef}></div>
      <p className="project-title">小久考研顺利！天天开心</p>
      
      {/* 渲染烟花 */}
      {fireworks.map(firework => (
        <div
          key={firework.id}
          className="firework"
          style={{
            left: firework.x,
            top: firework.y
          }}
        >
          {firework.particles.map((particle, i) => (
            <div
              key={i}
              className="firework-particle"
              style={{
                backgroundColor: particle.color,
                '--tx': `${particle.tx}px`,
                '--ty': `${particle.ty}px`
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default App;
