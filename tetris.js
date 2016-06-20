(function($){
	var tetrisCount = 1;

	Array.prototype.flip = function() {
		var obj = {};

		$.each(this, function(k, v){
			obj[v] = k;
		});

		return obj;
	};
	
	$.tetrisGlobalOptions = {
		width: 20,
		height: 20,
		colors: ['00', '33', '66', '99', 'cc', 'ff'],
		startKey: 116, // 继续 F5
		stopKey: 115, // 结束 F4
		pauseKey: 117, // 暂停 F6
		continueKey: 118, // 继续 F7
		isCannotRotateShapeObject: [4, 8, 9].flip(),
		shapes: [
			[
				[1, 0, 0, 0],
				[1, 0, 0, 0],
				[1, 0, 0, 0],
				[1, 0, 0, 0]
			],
			[
				[1, 0, 0, 0],
				[1, 0, 0, 0],
				[1, 1, 0, 0],
				[0, 0, 0, 0]
			],
			[
				[0, 1, 0, 0],
				[0, 1, 0, 0],
				[1, 1, 0, 0],
				[0, 0, 0, 0]
			],
			[
				[0, 1, 0, 0],
				[1, 1, 1, 0],
				[0, 0, 0, 0],
				[0, 0, 0, 0]
			],
			[
				[1, 1, 0, 0],
				[1, 1, 0, 0],
				[0, 0, 0, 0],
				[0, 0, 0, 0]
			],
			[
				[0, 1, 1, 0],
				[0, 1, 0, 0],
				[1, 1, 0, 0],
				[0, 0, 0, 0]
			],
			[
				[1, 1, 0, 0],
				[0, 1, 0, 0],
				[0, 1, 1, 0],
				[0, 0, 0, 0]
			],
			[
				[1, 0, 1, 0],
				[1, 1, 1, 0],
				[0, 1, 0, 0],
				[0, 0, 0, 0]
			],
			[
				[0, 1, 0, 0],
				[1, 1, 1, 0],
				[0, 1, 0, 0],
				[0, 0, 0, 0]
			],
			[
				[1, 0, 0, 0],
				[0, 0, 0, 0],
				[0, 0, 0, 0],
				[0, 0, 0, 0]
			]
		]
	};

	$.fn.tetrisShape = function() {
		var self = this;
		var rows = Math.ceil($.tetrisGlobalOptions.shapes.length/5);

		$(this).addClass('g-tetris-shape').height(rows * 4 * $.tetrisGlobalOptions.height - 1);

		$('<div class="g-tetris-title g-tetris-gradient"></div>').text('俄罗斯方块 - ' + $.tetrisGlobalOptions.shapes.length + ' 个形状').appendTo(this);

		$.each($.tetrisGlobalOptions.shapes, function(k,shape) {
			var X = k % 5, Y = Math.floor(k / 5);
			var elem = $('<div class="g-tetris-shape-box"></div>').appendTo(self);
			var color = $.tetris.prototype.randColor();

			elem.css({
				left: X * 4 * $.tetrisGlobalOptions.width,
				top: Y * 4 * $.tetrisGlobalOptions.height
			});
			
			var x, y;
			for(y=0; y<4; y++) {
				for(x=0; x<4; x++) {
					var bElem = $('<div class="g-tetris-block"></div>').css({
						left: x * $.tetrisGlobalOptions.width,
						top: y * $.tetrisGlobalOptions.height
					}).appendTo(elem);

					if(shape[y][x]) {
						$.tetris.prototype.setStyle(bElem, color.backgroundColor, color.borderColor);
					} else {
						$.tetris.prototype.removeStyle(bElem);
					}
				}
			}
		});
	};
	
	$.fn.tetris = function(options) {
		var args = [];
		var i;
		for(i=1; i<arguments.length; i++) {
			args.push(arguments[i]);
		}
		
		this.filter('.g-tetris').each(function() {
			var tetris = $(this).data('tetris');
			
			if(typeof(options) == 'string') {
				if($.isFunction(tetris[options])) {
					tetris[options].apply(tetris, args);
				} else if(options == 'options') { // $().tetris('options', ...)
					if($.isPlainObject(args[1])) { // $().tetris('options', {})
						$.extend(true, tetris.options, args[0]);
					} else if(args[1] in tetris.options) { // $().tetris('options', 'optionName', optionValue)
						if($.isPlainObject(tetris.options[args[0]])) { // $().tetris('options', 'pressKey', {})
							$.extend(true, tetris.options[args[0]], args[1]);
						} else { // $().tetris('options', 'beforeInit', function(){})
							tetris.options[args[1]] = args[1];
						}
					} else {
						alert('没有 $.tetris.options.' + args[0] + ' 选项属性！');
					}
				} else {
					alert('不合法属性或方法 $.tetris.' + args[0] + ' ！');
				}
			} else if($.isPlainObject(options)) {
				$.extend(true, tetris.options, options);
			} else {
				alert('不合法的操作 tetris ' + options + ' ！');
			}
		});
		
		this.not('.g-tetris').addClass('g-tetris').each(function() {
			$(this).data('tetris', new $.tetris(this, options));
		});
		
		return this;
	};
	$.initArray = function(defArray, defaultValue, defIndex, callbackArgs) {
		if(isNaN(defIndex) || !$.isArray(callbackArgs)) {
			defIndex = 0;
			callbackArgs = [];
		}
		
		if(!$.isArray(defArray) || defArray.length <= defIndex) {
			if($.isFunction(defaultValue)) {
				return defaultValue.apply(this, callbackArgs);
			} else {
				return defaultValue;
			}
		}
		
		var retArr = [];
		var i;
		
		for(i=0; i<defArray[defIndex]; i++) {
			callbackArgs[defIndex] = i;
			
			retArr.push($.initArray(defArray, defaultValue, defIndex+1, callbackArgs));
		}
		
		return retArr;
	};
	$.tetris = function(elem, options) {
		this.elem = $(elem);
		this.options = $.extend(true, {}, this.options, options);
		this.init();
	};
	$.tetris.prototype = {
		options: { // 可设置选项
			beforeInit: function() {}, // 初始化前事件
			afterInit: function() {}, // 初始化后事件
			pressKey: {
				leftMove: 37, // 左移
				rightMove: 39, // 右移
				rotate: 38, // 变形
				downMove: 40, // 下移
				fall: 32 // 落下
			}
		},
		
		elem: $([]), // 主元素 .g-tetris
		titleElem: $([]),
		mainBox: $([]),
		nextBox: $([]),
		textBox: $([]),
		scoreElem: $([]),
		lineElem: $([]),
		
		isStarted: false, // 是否已开始
		isPaused: false, // 是否已暂停
		isNeedClean: false, // 是否需要清理
		strTitle: '玩家1', // 标题
		
		mainElems: [], // 主块元素数组(18X10)
		nextElems: [], // 下一个块元素数组(4X4)
		
		nextShape: [], // 下一个形状数组(4X4)
		nextShapeIndex: 0, // 下一个形状索引号
		nextBackgroundColor: '#fff',
		nextBorderColor: '#fff',
		
		mainShape: [], // 主形状数组(4X4)
		mainShapeIndex: 0, // 主形状索引号
		mainTempShape: [], // 主临时形状数组(4X4)
		mainBackgroundColor: '#fff',
		mainBorderColor: '#fff',
		mainX: 0,
		mainY: 0,

		isBlockRecords: [], // 是否有块状态记录
		
		scoreNum: 0, // 分数
		lineNum: 0, // 行数
		interval: 1000, // 计时器时间间隔
		timer: 0, // 计时器
		
		init: function() {
			if(this.isInited) {
				alert('$.tetris.init 方法不能重复执行！');
				return;
			}
			
			this.options.beforeInit.call(this);
			
			var self = this;
			
			$(window).bind('keydown.tetris', function(e) {
				switch(e.keyCode) {
					case $.tetrisGlobalOptions.startKey:
						self.startGame();
						break;
					case $.tetrisGlobalOptions.stopKey:
						self.stopGame();
						break;
					case $.tetrisGlobalOptions.pauseKey:
						self.pauseGame();
						break;
					case $.tetrisGlobalOptions.continueKey:
						self.continueGame();
						break;
					case self.options.pressKey.rotate:
						self.rotate();
						break;
					case self.options.pressKey.leftMove:
						self.leftMove();
						break;
					case self.options.pressKey.rightMove:
						self.rightMove();
						break;
					case self.options.pressKey.downMove:
						self.downMove();
						break;
					case self.options.pressKey.fall:
						self.fall();
						break;
				}

				return false;
			});
			
			this.strTitle = '玩家' + (tetrisCount++);
			
			this.titleElem = $('<div class="g-tetris-title g-tetris-gradient"></div>').text(this.strTitle + ' - 等待游戏开始').appendTo(this.elem);
			this.mainBox = $('<div class="g-tetris-main-box"></div>').appendTo(this.elem);
			this.nextBox = $('<div class="g-tetris-next-box"></div>').appendTo(this.elem);
			this.textBox = $('<div class="g-tetris-text-box"></div>').appendTo(this.elem);
			this.scoreElem = $('<div><label>得分</label><span>0</span></div>').appendTo(this.textBox).find('span');
			this.lineElem = $('<div><label>行数</label><span>0</span></div>').appendTo(this.textBox).find('span');
			
			this.mainElems = $.initArray([18,10], function(y, x) {
				return $('<div class="g-tetris-block"></div>').css({
					left: x * $.tetrisGlobalOptions.width,
					top: y * $.tetrisGlobalOptions.height
				}).appendTo(self.mainBox);
			});
			this.nextElems = $.initArray([4,4], function(y, x) {
				return $('<div class="g-tetris-block"></div>').css({
					left: x * $.tetrisGlobalOptions.width,
					top: y * $.tetrisGlobalOptions.height
				}).appendTo(self.nextBox);
			});
			
			this.nextShape = $.initArray([4,4],0);
			this.mainShape = $.initArray([4,4],0);
			this.mainTempShape = $.initArray([4,4],0);

			this.isBlockRecords = $.initArray([18,10], 0);
			
			this.renderNextShape();
			
			this.options.afterInit.call(this);
			
			this.isInited = true;
		},
		startGame: function() {
			if(this.isStarted) {
				return;
			}
			
			this.isStarted = true;
			this.isPaused = false;
			
			this.scoreNum = 0;
			this.lineNum = 0;
			this.interval = 1000;
			
			this.titleElem.text(this.strTitle + ' - 游戏中...');
			this.scoreElem.text(0);
			this.lineElem.text(0);
			
			if(this.isNeedClean) {
				var self = this;
				$.each(this.mainElems, function(){
					$.each(this, function(){
						self.removeStyle(this);
					});
				});

				var x, y;
				for(y=0; y<this.isBlockRecords.length; y++) {
					for(x=0; x<this.isBlockRecords[y].length; x++) {
						this.isBlockRecords[y][x] = 0;
					}
				}
			}
			
			this.mainBackgroundColor = this.nextBackgroundColor;
			this.mainBorderColor = this.nextBorderColor;
			this.mainShapeIndex = this.nextShapeIndex;
			this.rotateShape(this.mainShape, this.nextShape, 0);
			this.makeXY();
			
			this.renderNextShape();
			
			var self = this;
			this.timer =  setInterval(function(){
				self.downMove();
			}, this.interval);
		},
		stopGame: function() {
			if(!this.isStarted || this.isPaused) {
				return;
			}
			
			this.isStarted = false;
			this.isPaused = false;
			this.isNeedClean = true;
			
			this.titleElem.text(this.strTitle + ' - 游戏已结束');
			
			clearInterval(this.timer);
		},
		pauseGame: function() {
			if(!this.isStarted || this.isPaused) {
				return;
			}
			
			this.isPaused = true;
			
			this.titleElem.text(this.strTitle + ' - 暂停游戏');
			
			clearInterval(this.timer);
		},
		continueGame: function() {
			if(!this.isStarted || !this.isPaused) {
				return;
			}
			
			this.isPaused = false;
			
			this.titleElem.text(this.strTitle + ' - 游戏中...');
			
			var self = this;
			this.timer =  setInterval(function(){
				self.downMove();
			}, this.interval);
		},
		rotate: function() {
			if(this.mainShapeIndex in $.tetrisGlobalOptions.isCannotRotateShapeObject) {
				return;
			}
			this.rotateShape(this.mainTempShape, this.mainShape, 1);
			if(!this.isMoveable(this.mainX, this.mainY, this.mainTempShape)) {
				return;
			}
			this.rotateShape(this.mainShape, this.mainTempShape, 0);
			
			this.renderMainShape();
		},
		leftMove: function() {
			if(!this.isMoveable(this.mainX-1, this.mainY, this.mainShape, true)) {
				return;
			}
			this.cleanMainShape();
			this.mainX--;
			this.renderMainShape();
		},
		rightMove: function() {
			if(!this.isMoveable(this.mainX+1, this.mainY, this.mainShape, true)) {
				return;
			}
			this.cleanMainShape();
			this.mainX++;
			this.renderMainShape();
		},
		downMove: function() {
			if(this.mainShapeIndex == 9) {
				var y,flag=true;
				for(y=this.mainElems.length-1; y>Math.max(this.mainY, -1); y--) {
					if(!this.isBlockRecords[y][this.mainX]) {
						flag = false;
						break;
					}
				}
				if(flag) {
					this.saveRecordAndNextShape();

					return;
				}
			} else if(!this.isMoveable(this.mainX, this.mainY+1, this.mainShape)) {
				this.saveRecordAndNextShape();

				return;
			}
			this.cleanMainShape();
			this.mainY++;
			this.renderMainShape();
		},
		fall: function() {
			this.cleanMainShape();

			if(this.mainShapeIndex == 9) {
				var y;
				for(y=this.mainElems.length-1; y>Math.max(this.mainY, -1); y--) {
					if(!this.isBlockRecords[y][this.mainX]) {
						this.mainY = y;
						break;
					}
				}
			} else {
				while(this.isMoveable(this.mainX, this.mainY+1, this.mainShape)) {
					this.mainY++;
				}
			}

			this.renderMainShape();
			this.saveRecordAndNextShape();
		},
		saveRecordAndNextShape: function() {
			var xx, x, y, flag, stack = [];

			for(y=this.mainY; y<this.mainY+4; y++) {
				for(x=this.mainX; x<this.mainX+4; x++) {
					if(this.mainElems[y] && this.mainElems[y][x]) {
						this.isBlockRecords[y][x] |= this.mainShape[y-this.mainY][x-this.mainX];

						if(this.isBlockRecords[y][x]) {
							flag = true;
							for(xx=0; xx<this.isBlockRecords[y].length; xx++) {
								if(!this.isBlockRecords[y][xx]) {
									flag = false;
								}
							}

							if(flag) {
								stack.push(y);
							}
						}
					} else if(this.mainShape[y-this.mainY][x-this.mainX]) {
						this.stopGame();
						return;
					}
				}
			}

			if(stack.length) {
				this.scoreNum += stack.length*2 - 1;
				this.lineNum += stack.length;

				this.scoreElem.text(this.scoreNum);
				this.lineElem.text(this.lineNum);

				var i = stack.length - 1;
				var moves = 1;

				this.interval = Math.max(1000-this.lineNum*9/8, 100);

				clearInterval(this.timer);
			
				var self = this;
				this.timer =  setInterval(function(){
					self.downMove();
				}, this.interval);

				y = stack[i];
				do {
					while(i && y-moves == stack[i-1]) {
						i--;
						moves++;
					}

					for(x=0; x<this.isBlockRecords[y].length; x++) {
						if(y-moves < 0) {
							this.isBlockRecords[y][x] = 0;
						} else {
							this.isBlockRecords[y][x] = this.isBlockRecords[y-moves][x];
						}

						if(this.isBlockRecords[y][x]) {
							this.setStyle(this.mainElems[y][x], this.mainElems[y-moves][x].css('backgroundColor'), this.mainElems[y-moves][x].css('borderColor'));
						} else {
							this.removeStyle(this.mainElems[y][x]);
						}
					}

					y--;
				} while(y>=0);
			}

			this.mainBackgroundColor = this.nextBackgroundColor;
			this.mainBorderColor = this.nextBorderColor;
			this.mainShapeIndex = this.nextShapeIndex;
			this.rotateShape(this.mainShape, this.nextShape, 0);
			this.makeXY();

			if(!this.isMoveable(this.mainX, this.mainY+1, this.mainShape)) {
				this.stopGame();
				return;
			}
			
			this.renderNextShape();
		},
		makeXY: function() {
			var x, y, minX = 3, maxX = 0, Y;
			
			for(y=3; y>=0; y--) {
				for(x=0; x<4; x++) {
					if(this.mainShape[y][x]) {
						if(isNaN(Y)) {
							Y = y;
						}

						minX = Math.min(minX, x);
						maxX = Math.max(maxX, x);
					}
				}
			}

			this.mainX = Math.floor(this.mainElems[0].length/2) - Math.ceil((minX+maxX+1)/2);
			this.mainY = -Y-1;
		},
		isMoveable: function(X, Y, shape, flag) {
			var x, y;
			for(y=Y; y<Y+4; y++) {
				for(x=X; x<X+4; x++) {
					if(shape[y-Y][x-X] && ((flag && y<0 && !this.mainElems[0][x]) || y>=0) && (!this.mainElems[y] || !this.mainElems[y][x] || this.isBlockRecords[y][x])) {
						return false;
					}
				}
			}

			return true;
		},
		cleanMainShape: function() {
			var x, y;
			for(y=this.mainY; y<this.mainY+4; y++) {
				for(x=this.mainX; x<this.mainX+4; x++) {
					if(this.mainElems[y] && this.mainElems[y][x] && !this.isBlockRecords[y][x]) {
						this.removeStyle(this.mainElems[y][x]);
					}
				}
			}
		},
		renderMainShape: function() {
			var x, y;
			for(y=this.mainY; y<this.mainY+4; y++) {
				for(x=this.mainX; x<this.mainX+4; x++) {
					if(this.mainElems[y] && this.mainElems[y][x]) {
						if(this.isBlockRecords[y][x]) {
							// 已有方块不清除
						} else if(this.mainShape[y-this.mainY][x-this.mainX]) {
							this.setStyle(this.mainElems[y][x], this.mainBackgroundColor, this.mainBorderColor);
						} else {
							this.removeStyle(this.mainElems[y][x]);
						}
					}
				}
			}
		},
		renderNextShape: function() {
			var color = this.randColor();
			
			this.nextBackgroundColor = color.backgroundColor;
			this.nextBorderColor = color.borderColor;
			
			this.nextShapeIndex = this.randInt($.tetrisGlobalOptions.shapes.length);
			this.rotateShape(this.nextShape, $.tetrisGlobalOptions.shapes[this.nextShapeIndex], (this.nextShapeIndex in $.tetrisGlobalOptions.isCannotRotateShapeObject) ? 0 : this.randInt(4));
			
			var x, y;
			
			for(y=0; y<4; y++) {
				for(x=0; x<4; x++) {
					if(this.nextShape[y][x]) {
						this.setStyle(this.nextElems[y][x], this.nextBackgroundColor, this.nextBorderColor);
					} else {
						this.removeStyle(this.nextElems[y][x]);
					}
				}
			}
		},
		rotateShape: function(dstShape, srcShape, grade) {
			var x, y;

			switch(grade%4) {
				case 1:
					for(y=0; y<4; y++) {
						for(x=0; x<4; x++) {
							dstShape[x][3-y] = srcShape[y][x];
						}
					}
					break;
				case 2:
					for(y=0; y<4; y++) {
						for(x=0; x<4; x++) {
							dstShape[3-y][3-x] = srcShape[y][x];
						}
					}
					break;
				case 3:
					for(y=0; y<4; y++) {
						for(x=0; x<4; x++) {
							dstShape[3-x][y] = srcShape[y][x];
						}
					}
					break;
				default:
					for(y=0; y<4; y++) {
						for(x=0; x<4; x++) {
							dstShape[y][x] = srcShape[y][x];
						}
					}
					return;
			}

			if(dstShape[0][0]) {
				return;
			}

			var arrX = $.initArray([4], 0), arrY = $.initArray([4], 0);
			for(y=0; y<4; y++) {
				for(x=0; x<4; x++) {
					arrX[x] |= dstShape[y][x];
					arrY[y] |= dstShape[y][x];
				}
			}

			//console.log(this.strTitle + '\n===================\n' + this.array2string(dstShape) + '\n-------------------\narrX = ' + arrX.join(',') + '\narrY = ' + arrY.join(','));

			var sX = 0;
			for(x=0; x<4; x++) {
				if(arrX[x]) {
					break;
				}
				sX++;
			}
			var sY = 0;
			for(y=0; y<4; y++) {
				if(arrY[y]) {
					break;
				}
				sY++;
			}
			if(sX == 0 && sY == 0) {
				return;
			}
			for(y=0; y<4; y++) {
				for(x=0; x<4; x++) {
					dstShape[y][x] = (y+sY < 4 && x+sX < 4 ? dstShape[y+sY][x+sX] : 0);
				}
			}
		},
		randColor: function() {
			var r = this.randInt($.tetrisGlobalOptions.colors.length-2)+1;
			var g = this.randInt($.tetrisGlobalOptions.colors.length-2)+1;
			var b = this.randInt($.tetrisGlobalOptions.colors.length-2)+1;
			var leftTopColor = '#' + $.tetrisGlobalOptions.colors[r+1] + $.tetrisGlobalOptions.colors[g+1] + $.tetrisGlobalOptions.colors[b+1];
			var rightBottomColor = '#' + $.tetrisGlobalOptions.colors[r-1] + $.tetrisGlobalOptions.colors[g-1] + $.tetrisGlobalOptions.colors[b-1];
			
			return {
				backgroundColor: '#' + $.tetrisGlobalOptions.colors[r] + $.tetrisGlobalOptions.colors[g] + $.tetrisGlobalOptions.colors[b],
				borderColor: leftTopColor + ' ' + rightBottomColor + ' ' + rightBottomColor + ' ' + leftTopColor
			};
		},
		randInt: function(maxValue) {
			return Math.floor(Math.random()*maxValue);
		},
		setStyle: function(elem, bgColor, borderColor) {
			elem.addClass('g-tetris-block-color').css({
				backgroundColor: bgColor,
				borderColor: borderColor
			});
		},
		removeStyle: function(elem) {
			var css=elem.position();
			
			elem.removeClass('g-tetris-block-color').removeAttr('style').css(css);
		},
		log: function() {
			console.log(this.strTitle + '\n===================\n' + this.array2string(this.isBlockRecords));
		},
		array2string: function(arr2) {
			return $.map(arr2, function(v){return v.join(',');}).join('\n');
		}
	};
})(jQuery);
