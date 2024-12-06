/*!
 * Color mode toggler for Bootstrap's docs (https://getbootstrap.com/)
 * Copyright 2011-2023 The Bootstrap Authors
 * Licensed under the Creative Commons Attribution 3.0 Unported License.
 *  Enhanced Feature added by @FreySu
 */
(() => {
  'use strict';

  const storedTheme = localStorage.getItem('theme');

  const getPreferredTheme = () => {
    if (storedTheme) {
      return storedTheme;
    }
    localStorage.setItem('theme', 'auto');
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const setTheme = function (theme) {
    if (theme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.setAttribute('data-bs-theme', prefersDark ? 'dark' : 'light');
    } else {
      document.documentElement.setAttribute('data-bs-theme', theme);
    }
  };

  const toggleTheme = function () {
    const currentTheme = document.documentElement.getAttribute('data-bs-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    showActiveTheme(newTheme, true);
  };

  setTheme(getPreferredTheme());

  const showActiveTheme = (theme, focus = false) => {
    const themeDropdown = document.querySelector('#themeDropdown');
    const dropdownItems = document.querySelectorAll('.dropdown-item');

    dropdownItems.forEach((item) => {
      item.classList.remove('active');
      item.setAttribute('aria-pressed', 'false');
    });

    const activeItem = document.querySelector(`[data-bs-theme-value="${theme}"]`);
    ``;
    activeItem.classList.add('active');
    activeItem.setAttribute('aria-pressed', 'true');

    // themeDropdown.textContent = `外观 (${theme})`;

    if (focus) {
      themeDropdown.focus();
    }
  };

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (storedTheme !== 'light' && storedTheme !== 'dark') {
      setTheme(getPreferredTheme());
    }
  });

  window.addEventListener('DOMContentLoaded', () => {
    showActiveTheme(getPreferredTheme());

    document.querySelectorAll('.dropdown-item').forEach((item) => {
      item.addEventListener('click', () => {
        const theme = item.getAttribute('data-bs-theme-value');
        localStorage.setItem('theme', theme);
        setTheme(theme);
        showActiveTheme(theme, true);
      });
    });

    // // 添加一个按钮或事件来触发 toggleTheme
    // document
    //   .getElementById('toggle-theme-button')
    //   .addEventListener('click', toggleTheme)
  });
})();

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

///////// test-start

/*
<h1 class="text-center mb-4">Theme Color Configurator</h1>
<div class="d-flex justify-content-between mt-4">
  <div>
    <label for="presetSelect" class="me-2">选择预设:</label>
    <select id="presetSelect" class="form-select form-select-sm me-2">
      <!-- 预设选项将在这里动态生成 -->
    </select>
  </div>
  <button id="themeConfig_importConfig" class="btn btn-primary">导入配置</button>
  <button id="themeConfig_resetConfig" class="btn btn-warning">重置配置</button>
  <button id="themeConfig_exportConfig" class="btn btn-success">导出配置</button>
</div>
<div id="configurator">
  <!-- 动态生成的配置区域 -->
</div>
*/
/*
class ThemeColorConfigurator {
  constructor(containerId, defaultConfig, presets) {
    this.container = document.getElementById(containerId);
    this.defaultConfig = JSON.parse(JSON.stringify(defaultConfig));
    this.config = JSON.parse(JSON.stringify(defaultConfig));
    this.presets = presets || [];
    this.init();
  }

  init() {
    this.renderSections();
    this.bindExportImportEvents();
    this.bindResetEvent();
    this.bindPresetEvents();
  }

  bindResetEvent() {
    document.getElementById('themeConfig_resetConfig').addEventListener('click', () => {
      if (confirm('确定要重置配置吗？这将恢复到默认设置。')) {
        this.config = JSON.parse(JSON.stringify(this.defaultConfig));
        this.renderSections();
        showNotification('配置已重置为默认值', '', { type: 'success', duration: 3000 });
      }
    });
  }

  renderSections() {
    this.container.innerHTML = '';
    for (const section in this.config.themeColors) {
      if (section !== 'base') {
        this.renderSection(section, this.config.themeColors[section]);
      }
    }
    this.renderBaseColor();
  }

  renderSection(section, items) {
    const sectionContainer = document.createElement('div');
    sectionContainer.className = `mb-4`;
    sectionContainer.innerHTML = `
      <h5>${section.toUpperCase()}</h5>
      <small class="form-text text-muted">${this.getSectionDescription(section)}</small>
    `;
    const colorSections = document.createElement('div');
    colorSections.className = `${section}Container`;
    sectionContainer.appendChild(colorSections);
    items.forEach((item, index) => {
      colorSections.appendChild(this.createColorItem(section, item, index));
    });
    const addButton = document.createElement('button');
    addButton.className = 'btn btn-sm btn-outline-primary mt-2';
    addButton.textContent = `添加颜色到 ${section}`;
    addButton.onclick = () => this.addColorItem(section);
    sectionContainer.appendChild(addButton);
    this.container.appendChild(sectionContainer);
  }

  getSectionDescription(section) {
    switch (section) {
      case 'low':
        return '低频部分（如前奏、慢节奏段落）';
      case 'mid':
        return '中频部分（如主歌、节奏适中的段落）';
      case 'high':
        return '高频部分（如副歌、高潮段落）';
      case 'accent':
        return '关键转折处的颜色（如情感爆发点）';
      default:
        return '';
    }
  }

  renderBaseColor() {
    const baseContainer = document.createElement('div');
    baseContainer.className = 'mb-4';
    baseContainer.innerHTML = `
      <h5>Base Color</h5>
      <select class="form-select" id="baseColor">
        ${Object.entries(ColorCodeManager.AVAILABLE_COLOR_CODES_TO_HEX)
          .map(
            ([code, hex]) =>
              `<option value="${code}" ${
                this.config.themeColors.base === code ? 'selected' : ''
              }>${code.toUpperCase()} (${hex})</option>`,
          )
          .join('')}
      </select>
    `;
    baseContainer.querySelector('#baseColor').addEventListener('change', (e) => {
      this.config.themeColors.base = e.target.value;
      showNotification('基础颜色已更新', '', {
        type: 'success',
        duration: 3000,
      });
    });
    this.container.appendChild(baseContainer);
  }

  createColorItem(section, item, index) {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'color-item mb-2 d-flex justify-content-between align-items-center';
    itemDiv.innerHTML = `
      <div class="input-group">
        <span class="input-group-text color-swatch"   style="background-color: ${
          ColorCodeManager.AVAILABLE_COLOR_CODES_TO_HEX[item.color]
        };"></span>
        <select class="form-select">
          ${Object.entries(ColorCodeManager.AVAILABLE_COLOR_CODES_TO_HEX)
            .map(
              ([code, hex]) =>
                `<option value="${code}" ${
                  item.color === code ? 'selected' : ''
                }>${code.toUpperCase()}</option>`,
            )
            .join('')}
        </select>
        <input type="number" class="form-control" value="${parseInt(item.per)}" min="0" max="100">
        <span class="input-group-text">%</span>
        <button class="btn btn-sm btn-outline-danger">删除</button>
      </div>
    `;
    const select = itemDiv.querySelector('select');
    select.addEventListener('change', (e) => {
      const selectedColor = e.target.value;
      if (
        this.config.themeColors[section].some(
          (colorItem) => colorItem.color === selectedColor && colorItem !== item,
        )
      ) {
        showNotification('颜色已存在！', '', { type: 'warning', duration: 4000 });
        e.target.value = item.color; // Revert to previous value
        return;
      }
      item.color = selectedColor;
      itemDiv.querySelector('.color-swatch').style.backgroundColor =
        ColorCodeManager.AVAILABLE_COLOR_CODES_TO_HEX[selectedColor];
      this.validateAndUpdate(section);
    });
    const input = itemDiv.querySelector('input');
    input.addEventListener(
      'input',
      debounce((e) => {
        item.per = e.target.value + '%';
        this.validateAndUpdate(section);
      }, 1500),
    );
    itemDiv.querySelector('button').addEventListener('click', () => {
      if (this.config.themeColors[section].length <= 1) {
        showNotification('至少需要一个颜色！', '', { type: 'error', duration: 4000 });
        return;
      }
      this.config.themeColors[section].splice(index, 1);
      this.renderSections();
      showNotification('颜色已删除', '', { type: 'warning', duration: 4000 });
    });
    return itemDiv;
  }

  addColorItem(section) {
    if (this.config.themeColors[section].length >= 10) {
      showNotification('无法添加更多颜色！ 🎨', '该部分的颜色数量已达到上限（10）', {
        type: 'warning',
        duration: 4000,
      });
      return;
    }
    const remainingPercentage =
      100 - this.config.themeColors[section].reduce((sum, item) => sum + parseInt(item.per), 0);
    if (remainingPercentage <= 0)
      return showNotification('无法添加更多颜色！ 🎨', '剩余百分比不足', {
        type: 'error',
        duration: 4000,
      });

    this.config.themeColors[section].push({ color: 'red', per: `${remainingPercentage}%` });
    this.renderSections();
    showNotification('添加颜色', '已添加新的颜色选项', {
      type: 'success',
      duration: 3000,
    });
  }

  validateAndUpdate(section) {
    const sectionContainer = this.container.querySelector(`.${section}Container`);
    const total = this.config.themeColors[section].reduce(
      (sum, item) => sum + parseInt(item.per.replace('%', ''), 10),
      0,
    );
    if (total > 100) {
      sectionContainer.classList.add('is-invalid');
      showNotification('百分比总和超过100%！', '请调整各颜色的百分比', {
        type: 'error',
        duration: 5000,
      });
      return false;
    }
    if (total < 100) {
      sectionContainer.classList.add('is-invalid');
      showNotification('百分比总和不足100%！', '请调整各颜色的百分比', {
        type: 'warning',
        duration: 4000,
      });
      return false;
    }
    sectionContainer.classList.remove('is-invalid');
    return true;
  }

  bindExportImportEvents() {
    document.getElementById('themeConfig_exportConfig').addEventListener('click', () => {
      const blob = new Blob([JSON.stringify(this.config, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${this.config.name || 'themeColors'}_${this.config.version || 'v1'}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showNotification('配置已导出', '', { type: 'success', duration: 3000 });
    });

    document.getElementById('themeConfig_importConfig').addEventListener('click', () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'application/json';
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            try {
              this.config = JSON.parse(e.target.result);
              this.renderSections();
              showNotification('配置已导入', '', { type: 'success', duration: 3000 });
            } catch {
              showNotification('配置文件格式错误', '', { type: 'error', duration: 4000 });
            }
          };
          reader.readAsText(file);
        }
      };
      input.click();
    });
  }

  bindPresetEvents() {
    const presetSelect = document.getElementById('presetSelect');
    this.presets.forEach((preset, index) => {
      const option = document.createElement('option');
      option.value = index;
      option.textContent = preset.name;
      presetSelect.appendChild(option);
    });
    presetSelect.addEventListener('change', (e) => {
      const presetIndex = parseInt(e.target.value);
      if (!isNaN(presetIndex) && this.presets[presetIndex]) {
        this.config = JSON.parse(JSON.stringify(this.presets[presetIndex]));
        this.renderSections();
        showNotification('预设已应用', '', { type: 'success', duration: 3000 });
      }
    });
  }
}
*/

////////////////// test-end

// 简单的去抖函数实现
function debounce(fn, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

// 捕获异步错误（Promise 拒绝）
window.addEventListener('unhandledrejection', function (event) {
  const errorDetails = {
    reason: event.reason,
    stack: event.reason ? event.reason.stack : 'No stack trace available',
    timestamp: new Date().toISOString(),
  };
  my_debugger.showError('Unhandled Rejection', errorDetails);
});

async function highlightCodeInPreElements() {
  const extractLanguageFromUrl = (url) => {
    try {
      const match = url.match(/\.([a-zA-Z0-9]+)(?:[\?#]|$)/);
      return match ? match[1] : 'json';
    } catch (error) {
      console.error('Error extracting language from URL:', error);
      return 'json';
    }
  };
  try {
    const preElements = Array.from(document.querySelectorAll('pre'));
    const fragment = document.createDocumentFragment();

    preElements.forEach((pre) => {
      if (!pre.querySelector('code')) {
        const language = extractLanguageFromUrl(location.href);
        if (/^[a-zA-Z\-]+$/.test(language)) {
          const newCodeElement = document.createElement('code');
          newCodeElement.className = `language-${language}`;
          newCodeElement.textContent = pre.textContent;
          fragment.appendChild(newCodeElement);
          pre.textContent = '';
          pre.appendChild(newCodeElement);
        }
      }
    });

    requestAnimationFrame(() => {
      document.body.appendChild(fragment);
      preElements.forEach((pre) => {
        const codeElement = pre.querySelector('code');
        if (codeElement) {
          window.hljs.highlightElement(codeElement);

          // Add the language label if it doesn't already exist
          if (
            !codeElement.nextElementSibling ||
            !codeElement.nextElementSibling.classList.contains('highlight-language')
          ) {
            const language = codeElement.result ? codeElement.result.language : 'plaintext';
            const languageLabel = document.createElement('span');
            languageLabel.className = 'highlight-language';
            languageLabel.textContent = `Language: ${language}`;
            pre.appendChild(languageLabel);
          }
        }
      });
    });
  } catch (error) {
    my_debugger.showError('Error highlighting code in <pre> elements:', error);
  }
}

var my_debugger = {};
my_debugger.showError = (message, error = null) => {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    message,
    ...(error
      ? {
          error: {
            message: error.message || 'Unknown error',
            stack: error.stack || 'No stack trace available',
            name: error.name || 'Error',
          },
        }
      : {}),
  };

  // if (isDevelopment) {
  // In development, log everything with more details
  console.error(JSON.stringify(logEntry, null, 2));
};

// 确保模板只插入一次
if (!document.querySelector('.toast-container')) {
  document.body.insertAdjacentHTML(
    'beforeend',
    `
    <!-- Toast Container -->
    <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 1111100; transform: translate3d(0px, 36px, 0px);">
      <div id="programToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-header">
          <span id="toastIcon" class="me-2 fw-bold"></span>
          <strong id="toastTitle" class="me-auto"></strong>
          <small id="toastTimeDiff" class="text-muted"></small>
          <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
          <span id="toastMessage"></span>
          <div id="toastButtons" class="mt-2 pt-2 border-top d-flex gap-2"></div>
        </div>
      </div>
    </div>

    <!-- Modal Template -->
    <div class="modal fade" id="notificationModal" tabindex="-1" aria-labelledby="modalTitle" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title text-light" id="modalTitle"></h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body" id="modalBody" style="
    max-height: 30rem;
    overflow: auto;
"></div>
          <div class="modal-footer" id="modalFooter"></div>
        </div>
      </div>
    </div>
  `,
  );
}

// 当前显示的通知队列，最大容量为 maxNotifications=3
let currentNotifications = [];
const maxNotifications = 3;

/**
 * 通知的配置，包括图标和样式相关的类名
 */
const notificationConfig = {
  icons: {
    info: '📝',
    success: '✅',
    warning: '⚠️',
    error: '❌',
  },
  style_bg_color_classname: {
    info: 'bg-info',
    success: 'bg-success',
    warning: 'bg-warning',
    error: 'bg-danger',
  },
  style_bg_text_classname: {
    info: 'text-dark',
    success: 'text-white',
    warning: 'text-dark',
    error: 'text-white',
  },
};

/**
 * 显示一个通知（Toast 或 Modal），根据配置自动选择合适的显示方式。
 *
 * @param {string} title - 通知的标题，将显示在通知的顶部。
 * @param {string} message - 通知的内容，用于提供详细信息。
 * @param {Object} [options={}] - 可选参数，用于自定义通知的外观和行为。
 * @param {string} [options.type='info'] - 通知类型，决定通知的样式和图标。支持 'info', 'success', 'warning', 'error'。
 * @param {number|boolean} [options.duration=3000] - 通知的显示时长（毫秒）。设置为 `false` 表示不会自动隐藏。
 * @param {boolean} [options.html=false] - 是否允许 `message` 使用 HTML。为 `false` 时自动转义 HTML 字符。
 * @param {boolean} [options.dismissible=true] - 是否允许用户关闭通知（显示关闭按钮或允许点击背景关闭）。
 * @param {boolean} [options.modal=false] - 是否显示为模态框。如果为 `true`，使用 Modal 样式而非 Toast。
 * @param {string} [options.size='medium'] - 模态框的大小，适用于 `modal=true` 的场景。可选值为 'small', 'medium', 'large'。
 * @param {boolean} [options.animate=true] - 是否启用动画效果。
 * @param {Array<Object>} [options.buttons=[]] - 自定义按钮数组，适用于需要用户交互的通知。每个按钮可设置以下属性：
 *   - `text` (string): 按钮文本。
 *   - `class` (string): 按钮的样式类，例如 'btn-primary'。
 *   - `onClick` (Function): 按钮的点击事件回调函数。
 *   - `closeOnClick` (boolean): 点击按钮后是否自动关闭通知，默认为 `true`。
 * @param {number} [options.triggerTime=Date.now()] - 通知的触发时间，用于显示时间差信息。
 *
 * @returns {Object|null} 返回 Toast 或 Modal 的实例；如果发生错误，返回 `null`。
 *
 * @example
 * // 显示一个简单的 Toast 通知
 * showNotification('提示', '操作成功完成', { type: 'success', duration: 5000 });
 *
 * @example
 * // 显示一个模态通知
 * showNotification('警告', '您确定要删除吗？', {
 *   modal: true,
 *   dismissible: false,
 *   buttons: [
 *     { text: '确认', class: 'btn-danger', onClick: () => console.log('确认删除') },
 *     { text: '取消', class: 'btn-secondary' }
 *   ],
 * });
 */
function showNotification(title, message, options = {}) {
  const defaults = {
    type: 'info', // 类型, inf,success,error,warning
    duration: 3000, // 持续时间（毫秒），设置为 false 则不会自动关闭
    position: 'top-0', // Toast 位置
    animate: true, // 是否启用动画
    dismissible: true, // 是否可关闭
    buttons: [], // 自定义按钮
    modal: false, // 是否显示为 Modal
    size: 'medium', // Modal 大小
    html: false, // 是否允许 HTML 内容
    triggerTime: Date.now(), // 创建时间
  };
  // 合并用户配置和默认配置
  const config = { ...defaults, ...options };

  // 如果当前通知数量超过最大值，移除最早的弹窗
  if (currentNotifications.length >= maxNotifications) {
    const oldestNotification = currentNotifications.shift();
    if (oldestNotification) {
      oldestNotification.hide();
    }
  }
  // 处理模态框通知
  if (config.modal) {
    const modalInstance = showModal(title, message, config);
    if (modalInstance) {
      currentNotifications.push(modalInstance);
      // 监听 Modal 关闭事件，移除队列中的实例
      modalInstance._element.addEventListener('hidden.bs.modal', () => {
        const index = currentNotifications.indexOf(modalInstance);
        if (index !== -1) {
          currentNotifications.splice(index, 1);
        }
      });
    }
    return modalInstance;
  }

  // 转义标题和内容以防止 XSS
  title = escapeHtml(title);

  // 处理吐司通知
  const toastInstance = showToast(title, message, config);
  if (toastInstance) {
    currentNotifications.push(toastInstance);
    // 监听 Modal 关闭事件，移除队列中的实例
    toastInstance._element.addEventListener('hidden.bs.toast', () => {
      const index = currentNotifications.indexOf(toastInstance);
      if (index !== -1) {
        currentNotifications.splice(index, 1);
      }
    });
  }
  return toastInstance;
}

/**
 * 显示一个动态通知（Toast）。
 *
 * @param {string} title - 通知标题，支持 HTML 格式化。
 * @param {string} message - 通知内容，支持 HTML 格式化。
 * @param {Object} config - 配置选项，用于自定义通知的外观和行为。
 * @param {boolean} [config.animate=true] - 是否启用显示/隐藏动画。
 * @param {boolean|number} [config.duration=3000] - 自动隐藏通知的时间（毫秒）。设置为 `false` 时，通知不会自动隐藏。
 * @param {boolean} [config.html=false] - 是否允许 `message` 使用 HTML。为 `false` 时自动转义 HTML 字符。
 * @param {Array} [config.buttons=[]] - 按钮数组，每个按钮可以指定文本、样式和回调函数。
 * @param {boolean} [config.dismissible=true] - 是否显示关闭按钮，允许用户手动关闭通知。
 * @param {string} [config.type='info'] - 通知类型，决定样式和图标。支持 'info', 'success', 'warning', 'error'。
 * @param {number} [config.triggerTime=Date.now()] - 通知的触发时间，用于计算相对时间。
 *
 * @returns {Object|null} 返回 Toast 的 Bootstrap 实例；如果发生错误，返回 `null`。
 *
 * @example
 * showNotificationNotification('成功', '操作已完成', {
 *   type: 'success',
 *   duration: 5000,
 *   buttons: [
 *     { text: '撤销', class: 'btn-warning', onClick: () => console.log('撤销操作') }
 *   ],
 *   html: false,
 *   dismissible: true,
 * });
 */
function showToast(title, message, config, isNeedRemove = true) {
  try {
    title = escapeHtml(title);
    // 获取或克隆现有的 Toast 元素
    let toastEl = document.getElementById('programToast');
    if (!toastEl) throw new Error('Toast element not found');
    if (toastEl.classList.contains('show')) {
      const newToastEl = toastEl.cloneNode(true);
      newToastEl.removeAttribute('id');
      document.querySelector('.toast-container').appendChild(newToastEl);
      toastEl = newToastEl;
    }
    // 创建 Bootstrap Toast 实例
    const toastInstance = new bootstrap.Toast(toastEl, {
      animation: config.animate,
      autohide: config.duration !== false,
      delay: config.duration,
    });

    // 配置 Toast 内容
    const iconEl = toastEl.querySelector('#toastIcon');
    const titleEl = toastEl.querySelector('#toastTitle');
    const messageEl = toastEl.querySelector('#toastMessage');
    const buttonContainer = toastEl.querySelector('#toastButtons');
    const closeBtn = toastEl.querySelector('.btn-close');
    const timeDiffEl = toastEl.querySelector('#toastTimeDiff');

    // 恢复原有的Toast的样式
    toastEl.className = 'toast';
    titleEl.className = 'me-auto';
    messageEl.className = '';
    timeDiffEl.className = 'text-muted';

    // 更新 Toast 样式和内容
    if (iconEl) {
      iconEl.textContent = notificationConfig.icons[config.type];
      toastEl.classList.add(
        notificationConfig.style_bg_color_classname[config.type],
        notificationConfig.style_bg_text_classname[config.type],
      );
    }

    if (titleEl) {
      titleEl.classList.add(notificationConfig.style_bg_text_classname[config.type]);
      titleEl.textContent = title;
    }
    if (messageEl) {
      if (config.html) {
        messageEl.innerHTML = message;
      } else {
        messageEl.textContent = message;
      }
    }

    // 配置按钮
    if (buttonContainer) {
      buttonContainer.innerHTML = '';
      if (config.buttons && config.buttons.length > 0) {
        config.buttons.forEach((button) => {
          const btnElement = document.createElement('button');
          btnElement.textContent = button.text;
          btnElement.className = button.class || 'btn btn-sm btn-primary';
          btnElement.onclick = () => {
            if (button.onClick) button.onClick();
            if (button.closeOnClick !== false) {
              toastInstance.hide();
            }
          };
          buttonContainer.appendChild(btnElement);
        });
        buttonContainer.style.display = 'flex';
      } else {
        buttonContainer.style.display = 'none';
      }
    }

    // 配置关闭按钮
    if (closeBtn) {
      closeBtn.style.display = config.dismissible ? 'block' : 'none';
    }

    // 更新时间显示
    if (timeDiffEl) {
      timeDiffEl.textContent = '刚刚';
      timeDiffEl.classList.add(notificationConfig.style_bg_text_classname[config.type]);
    }

    // 定时更新时间差
    const intervalId = setInterval(() => {
      timeDiffEl.textContent = calculateTimeDifference(Date.now(), config.triggerTime);
    }, 1000);

    // 监听 Toast 隐藏事件，清理定时器
    toastInstance._element.addEventListener('hidden.bs.toast', function () {
      clearInterval(intervalId);
      isNeedRemove && toastEl.id !== 'programToast' && toastEl.remove();
    });

    toastInstance.show();
    return toastInstance;
  } catch (error) {
    my_debugger.showError('Failed to show toast notification:', error);
    return null;
  }
}

/**
 * 显示一个模态通知。
 *
 * @param {string} title - 通知标题，支持 HTML 格式化。
 * @param {string} message - 通知内容，支持 HTML 格式化。
 * @param {Object} config - 配置选项，用于自定义模态通知的行为和样式。
 * @param {boolean} [config.dismissible=true] - 是否允许用户关闭模态框。设置为 `false` 则用户无法关闭模态框。
 * @param {Array} [config.buttons=[]] - 按钮数组，每个按钮可以指定文本、样式和回调函数。
 * @param {string} [config.size='medium'] - 模态框大小，可选值为 'small', 'medium', 'large'。
 * @param {boolean} [config.html=false] - 是否允许 `message` 使用 HTML。为 `false` 时自动转义 HTML 字符。
 *
 * @returns {Object|null} 返回模态框的 Bootstrap Modal 实例；如果出现错误，返回 `null`。
 *
 * @example
 * showModalNotification('提示', '这是一个模态通知', {
 *   dismissible: true,
 *   buttons: [
 *     { text: '确认', class: 'btn-primary', onClick: () => console.log('确认') },
 *     { text: '取消', class: 'btn-secondary', closeOnClick: true },
 *   ],
 *   size: 'large',
 *   html: true
 * });
 */
function showModal(title, message, config) {
  try {
    // Ensure config.dismissible is always boolean
    config.dismissible = Boolean(config.dismissible ?? true); // defaults to true if undefined
    const modalEl = document.getElementById('notificationModal');
    if (!modalEl) throw new Error('Modal element not found');

    // Get modal elements
    const titleEl = modalEl.querySelector('#modalTitle');
    const bodyEl = modalEl.querySelector('#modalBody');
    const footerEl = modalEl.querySelector('#modalFooter');
    const closeBtn = modalEl.querySelector('.btn-close');
    const dialogEl = modalEl.querySelector('.modal-dialog');

    // Set modal size
    dialogEl.className = `modal-dialog modal-dialog-centered ${
      config.size === 'large' ? 'modal-lg' : config.size === 'small' ? 'modal-sm' : ''
    }`;

    // Set content
    if (titleEl) {
      titleEl.innerHTML = `${notificationConfig.icons[config.type]} ${title}`;
    }

    if (bodyEl) {
      if (config.html) {
        bodyEl.innerHTML = message;
      } else {
        bodyEl.textContent = message;
      }
    }

    // Handle buttons
    if (footerEl) {
      footerEl.innerHTML = config.dismissible
        ? '<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>'
        : '';

      if (config.buttons.length > 0) {
        config.buttons.forEach((button) => {
          const btnElement = document.createElement('button');
          btnElement.textContent = button.text;
          btnElement.className = button.class || 'btn btn-primary';
          btnElement.onclick = () => {
            if (button.onClick) button.onClick();
            if (button.closeOnClick !== false) {
              modalInstance.hide();
            }
          };
          footerEl.appendChild(btnElement);
        });
      }
    }

    // Handle close button
    if (closeBtn) {
      closeBtn.style.display = config.dismissible ? 'block' : 'none';
    }

    // Create and show modal
    const modalInstance = new bootstrap.Modal(modalEl, {
      backdrop: config.dismissible ? true : 'static',
      keyboard: config.dismissible || false,
    });
    modalInstance.show();

    return modalInstance;
  } catch (error) {
    my_debugger.showError('Failed to show modal notification:', error);
    return null;
  }
}

/**
 * 计算时间差并返回友好的描述
 * @param {number} now - 当前时间戳
 * @param {number} triggerTime - 通知触发时间戳
 * @returns {string} 时间差描述
 */
function calculateTimeDifference(now, triggerTime) {
  const diff = now - triggerTime;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return `${seconds}秒前`;
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  if (days < 7) return `${days}天前`;
  return '刚刚';
}

class ThemeConfigForm {
  constructor(presets) {
    this.presets = JSON.parse(JSON.stringify(presets)) || [];
    this.themeConfig = this.presets.filter((item) => item.default === true)[0];
    this.sections = ['low', 'mid', 'high', 'accent'];
  }

  _addEventListeners() {
    if (this.eventListenersInitialized) return; // 如果已初始化，直接返回
    // Add Color buttons
    document.querySelectorAll('.add-color-btn').forEach((button) => {
      button.addEventListener('click', (e) => {
        const section = e.currentTarget.dataset.section;
        this.addColorItem(section);
      });
    });

    // Export button
    const exportBtn = document.querySelector('#themeConfig_exportConfig');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => debounce(this.exportConfig(), 1000));
    }

    // Import input
    const importInput = document.querySelector('#themeConfig_importConfig');
    if (importInput) {
      importInput.addEventListener('change', (e) => debounce(this.importConfig(e.target), 1000));
    }

    const saveInput = document.querySelector('#themeConfig_saveConfig');
    if (saveInput) {
      saveInput.addEventListener('click', (e) => debounce(this.saveConfig(), 1000));
    }

    document.getElementById('confirm-reset-btn').addEventListener(
      'click',
      debounce(() => {
        // 清空所有设置或执行其他重置操作
        this.resetSettings();
        showNotification('已重置', '所有设置已被清除！', {
          type: 'info',
          duration: 3000,
        });
        bootstrap.Modal.getInstance(document.getElementById('resetModal')).hide();
      }, 1000),
    );
    const presetSelect = document.getElementById('presetSelect');

    if (!presetSelect.hasAttribute('data-initialized')) {
      let defaultIndex = -1;
      const fragment = document.createDocumentFragment();

      this.presets.forEach((preset, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = preset.name;
        fragment.appendChild(option);

        if (preset.default === true) {
          defaultIndex = index;
        }
      });

      presetSelect.appendChild(fragment);

      if (defaultIndex !== -1) {
        presetSelect.value = defaultIndex;
      }

      presetSelect.setAttribute('data-initialized', 'true');
    }

    presetSelect.addEventListener('change', (e) => {
      const presetIndex = parseInt(e.target.value);
      if (!isNaN(presetIndex) && this.presets[presetIndex]) {
        this.themeConfig = JSON.parse(JSON.stringify(this.presets[presetIndex]));
        this.eventListenersInitialized = false;
        this.initializeForm();
        showNotification('预设已应用', '', { type: 'success', duration: 3000 });
      }
    });
    this.eventListenersInitialized = true; // 设置标志位为已初始化
  }

  createSectionContainers() {
    const colorSections = document.getElementById('colorSections');
    if (!colorSections) return;

    colorSections.innerHTML = ''; // Clear existing content

    const fragment = document.createDocumentFragment();

    this.sections.forEach((section) => {
      const sectionDiv = document.createElement('div');
      sectionDiv.className = `${section}ColorsSection  mb-4`;
      sectionDiv.innerHTML = `
            <div class="d-flex justify-content-between align-items-center mb-2">
                <h6 class="text-capitalize mb-0">${section} Colors</h6>
                <small class="form-text text-muted">${this.getSectionDescription(section)}</small>
                <button type="button" class="btn btn-sm btn-outline-primary add-color-btn" data-section="${section}">
                    <i class="material-icons">add</i>添加颜色
                </button>
            </div>
            <div id="${section}Colors" class="color-items">
            </div>
        `;

      fragment.appendChild(sectionDiv);
    });

    colorSections.appendChild(fragment);
  }

  getSectionDescription(section) {
    switch (section) {
      case 'low':
        return '低频部分（如前奏、慢节奏段落）';
      case 'mid':
        return '中频部分（如主歌、节奏适中的段落）';
      case 'high':
        return '高频部分（如副歌、高潮段落）';
      case 'accent':
        return '关键转折处的颜色（如情感爆发点）';
      default:
        return '';
    }
  }

  renderColorItems(section) {
    const container = document.getElementById(`${section}Colors`);
    if (!container) {
      my_debugger.showError(`Container for ${section} not found`);
      return;
    }

    container.innerHTML = '';

    const fragment = document.createDocumentFragment();

    // 先显示总百分比
    const totalPercentageDiv = document.createElement('div');
    totalPercentageDiv.id = `${section}TotalPercentage`;
    totalPercentageDiv.className = 'total-percentage';
    fragment.appendChild(totalPercentageDiv); // 在列表上方添加总和显示
    this.calculateTotalPercentage(section); // 计算并显示总和

    this.themeConfig.themeColors[section].forEach((item, index) => {
      const itemDiv = document.createElement('div');
      itemDiv.className = 'row mb-2 align-items-center';
      itemDiv.innerHTML = `
            <div class="col">
                ${this.createColorSelect(section, index, item.color).outerHTML}
            </div>
            <div class="col d-flex">
                <div class="input-group flex-grow-1">
                    <input type="number" class="form-control percentage-input"
                           value="${parseInt(item.per, 10)}"
                           min="0" max="100"
                           data-section="${section}"
                           data-index="${index}">
                    <span class="input-group-text">%</span>
                </div>
            </div>
            <div class="col-auto">
                <button type="button" class="btn btn-xs btn-outline-danger remove-color-btn"
                        data-section="${section}"
                        data-index="${index}">
                    <i class="material-icons">delete</i>删除
                </button>
            </div>
        `;
      fragment.appendChild(itemDiv);
      // Add event listeners to the newly created elements
      const select = itemDiv.querySelector('select');
      select.value = item.color;
      select.onchange = (e) => {
        if (index == null) {
          this.themeConfig.themeColors.base = e.target.value;
        } else {
          this.updateColor(section, index, e.target.value);
        }
      };

      const rmbtn = itemDiv.querySelector('button.remove-color-btn');
      rmbtn.addEventListener('click', (e) => {
        const { section, index } = e.target.dataset;
        this.removeColorItem(section, parseInt(index, 10));
      });

      const perInput = itemDiv.querySelector('input.percentage-input');
      perInput.addEventListener('change', (e) => {
        const { section, index } = e.target.dataset;
        this.updatePercentage(section, parseInt(index, 10), e.target.value);
      });
    });

    container.appendChild(fragment);
  }

  createColorSelect(section, index, currentValue) {
    const div = document.createElement('div');
    div.className = 'd-flex align-items-center';

    // 获取颜色代码的 hex 值
    const hexColor = ColorCodeManager.AVAILABLE_COLOR_CODES_TO_HEX[currentValue];

    // 创建颜色样本 (Swatch)
    const swatch = document.createElement('span');
    swatch.className = 'swatch';
    swatch.title = hexColor; // 鼠标悬停时显示颜色代码
    swatch.style.backgroundColor = hexColor; // 设置背景色为当前颜色的 hex 值

    // 创建下拉选择框
    const select = document.createElement('select');
    select.className = 'form-select';

    // 填充颜色选择框
    Object.values(ColorCodeManager.AVAILABLE_COLOR_CODES).forEach((color) => {
      const option = document.createElement('option');
      option.value = color;
      option.textContent = color.toUpperCase();
      option.selected = color === currentValue;
      select.appendChild(option);
    });

    // 当选择改变时，更新颜色样本 (Swatch) 和选中的颜色
    select.addEventListener('change', (e) => {
      const newColor = e.target.value;
      const newHexColor = ColorCodeManager.AVAILABLE_COLOR_CODES_TO_HEX[newColor];

      // 更新对应颜色项的 swatch 背景色
      swatch.style.backgroundColor = newHexColor;
      swatch.title = newHexColor;

      // 更新配置中的颜色
      index !== null && this.updateColor(section, index, newColor);
    });

    // 将 Swatch 和 Select 插入 div 中
    div.appendChild(swatch);
    div.appendChild(select);

    return div;
  }

  // 添加颜色项，增加校验总和
  addColorItem(section) {
    const totalPercentage = this.calculateTotalPercentage(section);
    if (totalPercentage === 100) {
      showNotification(
        '哎呀，无法添加更多颜色啦！ 🎨',
        '该部分的颜色百分比已满（100%），没办法再添加更多颜色咯~',
        {
          type: 'warning',
          duration: 3000,
        },
      );
      return;
    }

    // 如果已达到最大百分比限制，禁止添加新颜色
    if (this.themeConfig.themeColors[section].length >= 10) {
      showNotification('哇哦，最多只能添加10个颜色哦！ ⚠️', '每个部分的颜色数量已经达到上限啦~', {
        type: 'warning',
        duration: 3000,
      });
      return;
    }

    this.themeConfig.themeColors[section].push({
      color: ColorCodeManager.ALL_SUPPORTED_COLOR_CODES.BLU,
      per: '1%',
    }); // 设置最小1%的百分比
    this.renderColorItems(section);
    this.validatePercentages(section);
    this.calculateTotalPercentage(section);

    showNotification('颜色已添加! ✨', '新的颜色选项已添加到您的调色板', {
      type: 'success',
      duration: 2000,
    });
  }

  removeColorItem(section, index) {
    this.themeConfig.themeColors[section].splice(index, 1);
    if (this.themeConfig.themeColors[section].length === 0) {
      this.addColorItem(section);
    }
    this.renderColorItems(section);
    this.calculateTotalPercentage(section); // 重新计算并显示总百分比
    this.validatePercentages(section);

    showNotification('颜色已移除! 🗑️', '该颜色已从调色板中移除', {
      type: 'info',
      duration: 2000,
    });
  }

  updateColor(section, index, value) {
    this.themeConfig.themeColors[section][index].color = value;
    // 调用渲染方法来重新计算总百分比并更新显示
    this.calculateTotalPercentage(section);
    this.renderColorItems(section);
  }

  // 更新百分比，避免出现0%的情况
  updatePercentage(section, index, value) {
    const percentage = parseInt(value, 10);
    if (percentage === 0) {
      showNotification(
        '无效百分比！⚠️',
        '百分比不能为0哦，这样会影响颜色配置效果，请设置一个大于0且小于等于100的百分比值呢~',
        {
          type: 'error',
          duration: 3000,
        },
      );
      return;
    }
    this.themeConfig.themeColors[section][index].per = `${percentage}%`;
    this.validatePercentages(section);
    this.calculateTotalPercentage(section);
  }

  calculateTotalPercentage(section) {
    const items = this.themeConfig.themeColors[section];
    const total = items.reduce((sum, item) => sum + parseInt(item.per, 10), 0);
    this.updatePercentageDisplay(section, total); // 更新显示
    return total;
  }

  updatePercentageDisplay(section, total) {
    const totalDisplay = document.getElementById(`${section}TotalPercentage`);
    if (totalDisplay) {
      totalDisplay.textContent = `总百分比: ${total}%`;
    }
  }

  validatePercentages(section, isFirst = false) {
    let over = 0;
    const items = this.themeConfig.themeColors[section];
    const total = items.reduce((sum, item) => sum + parseInt(item.per, 10), 0);
    const rest = 100 - total;
    over = total - 100;
    if (over > 0) {
      document.getElementById(`${section}Colors`).classList = 'color-items is-invalid';
      document.getElementById(`${section}TotalPercentage`).className =
        'text-warning total-percentage ';
      !isFirst &&
        showNotification(
          '快速检查! 🎨',
          `${section}的总和超出了 100%（当前：${total}%），请调整比例以使总和不超过 100%。`,
          {
            type: 'warning',
            duration: 5000,
            dismissible: true,
          },
        );
      return false;
    } else if (over < 0) {
      document.getElementById(`${section}Colors`).classList = 'color-items is-invalid';
      document.getElementById(`${section}TotalPercentage`).className =
        'text-warning total-percentage is-invalid';
      !isFirst &&
        showNotification(
          '颜色分配需达100%！🎨',
          `${section} : 你当前设置的是 ${total}%，还有 ${rest}% 空余哦，快补上吧！`,
          {
            type: 'warning',
            duration: 4000,
          },
        );
      return false;
    } else if (over == 0) {
      document.getElementById(`${section}Colors`).classList = 'color-items is-valid';
      document.getElementById(`${section}TotalPercentage`).className =
        'text-success total-percentage';
      return true;
    }
    showNotification('错误', '出了一点问题，请再试一次。', {
      type: 'error',
      duration: 5000,
    });
    return false;
  }

  resetSettings() {
    this.themeConfig = {
      themeColors: {
        low: [{ color: 'blu', per: '1%' }],
        mid: [{ color: 'blu', per: '1%' }],
        high: [{ color: 'blu', per: '1%' }],
        accent: [{ color: 'blu', per: '1%' }],
        base: 'blu',
      },
    };
    this.eventListenersInitialized = false;
    this.initializeForm();
  }

  exportConfig() {
    // Validate all sections before export
    const isValid = ['low', 'mid', 'high', 'accent'].every((section) =>
      this.validatePercentages(section),
    );

    if (!isValid) return;

    const configString = JSON.stringify(this.themeConfig, null, 2);
    const blob = new Blob([configString], { type: 'application/json' });

    // 使用 FileSaver.js 的 saveAs 来直接保存文件
    window.saveAs(blob, 'theme-config.json');

    // 显示导出成功通知
    showNotification('导出成功！📦', '你的设置已保存为文件，快留作纪念吧~', {
      type: 'success',
      duration: 3000,
    });
  }

  saveConfig() {
    // Validate all sections before export
    const isValid = ['low', 'mid', 'high', 'accent'].every((section) =>
      this.validatePercentages(section),
    );

    if (!isValid)
      return showNotification('保存失败 ❌', '请确保所有颜色分配和百分比都正确。', {
        type: 'error',
        duration: 5000,
      });

    window.AudioAnalyzer &&
      window.AudioAnalyzer.handleThemeChange_manual(this.themeConfig) &&
      showNotification(
        '主题颜色方案准备好了！',
        '下一步：点击“生成预设代码”按钮，创造你的灯光秀吧！',
        {
          type: 'info',
          duration: 4000,
        },
      );
    localStorage.setItem('lastThemeColors', JSON.stringify(this.themeConfig));
  }

  importConfig(input) {
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);

        // Validate imported colors
        const isValid = this.validateImportedConfig(imported);
        if (!isValid) {
          throw new Error('Invalid color codes in imported configuration');
        }

        this.themeConfig = imported;
        this.initializeForm();
        showNotification('已导入！📥', '你的颜色偏好已成功导入', {
          type: 'success',
          duration: 3000,
        });
        this.saveConfig();
      } catch (error) {
        showNotification('错误', '出了一点问题，请再试一次。', {
          type: 'error',
          duration: 5000,
        });
      }
    };
    reader.onerror = () => {
      showNotification('错误', '文件读取失败，请再试一次。', {
        type: 'error',
        duration: 5000,
      });
    };
    reader.readAsText(file);
  }

  validateImportedConfig(config) {
    const validColors = Object.values(ColorCodeManager.ALL_SUPPORTED_COLOR_CODES);
    const sections = ['low', 'mid', 'high', 'accent'];

    // Validate base color
    if (!validColors.includes(config.themeColors.base)) {
      showNotification('哎呀！出错了~', '主色调好像没选对，请检查一吧！', {
        type: 'error',
        duration: 5000,
      });
      return false;
    }

    // Validate section colors
    for (const section of sections) {
      if (!config.themeColors[section]) {
        showNotification('哎呀！出错了~', `缺少部分：${section}`, {
          type: 'error',
          duration: 5000,
        });
        return false;
      }

      for (const item of config.themeColors[section]) {
        if (!validColors.includes(item.color)) {
          showNotification('哎呀！出错了~', `${section} 部分颜色无效`, {
            type: 'error',
            duration: 5000,
          });
          return false;
        }

        if (typeof item.per !== 'string') {
          showNotification('哎呀！出错了~', `${section} 部分百分比格式无效`, {
            type: 'error',
            duration: 5000,
          });
          return false;
        }

        const percentage = parseInt(item.per, 10);
        if (isNaN(percentage)) {
          showNotification('配置无效', `${section} 部分百分比值无效`, {
            type: 'error',
            duration: 5000,
          });
          return false;
        }
        if (percentage < 0 || percentage > 100) {
          showNotification('配置无效', `${section} 部分百分比值无效`, {
            type: 'error',
            duration: 5000,
          });
          return false;
        }
      }
    }

    return true;
  }

  initializeForm() {
    // First create base color select
    const baseContainer = document.getElementById('baseColorContainer');
    if (baseContainer) {
      baseContainer.innerHTML = '';
      const fragment = document.createDocumentFragment();
      const baseSelect = this.createColorSelect('base', null, this.themeConfig.themeColors.base);
      fragment.appendChild(baseSelect);
      baseContainer.appendChild(fragment);

      baseSelect.onchange = (e) => {
        this.themeConfig.themeColors.base = e.target.value;
      };
    }

    // Then create section containers and render items
    this.createSectionContainers();
    this.sections.forEach((section) => {
      this.renderColorItems(section);
      this.validatePercentages(section, true);
      this.calculateTotalPercentage(section);
    });
    // Add event listeners to the newly created buttons
    this._addEventListeners();
  }
}

/**
 *
 * @param {string} data
 * @example [length: 03:36]
 * @return {<Array>{string}} ['length', '03:06']
 */

function extractInfo(lrcData) {
  const tags = {};
  const lines = lrcData.split(/\r\n|\n|\r/);

  lines.forEach((line) => {
    const match = line.match(/\[(\w+):(.+)\]/);
    if (match) {
      const [_, key, value] = match;
      tags[key] = value.trim();
    }
  });

  return tags;
}

function lrcParser(data) {
  if (typeof data !== 'string') {
    throw new TypeError('expect first argument to be a string');
  }
  // split a long stirng into lines by system's end-of-line marker line \r\n on Windows
  // or \n on POSIX
  let lines = data.split('\n');
  const timeStart = /\[(\d*\:\d*\.?\d*)\]/; // i.g [00:10.55]
  const scriptText = /(.+)/; // Havana ooh na-na (ayy)
  const timeEnd = timeStart;
  const startAndText = new RegExp(timeStart.source + scriptText.source);

  const infos = [];
  const scripts = [];
  const result = {};

  for (let i = 0; startAndText.test(lines[i]) === false; i++) {
    infos.push(lines[i]);
  }

  // infos.reduce((result, info) => {
  //   const [key, value] = extractInfo(info);
  //   result[key] = value;
  //   return result;
  // }, result);
  result.infos = extractInfo(data);

  lines.splice(0, infos.length); // remove all info lines
  const qualified = new RegExp(startAndText.source + '|' + timeEnd.source);
  lines = lines.filter((line) => qualified.test(line));

  for (let i = 0, l = lines.length; i < l; i++) {
    const matches = startAndText.exec(lines[i]);
    const timeEndMatches = timeEnd.exec(lines[i + 1]);
    if (matches && timeEndMatches) {
      const [, start, text] = matches;
      const [, end] = timeEndMatches;
      scripts.push({
        start: convertTime(start),
        text,
        end: convertTime(end),
      });
    }
  }

  result.scripts = scripts;
  return result;
}

// convert time string to seconds
// i.g: [01:09.10] -> 69.10
function convertTime(string) {
  string = string.split(':');
  const minutes = parseInt(string[0], 10);
  const seconds = parseFloat(string[1]);
  if (minutes > 0) {
    const sc = minutes * 60 + seconds;
    return parseFloat(sc.toFixed(2));
  }
  return seconds;
}

/*
 * generate-tool
 */

const unlockSection = (sectionId) => {
  const section = document.getElementById(sectionId);
  section.classList.remove('disabled');
  section.scrollIntoView({ behavior: 'smooth' });
};
const lockSection = (sectionId) => {
  const section = document.getElementById(sectionId);
  section.classList.add('disabled');
};
const completeStep = (currentStepId, nextStepId) => {
  document.getElementById(currentStepId).classList.add('completed');
  unlockSection(nextStepId);
};

import localforage from 'localforage';
import { guess } from 'web-audio-beat-detector';
class AudioAnalyzer {
  constructor() {
    this.state = {
      audioContext: null,
      isAnalyzing: false,
      audioBuffer: null,
      metadata: null,
      lyrics: null,
      themeColors: null,
    };

    this.setupEventListeners();
    // 控制状态显示的函数
    this.showStatusNotStarted = () => {
      document.getElementById('statusNotStarted').classList.remove('d-none');
      document.getElementById('statusProcessing').classList.add('d-none');
      document.getElementById('statusCompleted').classList.add('d-none');
    };

    this.showStatusProcessing = () => {
      document.getElementById('statusNotStarted').classList.add('d-none');
      document.getElementById('statusProcessing').classList.remove('d-none');
      document.getElementById('statusCompleted').classList.add('d-none');
    };

    this.showStatusCompleted = () => {
      document.getElementById('statusNotStarted').classList.add('d-none');
      document.getElementById('statusProcessing').classList.add('d-none');
      document.getElementById('statusCompleted').classList.remove('d-none');
    };
  }

  setupEventListeners() {
    document
      .getElementById('searchEntry__generate_tool')
      .addEventListener('click', () => debounce(this.handleNetworkAudioEntry(), 1000));
    document
      .getElementById('audioFileInput_generate_tool')
      .addEventListener('change', (e) => this.handleAudioFileSelect(e));
    document
      .getElementById('lrcFileInput_generate_tool')
      .addEventListener('change', (e) => this.handleLrcFileSelect(e));

    // Analysis button
    document
      .getElementById('generate-btn')
      .addEventListener('click', () => debounce(this.startAnalysis(), 1500));

    document.getElementById('copy-btn').addEventListener(
      'click',
      debounce(async () => {
        try {
          const content = document.getElementById('output-result').value;
          await navigator.clipboard.writeText(content);
          showNotification('成功~🎉', '📋 已复制~可以直接粘贴使用啦！', {
            type: 'success',
            duration: 3000,
          });
        } catch (err) {
          my_debugger.showError('Failed to copy:', err);
          showNotification('出错了~🤔', '📋 复制失败了，请重试哦！实在不行请手动复制！', {
            type: 'error',
            duration: 5000,
          });
        }
      }, 1000),
    );

    document.getElementById('download-btn').addEventListener(
      'click',
      debounce(() => {
        try {
          const content = document.getElementById('output-result').value;
          if (!content.trim() || !content.replace(/\s/g, '')) {
            showNotification('检查一下！💭', '还没有内容可以下载。先添加一些内容吧！', {
              type: 'warning',
              duration: 4000,
            });
            return;
          }
          if (Timeline.parse(content).errors.length) {
            showNotification(
              '出错了~🤔',
              '预设代码无效，请检查内容!\n' + Timeline.parse(content).errors,
              {
                type: 'error',
                duration: 5000,
              },
            );
            return;
          }

          // 转义用户输入，防止XSS攻击
          const escapedContent = content.replace(/</g, '&lt;').replace(/>/g, '&gt;');

          // 使用 FileSaver.js 的 saveAs 方法来保存文件
          const blob = new Blob([escapedContent], {
            type: 'text/plain;charset=utf-8',
          });

          // 文件保存
          window.saveAs(blob, 'converted-output.txt');

          // 添加成功通知
          showNotification('下载中~✨', '文件已经开始下载，请稍等一会儿哦！', {
            type: 'success',
            duration: 3000,
          });
        } catch (error) {
          // 添加错误通知
          showNotification('出错了~ 🤔', '下载失败了，请检查文件内容后再试！', {
            type: 'error',
            duration: 5000,
            dismissible: true,
          });

          // 确保my_debugger.showError存在
          if (typeof my_debugger !== 'undefined' && typeof my_debugger.showError === 'function') {
            my_debugger.showError('Download error:', error);
          } else {
            console.error('Download error:', error);
          }
        }
      }, 1500),
    );
  }

  async handleNetworkAudioEntry() {
    showModal(
      '在线音乐搜索',
      `
<div class="card shadow-sm mb-4">
      <div class="card-header">
        <h2 class="h5 mb-0">找到你喜欢的音乐吧！🎵</h2>
      </div>
      <div class="card-body">
        <div class="search-section d-flex align-items-center">
          <input type="text" class="form-control" placeholder="搜索音频" id="searchInput">
          <select class="form-select" id="searchTypeSelect">
            <option value="1">单曲</option>
            <option value="10" disabled>专辑</option>
            <option value="100" disabled>歌手</option>
            <option value="1000" disabled>歌单</option>
            <!-- ... other options ... -->
          </select>
          <button class="btn btn-primary" type="button" id="searchButton">搜索</button>
        </div>
        <div id="searchResults"></div>
      </div>
    </div>
      `,
      {
        type: 'info',
        size: 'large',
        modal: true,
        buttons: [],
        html: true,
        dismissible: true,
      },
    );

    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const searchTypeSelect = document.getElementById('searchTypeSelect');

    // Add enter key support
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        searchButton.click();
      }
    });

    searchButton.addEventListener(
      'click',
      debounce(async (e) => {
        const keyword = searchInput.value.trim();
        const searchType = searchTypeSelect.value;

        if (!keyword) {
          showNotification('错误', '搜索词不能为空!', {
            type: 'error',
            duration: 3000,
          });
          return;
        }

        showNotification('发起搜索！', `正在尝试搜索${keyword}`, {
          type: 'info',
          duration: 5000,
        });

        e.target.disabled = true;
        const cacheKey = `${keyword}_${searchType}`;

        try {
          // Check cache first
          const cachedResults = await localforage.getItem(cacheKey);
          if (cachedResults) {
            displaySearchResults(cachedResults, keyword);
            return;
          }

          const searchUrl = `https://netease-cloud-music-api-freysu.glitch.me/cloudsearch?keywords=${encodeURIComponent(
            keyword,
          )}&type=${searchType}&limit=100&offset=0`;
          const response = await fetch(searchUrl);

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          if (data.result?.songs?.length) {
            await localforage.setItem(cacheKey, data.result.songs);
            displaySearchResults(data.result.songs, keyword);
          } else {
            const noResultsMessage = '<p class="mt-3">没有找到你想要的音乐~试试换个关键词吧！</p>';
            document.getElementById('searchResults').innerHTML = noResultsMessage;
            showNotification('搜索结果', noResultsMessage, {
              type: 'warning',
              html: true,
              duration: 5000,
            });
          }
        } catch (error) {
          handleSearchError(error);
        } finally {
          e.target.disabled = false;
        }
      }, 500),
    );

    // Capture this reference
    const that = this;

    function handleSearchError(error) {
      let errorMessage = '';
      let errorTitle = '错误';

      if (
        error.message.includes('Failed to fetch') ||
        error.message.includes('网络错误') ||
        error.message.includes('HTTP error! status: 0')
      ) {
        errorMessage =
          '<p>网络不通畅哦，稍后再试吧~若第一次使用不了，请检查网络设置（可能需要特殊网络设置，如"魔法"），不然请放弃使用该功能。</p>';
        errorTitle = '网络错误';
      } else if (error.message.includes('HTTP error! status: 403')) {
        errorMessage = '<p>请求被拒绝，可能是API限制或IP被封禁。请尝试使用其他网络或稍后再试。</p>';
        errorTitle = '请求被拒绝';
      } else if (error.message.includes('HTTP error! status: 404')) {
        errorMessage = '<p>API未找到，可能是API地址有误。请检查API地址并重试。</p>';
        errorTitle = 'API未找到';
      } else {
        errorMessage = '<p>An error occurred while fetching results.</p>';
        console.error('Error fetching search results:', error);
      }

      document.getElementById('searchResults').innerHTML = errorMessage;
      showNotification(errorTitle, errorMessage, {
        type: 'error',
        html: true,
        duration: 5000,
      });
    }

    const highlightKeyword = (text, keywords, options = {}) => {
      if (!text || !keywords) return text;

      const {
        className = 'text-primary',
        caseSensitive = false,
        wholeWord = false,
        maxHighlights = 200,
      } = options;

      // Convert single keyword to array
      const keywordArray = Array.isArray(keywords) ? keywords : [keywords];

      // Escape special regex characters
      const escapedKeywords = keywordArray.map((keyword) =>
        keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
      );

      // Create regex pattern based on options
      const wordBoundary = wholeWord ? '\\b' : '';
      const flags = caseSensitive ? 'g' : 'gi';
      const pattern = escapedKeywords
        .map((keyword) => `${wordBoundary}(${keyword})${wordBoundary}`)
        .join('|');

      let highlightCount = 0;
      const regex = new RegExp(pattern, flags);

      return text.replace(regex, (match, ...groups) => {
        if (highlightCount >= maxHighlights) return match;
        highlightCount++;
        return `<span class="${className}">${match}</span>`;
      });
    };

    function displaySearchResults(songs, keyword) {
      const resultsHtml = `
        <div class="container-fluid p-0" id="song-list">
          ${songs
            .map(
              (song) => `
            <div class="card mb-3 border-0 shadow-sm hover-overlay">
              <div class="card-body">
                <div class="row align-items-center g-3">
                  <div class="col-auto">
                    <img data-src="${song.al.picUrl}"
                         alt="Album Cover"
                         class="rounded shadow-sm album-cover"
                         style="width: 80px; height: 80px; object-fit: cover;">
                  </div>
                  <div class="col">
                    <div class="d-flex justify-content-between align-items-start">
                      <div>
                        <h5 class="card-title mb-2">${highlightKeyword(song.name, [keyword], {
                          className: 'highlight-blue',
                          wholeWord: false,
                          caseSensitive: false,
                        })}</h5>
                        <div class="text-body-secondary mb-1">
                          <i class="material-icons align-middle me-1" style="font-size: 16px;">person</i>
                          ${song.ar
                            .map((artist) =>
                              highlightKeyword(artist.name, [keyword], {
                                className: 'highlight-blue',
                                wholeWord: false,
                                caseSensitive: false,
                              }),
                            )
                            .join(', ')}
                        </div>
                        <div class="text-body-secondary mb-1">
                          <i class="material-icons align-middle me-1" style="font-size: 16px;">album</i>
                          ${highlightKeyword(song.al.name, [keyword], {
                            className: 'highlight-blue',
                            wholeWord: false,
                            caseSensitive: false,
                          })}
                        </div>
                        <div class="text-body-secondary">
                          <i class="material-icons align-middle me-1" style="font-size: 16px;">schedule</i>
                          ${formatTimestamp(song.dt, 'mm:ss')}
                        </div>
                      </div>
                      <div class="ms-3">
                        <button class="btn btn-primary btn-sm select-song-btn rounded-pill px-3"
                                data-songid="${song.id}">
                          <i class="material-icons align-middle me-1">add</i>选择
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            `,
            )
            .join('')}
        </div>
      `;

      document.getElementById('searchResults').innerHTML = resultsHtml;

      var lazyLoadImg = new LazyLoadImg({
        el: document.querySelector('#song-list'),
        mode: 'default',
        time: 300, // 设置一个检测时间间隔
        complete: true,
        position: {
          top: 0, // 元素距离顶部
          right: 0, // 元素距离右边
          bottom: 0, // 元素距离下面
          left: 0, // 元素距离左边
        },
      });

      // Add event listeners to select buttons
      document.querySelectorAll('.select-song-btn').forEach((button) => {
        button.addEventListener('click', (e) => {
          that.getNetworkAudioInfo(e.target.closest('.select-song-btn').dataset.songid);
        });
      });
    }
  }

  async getNetworkAudioInfo(songId) {
    const cacheKey = `audioInfo_${songId}`;
    try {
      // 检查缓存中是否已有结果
      const cachedResult = await localforage.getItem(cacheKey);
      if (cachedResult) {
        console.log('Using cached data for songId:', songId);
        this.handleNetworkAudioSrc(cachedResult.url);
        this.handleNetworkAudioLrc(cachedResult.lyric);
        return;
      }
      const songUrl = `https://api.cenguigui.cn/api/netease/music_v1.php?id=${songId}&type=json&level=standard`;
      const response = await fetch(songUrl);
      const data = await response.json();
      if (data.data && data.data.name != null && data.data.url) {
        console.log('data.data: ', data.data);
        this.handleNetworkAudioSrc(data.data.url);
        this.handleNetworkAudioLrc(data.data.lyric);
        // 将结果缓存起来
        await localforage.setItem(cacheKey, data.data);
      } else {
        console.error('No song URL found.');
      }
    } catch (error) {
      console.error('Error fetching song URL:', error);
    }
  }

  async handleNetworkAudioSrc(url) {
    try {
      // 初始化 AudioContext
      if (this.state.audioContext) {
        await this.cleanup();
      }
      this.state.audioContext = new (window.AudioContext || window.webkitAudioContext)();

      // 从网络获取音频文件
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      this.state.audioBuffer = await this.state.audioContext.decodeAudioData(arrayBuffer);

      // 使用 web-audio-beat-detector 获取元数据
      this.state.metadata = await this.getMetadata(this.state.audioBuffer);

      // 更新 UI
      this.updateFileInfo(
        'audioFileInfo',
        { name: '网络音频', size: this.state.audioBuffer.length },
        this.state.metadata,
      );
      this.updateAnalyzeButtonState();
      showNotification('你的音乐准备好了', '下一步：配置主题颜色方案~', {
        type: 'success',
        duration: 3000,
      });
      document.getElementById('processing').classList.remove('d-none');
      this.showStatusNotStarted();
    } catch (error) {
      document.getElementById('processing').classList.add('d-none');
      showNotification(
        '哎呀，出错了！',
        '音频加载失败，可能是网络问题或者文件格式不对。请检查后重试~',
        {
          type: 'error',
          duration: 5000,
        },
      );
      my_debugger.showError(`Error loading network audio: ${error.message}`, error);
    }
  }

  async handleNetworkAudioLrc(text) {
    try {
      if (!String(text).startsWith('[0')) return;
      this.state.lyrics = lrcParser(text);

      // Update UI
      // this.updateFileInfo('lrcFileInfo', file)
      this.updateAnalyzeButtonState();
      showNotification('成功', '加载LRC文件成功', {
        type: 'success',
        duration: 3000,
      });
    } catch (error) {
      showNotification('错误', `加载LRC文件出错: ${error.message}`, {
        type: 'error',
        duration: 5000,
      });
      my_debugger.showError(`Error loading LRC file: ${error.message}`, error);
    }
  }

  checkFileFormat(file) {
    // prettier-ignore
    const supportedFormats = ['.aac','.flac','.mp3', '.wav', '.ogg', '.m4a'];
    const fileExtension = file.name.toLowerCase().match(/\.[^.]*$/)?.[0];

    if (!supportedFormats.includes(fileExtension)) {
      showNotification(
        '文件类型检查 ⚠️',
        '为了获得最佳效果，请使用 AAC、FLAC、MP3、WAV、OGG 或 M4A 文件！',
        {
          type: 'warning',
          duration: 4000,
          dismissible: true,
        },
      );
      return false;
    }
    return true;
  }

  async getMetadata(audioBuffer) {
    try {
      // 使用 web-audio-beat-detector 分析 BPM 和节奏偏移
      const { bpm, offset } = await guess(audioBuffer);

      // 假设其他元数据无法从 web-audio-beat-detector 中获取，设置默认值
      const sampleRate = audioBuffer.sampleRate || 44100;
      const duration = audioBuffer.duration || 0;

      showNotification(
        '音频解析完成！🎵',
        `找到 ${bpm} BPM，时长: ${this.formatDuration(duration)}，偏移: ${offset.toFixed(2)} 秒`,
        {
          type: 'success',
          duration: 4000,
        },
      );
      console.log({ bpm, sampleRate, duration, offset });

      return { bpm, sampleRate, duration, offset };
    } catch (error) {
      if (error.message.includes('Cannot use a BYOB reader with a non-byte stream')) {
        showModal(
          '浏览器不支持 🚀',
          '当前浏览器不支持音频分析功能，请尝试使用 Chrome 或 Firefox 浏览器。',
          {
            type: 'error',
            duration: 5000,
            modal: true,
            html: false,
            dismissible: true,
          },
        );
      } else {
        showNotification('音频解析问题 🎧', '无法解析这个音频文件。请尝试不同的格式。', {
          type: 'error',
          duration: 5000,
          dismissible: true,
        });
      }
      my_debugger.showError(`Error parsing metadata: ${error.message}`, error);
      throw error;
    }
  }

  async handleAudioFileSelect(event) {
    const file = event.target.files[0];

    if (!file)
      return showNotification('上传失败', '没有选择文件呢，先选择音乐文件再试吧~', {
        type: 'error',
        duration: 5000,
      });

    if (!this.checkFileFormat(file)) return;

    try {
      // 初始化 AudioContext
      if (this.state.audioContext) {
        await this.cleanup();
      }
      this.state.audioContext = new (window.AudioContext || window.webkitAudioContext)();

      // 将音频文件转换为 ArrayBuffer 并解码为 AudioBuffer
      const arrayBuffer = await file.arrayBuffer();
      this.state.audioBuffer = await this.state.audioContext.decodeAudioData(arrayBuffer);

      // 使用 web-audio-beat-detector 获取元数据
      this.state.metadata = await this.getMetadata(this.state.audioBuffer);

      // 更新 UI
      this.updateFileInfo('audioFileInfo', file, this.state.metadata);
      this.updateAnalyzeButtonState();
      showNotification('你的音乐准备好了', '下一步：配置主题颜色方案~', {
        type: 'success',
        duration: 3000,
      });
      document.getElementById('processing').classList.remove('d-none');
      this.showStatusNotStarted();
    } catch (error) {
      document.getElementById('processing').classList.add('d-none');

      my_debugger.showError(`Error loading audio file: ${error.message}`, error);
    }
  }

  async handleLrcFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const text = await file.text();
      this.state.lyrics = lrcParser(text);

      // Update UI
      this.updateFileInfo('lrcFileInfo', file);
      this.updateAnalyzeButtonState();
      showNotification('成功', '加载LRC文件成功', {
        type: 'success',
        duration: 3000,
      });
    } catch (error) {
      showNotification('错误', `加载LRC文件出错: ${error.message}`, {
        type: 'error',
        duration: 5000,
      });
      my_debugger.showError(`Error loading LRC file: ${error.message}`, error);
    }
  }

  async handleThemeChange(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const parsedData = JSON.parse(e.target.result);
          if (!parsedData || !parsedData.themeColors) {
            throw new Error('Invalid theme configuration format');
          }
          this.state.themeColors = parsedData.themeColors;
          if (ColorCodeManager.validateThemeColorCodes(this.state.themeColors)) {
            // Update UI
            this.updateFileInfo('themeConfigInfo', file);
            this.updateAnalyzeButtonState();
            showNotification('成功', '主题颜色导入成功', {
              type: 'success',
              duration: 3000,
            });
          } else {
            showNotification('错误', '主题颜色配置无效', {
              type: 'error',
              duration: 5000,
            });
            my_debugger.showError(`Invalid theme colors configuration. - ${error.message}`, error);
          }
        } catch (error) {
          showNotification('错误', '无效的JSON格式', {
            type: 'error',
            duration: 5000,
          });
        }
      };
      reader.readAsText(file);
    }
  }

  async handleThemeChange_manual(configs_json) {
    try {
      if (!configs_json || !configs_json.themeColors) {
        throw new Error('Invalid theme configuration format');
      }
      this.state.themeColors = configs_json.themeColors;
      if (ColorCodeManager.validateThemeColorCodes(this.state.themeColors)) {
        this.updateAnalyzeButtonState();
        showNotification('成功', '主题颜色导入成功', {
          type: 'success',
          duration: 3000,
        });
      } else {
        throw new Error('Invalid theme colors configuration');
      }
    } catch (error) {
      showNotification('错误', '主题颜色配置无效', {
        type: 'error',
        duration: 5000,
      });
      my_debugger.showError(`Invalid theme colors configuration: ${error.message}`, error);
    }
  }

  updateFileInfo(elementId, file, metadata = null) {
    try {
      document.getElementById('fileInfoSection').classList.remove('d-none');
      const infoElement = document.getElementById(elementId);
      let info = `文件名: ${file.name}<br>大小: ${this.formatFileSize(file.size)}`;

      if (metadata) {
        info += `<br>时长: ${this.formatDuration(metadata.duration)}`;
        info += `<br>采样率: ${metadata.sampleRate}Hz`;

        // Success notification when metadata is loaded
        showNotification('音频信息准备就绪 🎵', `成功加载 "${file.name}"`, {
          type: 'success',
          duration: 3000,
        });

        // Show notification if sample rate is unusual
        if (metadata.sampleRate !== 44100 && metadata.sampleRate !== 48000) {
          showNotification('采样率通知🎚️', '检测到异常的采样率。这可能会影响处理', {
            type: 'warning',
            duration: 4000,
            dismissible: true,
          });
        }

        // Notification for very long audio files
        if (metadata.duration > 600) {
          // longer than 10 minutes
          showNotification('检测到大文件 📦', '此文件较大，处理可能需要更长时间', {
            type: 'info',
            duration: 4000,
          });
        }
      }

      infoElement.innerHTML = info;
    } catch (error) {
      // Error notification if something goes wrong
      showNotification('文件信息错误 ⚠️', '无法正确显示文件信息', {
        type: 'error',
        duration: 5000,
        dismissible: true,
      });
      my_debugger.showError('Error updating file info:', error);
    }

    // Check file size and show appropriate notification
    if (file.size > 100 * 1024 * 1024) {
      // 100MB
      showNotification('检测到大文件 📦', '此文件较大，处理可能需要更长时间', {
        type: 'info',
        duration: 4000,
      });
    }
  }

  formatFileSize(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  formatDuration(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  updateAnalyzeButtonState() {
    const button = document.getElementById('generate-btn');
    const canAnalyze = this.state.audioBuffer && !this.state.isAnalyzing;
    button.disabled = !canAnalyze;
  }

  async cleanup() {
    if (this.state.audioContext !== null) {
      await this.state.audioContext.close();
      this.state.audioContext = null;
    }
  }

  async startAnalysis() {
    if (this.state.isAnalyzing) {
      showNotification('正在处理中 🎵', '请等待当前分析完成', {
        type: 'info',
        duration: 3000,
      });
      return;
    }
    this.state.isAnalyzing = true;
    this.updateAnalyzeButtonState();
    this.clearOutput();

    try {
      // Input verification
      if (!this.state.audioBuffer) {
        showModal('缺少音频 🎵', '请先上传一个音频文件', {
          type: 'warning',
          duration: 4000,
          dismissible: true,
          modal: true,
          buttons: [],
        });
        throw new Error('Audio buffer is not initialized');
      }
      if (!this.state.metadata) {
        showModal('音频无效 🎵', '请先换一个音频文件,再试试吧', {
          type: 'warning',
          duration: 4000,
          dismissible: true,
          modal: true,
          buttons: [],
        });
        throw new Error('Metadata is not initialized');
      }
      if (!this.state.themeColors) {
        showModal('颜色主题问题 🎨', '没读取到颜色设置!请检查是否保存', {
          type: 'error',
          duration: 4000,
          dismissible: true,
          modal: true,
          buttons: [],
        });
        throw new Error('Theme colors are not initialized');
      }
      if (!ColorCodeManager.validateThemeColorCodes(this.state.themeColors)) {
        showModal('颜色主题问题 🎨', '颜色设置似乎有问题', {
          type: 'error',
          duration: 4000,
          dismissible: true,
          modal: true,
          buttons: [],
        });
        throw new Error('Invalid themeColors configuration');
      }

      await this.generateColorSequence();
      // Success notification after analysis completes
      showNotification('🎉 代码已生成！', '快复制或者下载吧，导入到Mayday.blue 小程序试试！', {
        type: 'success',
        duration: 4000,
      });
      this.showStatusCompleted();
    } catch (error) {
      my_debugger.showError(`Analysis failed: ${error.message}`, error);

      // // Error notification
      // showNotification('分析错误 🎧', error.message, {
      //   type: 'error',
      //   duration: 5000,
      //   dismissible: true
      // })
    } finally {
      this.state.isAnalyzing = false;
      this.updateAnalyzeButtonState();
    }
  }

  async generateColorSequence(intervalMultiplier = 1) {
    try {
      const offset = this.state.metadata.offset || 0; // 偏移时间（秒）
      const bpm = this.state.metadata.bpm || 120;
      const totalDuration = this.state.metadata.duration || 0;

      if (totalDuration > 600) {
        console.warn('Audio duration exceeds recommended length of 10 minutes');
      }

      const fileSizeInMB = this.state.audioBuffer.length / (1024 * 1024);
      if (fileSizeInMB > 50) {
        console.warn('Large File Detected 📦', 'This might take a little longer to process', {
          type: 'warning',
          duration: 4000,
        });
      }

      this.showStatusProcessing();
      showNotification('🚀 开始生成', '正在努力生成你的代码，稍等片刻哦！', {
        type: 'info',
        duration: 2000,
      });

      // Setup
      const interval = (60 / bpm) * 1000 * intervalMultiplier; // milliseconds
      // const totalIntervals = Math.ceil((totalDuration * 1000) / interval);
      const totalIntervals = Math.ceil(((totalDuration - offset) * 1000) / interval);

      let sentimentAnalyzer = {};
      if (this.state.lyrics) {
        sentimentAnalyzer = sentimentAnalyzer = (await import('./sentiment-zh_cn_web.min.js'))
          .default;
      }
      const sortedLyrics = this.state.lyrics
        ? this.state.lyrics.scripts.sort((a, b) => a.start - b.start)
        : [];

      let lastOffEffect = -Infinity; // To track when we last used the "off4" effect

      const timelineData = [];
      let currentIndex = 0;
      //import sentimentAnalyzer from './sentiment-zh_cn_web.min.js';
      const processChunk = async (startIndex) => {
        try {
          const chunkSize = 100; // Process 100 intervals at a time
          for (let i = startIndex; i < startIndex + chunkSize && i < totalIntervals; i++) {
            // const currentTime = (i * interval) / 1000;
            const currentTime = offset + (i * interval) / 1000;
            const normalizedTime = 100 * Math.round(10 * currentTime);

            console.log(
              `Processing time: ${currentTime}s, Normalized: ${normalizedTime}, Total Duration: ${totalDuration}s`,
            );

            // // Check if current time exceeds total duration
            // if (currentTime >= totalDuration) {
            //   console.log(`Reached end of audio duration at ${currentTime}s`);
            //   return;
            // }

            if (currentTime < offset || currentTime >= totalDuration) {
              console.log(`Skipping out-of-range time: ${currentTime}s`);
              continue;
            }

            const currentLyric = sortedLyrics.find(
              (lyric) => Math.abs(lyric.start - currentTime) < 0.1,
            );
            try {
              const audioAnalysis = await this.processAudioChunk(
                this.state.audioBuffer,
                currentTime,
                0.1,
              );

              let normalizedFrequency = 0.5; // Default value
              let normalizedAmplitude = 0.5; // Default value

              if (typeof audioAnalysis.frequency === 'number' && !isNaN(audioAnalysis.frequency)) {
                normalizedFrequency =
                  audioAnalysis.frequency > 0 ? Math.min(audioAnalysis.frequency / 2000, 1) : 0;
              }

              if (typeof audioAnalysis.amplitude === 'number' && !isNaN(audioAnalysis.amplitude)) {
                normalizedAmplitude = audioAnalysis.amplitude;
              }

              // Ensure values are within [0-1] range
              normalizedFrequency = Math.max(0, Math.min(1, normalizedFrequency));
              normalizedAmplitude = Math.max(0, Math.min(1, normalizedAmplitude));

              let sentimentScore = 0;
              if (currentLyric) {
                sentimentScore = sentimentAnalyzer(currentLyric.text).comparative;
              }

              const isOffEffect = normalizedTime - lastOffEffect >= 800;

              const colorCode = ColorCodeManager.getColorCode(
                normalizedFrequency,
                normalizedAmplitude,
                sentimentScore,
                this.state.themeColors,
                isOffEffect,
              );

              if (colorCode === 'off4') {
                lastOffEffect = normalizedTime;
              }

              console.log(
                `---\n[歌词]: ${
                  currentLyric ? currentLyric.text : '无'
                }, [情感分数]: ${sentimentScore},\n [时间]: ${normalizedTime}, [颜色]: ${colorCode},\n [归一化频率]: ${normalizedFrequency}, [归一化幅度]: ${normalizedAmplitude}\n---\n`,
              );

              if (currentLyric) {
                timelineData.push(`${normalizedTime},${colorCode} // ${currentLyric.text}`);
              } else {
                timelineData.push(`${normalizedTime},${colorCode}`);
              }
            } catch (error) {
              if (error.message && error.message.includes('Reached end of file')) {
                showNotification('处理完成 🎵', '完成音频文件的分析', {
                  type: 'success',
                  duration: 3000,
                });
              } else {
                showNotification('处理错误 🎧', '分析你的音频时出现问题', {
                  type: 'error',
                  duration: 5000,
                  dismissible: true,
                });
                my_debugger.showError(`Error analyzing audio: ${error}`);
              }
            }
            this.updateProgress((i / totalIntervals) * 100);
          }

          currentIndex += chunkSize;
          if (currentIndex < totalIntervals) {
            requestAnimationFrame(() => processChunk(currentIndex));
          } else {
            this.handleAnalysisResult(timelineData);
          }
        } catch (error) {
          showNotification('块处理错误', error.message, {
            type: 'error',
            duration: 5000,
            dismissible: true,
          });
          throw error;
        }
      };

      // Start processing from the beginning
      processChunk(0);
    } catch (error) {
      showNotification('分析错误', error.message, {
        type: 'error',
        duration: 5000,
        dismissible: true,
      });
      this.updateProgress(0);
      throw error;
    }
  }

  async processAudioChunk(audioBuffer, startTime, duration) {
    return new Promise((resolve, reject) => {
      // Add input validation
      if (!audioBuffer) {
        reject(new Error('Audio buffer is null or undefined'));
        return;
      }

      const sampleRate = audioBuffer.sampleRate;
      if (!sampleRate) {
        reject(new Error('Invalid sample rate'));
        return;
      }

      const startSample = Math.floor(startTime * sampleRate);
      const numSamples = Math.floor(duration * sampleRate);

      // Validate array bounds
      if (startSample < 0 || startSample >= audioBuffer.length) {
        reject(new Error('Start sample out of bounds'));
        return;
      }

      try {
        const channelData = audioBuffer.getChannelData(0);
        if (!channelData) {
          reject(new Error('Channel data is null'));
          return;
        }

        const chunk = channelData.slice(startSample, startSample + numSamples);

        // Validate chunk data
        if (!chunk || chunk.length === 0) {
          reject(new Error('Invalid audio chunk'));
          return;
        }

        // Calculate amplitude
        const amplitude = chunk.reduce((sum, sample) => sum + Math.abs(sample), 0) / numSamples;

        // Estimate frequency using zero-crossings
        let crossings = 0;
        for (let i = 1; i < chunk.length; i++) {
          if ((chunk[i] > 0 && chunk[i - 1] <= 0) || (chunk[i] < 0 && chunk[i - 1] >= 0)) {
            crossings++;
          }
        }
        const frequency = (crossings * sampleRate) / (2 * chunk.length);

        resolve({
          amplitude: isNaN(amplitude) ? 0 : amplitude,
          frequency: isNaN(frequency) ? 0 : frequency,
        });
      } catch (error) {
        reject(new Error(`Audio processing error: ${error.message}`));
      }
    });
  }

  updateProgress(progress) {
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');

    progressBar.style.width = `${progress}%`;
    progressText.textContent = `${Math.round(progress)}%`;

    // Update ARIA attributes
    progressBar.setAttribute('aria-valuenow', progress);
    progressText.setAttribute('aria-live', 'polite');
  }

  handleAnalysisResult(timelineData) {
    const output = document.getElementById('output-result');
    output.value = this.formatTimelineData(timelineData);
  }

  formatTimelineData(timelineData) {
    return timelineData
      .map((entry) => {
        const [time, color, lyric] = entry.split(',');
        return `${time},${color} ${lyric ? `// ${lyric}` : ''}`;
      })
      .join('\n');
  }

  clearOutput() {
    document.getElementById('output-result').value = '';
    this.updateProgress(0);
  }

  getDefaultThemeColors() {
    return {
      base: 'blu',
      low: [
        { color: 'blu', per: 60 },
        { color: 'pur', per: 40 },
      ],
      mid: [
        { color: 'pin', per: 50 },
        { color: 'red', per: 50 },
      ],
      high: [
        { color: 'yel', per: 40 },
        { color: 'ora', per: 60 },
      ],
      accent: [{ color: 'whi', per: 100 }],
    };
  }
}

/**
 * 特定格式的颜色代码管理类
 */
class ColorCodeManager {
  /**
   * 所有支持的颜色代码
   */
  static ALL_SUPPORTED_COLOR_CODES = {
    RED: 'red',
    ORA: 'ora',
    YEL: 'yel',
    SKY: 'sky',
    BLU: 'blu',
    PUR: 'pur',
    PIN: 'pin',
    WHI: 'whi',
    OFF: 'off',
    RAI: 'rai',
  };

  /**
   * 可用的颜色代码
   */
  static AVAILABLE_COLOR_CODES = ['red', 'ora', 'yel', 'sky', 'blu', 'pur', 'pin', 'whi'];

  /**
   * 颜色代码对应的十六进制值
   */
  static AVAILABLE_COLOR_CODES_TO_HEX = {
    red: '#FF0000',
    ora: '#FFA500', // 橙色
    yel: '#FFFF00', // 黄色
    sky: '#87CEEB', // 天蓝色
    blu: '#0000FF', // 蓝色
    pur: '#800080', // 紫色
    pin: '#FFC0CB', // 粉红色
    whi: '#FFFFFF', // 白色
  };

  /**
   * 强度等级
   */
  static INTENSITIES = ['1', '2', '3', '4', 'T'];

  /**
   * 特殊强度等级
   */
  static SPECIAL_INTENSITIES = {
    pin: new Set(['2', '4']),
    whi: new Set(['4', 'T']),
    off: new Set(['4']),
    rai: new Set(['4']),
  };

  /**
   * 获取颜色代码映射
   */
  static getColorCodeMap() {
    return Object.keys(this.ALL_SUPPORTED_COLOR_CODES).reduce((map, color) => {
      const colorKey = this.ALL_SUPPORTED_COLOR_CODES[color];
      map[colorKey] = this.SPECIAL_INTENSITIES[colorKey] || new Set(this.INTENSITIES);
      return map;
    }, {});
  }

  /**
   * 验证主题颜色代码
   * @param {Object} themeColorCodes 主题颜色代码
   * @returns {boolean} 是否有效
   */
  static validateThemeColorCodes(themeColors) {
    const colorMap = this.getColorCodeMap();
    const validRanges = ['low', 'mid', 'high', 'accent'];
    const validColors = Object.keys(colorMap);

    for (const range of validRanges) {
      if (!Array.isArray(themeColors[range])) {
        my_debugger.showError(`Invalid themeColors: ${range} should be an array`, 'error');
        return false;
      }

      for (const colorInfo of themeColors[range]) {
        if (typeof colorInfo !== 'object' || !colorInfo.color || !colorInfo.per) {
          showNotification(
            '颜色范围问题 🎨',
            `${range}范围需要正确配置！ ${range}范围内的颜色信息无效: ${JSON.stringify(colorInfo)}`,
            {
              type: 'error',
              duration: 4000,
            },
          );
          return false;
        }

        if (!validColors.includes(colorInfo.color)) {
          showNotification(
            '颜色选择无效 🎨',
            `请为${range}范围选择一个有效的颜色！${range}范围内颜色无效: ${colorInfo.color}`,
            {
              type: 'error',
              duration: 4000,
              dismissible: true,
            },
          );
          return false;
        }

        const percentage = parseInt(colorInfo.per);
        if (isNaN(percentage) || percentage <= 0 || percentage > 100) {
          showNotification(
            '百分比范围 📊',
            `颜色百分比必须在1到100之间！${range}范围内无效百分比: ${colorInfo.per}`,
            {
              type: 'warning',
              duration: 4000,
            },
          );
          return false;
        }
      }

      // Check if percentages sum up to 100
      const totalPercentage = themeColors[range].reduce(
        (sum, colorInfo) => sum + parseInt(colorInfo.per),
        0,
      );
      if (totalPercentage !== 100) {
        showNotification('百分比范围 🎯', `${range}范围百分比加起来应该是100!`, {
          type: 'warning',
          duration: 5000,
          dismissible: true,
        });
        return false;
      }
    }

    if (typeof themeColors.base !== 'string' || !validColors.includes(themeColors.base)) {
      showNotification('基础颜色缺失 🔍', '请为您的主题选择一个基础颜色！', {
        type: 'error',
        duration: 4000,
      });
      return false;
    }

    return true;
  }

  /**
   * 验证颜色代码
   * @param {string} colorCode 颜色代码
   * @returns {boolean} 是否有效
   */
  static validateColorCode(colorCode) {
    const color = colorCode.slice(0, 3);
    const intensity = colorCode.slice(3);
    const colorMap = this.getColorCodeMap();

    if (!colorMap.hasOwnProperty(color)) {
      return false;
    }

    return colorMap[color].has(intensity);
  }

  /**
   * 获取有效的颜色代码
   * @param {string} color 颜色
   * @param {string} preferredIntensity 偏好的强度
   * @returns {string|null} 有效的颜色代码
   */
  static getValidColorCode(color, preferredIntensity) {
    const colorMap = this.getColorCodeMap();
    if (!colorMap.hasOwnProperty(color)) {
      return null;
    }

    const validIntensities = Array.from(colorMap[color]);

    if (validIntensities.includes(preferredIntensity)) {
      return `${color}${preferredIntensity}`;
    }

    const closestIntensity = validIntensities.reduce((closest, current) => {
      const currentDiff = Math.abs(
        this.INTENSITIES.indexOf(current) - this.INTENSITIES.indexOf(preferredIntensity),
      );
      const closestDiff = Math.abs(
        this.INTENSITIES.indexOf(closest) - this.INTENSITIES.indexOf(preferredIntensity),
      );
      return currentDiff < closestDiff ? current : closest;
    }, validIntensities[0]);

    return `${color}${closestIntensity}`;
  }

  static getColorIntensity(normalizedFreq, adjustedLoudness) {
    const frequencyFactor = 1 - Math.pow(Math.abs(normalizedFreq - 0.5), 2);
    const combinedIntensity = adjustedLoudness * (1 + frequencyFactor);

    if (isNaN(combinedIntensity)) return 'off4';
    if (combinedIntensity >= 0.9) return 'T';
    if (combinedIntensity >= 0.7) return '4';
    if (combinedIntensity >= 0.5) return '3';
    if (combinedIntensity >= 0.3) return '2';
    return '1';
  }

  static mapFrequencyToColorInRange(frequency, range) {
    if (!Array.isArray(range) || range.length === 0) {
      return null;
    }

    const allEqual = range.every((item) => item.per === range[0].per);
    if (allEqual) {
      const slots = range.map((item) => item.color);
      for (let i = slots.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [slots[i], slots[j]] = [slots[j], slots[i]];
      }
      return slots[Math.floor(Math.random() * slots.length)];
    }

    const randomValue = Math.random();
    let accumulator = 0;

    for (const colorInfo of range) {
      accumulator += parseFloat(colorInfo.per) / 100;
      if (randomValue <= accumulator) {
        return colorInfo.color;
      }
    }

    return range[range.length - 1].color;
  }

  static mapFrequencyToColor(normalizedFreq, themeColors) {
    let range = {};
    if (normalizedFreq < 0.33) {
      range = themeColors.low;
    } else if (normalizedFreq < 0.66) {
      range = themeColors.mid;
    } else {
      range = themeColors.high;
    }

    if (!Array.isArray(range) || range.length === 0) {
      throw new Error('Invalid color range');
    }

    return this.mapFrequencyToColorInRange(normalizedFreq, range);
  }

  static getAccentColor(themeColors) {
    if (!Array.isArray(themeColors.accent) || themeColors.accent.length === 0) {
      throw new Error('Invalid accent color range');
    }

    return this.mapFrequencyToColorInRange(Math.random(), themeColors.accent);
  }

  static getColorCode(
    normalizedFreq,
    weightedAmplitude,
    sentimentScore,
    themeColors,
    useOffEffect = false,
  ) {
    // Apply Stevens' power law for perceived loudness (exponent ~0.6 for loudness)
    const perceivedLoudness = Math.pow(weightedAmplitude, 0.6);
    // Fletcher-Munson curves suggest that human hearing is most sensitive around 2-4 kHz
    // Adjust the amplitude threshold based on frequency sensitivity
    const sensitivityFactor = this.getSensitivityFactor(normalizedFreq);
    const adjustedLoudness = perceivedLoudness * sensitivityFactor;

    let color = '';
    try {
      color = this.mapFrequencyToColor(normalizedFreq, themeColors);
    } catch (error) {
      my_debugger.showError(`Error in mapFrequencyToColor: ${error}. Using base color.`, 'warn');
      color = themeColors.base;
    }

    // Use accent colors for extreme sentiments or high amplitudes
    // Reduced threshold for using accent colors, with less emphasis on sentiment
    if (adjustedLoudness >= 0.7) {
      try {
        color = this.getAccentColor(themeColors);
      } catch (error) {
        my_debugger.showError(`Error in getAccentColor: ${error}. Using original color.`, 'warn');
      }
    }

    // Get base intensity
    let intensity = this.getColorIntensity(normalizedFreq, adjustedLoudness);

    // Adjust intensity based on sentiment
    // Using a more gradual scale based on the circumplex model of affect
    if (sentimentScore > 0.75) {
      intensity = Math.min(parseInt(intensity) + Math.ceil(sentimentScore * 0.75), 4).toString();
    } else if (sentimentScore < -0.75) {
      intensity = Math.max(
        parseInt(intensity) - Math.ceil(Math.abs(sentimentScore) * 0.75),
        1,
      ).toString();
    }

    // Use flicker effect for high amplitudes or extreme sentiments
    // Threshold based on research on visual flicker fusion threshold
    if (adjustedLoudness > 0.98) {
      intensity = 'T';
    }

    if (useOffEffect && adjustedLoudness >= 0.5) {
      return 'off4';
    }

    let colorCode = `${color}${intensity}`;

    // Validate the color code
    if (!this.validateColorCode(colorCode)) {
      const fallbackColorCode = this.getValidColorCode(color, intensity);
      if (fallbackColorCode) {
        my_debugger.showError(
          `[WARN]Invalid color code generated: ${colorCode}. Falling back to ${fallbackColorCode}.`,
          'warn',
        );
        colorCode = fallbackColorCode;
      } else {
        my_debugger.showError(
          `[ERROR]Critical error: Unable to generate a valid color code - ${colorCode}.`,
          'error',
        );
        colorCode = 'whi4'; // Using 'whi4' as a last resort
      }
    }

    return colorCode;
  }

  static getSensitivityFactor(normalizedFreq) {
    // Implement a curve based on the Fletcher-Munson equal-loudness contours
    // This is a simplified approximation
    const peakSensitivity = 0.3; // Corresponds to about 3-4 kHz
    return 1 + Math.sin((normalizedFreq - peakSensitivity) * Math.PI) * 0.3;
  }
}

/*
 * color-visualizer
 */

// File Import Handling
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const sequenceInput = document.getElementById('sequenceInput');

// Prevent default drag behaviors
['dragenter', 'dragover', 'dragleave', 'drop'].forEach((eventName) => {
  dropZone.addEventListener(eventName, preventDefaults, false);
  document.body.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

// Highlight drop zone when dragging over it
['dragenter', 'dragover'].forEach((eventName) => {
  dropZone.addEventListener(eventName, highlight, false);
});
['dragleave', 'drop'].forEach((eventName) => {
  dropZone.addEventListener(eventName, unhighlight, false);
});

function highlight(e) {
  dropZone.classList.add('drag-over');
}

function unhighlight(e) {
  dropZone.classList.remove('drag-over');
}

// Handle dropped files
dropZone.addEventListener('drop', handleDrop, false);
dropZone.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', handleFileSelect);

function handleDrop(e) {
  const dt = e.dataTransfer;
  const files = dt.files;
  handleFiles(files);
}

function handleFileSelect(e) {
  const files = e.target.files;
  handleFiles(files);
}

function handleFiles(files) {
  const file = files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      sequenceInput.value = e.target.result;
      showNotification(`成功`, `预设代码已准备好!`, { type: 'success', duration: 3000 });
    };
    reader.readAsText(file);
  }
}

// config.js - Color configuration
// prettier-ignore
const ColorConfig = { colors: { red: { 4: '#ef4444', 3: '#f87171', 2: '#fca5a5', 1: '#fecaca', T: '#ef4444' }, ora: { 4: '#f97316', 3: '#fb923c', 2: '#fdba74', 1: '#fed7aa', T: '#f97316' }, yel: { 4: '#eab308', 3: '#facc15', 2: '#fde047', 1: '#fef08a', T: '#eab308' }, sky: { 4: '#06b6d4', 3: '#22d3ee', 2: '#67e8f9', 1: '#a5f3fc', T: '#06b6d4' }, blu: { 4: '#3b82f6', 3: '#60a5fa', 2: '#93c5fd', 1: '#bfdbfe', T: '#3b82f6' }, pur: { 4: '#a855f7', 3: '#c084fc', 2: '#d8b4fe', 1: '#e9d5ff', T: '#a855f7' }, off: { 4: '#333333' }, pin: { 4: '#ec4899', 2: '#f472b6' }, whi: { 4: '#ffffff', T: '#eeeeee' } }, colorCache: new Map(), getColorCode (colorName) { if (this.colorCache.has(colorName)) { return this.colorCache.get(colorName) } const [base, level] = [colorName.slice(0, 3), colorName.slice(3)]; const color = this.colors[base]?.[level] || null; this.colorCache.set(colorName, color); return color } };

// models/Timeline.js - Timeline data structure
class Timeline {
  constructor(sequence = []) {
    this.sequence = sequence;
  }

  addFrame(time, color) {
    if (typeof time !== 'number' || time < 0) {
      throw new Error('Invalid time value');
    }
    if (!color || typeof color !== 'string') {
      throw new Error('Invalid color value');
    }
    this.sequence.push({ time, color });
    this.sort();
  }

  sort() {
    this.sequence.sort((a, b) => a.time - b.time);
  }

  getFrameAtTime(currentTime) {
    if (!this.sequence.length) return null;

    let left = 0;
    let right = this.sequence.length - 1;

    // Binary search for the appropriate frame
    while (left < right) {
      const mid = Math.floor((left + right + 1) / 2);
      if (this.sequence[mid].time <= currentTime) {
        left = mid;
      } else {
        right = mid - 1;
      }
    }
    return this.sequence[left];
  }

  getDuration() {
    if (this.sequence.length === 0) return 0;
    return this.sequence[this.sequence.length - 1].time;
  }

  clear() {
    this.sequence = [];
  }

  static validate(line, index) {
    if (typeof line !== 'string') {
      return { errors: [`Line ${index + 1}: Invalid input type`] };
    }

    if (line.length <= 0) {
      return { errors: [`Line ${index + 1}: Empty Context`] };
    }

    if (line.length > 1000) {
      return { errors: [`Line ${index + 1}: Line too long`] };
    }

    const contentWithoutComment = line.split('//')[0].trim();

    if (!contentWithoutComment) {
      return null;
    }

    const errors = [];
    const [time, color] = contentWithoutComment.split(',').map((s) => s.trim());
    const timeMs = parseInt(time);

    if (isNaN(timeMs)) {
      errors.push(`Line ${index + 1}: Invalid time value: ${time}`);
    } else if (timeMs % 100 !== 0) {
      errors.push(`Line ${index + 1}: Time must be multiple of 100ms`);
    }

    if (!color) {
      errors.push(`Line ${index + 1}: Missing color value`);
    } else if (!ColorConfig.getColorCode(color)) {
      errors.push(`Line ${index + 1}: Invalid color code: ${color}`);
    }

    return errors.length ? { errors } : { time: timeMs, color };
  }

  static parse(input) {
    const lines = input.split('\n');
    const errors = [];
    const frames = [];

    lines.forEach((line, index) => {
      const result = Timeline.validate(line, index);
      if (result) {
        if (result.errors) {
          errors.push(...result.errors);
        } else {
          frames.push(result);
        }
      }
    });

    // Sort frames by time
    frames.sort((a, b) => a.time - b.time);

    // Validate minimum interval
    for (let i = 1; i < frames.length; i++) {
      const gap = frames[i].time - frames[i - 1].time;
      if (gap < 200) {
        errors.push(
          `Invalid gap of ${gap}ms between ${frames[i - 1].time}ms and ${frames[i].time}ms`,
        );
      }
    }

    return { errors, frames };
  }

  loadFromInput(input) {
    const { errors, frames } = Timeline.parse(input);
    if (errors.length) {
      throw new Error(errors.join('\n'));
    }
    frames.forEach(({ time, color }) => this.addFrame(time, color));
  }
}

// Update the AnimationController class
class AnimationController {
  constructor(element, timerDisplay) {
    this.element = element;
    this.timerDisplay = timerDisplay;
    this.timeline = null;
    this.startTimeStamp = 0;
    this.lastFrameTimeStamp = 0;
    this.animationFrame = null;
    this.pausedTimeStamp = 0;
    this.audioCurrentTimeStamp = 0;
    this.isPaused = false;
    this.colorInfoTemplate = document.createElement('div');
    this.colorInfoTemplate.className = 'color-info';
  }

  setTimeline(timeline) {
    this.timeline = timeline;
    this.reset();
  }

  start() {
    if (this.isPaused) {
      // Resume from paused state
      this.startTimeStamp = performance.now() - this.pausedTimeStamp;
      this.isPaused = false;
    } else {
      // Start fresh
      this.reset();
      this.startTimeStamp = performance.now();
    }
    this.animate();
  }

  pause() {
    if (!this.isPaused && this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
      this.pausedTimeStamp = performance.now() - this.startTimeStamp;
      this.isPaused = true;
    }
  }

  resume() {
    if (this.isPaused) {
      this.start();
    }
  }

  stop() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
    this.reset();
    // Dispatch a custom event when animation stops
    this.element.dispatchEvent(new CustomEvent('animationStopped'));
  }

  reset() {
    this.startTimeStamp = 0;
    this.lastFrameTimeStamp = 0;
    this.pausedTimeStamp = 0;
    this.isPaused = false;
    this.element.style.backgroundColor = 'var(--surface-secondary';
    this.element.innerHTML = '';
    this.updateDisplay(0);
  }

  restart() {
    this.stop();
    this.start();
  }

  clear() {
    this.stop();
    this.timeline = null;
    this.element.style.backgroundColor = 'var(--surface-secondary';
    this.element.innerHTML = '';
    this.updateDisplay(0);
  }

  destroy() {
    this.clear();
    this.element = null;
    this.timerDisplay = null;
    this.colorInfoTemplate = null;
  }

  hexToRgb(hex) {
    const value = parseInt(hex.slice(1), 16);
    const r = (value >> 16) & 255;
    const g = (value >> 8) & 255;
    const b = value & 255;
    return `rgb(${r}, ${g}, ${b})`;
  }

  updateColorInfo(colorName, hexColor, time) {
    const fragment = document.createDocumentFragment();
    const div = this.colorInfoTemplate.cloneNode(true);
    div.innerHTML = `
                    <div>Name: ${colorName}</div>
                    <div>Time: ${time}ms</div>
                    <div>Hex: ${hexColor}</div>
                    <div>RGB: ${this.hexToRgb(hexColor)}</div>
                `;
    fragment.appendChild(div);
    this.element.innerHTML = '';
    this.element.appendChild(fragment);
  }

  animate(currentTimeStamp = 0) {
    if (this.isPaused) return;

    // 防止过于频繁地更新，控制帧率 (大约 60FPS)
    if (this.lastFrameTimeStamp && currentTimeStamp - this.lastFrameTimeStamp < 16) {
      this.animationFrame = requestAnimationFrame((time) => this.animate(time));
      return;
    }
    this.lastFrameTimeStamp = currentTimeStamp;

    const elapsed = this.audioCurrentTimeStamp;

    // 更新显示，显示经过的时间
    this.updateDisplay(elapsed);

    // 获取当前时间点的动画帧
    const frame = this.timeline?.getFrameAtTime(elapsed);
    if (!frame) {
      if (elapsed <= this.timeline?.getDuration() + 1000) {
        this.animationFrame = requestAnimationFrame((time) => this.animate(time));
      } else {
        this.stop();
      }
      return;
    }

    const hexColor = ColorConfig.getColorCode(frame.color);
    if (!hexColor) {
      if (elapsed <= this.timeline?.getDuration() + 1000) {
        this.animationFrame = requestAnimationFrame((time) => this.animate(time));
      } else {
        this.stop();
      }
      return;
    }

    this.element.style.backgroundColor = hexColor;
    this.updateColorInfo(frame.color, hexColor, frame.time);

    if (elapsed <= this.timeline?.getDuration() + 1000) {
      this.animationFrame = requestAnimationFrame((time) => this.animate(time));
    } else {
      this.stop();
    }
  }

  updateDisplay(time) {
    this.timerDisplay.textContent = formatTimestamp(time, 'mm:ss:ms');
    document.querySelector('#milliseconds ').textContent = `${Math.floor(time)}ms`;
  }

  updateAnimation(currentTime) {
    // 根据当前时间更新动画的状态
    const frame = this.timeline?.getFrameAtTime(currentTime);
    if (frame) {
      const color = ColorConfig.getColorCode(frame.color);
      if (color) {
        this.element.style.backgroundColor = color;
        this.updateColorInfo(frame.color, color, frame.time);
      }
    }
  }

  updateProgress(audioCurrentTimeStamp) {
    this.audioCurrentTimeStamp = audioCurrentTimeStamp;
    this.animate();
  }
}

class AudioVisualizer {
  constructor(audioElement) {
    this.audio = audioElement;
    this.isInitialized = false;
    this.canvas = document.getElementById('visualizer');
    this.ctx = this.canvas.getContext('2d');
    this.visualizationType = document.getElementById('visualizationType');
    this.minHeight = 100; // Minimum height for mobile
    this.maxHeight = 200; // Maximum height for larger screens

    this.setupAudioContext();
    this.setupEventListeners();
    this.resizeCanvas();
  }

  setupAudioContext() {
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.analyser = this.audioContext.createAnalyser();
    // Reduce FFT size for better performance on mobile
    this.analyser.fftSize = window.innerWidth < 768 ? 1024 : 2048;
    this.bufferLength = this.analyser.frequencyBinCount;
    this.dataArray = new Uint8Array(this.bufferLength);

    this.source = this.audioContext.createMediaElementSource(this.audio);
    this.source.connect(this.analyser);
    this.analyser.connect(this.audioContext.destination);
    this.isInitialized = true;
  }

  setupEventListeners() {
    // Debounce resize event for better performance
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => this.resizeCanvas(), 250);
    });

    this.visualizationType.addEventListener('change', () => this.draw());

    this.visualizationType.value = 'frequency';

    // Handle orientation change for mobile devices
    window.addEventListener('orientationchange', () => {
      setTimeout(() => this.resizeCanvas(), 100);
    });
  }

  resizeCanvas() {
    const containerWidth = this.canvas.parentElement.offsetWidth;
    const screenWidth = window.innerWidth;

    // Responsive height calculation
    let canvasHeight;
    if (screenWidth < 576) {
      // Mobile
      canvasHeight = this.minHeight;
    } else if (screenWidth < 992) {
      // Tablet
      canvasHeight = Math.min(this.minHeight * 1.5, this.maxHeight);
    } else {
      // Desktop
      canvasHeight = this.maxHeight;
    }

    // Update canvas dimensions
    this.canvas.style.height = `${canvasHeight}px`;
    this.canvas.width = containerWidth * window.devicePixelRatio;
    this.canvas.height = canvasHeight * window.devicePixelRatio;

    // Scale canvas context
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Adjust visualization parameters based on screen size
    this.analyser.fftSize = screenWidth < 768 ? 1024 : 2048;
    this.bufferLength = this.analyser.frequencyBinCount;
    this.dataArray = new Uint8Array(this.bufferLength);
  }

  draw() {
    if (!this.isInitialized) return;
    requestAnimationFrame(() => this.draw());

    this.analyser.getByteTimeDomainData(this.dataArray);

    // Clear canvas
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    if (this.visualizationType.value === 'frequency') {
      this.drawFrequencyBars();
    } else {
      this.drawWaveform();
    }
  }

  drawFrequencyBars() {
    this.analyser.getByteFrequencyData(this.dataArray);

    // Adjust bar width based on screen size
    const screenWidth = window.innerWidth;
    const barWidthMultiplier = screenWidth < 576 ? 1.5 : 2.5;
    const barWidth = (this.canvas.width / this.bufferLength) * barWidthMultiplier;
    const barSpacing = screenWidth < 576 ? 0.5 : 1;

    let x = 0;

    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = 0; i < this.bufferLength; i++) {
      const barHeight = (this.dataArray[i] / 255) * this.canvas.height * 0.8;

      // Create gradient with adjusted colors for better visibility
      const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
      gradient.addColorStop(0, '#00ff88');
      gradient.addColorStop(0.5, '#00ffff');
      gradient.addColorStop(1, '#0088ff');

      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(
        x,
        this.canvas.height - barHeight,
        Math.max(barWidth, 1), // Ensure minimum width of 1px
        barHeight,
      );

      x += barWidth + barSpacing;
    }
  }

  drawWaveform() {
    this.analyser.getByteTimeDomainData(this.dataArray);

    // Adjust line width based on screen size
    this.ctx.lineWidth = window.innerWidth < 576 ? 1 : 2;
    this.ctx.strokeStyle = '#00ffff';
    this.ctx.beginPath();

    const sliceWidth = this.canvas.width / this.bufferLength;
    let x = 0;

    for (let i = 0; i < this.bufferLength; i++) {
      const v = this.dataArray[i] / 128.0;
      const y = v * (this.canvas.height / 2);

      if (i === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    this.ctx.lineTo(this.canvas.width, this.canvas.height / 2);
    this.ctx.stroke();
  }

  start() {
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
    this.draw();
  }

  stop() {
    if (this.audioContext.state === 'running') {
      this.audioContext.suspend();
    }
  }
}

class waveSurferController {
  constructor(audioElement) {
    this.audio = audioElement;
    this.setupWavesurfer();
  }

  setupWavesurfer() {
    // Initialize Wavesurfer.js
    this.wavesurfer = WaveSurfer.create({
      container: '#wavesurfer_color_preview',
      media: this.audio,
      responsive: true,
      normalize: false,
      interact: true,
      mediaControls: false,
    });

    this.wavesurfer.on('ready', () => {
      this.visualizerReady = true;
    });
  }

  loadAudio(url) {
    this.wavesurfer.load(url);
  }

  start() {
    if (this.visualizerReady) {
      this.wavesurfer.play();
    }
  }

  stop() {
    if (this.visualizerReady) {
      this.wavesurfer.pause();
    }
  }

  destroy() {
    if (this.visualizerReady) {
      this.wavesurfer.destroy();
    }
  }
}

// Audio handling class
class AudioController {
  constructor(animationController) {
    this.audio = new Audio();
    this.waveSurferController = null;
    this.isAudioLoaded = false;
    this.syncedWithTimeline = true;
    this.isDraggingProgress = false;
    this.animationController = animationController || null;
    this.visualizer = null;
    this.setupAudioElements();
    this.setupEventListeners();
  }

  setupAudioElements() {
    this.audioDropZone = document.getElementById('audioDropZone');
    this.audioInput = document.getElementById('audioInput');
    this.audioControls = document.getElementById('audioControls');
    this.audioProgress = document.getElementById('audioProgress');
    this.currentTimeDisplay = document.getElementById('currentTime');
    this.totalTimeDisplay = document.getElementById('totalTime');
    this.audioFileName = document.getElementById('audioFileName');
    this.currentPer = document.getElementById('currentPer');
  }

  setupEventListeners() {
    // Audio file drop handling
    this.audioDropZone.addEventListener('drop', (e) => this.handleAudioDrop(e));
    this.audioDropZone.addEventListener('click', () => this.audioInput.click());
    this.audioInput.addEventListener('change', (e) => this.handleAudioSelect(e));

    // Audio playback events
    this.audio.addEventListener('loadedmetadata', () => this.handleAudioLoaded());
    this.audio.addEventListener('timeupdate', () => this.updateTimeDisplay());
    this.audio.addEventListener('ended', () => this.handleAudioEnded());

    // Timeline slider control
    this.audioProgress.addEventListener('input', (e) => {
      if (this.audio && !isNaN(this.audio.duration) && this.audio.duration > 0) {
        const percentage = parseFloat(e.target.value) / 100;
        const newTime = percentage * this.audio.duration;

        if (isFinite(newTime) && newTime >= 0) {
          this.audio.currentTime = newTime;
        } else {
          showNotification('播放出错', '检测到无效的时间位置.', {
            type: 'error',
            duration: 3000,
          });
        }
      } else {
        showNotification('音频未就绪', '请确保音频文件已正确加载。', {
          type: 'warning',
          duration: 3000,
        });
      }
    });

    // Progress bar handling with improved sync
    this.audioProgress.addEventListener('mousedown', (e) => {
      this.isDraggingProgress = true;
      this.handleProgressChange(e);
    });

    this.audioProgress.addEventListener('mousemove', (e) => {
      if (this.isDraggingProgress) {
        this.handleProgressChange(e);
      }
    });

    this.audioProgress.addEventListener('mouseup', (e) => {
      this.isDraggingProgress = false;
      this.handleProgressChange(e);
    });

    // Add volume control listener
    const volumeControl = document.getElementById('volumeControl');
    if (volumeControl) {
      volumeControl.addEventListener('input', (e) => {
        this.setVolume(e.target.value / 100);
      });
    }
  }

  handleProgressChange(e) {
    if (this.audio && !isNaN(this.audio.duration) && this.audio.duration > 0) {
      const percentage = parseFloat(e.target.value) / 100;
      const newTime = percentage * this.audio.duration;

      if (isFinite(newTime) && newTime >= 0) {
        this.audio.currentTime = newTime;
        this.updateTimeDisplay();
      } else {
        showNotification('播放出错', '检测到无效的时间位置.', {
          type: 'error',
          duration: 3000,
        });
      }
    } else {
      showNotification('音频未就绪', '请确保音频文件已正确加载。', {
        type: 'warning',
        duration: 3000,
      });
    }
  }

  handleAudioDrop(e) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('audio/')) {
      this.loadAudioFile(file);
    }
  }

  handleAudioSelect(e) {
    const file = e.target.files[0];
    if (file) {
      this.loadAudioFile(file);
    }
  }

  loadAudioFile(file) {
    console.log('loadAudioFile: ', file);
    const url = URL.createObjectURL(file);
    this.audio.src = url;
    this.audioFileName.textContent = file.name;
    this.isAudioLoaded = true;

    this.updateControlButtons(true);
    document.querySelector('#run').disabled = false;
    // // Initialize visualizer after loading audio
    if (!this.waveSurferController) {
      this.waveSurferController = new waveSurferController(this.audio);
    }
    this.waveSurferController.loadAudio(url);

    if (!this.visualizer) {
      this.visualizer = new AudioVisualizer(this.audio);
    }

    showNotification(`成功`, `音频加载成功!`, { type: 'success', duration: 3000 });
  }

  handleAudioLoaded() {
    this.audioProgress.max = 100;
    this.totalTimeDisplay.textContent = this.formatTime(this.audio.duration);
  }

  updateTimeDisplay() {
    // const currentTime = this.audio.currentTime;
    // const duration = this.audio.duration;
    // const currentProgressValue = ((currentTime / duration) * 100).toFixed(2);
    // this.currentTimeDisplay.textContent = this.formatTime(currentTime);
    // this.totalTimeDisplay.textContent = this.formatTime(duration);
    // this.currentPer.textContent = currentProgressValue + '%';
    // this.audioProgress.value = currentProgressValue;

    const currentTime = this.audio.currentTime || 0;
    const duration = this.audio.duration || 0;
    const percent =
      currentTime !== 0 && duration !== 0 ? ((currentTime / duration) * 100).toFixed(2) : 0;

    this.currentTimeDisplay.textContent = this.formatTime(currentTime);
    this.totalTimeDisplay.textContent = this.formatTime(duration);
    this.currentPer.textContent = `${percent}%`;
    this.audioProgress.value = percent;

    // Sync AnimationController with audio progress
    if (this.syncedWithTimeline && this.animationController) {
      this.animationController.updateProgress(this.audio.currentTime * 1000);
    }
  }

  handleAudioEnded() {
    this.audioProgress.value = 0;
    this.updateTimeDisplay();
    if (this.syncedWithTimeline) {
      // Trigger timeline stop
      document.getElementById('stop').click();
    }
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  // Volume control (0.0 to 1.0)
  setVolume(value) {
    const volume = Math.max(0, Math.min(1, value));
    this.audio.volume = volume;
    return volume;
  }

  // // Playback speed control (0.5 to 2.0)
  // setPlaybackRate (rate) {
  //     const validRate = Math.max(0.5, Math.min(2, rate));
  //     this.audio.playbackRate = validRate;
  //     return validRate;
  // }

  // Seek to specific time in seconds
  seekTo(timeInSeconds) {
    if (this.isAudioLoaded) {
      const validTime = Math.max(0, Math.min(timeInSeconds, this.audio.duration));
      this.audio.currentTime = validTime;
      this.updateTimeDisplay();
    }
  }

  // Skip forward by specified seconds
  skipForward(seconds = 10) {
    if (this.isAudioLoaded) {
      this.seekTo(this.audio.currentTime + seconds);
    }
  }

  // Skip backward by specified seconds
  skipBackward(seconds = 10) {
    if (this.isAudioLoaded) {
      this.seekTo(this.audio.currentTime - seconds);
    }
  }

  // Mute/unmute toggle
  toggleMute() {
    this.audio.muted = !this.audio.muted;
    return this.audio.muted;
  }

  // Get current audio state
  getAudioState() {
    return {
      currentTime: this.audio.currentTime,
      duration: this.audio.duration,
      volume: this.audio.volume,
      playbackRate: this.audio.playbackRate,
      isMuted: this.audio.muted,
      isPlaying: !this.audio.paused,
    };
  }

  // Enhanced play method with optional start time
  play(startFromTime) {
    if (this.isAudioLoaded) {
      if (startFromTime !== undefined) {
        this.seekTo(startFromTime);
      }
      this.audio.play();
      this.waveSurferController?.start();
    }
  }

  syncWithControls_run() {
    if (!this.isAudioLoaded) return;
    this.audio.currentTime = 0; // Reset to start
    this.play();
    this.waveSurferController?.start();
    this.updateControlButtons(true);
  }

  syncWithControls_pause() {
    if (!this.isAudioLoaded) return;
    this.audio.pause();
    this.waveSurferController?.stop();
  }

  syncWithControls_resume() {
    if (!this.isAudioLoaded) return;
    this.play();
    this.waveSurferController?.start();
  }

  syncWithControls_stop() {
    if (!this.isAudioLoaded) return;
    this.audio.pause();
    this.audio.currentTime = 0;
    this.waveSurferController?.stop();
    this.updateTimeDisplay();
    this.audioProgress.value = 0;
    this.currentPer.textContent = '0%';
  }

  syncWithControls_restart() {
    if (!this.isAudioLoaded) return;
    this.audio.currentTime = 0;
    this.currentPer.textContent = '0%';
    this.play();
    this.waveSurferController?.start();
  }

  syncWithControls_clear() {
    if (!this.isAudioLoaded) return;
    this.audio.pause();
    this.audio.currentTime = 0;
    this.waveSurferController?.destroy();
    this.waveSurferController = null;
    this.isAudioLoaded = false;
    this.audio.src = '';
    this.audioFileName.textContent = '';
    this.audioProgress.value = 0;
    this.currentPer.textContent = '0%';
    this.updateTimeDisplay();
    // this.audioControls.className = 'd-none';
    this.updateControlButtons(false);
  }

  updateControlButtons(isSynced) {
    const controls = document.querySelectorAll('.control-button');
    controls.forEach((button) => {
      if (isSynced) {
        button.classList.add('synced');
      } else {
        button.classList.remove('synced');
      }
    });
  }
}

// Prevent default drag behaviors for audio drop zone
['dragenter', 'dragover', 'dragleave', 'drop'].forEach((eventName) => {
  document.getElementById('audioDropZone').addEventListener(eventName, preventDefaults, false);
});

function formatTimestamp(milliseconds, format = 'dd HH:mm:ss') {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const millisecondsPart = milliseconds % 1000;

  const totalMinutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  const totalHours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;

  const formattedDays = String(days).padStart(2, '0');
  const formattedHours = String(hours).padStart(2, '0');
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');
  const formattedMilliseconds = String(millisecondsPart.toFixed(0)).padStart(2, '0');
  return format
    .replace('dd', formattedDays)
    .replace('HH', formattedHours)
    .replace('mm', formattedMinutes)
    .replace('ss', formattedSeconds)
    .replace('ms', formattedMilliseconds);
}

window.addEventListener('load', () => {
  const fileInputs = document.querySelectorAll('input[type="file"]');
  const hasAutoFilled = Array.from(fileInputs).some((input) => input.value !== '');

  if (hasAutoFilled) {
    // Clear the inputs
    fileInputs.forEach((input) => {
      input.value = '';
    });

    // Use your existing notification system to show the message
    showNotification('需要选择文件', '请再次选择您的文件以确保正确处理。', {
      type: 'info',
      duration: 5000,
      buttons: [
        {
          text: 'OK',
          class: 'btn btn-sm btn-primary',
          onClick: () => {},
        },
      ],
    });
  }
});

document.addEventListener('DOMContentLoaded', async () => {
  //https://cdn.jsdelivr.net/npm/segmentit@2.0.3/dist/umd/segmentit.min.js
  const loadScripts_segmentit = (src) => {
    const script = document.createElement('script');
    script.src = src;
    script.defer = true;
    script.crossOrigin = 'anonymous';
    script.onload = () => {
      console.log('Script loaded successfully!');
      // document.getElementById('loadingOverlay').style.display = 'none'; // 隐藏加载动画
      document.getElementById('loadingOverlay').classList.add('d-none'); // 隐藏加载动画
    };
    document.body.appendChild(script);
  };

  loadScripts_segmentit('https://cdn.jsdelivr.net/npm/segmentit@2.0.3/dist/umd/segmentit.min.js');

  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.forEach((tooltipTriggerEl) => {
    new bootstrap.Tooltip(tooltipTriggerEl);
  });

  document.querySelectorAll('input[name="musicSource"]').forEach((radio) => {
    radio.addEventListener('change', function () {
      if (this.value === 'search') {
        document.getElementById('searchSection').style.display = 'block';
        document.getElementById('uploadSection').style.display = 'none';
      } else if (this.value === 'upload') {
        document.getElementById('searchSection').style.display = 'none';
        document.getElementById('uploadSection').style.display = 'block';
      }
    });
  });

  // 初始状态检查
  if (document.getElementById('searchRadio').checked) {
    document.getElementById('searchSection').style.display = 'block';
    document.getElementById('uploadSection').style.display = 'none';
  } else if (document.getElementById('uploadRadio').checked) {
    document.getElementById('searchSection').style.display = 'none';
    document.getElementById('uploadSection').style.display = 'block';
  }

  // Cache DOM elements
  const elements = {
    colorElement: document.getElementById('colorElement'),
    input: document.getElementById('sequenceInput'),
    timerDisplay: document.getElementById('timer'),
    buttons: {
      run: document.getElementById('run'),
      pause: document.getElementById('pause'),
      resume: document.getElementById('resume'),
      stop: document.getElementById('stop'),
      restart: document.getElementById('restart'),
      clear: document.getElementById('clear'),
    },
  };

  // Initialize the form
  const themeConfigForm = new ThemeConfigForm(window.MY_PRESETS);
  try {
    const lastThemeColors = localStorage.getItem('lastThemeColors');
    if (lastThemeColors && lastThemeColors !== undefined && lastThemeColors != null) {
      themeConfigForm.themeConfig = JSON.parse(lastThemeColors);
    }
  } catch (error) {
    console.log('error-initializeForm: ', error);
  }
  themeConfigForm.initializeForm();

  // const configurator = new ThemeColorConfigurator(
  //   'configurator',
  //   window.MY_PRESETS[0],
  //   window.MY_PRESETS,
  // );
  // console.log('configurator: ', configurator);

  window.AudioAnalyzer = new AudioAnalyzer();

  // Initialize controller
  const animationController = new AnimationController(elements.colorElement, elements.timerDisplay);
  // Initialize audio controller
  const audioController = new AudioController(animationController);

  // Add listener for animation stopped event
  elements.colorElement.addEventListener('animationStopped', () => {
    updateButtonStates(false, false);
  });

  // Set initial button states
  const updateButtonStates = (running = false, paused = false) => {
    elements.buttons.run.disabled = running;
    elements.buttons.pause.disabled = !running || paused;
    elements.buttons.resume.disabled = !paused;
    elements.buttons.stop.disabled = !running;
    elements.buttons.restart.disabled = !animationController.timeline;
    elements.buttons.clear.disabled = !animationController.timeline;

    // Update button tooltips with hotkey information
    elements.buttons.run.title = '开始（空格）';
    elements.buttons.pause.title = '暂停（空格）';
    elements.buttons.resume.title = '恢复播放（空格）';
    elements.buttons.stop.title = '停止（Esc）';
    elements.buttons.restart.title = '重新启动（Ctrl/Cmd+R）';
    elements.buttons.clear.title = '清除（Ctrl/Cmd+Del）';
  };

  // Event Handlers
  const handleRun = () => {
    if (document.activeElement === elements.input) {
      showNotification('检测到正在输入 ⌨️', '请在运行前完成编辑', {
        type: 'info',
        duration: 3000,
      });
      return;
    }

    const { errors, frames } = Timeline.parse(elements.input.value);
    if (errors.length) {
      showNotification(
        '时间轴内容检查 ⚠️',
        '在你的时间轴内容上发现了一些问题:\n' + errors.join('\n'),
        {
          type: 'error',
          duration: 5000,
          dismissible: true,
        },
      );
      return handleStop();
    }
    if (frames.length === 0) {
      showNotification('空白时间轴内容 🎬', '找不到有效的时间轴。请先添加一些内容！', {
        type: 'warning',
        duration: 4000,
      });
      return;
    }

    try {
      animationController.timeline = new Timeline(frames);
      animationController.start();
      audioController.syncWithControls_run();
      updateButtonStates(true);

      showNotification('开始预览 🎵', '当前在预览时间轴颜色效果', {
        type: 'success',
        duration: 3000,
      });
    } catch (error) {
      showNotification('播放错误 🎼', '无法开始预览。请重试！', {
        type: 'error',
        duration: 4000,
        dismissible: true,
      });
      my_debugger.showError('Animation error:', error);
    }
  };

  const handlePause = () => {
    if (document.activeElement === elements.input) {
      showNotification('检测到正在输入 ⌨️', '请在暂停前完成编辑', {
        type: 'info',
        duration: 3000,
      });
      return;
    }
    animationController.pause();
    audioController.syncWithControls_pause();
    updateButtonStates(true, true);
    // showNotification('播放状态: 暂停 ⏸️', '已尝试暂停时间轴演示和音频', {
    //   type: 'info',
    //   duration: 3000
    // })
  };

  const handleResume = () => {
    if (document.activeElement === elements.input) {
      showNotification('检测到正在输入 ⌨️', '请在播放前完成编辑', {
        type: 'info',
        duration: 3000,
      });
      return;
    }
    animationController.resume();
    audioController.syncWithControls_resume();
    updateButtonStates(true, false);
    // showNotification('播放状态: 继续 ▶️', '从我们暂停的地方继续', {
    //   type: 'success',
    //   duration: 3000
    // })
  };

  const handleStop = () => {
    if (document.activeElement === elements.input) {
      showNotification('检测到正在输入 ⌨️', '请在暂停前完成编辑', {
        type: 'info',
        duration: 3000,
      });
      return;
    }
    animationController.stop();
    audioController.syncWithControls_stop();
    updateButtonStates();
    const modalBackdrop = document.querySelector('.modal-backdrop.fade.show');
    modalBackdrop?.remove();
    // showNotification('播放状态: 暂停 🔄', '已尝试暂停', {
    //   type: 'info',
    //   duration: 3000
    // })
  };

  const handleRestart = () => {
    if (document.activeElement === elements.input) {
      showNotification('检测到正在输入 ⌨️', '请在暂停前完成编辑', {
        type: 'info',
        duration: 3000,
      });
      return;
    }
    animationController.restart();
    audioController.syncWithControls_restart();
    updateButtonStates(true);

    // showNotification('播放状态: 重播 🔄', '已尝试重新开始播放', {
    //   type: 'success',
    //   duration: 3000
    // })
  };

  const handleClear = () => {
    if (document.activeElement === elements.input) {
      showNotification('检测到正在输入 ⌨️', '请在清除前完成编辑', {
        type: 'info',
        duration: 3000,
      });
      return;
    }

    if (elements.input.value.trim()) {
      showModal('清除已生成的时间轴内容', '你确定要清除所有内容吗？此操作无法撤销。', {
        type: 'warning',
        buttons: [
          {
            text: '是的，清除所有 ',
            class: 'btn btn-danger',
            onClick: () => {
              performClear();
            },
          },
          {
            text: 'Cancel',
            class: 'btn btn-secondary',
            onClick: () => {
              showNotification('已取消清除 ↩️', '你的时间轴内容没有改变', {
                type: 'info',
                duration: 3000,
              });
            },
          },
        ],
        modal: true,
      });
    } else {
      showNotification('没什么需要清理的 🌟', '时间轴内容已经空了', {
        type: 'info',
        duration: 3000,
      });
    }
  };

  // Separate function to perform the actual clear operation
  const performClear = () => {
    try {
      elements.input.value = '';
      animationController.stop();
      animationController.timeline = null;
      elements.colorElement.style.backgroundColor = 'var(--surface-secondary';
      elements.timerDisplay.textContent = '[00:00:00] => 0ms';
      audioController.syncWithControls_clear();
      updateButtonStates();

      // Show success notification after clearing
      showNotification('清除成功 ✨', '一切都被成功重置了', {
        type: 'success',
        duration: 3000,
      });
    } catch (error) {
      // Show error notification if something goes wrong
      showNotification('清除错误 ⚠️', '清除输入的时间轴内容时出错', {
        type: 'error',
        duration: 4000,
        dismissible: true,
      });
      my_debugger.showError('Clear error:', error);
    }
  };

  // Bind click event listeners
  elements.buttons.run.addEventListener('click', handleRun);
  elements.buttons.pause.addEventListener('click', handlePause);
  elements.buttons.resume.addEventListener('click', handleResume);
  elements.buttons.stop.addEventListener('click', handleStop);
  elements.buttons.restart.addEventListener('click', handleRestart);
  elements.buttons.clear.addEventListener('click', handleClear);

  let errorCount = 0;
  const maxErrors = 5; // 设置最大错误处理次数
  let lastErrorTime = 0;
  const cooldownDuration = 5000; // 设置冷却时间为5秒

  // Add error handling
  window.addEventListener('error', (event) => {
    if (event.message.indexOf('Script Error')) return console.log(event);
    if (errorCount >= maxErrors) {
      showModal(
        '频繁错误',
        `
                <div class="alert alert-warning">
                    <p><strong>频繁出现错误:</strong></p>
                    <p>快跟作者反馈一下!:</p>
                    <ul>
                        <li>刷新页面</li>
                        <li>检查您的输入数据</li>
                        <li>请在几分钟后重试</li>
                    </ul>
                </div>
            `,
        {
          type: 'warning',
          size: 'large',
          dismissible: true,
          modal: true,
          html: true,
          buttons: [
            {
              text: '确定',
              class: 'btn btn-primary',
              onClick: () => location.reload(),
              closeOnClick: true,
            },
          ],
        },
      );
      return; // 达到最大错误处理次数，不再处理新的错误
    }
    errorCount++;

    const currentTime = new Date().getTime();
    if (currentTime - lastErrorTime < cooldownDuration) {
      return; // 在冷却时间内，不再处理新的错误
    }

    lastErrorTime = currentTime;

    // // 将错误信息记录到本地存储
    // localStorage.setItem('errorLog', JSON.stringify(errorDetails));
    // 或者将错误信息发送到服务器
    // fetch()

    const errorDetails = {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error,
      stack: event.error ? event.error.stack : 'No stack trace available',
      timestamp: new Date().toISOString(),
    };

    showModal(
      '发生错误',
      `
              <div class="alert alert-danger">
                  <p><strong>出错了:</strong></p>
                  <p>${event.message}</p>
                  <p>文件: ${event.filename}</p>
                  <p>行号: ${event.lineno}, 列号: ${event.colno}</p>
              </div>
              <p>请尝试以下方法:</p>
              <ul>
                  <li>刷新页面</li>
                  <li>检查您的输入数据</li>
                  <li>请在几分钟后重试</li>
              </ul>
          `,
      {
        type: 'error',
        size: 'large',
        dismissible: true,
        modal: true,
        html: true,
        buttons: [
          {
            text: '报告错误',
            class: 'btn btn-danger',
            onClick: () => showNotification('Report Error', `好了好了我知道了!`),
            closeOnClick: true,
          },
        ],
      },
    );

    my_debugger.showError('Error occurred:', errorDetails);
    const modalBackdrop = document.querySelector('.modal-backdrop.fade.show');
    modalBackdrop?.remove();
    return handleStop();
  });

  // Setup Mousetrap hotkeys
  const setupHotkeys = () => {
    // Space - Toggle Play/Pause
    Mousetrap.bind('space', (e) => {
      e.preventDefault();
      if (!document.querySelector('.nav-link.active[data-bs-target="#color-visualizer"]')) return;
      if (!animationController.timeline) {
        handleRun();
      } else if (animationController.isPaused) {
        handleResume();
      } else {
        handlePause();
      }
    });

    // Stop - Escape or Ctrl/Cmd + S
    Mousetrap.bind(['escape', 'mod+s'], (e) => {
      e.preventDefault();
      if (!document.querySelector('.nav-link.active[data-bs-target="#color-visualizer"]')) return;
      handleStop();
    });

    // Restart - Ctrl/Cmd + R
    Mousetrap.bind('mod+r', (e) => {
      e.preventDefault();
      if (!document.querySelector('.nav-link.active[data-bs-target="#color-visualizer"]')) return;
      handleRestart();
    });

    // Clear - Ctrl/Cmd + Delete
    Mousetrap.bind('mod+backspace', (e) => {
      e.preventDefault();
      if (!document.querySelector('.nav-link.active[data-bs-target="#color-visualizer"]')) return;
      handleClear();
    });

    // Additional helpful shortcuts
    Mousetrap.bind('mod+enter', (e) => {
      e.preventDefault();
      if (!document.querySelector('.nav-link.active[data-bs-target="#color-visualizer"]')) return;
      handleRun();
    });

    // Prevent default browser shortcuts when working with the animation
    Mousetrap.bind(['mod+s', 'mod+r'], (e) => {
      e.preventDefault();
      if (!document.querySelector('.nav-link.active[data-bs-target="#color-visualizer"]')) return;
    });

    // Add help shortcut to show available hotkeys
    Mousetrap.bind('mod+.', (e) => {
      e.preventDefault();
      if (!document.querySelector('.nav-link.active[data-bs-target="#color-visualizer"]')) return;
      if (!document.querySelector('.modal-backdrop.fade.show'))
        showModal(
          '快捷键帮助 ⌨️',
          `<div>可用的快捷键:<br>
      • 空格键 (Space) - 播放/暂停切换<br>
      • Ctrl/Cmd + Enter - 运行<br>
      • Esc 或 Ctrl/Cmd + S - 停止<br>
      • Ctrl/Cmd + R - 重新开始<br>
      • Ctrl/Cmd + Backspace - 清除内容<br>
      <br>
提示: 在编辑文本时，快捷键会暂时禁用</div>`,
          {
            type: 'info',
            buttons: [
              {
                text: 'OK',
                class: 'btn btn-primary',
                onClick: () => {},
              },
            ],
            modal: true,
            dismissible: true,
            html: true,
          },
        );
    });
  };

  // Initialize hotkeys
  if (window.Mousetrap) {
    setupHotkeys();
  } else {
    my_debugger.showError(
      'Mousetrap not found. Hotkeys will not work. Please install it from npm.',
    );
  }

  // Initial button states
  updateButtonStates();
  elements.buttons.run.disabled = true;

  function toggleHelp(elm) {
    const isExpanded = elm.getAttribute('aria-expanded') === 'true';
    elm.setAttribute('aria-expanded', !isExpanded);
    elm.textContent = isExpanded ? '帮助 (收起)' : '帮助 (展开)';
  }

  if (window.hljs) {
    await highlightCodeInPreElements();
  } else {
    my_debugger.showError('Highlight.js not found. Skipping code highlighting.');
  }

  const ANNOUNCEMENT_CONTENT_backup = `
<div class="card shadow-sm mb-4">
        <div class="card-header">
          <h2 class="modal-title" id="announcementModalLabel">欢迎wmls来玩 Mayday.Blue 预设工具~</h2>
        </div>
        <div class="modal-body">
<h6>制作者<a
  href="https://www.xiaohongshu.com/user/profile/5c1610720000000005018c49"
  target="_blank">（小红书@那一转眼只剩我🥕)</a>留言：</h6>
<p>你只需要选择你喜欢的音乐文件并配置好主题颜色方案，剩下的交给我~<br>生成的质量还再不停优化!<br>感谢<a
      href="https://www.xiaohongshu.com/user/profile/5d7e751900000000010010bd"
      target="_blank">小红书@Diu🥕</a>大佬开发的<strong><code style="font-family: 'Lato', sans-serif;">Mayday.Blue</code></strong>小程序!
</p>

<h6>网站功能简介：</h6>
<ul>
  <li><strong>生成工具🎨：</strong>提供你想做预设的音频文件,轻松配置荧光棒的颜色主题并生成 <strong><code style="font-family: 'Lato', sans-serif;">Mayday.Blue</code></strong> 场控预设代码。</li>
  <li><strong>实时预览👀：</strong>可以把生成的预设代码添加进来，实时展示荧光棒使用到的电脑颜色效果。</li>
</ul>

<h6>功能详细介绍：</h6>
<ul>
  <li>生成工具🎨：请看<strong>预设代码生成器</strong>选项卡的使用指南</li>
  <li>实时预览👀：请看<strong>预设可视化工具</strong>选项卡的使用指南</li>
</ul>

<h6>重要细节：</h6>
<ul>
  <li>生成的代码可以直接复制并粘贴到你的<strong><code style="font-family: 'Lato', sans-serif;">Mayday.Blue</code></strong>中。</li>
  <li>支持导出和导入颜色主题配置，方便保存和分享创意。</li>
</ul>
        </div>
      </div>
  `;

  // 检查是否为新用户
  if (!localStorage.getItem('isNewUser')) {
    try {
      showModal('公告📢 - 2024/11/23 15:20', ANNOUNCEMENT_CONTENT_backup, {
        type: 'info',
        size: 'large',
        buttons: [
          {
            text: '开始使用（不再展示)',
            class: 'btn btn-primary',
            onClick: () => {
              // 存储用户选择开始使用
              localStorage.setItem('isNewUser', 'false');

              // 关闭模态框
              const modal = document.querySelector('#notificationModal');
              if (modal && modal.classList.contains('show')) {
                const bootstrapModal = new bootstrap.Modal(modal);
                bootstrapModal.hide();
              }

              const descriptionSteps = [
                {
                  element: '#guideHeading',
                  popover: {
                    title: '使用指南：如何生成预设代码 ',
                    description:
                      '首先，请导入你喜欢的歌曲吧！这一步可是关键哦，它将为我们的荧光棒色彩之旅奠定基础。',
                    position: 'right',
                  },
                },
                {
                  element: '#fileFormCollapse',
                  popover: {
                    description:
                      '<p>想在线找音乐，就点蓝色的 “在线搜索音乐”，再点下面的 “点我去搜索”，就能从网上找音乐啦。</p>',
                    position: 'right',
                  },
                },
                {
                  element: '#fileFormCollapse',
                  popover: {
                    description: `<p>要是想上传自己电脑里的音乐，就点 “上传本地音乐”（点了会变蓝）。然后点 “浏览...”，从自己电脑里选音乐文件就行，像 MP3、WAV、FLAC 这些格式都可以。</p><span class="text-muted">一万首的mp3 一万次疯狂的爱 灭不了一个渺小的孤单</span><img src="https://i.imgur.com/JqJyJqJ.png" width="300" height="auto"> </img>`,
                    position: 'right',
                  },
                },
                // 颜色
                {
                  element: '.card-header[id="themeConfigHeading"]',
                  popover: {
                    description: '现在，让我们来为荧光棒挑选漂亮的颜色主题吧！',
                    position: 'bottom',
                  },
                },
                {
                  element: '#baseColorContainer',
                  popover: {
                    description:
                      '在这里，先选择一个基础颜色，它就像歌曲的灵魂一样，会决定整个荧光棒颜色变化的主基调哦。想象一下，哪种颜色最能代表你心中五月天歌曲的感觉呢？',
                    position: 'bottom',
                  },
                },
                {
                  element: '#colorSections',
                  popover: {
                    description:
                      '然后，我们要为歌曲的不同部分设置颜色啦。每个部分都可以有自己独特的颜色哦。调整颜色的比例，让它们完美地配合歌曲的节奏，就像一场绚丽的色彩派对！',
                    position: 'bottom',
                  },
                },
                {
                  element: '.lowColorsSection',
                  popover: {
                    description: '低频部分（如前奏、慢节奏段落）',
                    position: 'bottom',
                  },
                },
                {
                  element: '.midColorsSection',
                  popover: {
                    description: '中频部分（如主歌、节奏适中段落）',
                    position: 'bottom',
                  },
                },
                {
                  element: '.highColorsSection',
                  popover: {
                    description: '高频部分（如副歌、高潮段落）',
                    position: 'bottom',
                  },
                },
                {
                  element: '.accentColorsSection',
                  popover: {
                    description: '关键转折处（如情感爆发点）',
                    position: 'bottom',
                  },
                },
                {
                  element: '#themeConfig_saveConfig',
                  popover: {
                    description:
                      '当你完成颜色设置后，点击这个保存配置按钮，就能保存你的颜色主题配置啦。',
                    position: 'left',
                  },
                },
                {
                  element: '#themeConfig_exportConfig',
                  popover: {
                    description:
                      '如果你想分享你的颜色主题设置，可以点击这个导出配置按钮，将配置导出为文件。',
                    position: 'left',
                  },
                },
                {
                  element: "label[for='themeConfig_importConfig']",
                  popover: {
                    description:
                      '想要使用已有的颜色主题配置？点击这个导入配置按钮，选择相应的文件即可。',
                    position: 'left',
                  },
                },
                // 生成
                {
                  element: '#generate-btn',
                  popover: {
                    description:
                      '歌曲和颜色主题配置都准备好啦，接下来就是见证奇迹的时刻——点击这个按钮就生成Mayday.blue 的预设代码了！',
                    position: 'right',
                  },
                },
                {
                  element: '#output-result',
                  popover: {
                    description:
                      '看，这里就是生成的代码显示区域啦。代码生成后，你可以点击“复制”按钮把它复制到剪贴板，然后粘贴到Mayday.Blue应用中，或者点击“下载”保存为.json文件备用哦。',
                    position: 'top',
                  },
                },
                {
                  element: '#copy-btn',
                  popover: {
                    description:
                      '点击这个“复制”按钮，就可以轻松把代码复制下来，准备好让荧光棒闪耀起来吧！',
                    position: 'left',
                  },
                },
                {
                  element: '#download-btn',
                  popover: {
                    description:
                      '如果你想把代码保存下来，以防万一，就点击这个“下载”按钮，它会把代码保存为一个方便的.json文件哦。',
                    position: 'bottom',
                  },
                },
                // 可视化
                {
                  element: '#guide1Heading',
                  popover: {
                    description: '这是如何预览已有的预设代码的使用指南。',
                    position: 'bottom',
                  },
                },
              ];
              const driver = window.driver.js.driver;
              // 启动 description.js 引导
              setTimeout(() => {
                const driverObj = driver({
                  animate: true,
                  showProgress: false,
                  nextBtnText: '下一个',
                  prevBtnText: '上一个',
                  doneBtnText: '结束',
                  popoverClass: 'driverjs-theme',
                  steps: descriptionSteps,
                  scrollIntoViewOptions: { behavior: 'smooth' },
                });
                driverObj.drive();
              }, 300); // 确保模态框完全关闭后再启动引导

              // // 移除 iframe 元素
              // const iframe = document.getElementById('myIframe');
              // if (iframe) {
              //   // 移除 iframe 的所有事件监听器
              //   iframe.onload = null;
              //   iframe.onerror = null;
              //   // 移除 iframe 元素
              //   iframe.remove();
              // }
              // // 如果需要，可以重置模态框内容
              // document.querySelector('#notificationModal #modalBody').innerHTML = '';
            },
          },
        ],
        html: true,
        dismissible: false,
      });
      // // 确保 iframe 加载完成后再显示通知
      // const iframe = document.getElementById('myIframe');
      // if (iframe) {
      //   iframe.onload = () => {
      //     // 模态通知已经显示，无需额外操作
      //   };
      //   // 可以在这里添加其他事件监听器，例如错误处理
      //   iframe.onerror = (event) => {
      //     console.error('Iframe 加载失败:', event);
      //   };
      // }
    } catch (error) {
      console.error('显示公告时发生错误:', error);
      document.querySelector(
        '#notificationModal #modalBody',
      ).innerHTML = `<iframe id="myIframe" src="https://sx5w7odpp7p.feishu.cn/docx/IcuIdkFKJofwhsxfW4GcVdGSnQd" width="100%" height="600px"></iframe>`;
    }
  }
});
