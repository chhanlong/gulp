/**
 * 弹出选择列表插件
 * 此组件依赖 listpcker ，请在页面中先引入 mui.picker.css + mui.picker.js
 * varstion 1.0.1
 * by Houfeng
 * Houfeng@DCloud.io
 */

(function($, document) {

  //创建 DOM
  $.dom = function(str) {
    if (typeof(str) !== 'string') {
      if ((str instanceof Array) || (str[0] && str.length)) {
        return [].slice.call(str);
      } else {
        return [str];
      }
    }
    if (!$._createDomDiv) {
      $._createDomDiv = document.createElement('div');
    }
    $._createDomDiv.innerHTML = str;
    return [].slice.call($._createDomDiv.childNodes);
  };

  //新增mui-wb-title  TODO by lty 20170822
  var panelBuffer = '<div class="mui-poppicker">\
    <div class="mui-poppicker-header">\
      <p class="mui-wb-title">title</p>\
      <button class="mui-btn mui-poppicker-btn-cancel">取消</button>\
      <button class="mui-btn mui-btn-blue mui-poppicker-btn-ok">确定</button>\
      <div class="mui-poppicker-clear"></div>\
    </div>\
    <div class="mui-poppicker-body">\
    </div>\
  </div>';

  var pickerBuffer = '<div class="mui-picker">\
    <div class="mui-picker-inner">\
      <div class="mui-pciker-rule mui-pciker-rule-ft"></div>\
      <ul class="mui-pciker-list">\
      </ul>\
      <div class="mui-pciker-rule mui-pciker-rule-bg"></div>\
    </div>\
  </div>';

  //定义弹出选择器类
  var PopPicker = $.PopPicker = $.Class.extend({
    //构造函数
    init: function(options) {
      var self = this;
      self.options = options || {};
      self.options.wbTitle = self.options.wbTitle;                  //新增wbTitle  TODO by lty 20170822
      self.options.buttons = self.options.buttons || ['取消', '确定'];
      self.panel = $.dom(panelBuffer)[0];
      document.body.appendChild(self.panel);
      self.ok = self.panel.querySelector('.mui-poppicker-btn-ok');
      self.cancel = self.panel.querySelector('.mui-poppicker-btn-cancel');
      self.body = self.panel.querySelector('.mui-poppicker-body');
      self.wbTitle = self.panel.querySelector('.mui-wb-title');     //新增wbTitle  TODO by lty 20170822
      self.mask = $.createMask();
      self.cancel.innerText = self.options.buttons[0];
      self.ok.innerText = self.options.buttons[1];
      self.wbTitle.innerText = self.options.wbTitle;                //新增wbTitle  TODO by lty 20170822
      self.cancel.addEventListener('tap', function(event) {
        self.hide();
      }, false);
      self.ok.addEventListener('tap', function(event) {
        if (self.callback) {
          var rs = self.callback(self.getSelectedItems());
          if (rs !== false) {
            self.hide();
          }
        }
      }, false);
      self.mask[0].addEventListener('tap', function() {
        self.hide();
      }, false);
      self._createPicker();
      //防止滚动穿透
      self.panel.addEventListener($.EVENT_START, function(event) {
        event.preventDefault();
      }, false);
      self.panel.addEventListener($.EVENT_MOVE, function(event) {
        event.preventDefault();
      }, false);
    },
    _createPicker: function() {
      var self = this;
      var layer = self.options.layer || 1;
      var width = (100 / layer) + '%';
      self.pickers = [];
      for (var i = 1; i <= layer; i++) {
        var pickerElement = $.dom(pickerBuffer)[0];
        pickerElement.style.width = width;
        self.body.appendChild(pickerElement);
        var picker = $(pickerElement).picker();
        self.pickers.push(picker);
        pickerElement.addEventListener('change', function(event) {
          var nextPickerElement = this.nextSibling;
          if (nextPickerElement && nextPickerElement.picker) {
            var eventData = event.detail || {};
            var preItem = eventData.item || {};
            nextPickerElement.picker.setItems(preItem.children);
          }
        }, false);
      }
    },
    //填充数据
    setData: function(data) {
      var self = this;
      data = data || [];
      self.pickers[0].setItems(data);
    },
    //获取选中的项（数组）
    getSelectedItems: function() {
      var self = this;
      var items = [];
      for (var i in self.pickers) {
        var picker = self.pickers[i];
        items.push(picker.getSelectedItem() || {});
      }
      return items;
    },
    //显示
    show: function(callback) {
      var self = this;
      self.callback = callback;
      self.mask.show();
      document.body.classList.add($.className('poppicker-active-for-page'));
      self.panel.classList.add($.className('active'));
      //处理物理返回键
      self.__back = $.back;
      $.back = function() {
        self.hide();
      };
    },
    //隐藏
    hide: function() {
      var self = this;
      if (self.disposed) return;
      self.panel.classList.remove($.className('active'));
      self.mask.close();
      document.body.classList.remove($.className('poppicker-active-for-page'));
      //处理物理返回键
      $.back=self.__back;
    },
    dispose: function() {
      var self = this;
      self.hide();
      setTimeout(function() {
        self.panel.parentNode.removeChild(self.panel);
        for (var name in self) {
          self[name] = null;
          delete self[name];
        }
        self.disposed = true;
      }, 300);
    }
  });

})(mui, document);

var _$showCBtn = $(".order-confirm .confirm-lines .pay-type");

/**
 * TODO BY LTY 20170818
 * 获取对象属性的值
 * 主要用于过滤三级联动中，可能出现的最低级的数据不存在的情况，实际开发中需要注意这一点；
 * @param {Object} obj 对象
 * @param {String} param 属性名
 */
//普通示例
/***  一级选择 begin  *****/
//var userPicker = new mui.PopPicker();
//userPicker.setData([{
//  value: 'ywj',
//  text: '董事长 叶文洁'
//}, {
//  value: 'aaa',
//  text: '总经理 艾AA'
//}, {
//  value: 'lj',
//  text: '罗辑'
//}, {
//  value: 'ymt',
//  text: '云天明'
//}, {
//  value: 'shq',
//  text: '史强'
//}, {
//  value: 'zhbh',
//  text: '章北海'
//}, {
//  value: 'zhy',
//  text: '庄颜'
//}, {
//  value: 'gyf',
//  text: '关一帆'
//}, {
//  value: 'zhz',
//  text: '智子'
//}, {
//  value: 'gezh',
//  text: '歌者'
//}]);
//
//userPicker.pickers[0].setSelectedValue('shq', 2000);
//_$showCBtn.click(function(){
//  userPicker.show(function(SelectedItem) {
//    console.log(SelectedItem);
//  });
//});
/***  一级选择 end  *****/

/***  二级选择 begin  *****/
//var cityPicker = new mui.PopPicker({
//  layer: 2
//});
//cityPicker.setData([{
//  value: '110000',
//  text: '北京市',
//  children: [{
//    value: "110101",
//    text: "东城区"
//  }]
//}, {
//  value: '120000',
//  text: '天津市',
//  children: [{
//    value: "120101",
//    text: "和平区"
//  }, {
//    value: "120102",
//    text: "河东区"
//  }, {
//    value: "120104",
//    text: "南开区"
//  }
//  ]
//}]);
//cityPicker.pickers[0].setSelectedIndex(1);
//cityPicker.pickers[1].setSelectedIndex(1);
//_$showCBtn.click(function(){
//  cityPicker.show(function(SelectedItem) {
//    console.log(SelectedItem);
//  });
//});
/***  二级选择 end  *****/

/***  三级选择 begin  *****/
//var cityPicker = new mui.PopPicker({
//  layer: 3,
//  buttons: ['取消','完成'],    //默认是 ["取消", "确定"]
//  wbTitle: "title"
//});
//cityPicker.setData([{
//  value: '110000',
//  text: '北京市',
//  children: [{
//    value: "110101",
//    text: "东城区",
//    children: [{
//      value: "110101",
//      text: "东城区"
//    }, {
//      value: "110102",
//      text: "西城区"
//    }, {
//      value: "110103",
//      text: "崇文区"
//    }, {
//      value: "110113",
//      text: "顺义区"
//    }, {
//      value: "110230",
//      text: "其它区"
//    }]
//  }]
//}, {
//  value: '120000',
//  text: '天津市',
//  children: [{
//    value: "120101",
//    text: "和平区",
//    children: [{
//      value: "110101",
//      text: "东城区",
//      children: [{
//        value: "110101",
//        text: "东城区"
//      }, {
//        value: "110102",
//        text: "西城区"
//      }, {
//        value: "110103",
//        text: "崇文区"
//      }, {
//        value: "110113",
//        text: "顺义区"
//      }, {
//        value: "110230",
//        text: "其它区"
//      }]
//    }]
//  }, {
//    value: "120102",
//    text: "河东区",
//    children: [{
//      value: "110101",
//      text: "东城区",
//      children: [{
//        value: "110101",
//        text: "东城区"
//      }, {
//        value: "110102",
//        text: "西城区"
//      }, {
//        value: "110103",
//        text: "崇文区"
//      }, {
//        value: "110113",
//        text: "顺义区"
//      }, {
//        value: "110230",
//        text: "其它区"
//      }]
//    }]
//  }, {
//    value: "120104",
//    text: "南开区",
//    children: [{
//      value: "110101",
//      text: "东城区",
//      children: [{
//        value: "110101",
//        text: "东城区"
//      }, {
//        value: "110102",
//        text: "西城区"
//      }, {
//        value: "110103",
//        text: "崇文区"
//      }, {
//        value: "110113",
//        text: "顺义区"
//      }, {
//        value: "110230",
//        text: "其它区"
//      }]
//    }]
//  }]
//}]);
////cityPicker.pickers[0].setSelectedIndex(1);
////cityPicker.pickers[1].setSelectedIndex(1);
//_$showCBtn.click(function(){
//  cityPicker.show(function(SelectedItem) {
//    console.log(SelectedItem);
//  });
//});
/***  三级选择 end  *****/