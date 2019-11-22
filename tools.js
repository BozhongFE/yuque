let memories = [];
const tool = {
  /**
   * 测试单个函数的耗时总时长
   * @param {function} method 
   * @param {array} data => [item] => [[param1, param2]] 测试数据列表
   */
  consumeTime(method, data) {
    const dataLength = data.length;
    let diffAll = 0;
    for (let i = 0; i < dataLength; i += 1) {
      const time = process.hrtime();
      method.apply(null, data[i]);
      const diff = process.hrtime(time);
      diffAll += diff[0] * 1e9 + diff[1];
    }
    console.log('total time: ', tool.formatTime(diffAll));
  },
  // 纳秒
  formatTime(ns, level = 0, minLevel = 2) {
    const levels = ['ns', 'μs', 'ms', 's', 'min', 'h', 'd'];
    if (level < minLevel || ns >= 1000) {
      return tool.formatTime(ns / 1000, level + 1);
    }
    return `${ns.toFixed(3)}${levels[level]}`;
  },
  // 多次使用，需要等上一次内存回收稳定后再测试
  memoryReady(callback, times = 1000) {
    memories = [];
    setTimeout(callback, times);
  },
  /**
   * 检查函数的内存使用情况
   * @param {string} status 通过状态设置内存起始，值有：start|end
   * 例子：memory('start'); func(); memory('end');
   */
  memory(status) {
    /**
     * rss: 进程常驻内存
     * heapTotal：已申请的堆内存
     * heapUsed：已使用的量
     */
    if (status === 'start' || status === 'doing') {
      process.memoryUsage();
      memories.push(process.memoryUsage());
    } else if (status === 'end') {
      memories.push(process.memoryUsage());
      let maxMemory = 0;
      let minMemory = memories[0].heapUsed;
      memories.forEach((item) => {
        maxMemory = Math.max(maxMemory, item.heapUsed);
        minMemory = Math.min(minMemory, item.heapUsed);
      });
      let max = maxMemory - minMemory;
      const last = memories[memories.length - 1];
      console.log(
        'Process: rss ', tool.formatMemory(last.rss),
        ' heapTotal ', tool.formatMemory(last.heapTotal),
        ' heapUsed ', tool.formatMemory(last.heapUsed),
        ' consume ', tool.formatMemory(max)
      );
    }
  },
  formatMemory(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    else if (bytes / 1024 < 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    else return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  },
  /**
   * 比较两个值
   */
  check(val1, val2, type) {
    if (type === 'object' || type === 'array') {
      if (JSON.stringify(val1) !== JSON.stringify(val2)) console.error(`error: ${val1} ${val2}`);
    } else {
      if (val1 !== val2) console.error(`error: ${val1} ${val2}`);
    }
  },
};

module.exports = tool;
