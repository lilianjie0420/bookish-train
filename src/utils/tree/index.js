// [ > … ] 表示调用函数后的打印内容

// arrange('William').execute();
// > William is notified

// arrange('William').do('commit').execute();
// > William is notified
// > Start to commit

// arrange('William').wait(5).do('commit').execute();
// > William is notified
// 等待 5 秒
// > Start to commit

// arrange('William').waitFirst(5).do('push').execute();
// 等待 5 秒
// > William is notified
// > Start to push

export default function arrange(taskId) {
    /**
     * 此处写代码逻辑
     */
    const obj = {
        taskId: taskId,
        action: '',
        time: 0,
        firstTime: 0,
        do: function (action) {
            this.action = action
            return obj
        },
        execute: function() {
            setTimeout(function(){
                console.log(`> ${obj.taskId} is notified`);
                if(obj.action) {
                    setTimeout(() => {
                        console.log(`> Start to ${obj.action} `);
                    }, obj.time)
                }
            }, obj.firstTime)
            return obj
        },
        wait: function(time) {
            obj.time += time * 1000;
            return obj
        },
        waitFirst: function(time) {
            obj.firstTime += time * 1000;
            return obj
        }
    }
    return obj
}
//或使用类组件, 如果使用类组件，调用形式可以改为： new arrange('William').execute();
// class arrange {
  
// }