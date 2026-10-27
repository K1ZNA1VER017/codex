/**
 * THREE.JS 3D МОДЕЛЬ: «КОВАНАЯ РОЗА КОДЕКСА 1С»
 * Тематика: Средневековое кованое железо, переплетенные лианы с шипами и листьями,
 * благородная белая/серебряная основа и распускающиеся алые средневековые розы.
 */

(function () {
  'use strict';

  let scene, camera, renderer, artifactGroup;
  let coreCage, innerCore, ringArmature, vineGroup, flowerGroup;
  let silverParticles, redPetalParticles;
  let flowerLights = [];
  let flowerMeshes = [];

  let isDragging = false;
  let previousMousePosition = { x: 0, y: 0 };
  let targetRotation = { x: 0.25, y: 0.4 };
  let currentRotation = { x: 0.25, y: 0.4 };
  let rotationSpeedMultiplier = 1.0;
  let currentProgressPercent = 10;
  let animationFrameId;

  const container = document.getElementById('three-canvas-wrap');
  const canvas = document.getElementById('three-artifact-canvas');

  function initThree() {
    if (!container || !canvas || typeof THREE === 'undefined') {
      console.warn('Three.js не загружен или холст не найден.');
      showFallbackUI();
      return;
    }

    try {
      // 1. Сцена
      scene = new THREE.Scene();

      // 2. Камера
      const width = container.clientWidth || 400;
      const height = container.clientHeight || 380;
      camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
      camera.position.set(0, 0, 7.8);

      // 3. Рендерер
      renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;

      // 4. Освещение (Белый студийный свет + теплый рубиновый акцент)
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
      scene.add(ambientLight);

      // Верхний ключевой белый свет для бликов на кованом железе
      const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
      keyLight.position.set(5, 8, 6);
      scene.add(keyLight);

      // Контровой холодный серебряный свет
      const rimLight = new THREE.DirectionalLight(0xe2e8f0, 1.3);
      rimLight.position.set(-6, -4, -4);
      scene.add(rimLight);

      // Внутренний рубиновый свет из центра роз
      const coreRedLight = new THREE.PointLight(0xff1744, 2.2, 8);
      coreRedLight.position.set(0, 0, 0);
      scene.add(coreRedLight);
      flowerLights.push(coreRedLight);

      // 5. Главная группа артефакта
      artifactGroup = new THREE.Group();
      scene.add(artifactGroup);

      // Общие материалы
      // Чистое белое полированное железо / серебро
      const whiteIronMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 0.92,
        roughness: 0.22
      });

      // Темное кованое средневековое железо (акцентные элементы каркаса)
      const forgedIronMaterial = new THREE.MeshStandardMaterial({
        color: 0xcccccc,
        metalness: 0.88,
        roughness: 0.35
      });

      // Внутренний светящийся белый кристалл
      const glowWhiteMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xeeeeee,
        emissiveIntensity: 0.7,
        roughness: 0.1,
        metalness: 0.8
      });

      // Бархатный алый материал для лепестков роз
      const crimsonPetalMaterial = new THREE.MeshStandardMaterial({
        color: 0xd90429,
        emissive: 0x59000d,
        emissiveIntensity: 0.35,
        roughness: 0.38,
        metalness: 0.12,
        side: THREE.DoubleSide
      });

      // Сияющая сердцевина розы (рубин)
      const rubyCoreMaterial = new THREE.MeshStandardMaterial({
        color: 0xff1744,
        emissive: 0xff0033,
        emissiveIntensity: 1.1,
        roughness: 0.15,
        metalness: 0.6
      });

      // ========================================================
      // А. ЦЕНТРАЛЬНОЕ ЯДРО: СРЕДНЕВЕКОВЫЙ КОВАHЫЙ КАРКАС И БЕЛЫЙ КРИСТАЛЛ
      // ========================================================
      const coreGeo = new THREE.IcosahedronGeometry(0.9, 0);
      innerCore = new THREE.Mesh(coreGeo, glowWhiteMaterial);
      artifactGroup.add(innerCore);

      const cageGeo = new THREE.IcosahedronGeometry(1.2, 1);
      const cageWireMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true,
        transparent: true,
        opacity: 0.5
      });
      coreCage = new THREE.Mesh(cageGeo, cageWireMat);
      artifactGroup.add(coreCage);

      // ========================================================
      // Б. КОВАНЫЕ ЖЕЛЕЗНЫЕ КОЛЬЦА АРМАТУРЫ (WHITE IRON RINGS)
      // ========================================================
      ringArmature = new THREE.Group();
      artifactGroup.add(ringArmature);

      // Экваториальное кольцо
      const ring1Geo = new THREE.TorusGeometry(2.35, 0.055, 16, 100);
      const ring1 = new THREE.Mesh(ring1Geo, whiteIronMaterial);
      ringArmature.add(ring1);

      // Наклонное меридиональное кольцо
      const ring2Geo = new THREE.TorusGeometry(2.1, 0.045, 16, 90);
      const ring2 = new THREE.Mesh(ring2Geo, forgedIronMaterial);
      ring2.rotation.x = Math.PI / 3;
      ringArmature.add(ring2);

      // Внутреннее наклонное кольцо
      const ring3Geo = new THREE.TorusGeometry(1.8, 0.04, 16, 80);
      const ring3 = new THREE.Mesh(ring3Geo, whiteIronMaterial);
      ring3.rotation.y = Math.PI / 4;
      ringArmature.add(ring3);

      // Кованые средневековые заклепки / шипы на внешнем кольце
      const studGeo = new THREE.ConeGeometry(0.09, 0.35, 6);
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI) / 4;
        const stud = new THREE.Mesh(studGeo, whiteIronMaterial);
        stud.position.set(Math.cos(angle) * 2.35, Math.sin(angle) * 2.35, 0);
        stud.rotation.z = angle - Math.PI / 2;
        ring1.add(stud);
      }

      // ========================================================
      // В. ПЕРЕПЛЕТЕННЫЕ ЛИАНЫ С ШИПАМИ И ЛИСТЬЯМИ (VINES)
      // ========================================================
      vineGroup = new THREE.Group();
      artifactGroup.add(vineGroup);

      createWindingVines(vineGroup, whiteIronMaterial);

      // ========================================================
      // Г. КРАСНЫЕ СРЕДНЕВЕКОВЫЕ ЦВЕТЫ (РОЗЫ)
      // ========================================================
      flowerGroup = new THREE.Group();
      artifactGroup.add(flowerGroup);

      // Создаем 7 распустившихся алых роз в стратегических точках сплетения
      const flowerPositions = [
        { pos: new THREE.Vector3(1.7, 1.2, 0.6), scale: 0.95, rot: [0.3, 0.4, 0.2] },
        { pos: new THREE.Vector3(-1.8, -0.9, 0.8), scale: 0.9, rot: [-0.4, -0.6, 0.5] },
        { pos: new THREE.Vector3(-0.9, 1.8, -0.7), scale: 0.85, rot: [0.6, -0.3, -0.4] },
        { pos: new THREE.Vector3(1.2, -1.7, -0.8), scale: 0.9, rot: [-0.5, 0.7, 0.3] },
        { pos: new THREE.Vector3(0, 2.35, 0), scale: 1.1, rot: [0, 0, 0] },
        { pos: new THREE.Vector3(0, -2.35, 0), scale: 1.05, rot: [Math.PI, 0, 0] },
        { pos: new THREE.Vector3(2.35, 0, 0.2), scale: 1.0, rot: [0, 0, -Math.PI / 2] }
      ];

      flowerPositions.forEach((fp, index) => {
        const flower = createMedievalRose(crimsonPetalMaterial, rubyCoreMaterial, whiteIronMaterial);
        flower.position.copy(fp.pos);
        flower.rotation.set(fp.rot[0], fp.rot[1], fp.rot[2]);
        flower.scale.setScalar(fp.scale);
        flowerGroup.add(flower);
        flowerMeshes.push(flower);

        // Индивидуальный рубиновый точечный свет для каждой крупной розы
        if (index < 4) {
          const pLight = new THREE.PointLight(0xff0033, 1.2, 3.5);
          pLight.position.copy(fp.pos);
          flowerGroup.add(pLight);
          flowerLights.push(pLight);
        }
      });

      // ========================================================
      // Д. ОБЛАКО СЕРЕБРЯНЫХ ИСКР И ПАДЕНИЕ АЛЫХ ЛЕПЕСТКОВ
      // ========================================================
      createParticles();

      // Настройка мыши и событий
      setupInteractions();

      // Старт анимационного цикла
      animate();

    } catch (err) {
      console.error('Ошибка создания 3D модели:', err);
      showFallbackUI();
    }
  }

  // Создание извивающихся лиан с шипами и серебряными листьями
  function createWindingVines(parent, vineMaterial) {
    // 3 винтовые ветви лиан, обвивающие кольца и ядро
    const vineBranches = [
      // Ветвь 1: обвивает экватор и устремляется к полюсу
      [
        new THREE.Vector3(-2.2, 0.2, 0.3),
        new THREE.Vector3(-1.4, 1.5, 0.8),
        new THREE.Vector3(0.0, 2.2, 0.5),
        new THREE.Vector3(1.3, 1.4, -0.6),
        new THREE.Vector3(2.1, 0.1, -0.4),
        new THREE.Vector3(1.5, -1.3, 0.7),
        new THREE.Vector3(0.1, -2.1, 0.8),
        new THREE.Vector3(-1.3, -1.5, -0.5)
      ],
      // Ветвь 2: спираль вокруг меридиана
      [
        new THREE.Vector3(0.2, -2.2, -0.3),
        new THREE.Vector3(-1.2, -1.4, 0.9),
        new THREE.Vector3(-1.9, 0.1, 0.6),
        new THREE.Vector3(-1.1, 1.6, -0.7),
        new THREE.Vector3(0.3, 2.0, -0.8),
        new THREE.Vector3(1.5, 1.2, 0.5),
        new THREE.Vector3(1.8, -0.4, 0.7)
      ]
    ];

    const leafGeo = new THREE.DodecahedronGeometry(0.12, 0);
    const thornGeo = new THREE.ConeGeometry(0.05, 0.2, 5);

    vineBranches.forEach((points) => {
      const curve = new THREE.CatmullRomCurve3(points, true);
      const tubeGeo = new THREE.TubeGeometry(curve, 90, 0.045, 8, true);
      const tubeMesh = new THREE.Mesh(tubeGeo, vineMaterial);
      parent.add(tubeMesh);

      // Рассаживаем шипы и серебряные листья вдоль кривой лианы
      for (let i = 0; i < 24; i++) {
        const t = i / 24;
        const pt = curve.getPoint(t);
        const tangent = curve.getTangent(t);

        // Лист
        if (i % 2 === 0) {
          const leaf = new THREE.Mesh(leafGeo, vineMaterial);
          leaf.scale.set(1.5, 0.35, 2.2);
          leaf.position.copy(pt);
          leaf.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tangent);
          parent.add(leaf);
        } else {
          // Острый шип розы
          const thorn = new THREE.Mesh(thornGeo, vineMaterial);
          thorn.position.copy(pt);
          thorn.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
          parent.add(thorn);
        }
      }
    });
  }

  // Создание детализированной средневековой красной розы
  function createMedievalRose(petalMat, rubyCoreMat, ironStemMat) {
    const roseGroup = new THREE.Group();

    // Стебель/чашелистик из белого кованого железа
    const calyxGeo = new THREE.CylinderGeometry(0.08, 0.02, 0.25, 6);
    const calyx = new THREE.Mesh(calyxGeo, ironStemMat);
    calyx.position.z = -0.12;
    calyx.rotation.x = Math.PI / 2;
    roseGroup.add(calyx);

    // Центральное сверкающее рубиновое ядро
    const coreGeo = new THREE.SphereGeometry(0.16, 12, 12);
    const core = new THREE.Mesh(coreGeo, rubyCoreMat);
    roseGroup.add(core);

    // Геометрия лепестка (изогнутая эллиптическая форма)
    const petalGeo = new THREE.SphereGeometry(0.24, 10, 8, 0, Math.PI, 0, Math.PI / 1.7);

    // Внутренний ряд: 4 плотно прилегающих алых лепестка
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2;
      const petal = new THREE.Mesh(petalGeo, petalMat);
      petal.scale.set(0.8, 0.9, 0.4);
      petal.position.set(Math.cos(angle) * 0.08, Math.sin(angle) * 0.08, 0.04);
      petal.rotation.z = angle;
      petal.rotation.x = 0.55;
      roseGroup.add(petal);
    }

    // Средний ряд: 6 раскрывающихся лепестков
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3 + 0.25;
      const petal = new THREE.Mesh(petalGeo, petalMat);
      petal.scale.set(1.05, 1.15, 0.45);
      petal.position.set(Math.cos(angle) * 0.17, Math.sin(angle) * 0.17, 0.02);
      petal.rotation.z = angle;
      petal.rotation.x = 0.85;
      roseGroup.add(petal);
    }

    // Внешний ряд: 7 пышно распустившихся лепестков
    for (let i = 0; i < 7; i++) {
      const angle = (i * Math.PI * 2) / 7;
      const petal = new THREE.Mesh(petalGeo, petalMat);
      petal.scale.set(1.35, 1.45, 0.5);
      petal.position.set(Math.cos(angle) * 0.28, Math.sin(angle) * 0.28, -0.02);
      petal.rotation.z = angle;
      petal.rotation.x = 1.15;
      roseGroup.add(petal);
    }

    return roseGroup;
  }

  // Облако частиц: белые серебряные искры + летящие алые лепестки
  function createParticles() {
    // 1. Белые серебряные искры
    const silverCount = 140;
    const silverGeo = new THREE.BufferGeometry();
    const silverPos = new Float32Array(silverCount * 3);

    for (let i = 0; i < silverCount * 3; i += 3) {
      const r = 2.4 + Math.random() * 2.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      silverPos[i] = r * Math.sin(phi) * Math.cos(theta);
      silverPos[i + 1] = r * Math.sin(phi) * Math.sin(theta);
      silverPos[i + 2] = r * Math.cos(phi);
    }

    silverGeo.setAttribute('position', new THREE.BufferAttribute(silverPos, 3));
    const silverMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.05,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    silverParticles = new THREE.Points(silverGeo, silverMat);
    artifactGroup.add(silverParticles);

    // 2. Парящие алые лепестки роз
    const redCount = 70;
    const redGeo = new THREE.BufferGeometry();
    const redPos = new Float32Array(redCount * 3);

    for (let i = 0; i < redCount * 3; i += 3) {
      const r = 1.6 + Math.random() * 2.4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      redPos[i] = r * Math.sin(phi) * Math.cos(theta);
      redPos[i + 1] = r * Math.sin(phi) * Math.sin(theta);
      redPos[i + 2] = r * Math.cos(phi);
    }

    redGeo.setAttribute('position', new THREE.BufferAttribute(redPos, 3));
    const redMat = new THREE.PointsMaterial({
      color: 0xff1744,
      size: 0.09,
      transparent: true,
      opacity: 0.9,
      blending: THREE.NormalBlending
    });
    redPetalParticles = new THREE.Points(redGeo, redMat);
    artifactGroup.add(redPetalParticles);
  }

  function setupInteractions() {
    canvas.addEventListener('mousedown', (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    window.addEventListener('mousemove', (e) => {
      if (isDragging) {
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;

        targetRotation.y += deltaX * 0.007;
        targetRotation.x += deltaY * 0.007;

        previousMousePosition = { x: e.clientX, y: e.clientY };
      }
    });

    // Сенсорные экраны
    canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });

    window.addEventListener('touchmove', (e) => {
      if (isDragging && e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - previousMousePosition.x;
        const deltaY = e.touches[0].clientY - previousMousePosition.y;

        targetRotation.y += deltaX * 0.008;
        targetRotation.x += deltaY * 0.008;

        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    }, { passive: true });

    // Клик — импульс энергии цветения
    canvas.addEventListener('click', pulseBloom);

    const pulseBtn = document.getElementById('btn-pulse-artifact');
    if (pulseBtn) {
      pulseBtn.addEventListener('click', pulseBloom);
    }

    window.addEventListener('resize', onWindowResize);
  }

  // Импульс рубинового цветения при клике
  function pulseBloom() {
    rotationSpeedMultiplier = 3.5;

    // Вспышка рубиновых огней
    flowerLights.forEach(light => {
      light.intensity = 4.5;
    });

    if (innerCore && innerCore.material) {
      innerCore.material.emissiveIntensity = 1.6;
    }

    setTimeout(() => {
      rotationSpeedMultiplier = 1.0;
      flowerLights.forEach((light, idx) => {
        light.intensity = idx === 0 ? 2.2 : 1.2;
      });
      if (innerCore && innerCore.material) {
        innerCore.material.emissiveIntensity = 0.7;
      }
    }, 1200);
  }

  function onWindowResize() {
    if (!container || !renderer || !camera) return;
    const width = container.clientWidth;
    const height = container.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  function animate() {
    animationFrameId = requestAnimationFrame(animate);

    // Плавное вращение с физической инерцией
    currentRotation.x += (targetRotation.x - currentRotation.x) * 0.08;
    currentRotation.y += (targetRotation.y - currentRotation.y) * 0.08;

    const baseSpeed = 0.006 * rotationSpeedMultiplier;

    // Медленное вращение арматуры из белого железа
    if (ringArmature) {
      ringArmature.rotation.y += baseSpeed * 0.8;
      ringArmature.rotation.z += baseSpeed * 0.4;
    }

    // Лианы и розы плавно обвивают пространство
    if (vineGroup) {
      vineGroup.rotation.y += baseSpeed * 1.1;
      vineGroup.rotation.x -= baseSpeed * 0.3;
    }

    if (flowerGroup) {
      flowerGroup.rotation.y += baseSpeed * 1.1;
      flowerGroup.rotation.x -= baseSpeed * 0.3;
    }

    // Центральный белый кристалл
    if (innerCore) {
      innerCore.rotation.x += baseSpeed * 1.4;
      innerCore.rotation.y -= baseSpeed * 1.6;
    }
    if (coreCage) {
      coreCage.rotation.x -= baseSpeed * 0.9;
      coreCage.rotation.y += baseSpeed * 1.1;
    }

    // Движение алых лепестков и серебряных искр
    if (silverParticles) {
      silverParticles.rotation.y += baseSpeed * 0.5;
    }
    if (redPetalParticles) {
      redPetalParticles.rotation.y -= baseSpeed * 0.7;
      redPetalParticles.rotation.x += baseSpeed * 0.3;
    }

    // Общая группа реагирует на мышь
    if (artifactGroup) {
      artifactGroup.rotation.x = currentRotation.x;
      artifactGroup.rotation.y = currentRotation.y;
    }

    renderer.render(scene, camera);
  }

  function showFallbackUI() {
    if (!container) return;
    container.innerHTML = `
      <div style="width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#cbd5e1;text-align:center;padding:20px;">
        <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="#ff1744" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom:14px;filter:drop-shadow(0 0 12px rgba(255,23,68,0.6));">
          <circle cx="12" cy="12" r="10" stroke="#ffffff"></circle>
          <path d="M12 8c-2 2-3 4-3 6a3 3 0 0 0 6 0c0-2-1-4-3-6z" fill="#ff1744"></path>
        </svg>
        <div style="font-family:'Cinzel',serif;font-size:1.15rem;letter-spacing:0.1em;color:#fff;margin-bottom:6px;">КОВАНАЯ РОЗА КОДЕКСА</div>
        <div style="font-size:0.8rem;color:#e2e8f0;font-family:'JetBrains Mono',monospace;">Средневековое железо, лианы и алые розы</div>
      </div>
    `;
  }

  // Обновление прогресса: розы раскрываются шире, а их рубиновое сияние усиливается
  window.updateArtifactProgress = function (percent) {
    currentProgressPercent = percent;
    const progressEl = document.getElementById('artifact-progress-display');
    if (progressEl) {
      progressEl.textContent = `${percent}%`;
    }

    // Чем выше прогресс, тем пышнее распускаются розы
    const bloomScale = 0.85 + (percent / 100) * 0.35;
    flowerMeshes.forEach(flower => {
      flower.scale.setScalar(bloomScale);
    });

    // Усиливаем рубиновый свет роз при продвижении по плану
    const lightPower = 1.0 + (percent / 100) * 1.5;
    flowerLights.forEach((light, idx) => {
      light.intensity = idx === 0 ? lightPower * 1.8 : lightPower;
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThree);
  } else {
    initThree();
  }
})();
