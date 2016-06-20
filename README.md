# tetris
HTML4+CSS+JavaScript实现的俄罗斯方块游戏

```
<!-- demo -->
<script type="text/javascript">
// 事件选项
var tetrisEventOptions = { // 可设置选项
    beforeInit: function() {}, // 初始化前事件
	afterInit: function() {}, // 初始化后事件
	beforeScore: function(scores, lines) {}, // 得分前事件
	afterScore: function(scores, lines) {}, // 得分后事件
	beforeSave: function() {}, // 保存前事件
	afterSave: function(stack) {}, // 保存后事件
	shapeDownCallback: function(shapeIndex, isFall) {} // 形状下落事件
};
// tetris 玩家按键选项
var tetrisPressKeyOptions = {
    leftMoveKey: 37, // 左移
	rightMoveKey: 39, // 右移
	rotateKey: 38, // 变形
	downMoveKey: 40, // 下移
	fallKey: 32 // 落下
}

/**
 * 游戏设置
 * 
 * @param container tetris所放置的容器
 * @param tetrisOptions 可选参数：tetris游戏选项一般只有事件类选项如beforeInit/afterInit
 */
$('<div></div>').appendTo(document.body).tetrisShape(container, tetrisEventOptions);

/**
 * 添加玩家
 * 
 * @param tetrisOptions 可选参数
 */
$('<div></div>').appendTo(document.body).tetris($.extend({}, tetrisEventOptions, tetrisPressKeyOptions));

// 重写落下方法
$.tetris.prototype.fall = function() {
    // TODO: 自定义代码
};

// 基本帮助信息请阅读源码及注释
</script>
```
