document.addEventListener('DOMContentLoaded', () => {
    // 弹窗控制模块
    const settingsModal = document.getElementById('settingsModal');
    const maskLayer = document.getElementById('mask');

    // 模式切换处理（保留唯一的事件监听器）
    document.getElementById('mode').addEventListener('change', function (e) {
        const value = e.target.value;
        const interfaces = document.querySelectorAll('.interface');

        if (value === 'settings') {
            openSettings();
            this.value = 'default';
            return;
        }

        interfaces.forEach(ui => ui.style.display = 'none');
        document.getElementById(value).style.display = 'block';
    });

    // 全局状态管理
    window.appState = {
        minStudent: 1,       // 默认最小值
        maxStudent: 52,      // 默认最大值
        isFlickering: false,
        intervalId: null,
        fast: 50
    };

    // 下载源代码功能
    async function downloadSourceCode() {
        try {
            const response = await fetch('https://github.com/WuiQeFan/DrawingStudentsID/archive/refs/heads/master.zip');
            if (!response.ok) {
                throw new Error('Failed to fetch');
                
            }
            
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = 'DrawingStudentsID-source.zip';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Clean up
            setTimeout(() => URL.revokeObjectURL(url), 100);
        } catch (error) {
            console.error('Download failed:', error);
            alert('下载源码失败: ' + error.message);
            alert('这里试一试:https://github.com/WuiQeFan/DrawingStudentsID/archive/refs/heads/master.zip');
        }
    }

    // 打开设置
    function openSettings() {
        maskLayer.style.display = 'block';
        settingsModal.style.display = 'block';
        document.getElementById('MinTotalStudents').value = window.appState.minStudent;
        document.getElementById('MaxTotalStudents').value = window.appState.maxStudent;
        document.getElementById('fast').value = window.appState.fast;
    }

    // 关闭设置
    function closeSettings() {
        maskLayer.style.display = 'none';
        settingsModal.style.display = 'none';
    }

    // 保存设置
    function saveSettings() {
        const min = parseInt(document.getElementById('MinTotalStudents').value);
        const max = parseInt(document.getElementById('MaxTotalStudents').value);
        const newFast = parseInt(document.getElementById('fast').value);

        // 验证输入范围
        if (isNaN(min) || isNaN(max) || min < 1 || max < 1 || min >= max) {
            alert('学号范围设置无效！最小值必须大于0，且最大值不能小于最小值。');
            return;
        }
        
        if (min > 1000000000 || max > 1000000000) {
            alert('学号范围过大！最大值不能超过1000000000。');
            return;
        }

        if (isNaN(newFast) || newFast < 1 || newFast > 10000) {
            alert('闪烁速度设置无效！请输入1-10000之间的整数。');
            return;
        }

        // 更新全局状态
        window.appState.minStudent = min;
        window.appState.maxStudent = max;
        window.appState.fast = newFast;

        // 更新界面显示
        window.updateStudentCounters();
        
        // 如果正在闪烁，重启闪烁
        if (window.appState.isFlickering) {
            clearInterval(window.appState.intervalId);
            window.appState.intervalId = setInterval(() => {
                const tempResult = Math.floor(
                    Math.random() * (window.appState.maxStudent - window.appState.minStudent + 1)
                ) + window.appState.minStudent;
                document.getElementById('FlickerResult').innerHTML = `
                    ✨ 闪烁中：<span class="blink">${tempResult}</span>
                `;
            }, window.appState.fast);
        }

        closeSettings();
    }

    // 全局暴露函数
    window.closeSettings = closeSettings;
    window.saveSettings = saveSettings;
    window.downloadSourceCode = downloadSourceCode;
    window.openSettings = openSettings;
});