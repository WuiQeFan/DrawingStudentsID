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
        totalStudents: 52,
        isFlickering: false,
        intervalId: null,
        fast: 50
    };

    // 下载源代码功能
    async function downloadSourceCode() {
        // 从https://github.com/WuiQeFan/WuiQeFan/archive/refs/heads/master.zip下载源码
        try {
            const response = await fetch('https://github.com/WuiQeFan/WuiQeFan/archive/refs/heads/master.zip');
            if (!response.ok) {
                throw new Error('Failed to download source code');
            }
            
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = 'WuiQeFan-source.zip';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Clean up
            setTimeout(() => URL.revokeObjectURL(url), 100);
        } catch (error) {
            console.error('Download failed:', error);
            alert('下载源码失败: ' + error.message);
        }
    }

    // 打开设置
    function openSettings() {
        maskLayer.style.display = 'block';
        settingsModal.style.display = 'block';
        document.getElementById('totalStudents').value = window.appState.totalStudents;
        document.getElementById('fast').value = window.appState.fast;
    }

    // 关闭设置
    function closeSettings() {
        maskLayer.style.display = 'none';
        settingsModal.style.display = 'none';
    }

    // 保存设置
    function saveSettings() {
        const newTotal = parseInt(document.getElementById('totalStudents').value);
        const newFast = parseInt(document.getElementById('fast').value);

        if (newTotal > 0 && newFast > 0 || newTotal <= 1000000000) {
            window.appState.totalStudents = newTotal;
            window.appState.fast = newFast;
            updateStudentCounters();
            closeSettings();
        } else {
            if (newTotal <= 0 || newTotal > 1000000000){
                alert('请输入有效的班级人数！');
            } else if (newFast <= 0 || newFast > 1000000000) {
                alert('请输入有效的闪烁速度！');
            }
        }
    }

    // 全局暴露函数
    window.closeSettings = closeSettings;
    window.saveSettings = saveSettings;
    window.downloadSourceCode = downloadSourceCode;
    window.openSettings = openSettings;
});
