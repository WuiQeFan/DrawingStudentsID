document.addEventListener('DOMContentLoaded', () => {
    // 更新人数显示
    function updateStudentCounters() {
        document.querySelectorAll('#currentTotal, #flickerTotal').forEach(el => {
            el.textContent = `${window.appState.minStudent} - ${window.appState.maxStudent}`;
        });
    }

    // 默认抽号处理
    function handleDefaultDraw() {
        const range = window.appState.maxStudent - window.appState.minStudent + 1;
        const result = Math.floor(Math.random() * range) + window.appState.minStudent;
        document.getElementById('DefaultResult').innerHTML = `
            🎉 抽中学号：<span class="highlight">${result}</span>
        `;
    }

    // 闪烁抽号处理
    function handleFlickerDraw() {
        const btn = document.getElementById('flickerBtn');
        if (!window.appState.isFlickering) {
            window.appState.isFlickering = true;
            btn.innerHTML = '⏸️ 暂停闪烁';
            const range = window.appState.maxStudent - window.appState.minStudent + 1;
            
            window.appState.intervalId = setInterval(() => {
                const tempResult = Math.floor(Math.random() * range) + window.appState.minStudent;
                document.getElementById('FlickerResult').innerHTML = `
                    ✨ 闪烁中：<span class="blink">${tempResult}</span>
                `;
            }, window.appState.fast);
        } else {
            window.appState.isFlickering = false;
            btn.innerHTML = '▶️ 开始闪烁';
            clearInterval(window.appState.intervalId);
        }
    }

    // 初始化界面
    function initInterface() {
        document.getElementById('default').style.display = 'block';
        updateStudentCounters();
    }

    // 全局暴露函数
    window.updateStudentCounters = updateStudentCounters;
    window.handleDefaultDraw = handleDefaultDraw;
    window.handleFlickerDraw = handleFlickerDraw;

    // 初始化
    initInterface();
});