/**
 * jquery 插件
 * 当屏幕滚动的时候，提前加载下一屏的图片
 *
 * 使用方法
 * $("img").wPreLoad( yourOption );
 *
 * options:
 *   srcAttr:(string) - 要替换图片的 src 属性的属性名，默认值 “data-wpl”。当替换之后，改属性名会被删掉
 *   setUrlParam: (Boolean) - 是否将图片的 width height 添加到图片链接中
 *   imgProcessAttr: (String) - 语法约定，会将此字符串转成符合阿里云 x-oss-process 图片处理的语法
 *
 * future:
 *   后续扩展在属性中添加用于描述图片狂傲的字段，在替换 src 属性前为 url 添加参数，
 *   参数传到后端，后端即可根据参数回传不同宽高的图片回到页面。
 *   默认会将 img 对象的 width height 属性添加到图片链接中，变成类似 ?w=220&h=220 的参数，
 *   修改 setUrlParam 为 false 即可不使用此功能
 */


(function( win,$ ){
  $.fn.wPreLoad = function(options) {
    /**
     * 默认配置
     * */
    var _defaultSettings = {
      srcAttr : "data-wpl",
      setUrlParam : true,
      imgProcessAttr : "data-wpps",
      onchange : null
    };
    var _settings;
    var _$imgsArray = [];
    var _winHeight = $(win).height();

    /** 合并用户配置到默认配置 */
    _settings = $.extend( _defaultSettings, options);

    this.each(function(){
      _$imgsArray.push( $(this) );
    });

    /**
     * 设置 url 参数
     * @url (String) - url 格式的字符串
     * @param (String) - 要添加到 url 上的参数
     * @paramVal (String) - 要添加到 url 上的参数的值
     * @return (String) - 添加过参数后完整的 url
     * */
    function _setUrlParam(url, param, paramVal){
      var newAdditionalURL = "";
      var tempArray = url.split("?");
      var baseURL = tempArray[0];
      var additionalURL = tempArray[1];
      var temp = "";
      var i;
      var rowsTxt;
      if (additionalURL) {
        tempArray = additionalURL.split("&");
        for (i=0; i<tempArray.length; i++){
          if(tempArray[i].split('=')[0] != param){
            newAdditionalURL += temp + tempArray[i];
            temp = "&";
          }
        }
      }
      rowsTxt = temp + "" + param + "=" + paramVal;
      return baseURL + "?" + newAdditionalURL + rowsTxt;
    }

    /**
     * 解析图片处理参数
     * @paramStr （String) - 添加到图片的参数，
     * 参数格式类似于：resize:w_100,h_80|blur:r_3|rotate:0|crop:x_100,y_50,w_50,h_100
     *
     * @return (String | Object) - 如果返回的是 String 则认为通过样式来处理图片，如：bucket.aliyuncs.com/sample.jpg@!stylename
     * 如果返回的是 Object，则认为通过参数来处理图片
     */
    function _imgParamParse(paramStr){
      if( !paramStr ){
        return false
      }

      /** 含有 @! 则表示通过样式来处理图片 */
      if( /\@\!/.test(paramStr) ){
        return paramStr;
      }

      var _obj;
      var _key;

      //eg: resize:w_100|rotate:0|crop:x_100,y_50,w_50,h_100|auto-orient
      function __asumbleObj( _str, _keySep, _valueSep ){
        var _o = {};
        var _arr = _str.split( _keySep );
        var _k;
        if( !_valueSep ){
          _o[_arr[0]] = _arr[1];
        } else {
          for( _k in _arr){
            _o[_arr[_k].split(_valueSep)[0]] = _arr[_k].split(_valueSep)[1];
          }
        }
        return _o;
      }

      _obj = __asumbleObj(paramStr, "|", ":");

      for( _key in _obj ){
        /**
         * 只有 key 没有 value 的情况下，手动赋值字符串 "true"
         * 如： //auto-orient|rotate:0
         * */
        if( "undefined" === typeof _obj[_key] ){
          _obj[_key] = "true";
        }

        if( _obj[_key].indexOf(",") > 0 ){
          _obj[_key] = __asumbleObj(_obj[_key], ",", "_");
        } else if( _obj[_key].indexOf("_") > 0 ){
          _obj[_key] = __asumbleObj(_obj[_key], "_");
        }
      }

      return _obj;
    }

    /**
     * 将解析好的对象组合成符合阿里云 oss 的格式
     * @url (String) - 要添加 oss 参数的 url
     * @option (Object) - 图片参数对象
     * @return (String | Boolean) - 完整的符合 阿里云 oss 图片处理格式的 url
     * */
    function _ossAdaptor(url, option){
      var _url = url;

      /** 如果 option 为一个字符串，则认为通过样式来处理图片 */
      if( "string" == typeof option && /\@\!/.test(option) ){
        return _setUrlParam(_url, "x-oss-process", "style") + option;
      }

      /** 如果 option 为一个对象，则认为通过参数来处理图片 */
      if( "object" == typeof option ){
        _url = _setUrlParam(_url, "x-oss-process", "image");
      } else {
        return false;
      }

      /** resize */
      if( option["resize"] ){
        _url += "/resize";
        _url += option["resize"].m ? ",m_" +  option["resize"].m : "";
        _url += option["resize"].w ? ",w_" +  option["resize"].w : "";
        _url += option["resize"].h ? ",h_" +  option["resize"].h : "";
        _url += option["resize"].color ? ",color_" +  option["resize"].color : "";
        _url += option["resize"].limit ? ",limit_" +  option["resize"].limit : "";
      }

      /** circle */
      if( option["circle"] ){
        _url += "/circle";
        _url += option["circle"].r ? ",r_" +  option["circle"].r : "";
      }

      /** crop */
      if( option["crop"] ){
        _url += "/crop";
        _url += option["crop"].w ? ",w_" +  option["crop"].w : "";
        _url += option["crop"].h ? ",h_" +  option["crop"].h : "";
        _url += option["crop"].x ? ",x_" +  option["crop"].x : "";
        _url += option["crop"].y ? ",y_" +  option["crop"].y : "";
        _url += option["crop"].g ? ",g_" +  option["crop"].g : "";
      }

      /** indexcrop */
      if( option["indexcrop"] ){
        _url += "/indexcrop";
        _url += option["indexcrop"].x ? ",x_" +  option["indexcrop"].x : "";
        _url += option["indexcrop"].y ? ",y_" +  option["indexcrop"].y : "";
        _url += option["indexcrop"].i ? ",i_" +  option["indexcrop"].i : "";
      }

      /** rounded-corners */
      if( option["rounded-corners"] ){
        _url += "/rounded-corners";
        _url += option["rounded-corners"].r ? ",r_" +  option["rounded-corners"].r : "";
      }

      /** auto-orient */
      if( option["auto-orient"] ){
        _url += "/auto-orient";
        _url += option["auto-orient"] ? "," +  option["auto-orient"] : "";
      }

      /** rotate */
      if( option["rotate"] ){
        _url += "/rotate";
        _url += option["rotate"] ? "," +  option["rotate"] : "";
      }

      /** blur */
      if( option["blur"] ){
        _url += "/blur";
        _url += option["blur"].r ? ",r_" +  option["blur"].r : "";
        _url += option["blur"].s ? ",s_" +  option["blur"].s : "";
      }

      /** bright */
      if( option["bright"] ){
        _url += "/bright";
        _url += option["bright"] ? "," +  option["bright"] : "";
      }

      /** bright */
      if( option["contrast"] ){
        _url += "/contrast";
        _url += option["contrast"] ? "," +  option["contrast"] : "";
      }

      /** bright */
      if( option["sharpen"] ){
        _url += "/sharpen";
        _url += option["sharpen"] ? "," +  option["sharpen"] : "";
      }

      /** format */
      if( option["format"] ){
        _url += "/format";
        _url += option["format"] ? "," +  option["format"] : "";
      }

      /** interlace */
      if( option["interlace"] ){
        _url += "/interlace";
        _url += option["interlace"] ? "," +  option["interlace"] : "";
      }

      /** quality */
      if( option["quality"] ){
        _url += "/quality";
        _url += option["quality"].q ? ",q_" +  option["quality"].q : "";
        _url += option["quality"].Q ? ",Q_" +  option["quality"].Q : "";
      }

      /** watermark */
      if( option["watermark"] ){
        _url += "/watermark";
        _url += option["watermark"].image ? ",image_" +  option["watermark"].image : "";
        _url += option["watermark"].t ? ",t_" +  option["watermark"].t : "";
        _url += option["watermark"].g ? ",g_" +  option["watermark"].g : "";
        _url += option["watermark"].x ? ",image_" +  option["watermark"].x : "";
        _url += option["watermark"].y ? ",image_" +  option["watermark"].y : "";
        _url += option["watermark"].voffset ? ",voffset_" +  option["watermark"].voffset : "";
      }

      /** average-hue */
      if( option["average-hue"] ){
        _url += "/average-hue";
      }

      /** info */
      if( option["info"] ){
        _url += "/info";
      }

      return _url
    }

    /**
     * 主要功能
     * 修改图片的 src 属性
     * */
    function _changeImgs(){
      if( _$imgsArray.length <= 0 ){
        return false;
      }
      var $win = $(window);
      var _len = _$imgsArray.length;
      var _index = 0;
      var _$winScrollTop = $win.scrollTop();
      var _$thisImg;
      var _imgProcessAttr;

      for( ;_index < _len; _index++ ){
        _$thisImg = _$imgsArray[ _index ];
        _imgProcessAttr = _$thisImg.attr( _settings.imgProcessAttr ) || "";

        /** 在屏幕上方一个屏幕高度以上的图片跳过不处理 */
        if( _$thisImg.offset().top < _$winScrollTop - _winHeight ){
          continue
        }

        /** 在屏幕下方一个屏幕高度以下的图片跳过不处理 */
        if( _$thisImg.offset().top > _$winScrollTop + _winHeight * 2 ){
          continue
        }

        /** 改变图片的 src 属性 */
        _$thisImg.attr("src", function(){
          var _url = _$thisImg.attr(_settings.srcAttr);

          if( _settings.setUrlParam && _imgProcessAttr ){
            _url = _ossAdaptor( _url, _imgParamParse(_imgProcessAttr) );
          }

          return _url;
        });
        _$thisImg.removeAttr(_settings.srcAttr);
        _$thisImg.removeAttr(_settings.imgProcessAttr);
        _settings.onchange && _settings.onchange.call(_$thisImg.get());

        /** 替换过 src 属性的图片，将其删除出数组外，往后不再处理该图片 */
        _$imgsArray.splice(_index, 1);
        _len--;
        _index--;
      }
    }



    $(function(){
      //改变图片 src 值
      _changeImgs();
    });

    $(win).on("scroll", function(){
      _changeImgs();
    });

  };
})( window, jQuery );
