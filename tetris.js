/*
 * 俄罗斯方块
 * 
 * @author 张宝财 <talent518@yeah.net>
 * @copyright 张宝财 <talent518@yeah.net>
 */

(function($) {
	var tetrisCount = 1;

	if($.browser.msie && $.browser.version <'8.0') {
		$.fn.tetrisShape = function() {};
		$.fn.tetris = function() {};
		alert('俄罗斯方块 IE <= 7.0 以下浏览器不支持，当前版本是：' + $.browser.version);
		return;
	}

	Array.prototype.flip = function() {
		var obj = {};

		$.each(this, function(k, v) {
			obj[v] = k;
		});

		return obj;
	};

	$.keyCodes = {
		// 字母和数字键的键码值(keyCode)
		48: 0,
		49: 1,
		50: 2,
		51: 3,
		52: 4,
		53: 5,
		54: 6,
		55: 7,
		56: 8,
		57: 9,
		65: 'A',
		66: 'B',
		67: 'C',
		68: 'D',
		69: 'E',
		70: 'F',
		71: 'G',
		72: 'H',
		73: 'I',
		74: 'J',
		75: 'K',
		76: 'L',
		77: 'M',
		78: 'N',
		79: 'O',
		80: 'P',
		81: 'Q',
		82: 'R',
		83: 'S',
		84: 'T',
		85: 'U',
		86: 'V',
		87: 'W',
		88: 'X',
		89: 'Y',
		90: 'Z',
		
		// 数字键盘上的键的键码值(keyCode)
		96: 0,
		97: 1,
		98: 2,
		99: 3,
		100: 4,
		101: 5,
		102: 6,
		103: 7,
		104: 8,
		105: 9,
		106: '*',
		107: '+',
		108: 'Enter',
		109: '-',
		110: '.',
		111: '/',
		
		// 功能键键码值(keyCode)
		112: 'F1',
		113: 'F2',
		114: 'F3',
		115: 'F4',
		116: 'F5',
		117: 'F6',
		118: 'F7',
		119: 'F8',
		120: 'F9',
		121: 'F10',
		122: 'F11',
		123: 'F12',
		
		// 控制键键码值(keyCode)
		8: 'Backspace',
		9: 'Tab',
		12: 'Clear',
		13: 'Enter',
		16: 'Shift',
		17: 'Ctrl',
		18: 'Alt',
		20: 'Cape Lock',
		27: 'Esc',
		32: 'Spacebar',
		33: 'Page Up',
		34: 'Page Down',
		35: 'End',
		36: 'Home',
		37: 'Left Arrow',
		38: 'Up Arrow',
		39: 'Right Arrow',
		40: 'Down Arrow',
		45: 'Insert',
		46: 'Delete',
		144: 'Num Lock',
		186: ': ;',
		187: '+ =',
		188: ', <',
		189: '- _',
		190: '. >',
		192: '/ ?',
		192: '` ~',
		219: '[ {',
		220: '\\ |',
		221: '] }',
		222: '\' "',
		
		// 多媒体键码值(keyCode)
		170: '搜索',
		171: '收藏',
		172: '浏览器',
		173: '静音',
		174: '音量减',
		175: '音量加',
		179: '停止',
		180: '邮件'
	};
	
	function delaySetStyle(elem, backgroundColor, borderColor, interval) {
		var self = this;
		
		setTimeout(function() {
			self.setStyle(elem, backgroundColor, borderColor);
		}, interval);
	};
	
	function delayRemoveStyle(elem, interval) {
		var self = this;
		
		setTimeout(function() {
			self.removeStyle(elem);
		}, interval);
	};
	
	$.tetrisGlobalOptions = {
		width: 25,
		height: 25,
		colors: ['00', '33', '66', '99', 'cc', 'ff'],
		startKey: 116, // 开始 F5
		stopKey: 115, // 结束 F4
		pauseKey: 117, // 暂停 F6
		continueKey: 118, // 继续 F7
		isCannotRotateShapeObject: [0, 3, 10, 16, 38].flip(),
		shapeDownCallback: {
			3: function() {
				var x, y, self = this;
				
				for(y=this.mainY; y<=this.mainY+5; y++) {
					for(x=this.mainX-2; x<=this.mainX+2; x++) {
						if(this.mainElems[y] && this.mainElems[y][x]) {
							this.isBlockRecords[y][x] = 0;
							
							delayRemoveStyle.call(this, this.mainElems[y][x], Math.max(Math.abs(this.mainY+5-y),Math.abs(x-this.mainX))*100);
						}
					}
				}
			},
			38: function() {
				var x, y;
				
				for(y=this.mainY; y<this.mainY+4; y++) {
					for(x=this.mainX; x<this.mainX+4; x++) {
						if(this.mainElems[y] && this.mainElems[y][x]) {
							this.isBlockRecords[y][x] = 0;
							
							delayRemoveStyle.call(this, this.mainElems[y][x], Math.max(Math.abs(this.mainY+3-y),Math.abs(x-this.mainX-1))*100);
						}
					}
				}
			}
		},
		crossCorePointIndex: 0,
		shapes: [
			[
				[1, 0, 0, 0],
				[0, 0, 0, 0],
				[0, 0, 0, 0],
				[0, 0, 0, 0]
			],
			[
				[1, 0, 0, 0],
				[1, 0, 0, 0],
				[0, 0, 0, 0],
				[0, 0, 0, 0]
			],
			[
				[1, 0, 0, 0],
				[0, 1, 0, 0],
				[0, 0, 0, 0],
				[0, 0, 0, 0]
			],
			[
				[1, 0, 0, 0],
				[0, 0, 0, 0],
				[1, 0, 0, 0],
				[1, 0, 0, 0]
			],
			[
				[1, 0, 0, 0],
				[1, 0, 0, 0],
				[1, 0, 0, 0],
				[0, 0, 0, 0]
			],
			[
				[1, 1, 0, 0],
				[1, 0, 0, 0],
				[0, 0, 0, 0],
				[0, 0, 0, 0]
			],
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
				[0, 1, 0, 0],
				[1, 1, 0, 0],
				[1, 0, 0, 0],
				[0, 0, 0, 0]
			],
			[
				[1, 0, 0, 0],
				[1, 1, 0, 0],
				[0, 1, 0, 0],
				[0, 0, 0, 0]
			],
			[
				[1, 1, 1, 0],
				[1, 0, 0, 0],
				[1, 0, 0, 0],
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
				[0, 1, 0, 0],
				[1, 1, 1, 0],
				[0, 1, 0, 0],
				[0, 0, 0, 0]
			],
			[
				[1, 0, 0, 0],
				[1, 0, 0, 0],
				[1, 1, 0, 0],
				[1, 0, 0, 0]
			],
			[
				[0, 1, 0, 0],
				[0, 1, 0, 0],
				[1, 1, 0, 0],
				[0, 1, 0, 0]
			],
			[
				[0, 1, 0, 0],
				[1, 1, 0, 0],
				[0, 1, 1, 0],
				[0, 0, 0, 0]
			],
			[
				[0, 1, 0, 0],
				[0, 1, 1, 0],
				[1, 1, 0, 0],
				[0, 0, 0, 0]
			],
			[
				[0, 1, 0, 0],
				[0, 1, 0, 0],
				[1, 1, 1, 0],
				[0, 0, 0, 0]
			],
			[
				[0, 1, 0, 0],
				[0, 1, 0, 0],
				[1, 1, 0, 0],
				[1, 0, 0, 0]
			],
			[
				[1, 0, 0, 0],
				[1, 0, 0, 0],
				[1, 1, 0, 0],
				[0, 1, 0, 0]
			],
			[
				[1, 1, 0, 0],
				[1, 1, 0, 0],
				[1, 0, 0, 0],
				[0, 0, 0, 0]
			],
			[
				[1, 1, 0, 0],
				[1, 1, 0, 0],
				[0, 1, 0, 0],
				[0, 0, 0, 0]
			],
			[
				[0, 1, 1, 0],
				[1, 1, 0, 0],
				[1, 0, 0, 0],
				[0, 0, 0, 0]
			],
			[
				[1, 0, 1, 0],
				[1, 1, 1, 0],
				[0, 0, 0, 0],
				[0, 0, 0, 0]
			],
			[
				[1, 0, 1, 0],
				[1, 1, 1, 0],
				[0, 1, 0, 0],
				[0, 0, 0, 0]
			],
			[
				[1, 0, 1, 0],
				[1, 1, 1, 0],
				[1, 0, 0, 0],
				[0, 0, 0, 0]
			],
			[
				[1, 0, 1, 0],
				[1, 1, 1, 0],
				[0, 0, 1, 0],
				[0, 0, 0, 0]
			],
			[
				[1, 1, 0, 0],
				[1, 1, 0, 0],
				[1, 0, 0, 0],
				[1, 0, 0, 0]
			],
			[
				[1, 0, 0, 0],
				[1, 1, 0, 0],
				[1, 1, 0, 0],
				[1, 0, 0, 0]
			],
			[
				[1, 0, 0, 0],
				[1, 0, 0, 0],
				[1, 1, 0, 0],
				[1, 1, 0, 0]
			],
			[
				[1, 1, 0, 0],
				[1, 0, 0, 0],
				[1, 1, 0, 0],
				[1, 0, 0, 0]
			],
			[
				[1, 1, 0, 0],
				[0, 1, 0, 0],
				[1, 1, 0, 0],
				[0, 1, 0, 0]
			],
			[
				[1, 1, 0, 0],
				[1, 0, 0, 0],
				[1, 0, 0, 0],
				[1, 1, 0, 0]
			],
			[
				[0, 1, 0, 0],
				[1, 1, 0, 0],
				[1, 1, 0, 0],
				[1, 0, 0, 0]
			],
			[
				[0, 1, 1, 0],
				[0, 1, 1, 0],
				[1, 0, 0, 1],
				[0, 0, 0, 0]
			],
			[
				[1, 1, 1, 0],
				[1, 1, 0, 0],
				[1, 0, 0, 0],
				[0, 0, 0, 0]
			]
		],
		usableShapeIndexes: [],
		columnNum: 8
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

	$.fn.tetrisShape = function(container, tetrisOptions) {
		var self = this;
		var rows = Math.ceil($.tetrisGlobalOptions.shapes.length/$.tetrisGlobalOptions.columnNum);

		$(this).addClass('g-tetris-shape').height(rows * 4 * $.tetrisGlobalOptions.height - 1);

		var titleElem = $('<div class="g-tetris-title g-tetris-gradient"></div>').text('俄罗斯方块 - ' + $.tetrisGlobalOptions.shapes.length + ' 个形状').appendTo(this);
		var globalKeyTextCall = function() {
			var h = self.height();
			var textBoxElem = $('<div class="g-tetris-text-box"></div>').appendTo(self);
			$('<p><label>开始键</label><span class="g-key"></span></p>').appendTo(textBoxElem).find('span').text($.keyCodes[$.tetrisGlobalOptions.startKey]);
			$('<p><label>结束键</label><span class="g-key"></span></p>').appendTo(textBoxElem).find('span').text($.keyCodes[$.tetrisGlobalOptions.stopKey]);
			$('<p><label>暂停键</label><span class="g-key"></span></p>').appendTo(textBoxElem).find('span').text($.keyCodes[$.tetrisGlobalOptions.pauseKey]);
			$('<p><label>继续键</label><span class="g-key"></span></p>').appendTo(textBoxElem).find('span').text($.keyCodes[$.tetrisGlobalOptions.continueKey]);

			textBoxElem.css('padding', Math.floor((self.height()-textBoxElem.height())/2) + 'px 0px');
			$('.g-key', textBoxElem).each(function() {
				$(this).attr('title', $(this).text());
			});
		};
		var timerShapeElem = $('<div class="g-tetris-shape-box g-tetris-shape-box-timer"></div>').appendTo(self);
		var timerShape = $.initArray([4,4], 0);
		var timerShapeIndex = 0;
		var timerShapeElems = $.initArray([4,4], function(y, x) {
			return $('<div class="g-tetris-block"></div>').attr({
				x: x,
				y: y
			}).css({
				left: x * $.tetrisGlobalOptions.width,
				top: y * $.tetrisGlobalOptions.height
			}).appendTo(timerShapeElem);
		});
		var timer = setInterval(function() {
			var x, y;
			var color = $.tetris.prototype.randColor();
			if(timerShapeIndex == $.tetrisGlobalOptions.shapes.length) {
				timerShapeIndex = 0;
			}
			$.tetris.prototype.rotateShape(timerShape, $.tetrisGlobalOptions.shapes[timerShapeIndex], (timerShapeIndex in $.tetrisGlobalOptions.isCannotRotateShapeObject) ? 0 : $.tetris.prototype.randInt(4));
			timerShapeIndex++;
			for(y=0; y<4; y++) {
				for(x=0; x<4; x++) {
					if(timerShape[y][x]) {
						$.tetris.prototype.setStyle(timerShapeElems[y][x], color.backgroundColor, color.borderColor);
					} else {
						$.tetris.prototype.removeStyle(timerShapeElems[y][x]);
					}
				}
			}
		}, 500);

		$('<span class="g-tetris-shape-setting">设置</span>').prependTo(titleElem).click(function() {
			$(this).remove();

			var dialogElem = $('<div class="g-tetris-setting-dialog"><div class="g-tetris-title g-tetris-gradient">游戏设置</div></div>').appendTo(document.body);
			var dialogTitleElem = $('.g-tetris-title', dialogElem);
			var scrollElem = $('<div class="g-tetris-setting-dialog-scroll"></div>').appendTo(dialogElem);

			$(
				'<div class="g-tetris-global-setting">' + 
					'<div class="g-tetris-title g-tetris-gradient g-tetris-form-title">全局</div>' +
					'<div class="g-tetris-form-row">' +
						'<label class="g-tetris-form-label">开始键：</label>' +
						'<div class="g-tetris-form-field"><input class="g-press-key-input" name="global[startKey]" type="text" value="' + $.tetrisGlobalOptions.startKey + '"/></div>' +
					'</div>' +
					'<div class="g-tetris-form-row">' +
						'<label class="g-tetris-form-label">结束键：</label>' +
						'<div class="g-tetris-form-field"><input class="g-press-key-input" name="global[stopKey]" type="text" value="' + $.tetrisGlobalOptions.stopKey + '"/></div>' +
					'</div>' +
					'<div class="g-tetris-form-row">' +
						'<label class="g-tetris-form-label">暂停键：</label>' +
						'<div class="g-tetris-form-field"><input class="g-press-key-input" name="global[pauseKey]" type="text" value="' + $.tetrisGlobalOptions.pauseKey + '"/></div>' +
					'</div>' +
					'<div class="g-tetris-form-row">' +
						'<label class="g-tetris-form-label">继续键：</label>' +
						'<div class="g-tetris-form-field"><input class="g-press-key-input" name="global[continueKey]" type="text" value="' + $.tetrisGlobalOptions.continueKey + '"/></div>' +
					'</div>' +
				'</div>'
			).appendTo(scrollElem);

			$(
				'<div class="g-tetris-player-setting">' + 
					'<div class="g-tetris-title g-tetris-gradient g-tetris-form-title">玩家1</div>' +
					'<div class="g-tetris-form-row">' +
						'<label class="g-tetris-form-label">左移键：</label>' +
						'<div class="g-tetris-form-field"><input class="g-press-key-input" name="players[0][leftMoveKey]" type="text" value="' + $.tetris.prototype.options.leftMoveKey + '"/></div>' +
					'</div>' +
					'<div class="g-tetris-form-row">' +
						'<label class="g-tetris-form-label">右移键：</label>' +
						'<div class="g-tetris-form-field"><input class="g-press-key-input" name="players[0][rightMoveKey]" type="text" value="' + $.tetris.prototype.options.rightMoveKey + '"/></div>' +
					'</div>' +
					'<div class="g-tetris-form-row">' +
						'<label class="g-tetris-form-label">变形键：</label>' +
						'<div class="g-tetris-form-field"><input class="g-press-key-input" name="players[0][rotateKey]" type="text" value="' + $.tetris.prototype.options.rotateKey + '"/></div>' +
					'</div>' +
					'<div class="g-tetris-form-row">' +
						'<label class="g-tetris-form-label">下移键：</label>' +
						'<div class="g-tetris-form-field"><input class="g-press-key-input" name="players[0][downMoveKey]" type="text" value="' + $.tetris.prototype.options.downMoveKey + '"/></div>' +
					'</div>' +
					'<div class="g-tetris-form-row">' +
						'<label class="g-tetris-form-label">落下键：</label>' +
						'<div class="g-tetris-form-field"><input class="g-press-key-input" name="players[0][fallKey]" type="text" value="' + $.tetris.prototype.options.fallKey + '"/></div>' +
					'</div>' +
				'</div>'
			).appendTo(scrollElem);

			$('<span class="g-tetris-button-start-game">开始</span>').prependTo(dialogTitleElem).click(function() {
				var flag = false;
				var options = {
					global: {},
					players: []
				};

				$('input.g-press-key-input', scrollElem).each(function() {
					var keyCode = parseInt($(this).attr('keyCode'));
					var iptElem = $('input.g-press-key-input[keyCode="' + keyCode + '"]', scrollElem).not(this);

					if(iptElem.size()) {
						iptElem.focus();
						flag = true;
						return false;
					} else {
						var matches = $(this).attr('name').replace(/\]/gm, '').split('[');
						if(matches[0] == 'global') {
							options.global[matches[1]] = keyCode;
						} else if(matches[0] == 'players') {
							if(!options.players[matches[1]]) {
								options.players[matches[1]] = {};
							}

							options.players[matches[1]][matches[2]] = keyCode;
						}
					}
				});

				//console.log(options);

				if(flag) {
					return;
				}

				$.extend($.tetrisGlobalOptions, options.global);

				$('.g-tetris-text-box', self).remove();

				globalKeyTextCall();

				$('.g-tetris-shape-checkbox', self).each(function(i) {
					if($(this).is('.g-tetris-shape-checked')) {
						$.tetrisGlobalOptions.usableShapeIndexes.push(i);
					}
				});

				$.each(options.players, function(k,v) {
					$('<div></div>').appendTo(container).tetris($.extend(true, {}, tetrisOptions, v));
				});

				clearInterval(timer);

				dialogElem.remove();
				self.remove();
			});

			$('input.g-press-key-input', scrollElem).each(function() {
				$(this).attr('keyCode', $(this).val());
				$(this).val($.keyCodes[$(this).val()]);
			}).bind('keydown.tetris', function(e) {
				if(typeof($.keyCodes[e.keyCode]) != 'undefined') {
					$(this).attr('keyCode', e.keyCode).val($.keyCodes[e.keyCode]);
				} else {
					alert('未知的 keyCode ' + e.keyCode + '！');
				}

				return false;
			});

			var players = 0;
			var deleteElem = $('<span class="g-tetris-button-delete-player">删除玩家</span>').hide().prependTo(dialogTitleElem).click(function() {
				players--;
				$('.g-tetris-player-setting:last', scrollElem).remove();
				if(players) {
					deleteElem.show();
				} else {
					deleteElem.hide();
				}
			});
			$('<span class="g-tetris-button-add-player">添加玩家</span>').insertAfter(deleteElem).click(function() {
				players++;

				var playerSettingElem = $('.g-tetris-player-setting:first', scrollElem).clone(true).appendTo(scrollElem);

				$('.g-tetris-form-title', playerSettingElem).html('玩家' + (players+1));

				$('input.g-press-key-input', playerSettingElem).each(function() {
					$(this).attr('name', $(this).attr('name').replace('players[0]', 'players[' + players + ']'));
				});

				deleteElem.show();
			});
		});

		var shapeMaps = {};
		$.each($.tetrisGlobalOptions.shapes, function(k,shape) {
			var X = k % $.tetrisGlobalOptions.columnNum, Y = Math.floor(k / $.tetrisGlobalOptions.columnNum);
			var color = $.tetris.prototype.randColor();
			var css = {
				left: X * 4 * $.tetrisGlobalOptions.width,
				top: Y * 4 * $.tetrisGlobalOptions.height
			};
			var shapeElem = $('<div class="g-tetris-shape-box"></div>').css(css).appendTo(self);

			str = $.tetris.prototype.array2string(shape);
			if(shapeMaps[str]) {
				console.log('重复形状(' + (k+1) + ')\n==================\n' + str);
			} else {
				shapeMaps[str] = true;
			}

			$('<div class="g-tetris-shape-checkbox g-tetris-shape-checked">√</div>').css(css).appendTo(self).click(function() {
				$(this).toggleClass('g-tetris-shape-checked');
			});
			
			var x, y;
			for(y=0; y<4; y++) {
				for(x=0; x<4; x++) {
					var blockElem = $('<div class="g-tetris-block"></div>').css({
						left: x * $.tetrisGlobalOptions.width,
						top: y * $.tetrisGlobalOptions.height
					}).appendTo(shapeElem);

					if(shape[y][x]) {
						$.tetris.prototype.setStyle(blockElem, color.backgroundColor, color.borderColor);
					} else {
						$.tetris.prototype.removeStyle(blockElem);
					}

					if(y == 3 && x == 3) {
						blockElem.text(k+1);
					}
				}
			}
		});

		globalKeyTextCall();
	};
	
	$.fn.tetris = function(options) {
		var args = [];
		var i;
		for(i=1; i<arguments.length; i++) {
			args.push(arguments[i]);
		}

		if($.tetrisGlobalOptions.usableShapeIndexes.length == 0) {
			for(i in $.tetrisGlobalOptions.shapes) {
				$.tetrisGlobalOptions.usableShapeIndexes.push(i);
			}
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
						if($.isPlainObject(tetris.options[args[0]])) { // $().tetris('options', 'optionName', {})
							$.extend(true, tetris.options[args[0]], args[1]);
						} else { // $().tetris('options', 'eventName', function() {})
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

	$.tetris = function(elem, options) {
		this.elem = $(elem);
		this.options = $.extend(true, {}, this.options, options);
		this.init();
	};
	$.tetris.prototype = {
		options: { // 可设置选项
			beforeInit: function() {}, // 初始化前事件
			afterInit: function() {}, // 初始化后事件
			beforeScore: function(scores, lines) {}, // 得分前事件
			afterScore: function(scores, lines) {}, // 得分后事件
			beforeSave: function() {}, // 保存前事件
			afterSave: function(stack) {}, // 保存后事件
			shapeDownCallback: function(shapeIndex, isFall) {}, // 形状下落事件

			leftMoveKey: 37, // 左移
			rightMoveKey: 39, // 右移
			rotateKey: 38, // 变形
			downMoveKey: 40, // 下移
			fallKey: 32 // 落下
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
					case self.options.rotateKey:
						self.rotate();
						break;
					case self.options.leftMoveKey:
						self.leftMove();
						break;
					case self.options.rightMoveKey:
						self.rightMove();
						break;
					case self.options.downMoveKey:
						self.downMove();
						break;
					case self.options.fallKey:
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
			this.scoreElem = $('<p><label>得分</label><span class="g-num">0</span></p>').appendTo(this.textBox).find('span');
			this.lineElem = $('<p><label>行数</label><span class="g-num">0</span></p>').appendTo(this.textBox).find('span');

			var keyBoxElem = $('<div class="g-key-box"></div>').appendTo(this.textBox);

			$('<p><label>左移键</label><span class="g-key"></span></p>').appendTo(keyBoxElem).find('span').text($.keyCodes[this.options.leftMoveKey]);
			$('<p><label>右移键</label><span class="g-key"></span></p>').appendTo(keyBoxElem).find('span').text($.keyCodes[this.options.rightMoveKey]);
			$('<p><label>变形键</label><span class="g-key"></span></p>').appendTo(keyBoxElem).find('span').text($.keyCodes[this.options.rotateKey]);
			$('<p><label>下移键</label><span class="g-key"></span></p>').appendTo(keyBoxElem).find('span').text($.keyCodes[this.options.downMoveKey]);
			$('<p><label>落下键</label><span class="g-key"></span></p>').appendTo(keyBoxElem).find('span').text($.keyCodes[this.options.fallKey]);

			$('.g-key', keyBoxElem).each(function() {
				$(this).attr('title', $(this).text());
			});
			
			this.mainElems = $.initArray([18,10], function(y, x) {
				return $('<div class="g-tetris-block"></div>').attr({
					x: x,
					y: y
				}).css({
					left: x * $.tetrisGlobalOptions.width,
					top: y * $.tetrisGlobalOptions.height
				}).appendTo(self.mainBox);
			});
			this.nextElems = $.initArray([4,4], function(y, x) {
				return $('<div class="g-tetris-block"></div>').attr({
					x: x,
					y: y
				}).css({
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
				$.each(this.mainElems, function() {
					$.each(this, function() {
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
			this.timer =  setInterval(function() {
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
			this.timer =  setInterval(function() {
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
			if(this.mainShapeIndex == $.tetrisGlobalOptions.crossCorePointIndex) {
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
				if(this.mainShapeIndex in $.tetrisGlobalOptions.shapeDownCallback) {
					this.options.shapeDownCallback.call(this, this.mainShapeIndex, false);
					
					if($.tetrisGlobalOptions.shapeDownCallback[this.mainShapeIndex].call(this) == false) {
						return;
					}

					this.mainBackgroundColor = this.nextBackgroundColor;
					this.mainBorderColor = this.nextBorderColor;
					this.mainShapeIndex = this.nextShapeIndex;
					this.rotateShape(this.mainShape, this.nextShape, 0);
					this.makeXY();

					this.renderNextShape();
				} else {
					this.saveRecordAndNextShape();
				}

				return;
			}
			this.cleanMainShape();
			this.mainY++;
			this.renderMainShape();
		},
		fall: function() {
			this.cleanMainShape();

			if(this.mainShapeIndex == $.tetrisGlobalOptions.crossCorePointIndex) {
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

			if(this.mainShapeIndex in $.tetrisGlobalOptions.shapeDownCallback) {
				this.options.shapeDownCallback.call(this, this.mainShapeIndex, true);
				
				if($.tetrisGlobalOptions.shapeDownCallback[this.mainShapeIndex].call(this) == false) {
					return;
				}
				
				this.mainBackgroundColor = this.nextBackgroundColor;
				this.mainBorderColor = this.nextBorderColor;
				this.mainShapeIndex = this.nextShapeIndex;
				this.rotateShape(this.mainShape, this.nextShape, 0);
				this.makeXY();

				this.renderNextShape();
			} else {
				this.renderMainShape();
				this.saveRecordAndNextShape();
			}
		},
		saveRecordAndNextShape: function() {
			var x, y, flag, stack = [];
			
			this.options.beforeSave.call(this);

			for(y=this.mainY; y<this.mainY+4; y++) {
				flag = false;
				for(x=this.mainX; x<this.mainX+4; x++) {
					if(this.mainElems[y] && this.mainElems[y][x]) {
						this.isBlockRecords[y][x] |= this.mainShape[y-this.mainY][x-this.mainX];

						if(this.isBlockRecords[y][x]) {
							flag = true;
						}
					} else if(this.mainShape[y-this.mainY][x-this.mainX]) {
						this.stopGame();
						return;
					}
				}

				if(flag) {
					for(x=0; x<this.isBlockRecords[y].length; x++) {
						if(!this.isBlockRecords[y][x]) {
							flag = false;
						}
					}

					if(flag) {
						stack.push(y);
					}
				}
			}
			this.options.afterSave.call(this, stack);

			if(stack.length) {
				this.options.beforeScore.call(this, stack.length*2 - 1, stack.length);
				
				this.scoreNum += stack.length*2 - 1;
				this.lineNum += stack.length;

				this.scoreElem.text(this.scoreNum);
				this.lineElem.text(this.lineNum);

				var i = stack.length - 1;
				var moves = 1;

				this.interval = Math.max(1000-this.lineNum*9/8, 100);

				clearInterval(this.timer);
			
				var self = this;
				this.timer =  setInterval(function() {
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
							delaySetStyle.call(this, this.mainElems[y][x], this.mainElems[y-moves][x].attr('backgroundColor'), this.mainElems[y-moves][x].attr('borderColor'), 200);
						} else {
							delayRemoveStyle.call(this, this.mainElems[y][x], 200);
						}
					}

					y--;
				} while(y>=0);
				
				this.options.afterScore.call(this, stack.length*2 - 1, stack.length);
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
			
			this.nextShapeIndex = $.tetrisGlobalOptions.usableShapeIndexes[this.randInt($.tetrisGlobalOptions.usableShapeIndexes.length)];
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
			elem.addClass('g-tetris-block-color').attr({
				backgroundColor: bgColor,
				borderColor: borderColor
			}).css({
				backgroundColor: bgColor,
				borderColor: borderColor
			});
		},
		removeStyle: function(elem) {
			if(!elem.is('.g-tetris-block-color')) {
				return;
			}

			var css=elem.position();
			
			elem.removeAttr('backgroundColor').removeAttr('borderColor').removeClass('g-tetris-block-color').removeAttr('style').css(css);
		},
		log: function() {
			console.log(this.strTitle + '\n===================\n' + this.array2string(this.isBlockRecords));
		},
		array2string: function(arr2) {
			return $.map(arr2, function(v) {return v.join(',');}).join('\n');
		}
	};
})(jQuery);
