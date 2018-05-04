;(function($,window,document,undefined){
  var $cropperImg,opt;
  var cropSet = {};
  var move=false;//移动标记
  var waterBtn = {
    leftTop:'左上角',
    rightTop:'右上角',
    leftBottom:'左下角',
    rightBottom:'右下角',
    center:'中间',
    free:'自定义'
  };
  var waterType = {
    image:'图片水印',
    text:'文字水印'
  }
  var ratio = {
    free:'无比例',
    oneOne:'1:1',
    fourThree:'4:3',
    fourOne:'4:1',
    sixteenNine:'16:9',
    eightThree:'8:3',
    eightOne:'8:1',
    threeFour:'3:4',
	oneOnePointFour:'1:1.414',
	nineSixteen:'9:16'
  }
  var optbtn = {
    zoomOut:'放大',
    zoomIn:'缩小',
    leftRoate:'左旋转',
    rightRoate:'右旋转',
    reset:'重置',
    upload:'添加图片',
    waterMark:'添加水印'
  };
  cropSet.modaloptions = {
    fade  : 'fade',
    close : true,
    title : 'title',
    head  : true,
    foot  : true,
    markSrc:'',//水印src
    src   :'',
    picSize:'',//保存图片比例
    type  :'',//图片类型
    name  :'',//图片名称
    cropRatio :[],//图片比例
    otherRatio:false,//其他比例是否可选，true可选false 
    waterPosition:'rightBottom',//水印位置
    okbtn : '\u786e\u5b9a',
    qubtn : '\u53d6\u6d88',
    waterType:['image'],
    waterBtn:['free','leftTop','rightTop','leftBottom','rightBottom','center'],                   //水印位置设置
    ratio:['free','oneOne','fourThree','fourOne','sixteenNine','eightThree','eightOne','threeFour','oneOnePointFour','nineSixteen'], //裁切比例设置
    optbtn:['zoomOut','zoomIn','leftRoate','rightRoate','reset','upload','waterMark'] //按钮区域设置

  };
  $(document).ready(function(){
    // $('body').append('<script src="js/cropper.js"><\/script>');
   
  });
  cropSet.init = function(options,func){//初始化函数
    opt = $.extend({}, cropSet.modaloptions);
    //console.log(options,'传入参数')
    if(typeof options == 'string'){
      opt.title = options;
    }else{
    	if(options.src){
    		var _src = options.src.split('?');
    		options.src = _src[0];
    	}
      $.extend(opt, options);
    }
    // add
    $('body').append(cropSet.modalstr());
    console.log(opt,'传入参数')
    if(opt.fade == 'fade'){
      $('body').append(cropSet.mask());
    }

    cropSet.evt(func);
  }
  cropSet.modalstr = function(){
   
    var start = '<div class="cropSet-modal" role="dialog">';

    var end = '<input type="file" id="cropSet-change" class="cropSet-hidden"/>'+
              '<input type="file" id="uploadWaterMark" class="cropSet-hidden"/>'+
              '</div>';

    var head = cropSet.header();

    var body = cropSet.body();

    var foot = cropSet.footer();

    return start + head + body + foot + end;
  };
  cropSet.mask = function(){//生成遮罩层
    return '<div class="cropSet-mask"></div>';
  }
  cropSet.header = function(){//弹出框头部
    var str = '';
    if(opt.head){
      str = '<div class="cropSet-dialog-header">'+
                '<span class="cropSet-dialog-icon-title">'+opt.title+'</span>';
      if(opt.close){
        str+='<span class="cropSet-dialog-icon-close" title="关闭">&times;</span>';
      }
      str+='</div>';
    }
    return str;
  }
  cropSet.waterImgFade = function(){
    var _src = opt.markSrc;
    var str = '<div class="cropSet-water-mark waterMark-bg" id="cropSetWaterMark">'+
               '<img class="" draggable="false" src="'+_src+'"/>'+
               '<span class="cropSet-water-drag" id="resizeWaterMark"></span>'+
             '</div>';
    return str;
  }
  cropSet.footer = function(){//弹出框底部
    var str = '';
    if(opt.foot){
      str = '<div class="cropSet-dialog-footer">'+
              '<span class="cropSet-button-common cropSet-button-outer cropSet-dialog-yes" title="'+opt.okbtn+'">'+
                '<input class="cropSet-button-common cropSet-button" type="button" value="'+opt.okbtn+'"/>'+
              '</span>'+
              '<span class="cropSet-button-common cropSet-button-outer cropSet-dialog-no" title="'+opt.qubtn+'">'+
                '<input class="cropSet-button-common cropSet-button" type="button" value="'+opt.qubtn+'"/>'+
                '</span>'+
            '</div>'
    }
    return str;
  }
  cropSet.body = function(){//中间区域内容
    var start = '<div class="cropSet-container">';
    var end = '</div>';
    var body = '<div class="cropSet-img-container">'+
                  cropSet.imgContainer()+
                  cropSet.rightContainer()+
                '</div>'+
                '<div class="cropSet-banner">'+cropSet.optbtn()+
                '</div>';
    return start + body + end;
  }
  cropSet.imgContainer = function(){
    var start = '<div class="img-container">';
    var end = '</div>';
    var body = '';
    if(opt.src != ''){
      body = '<img id="cropSet-image" src="" class="img"/>'+
              '<span id="cropSet-addImg" class="cropSet-font cropSet-hidden">请选择图片</span>';
    }else{
      body = '<img id="cropSet-image" src="" class="cropSet-hidden"/>'+
              '<span id="cropSet-addImg" class="cropSet-font">请选择图片</span>';
    }
    return start + body + end;
  }
  cropSet.rightContainer = function(){
    var start ='<div class="right-container">';
    var end = '</div>';
    var body = cropSet.waterType() + cropSet.waterMark() + cropSet.cropRatio() + cropSet.uploadOriginal();
    return start + body + end;
  }
  //水印类型
  cropSet.waterType = function(){
    var start = '<div class="cropSet-opt-mod">'+
                    '<p class="section-title">自定义水印</p>'+
                    '<ul class="water-type">';
    var end ='</ul>'+
            '</div>';
    
    return start + cropSet.waterTypeBtn() + end;
  }
  //水印类型按钮
  cropSet.waterTypeBtn = function(){
    var arr = [];
    $.each(opt.waterType,function(i,value){
      arr[i] = '<li class="cropSet-btn" data-type="'+value+'"><a>'+waterType[value]+'</a></li>'
    });
    return arr.join('');
  }
  cropSet.waterMark = function(){
    var start = '<div class="cropSet-opt-mod">'+
                    '<p class="section-title">水印位置</p>'+
                    '<ul class="water-position">';
    var end ='</ul>'+
            '</div>';
    
    return start + cropSet.waterBtn() + end;
  }
  cropSet.cropRatio = function(){
    var start = '<div class="cropSet-opt-mod">'+
                    '<p class="section-title">预设比例</p>'+
                    '<ul class="cropSet-ratio">';
    var end ='</ul>'+
            '</div>';
    
    return start + cropSet.ratio() + end;
  }
  cropSet.ratio = function(){
    var arr = [];
    $.each(opt.ratio,function(i,value){
      var cls = '';
      if(opt.cropRatio.length>0){
        cls = getParamRadio(ratio[value]);
      }
      
      arr[i] = '<li class="cropSet-btn '+cls+'" data-type="'+value+'"><a>'+ratio[value]+'</a></li>';
    });
    return arr.join('');
  }
  cropSet.waterBtn = function(){
    var arr = [];
    $.each(opt.waterBtn,function(i,value){
      var cls = '';
      if(opt.waterPosition != '' && opt.waterPosition == value){
        cls = 'active';
      }
      arr[i] = '<li class="cropSet-btn '+cls+'" data-type="'+value+'"><a>'+waterBtn[value]+'</a></li>'
    });
    return arr.join('');
  }
  cropSet.optbtn = function(){
    var arr = [];
    $.each(opt.optbtn,function(i,value){
      arr[i] = '<a class="cropSet-btn" data-type="'+value+'" title="'+optbtn[value]+'">'+optbtn[value]+'</a>';
    });
    return arr.join('');
  }
  cropSet.uploadOriginal =function(){//原始图片按钮
    var str = '<div class="cropSet-opt-mod">'+
                '<label class="checkbox">'+
                  '<input type="checkbox" class="gifbtn" id="uploadOriginal">'+
                  '<span>上传原始图片</span>'+
                '</label>'+
              '</div>'
    return str;
  }
  cropSet.evt = function(func){
    $cropperImg = $('#cropSet-image');
    cropSet.addEvt(func);//初始化按钮事件
    initCropper(opt.src);//初始化裁切工具
  }
  cropSet.addEvt = function (func) {//初始化按钮事件
    if($('#cropSet-addImg').length>0){
      $('#cropSet-addImg').on('click',function(){
        $('#cropSet-change').trigger('click');
        $('.cropSet-banner').css('display','block');
      });
    }
    //选择水印类型
    $('.water-type').on('click','.cropSet-btn',function(e){
      var type = $(this).attr('data-type');//事件类型
      switch (type) {
        case 'image':
          $('#uploadWaterMark').trigger('click');
          $('.right-container').css('display','block');
        break;
          case 'text':
          addTextWaterMark();
        break;
        default:
      }
    });
    $('#cropSet-change').on('change',{node:$('#cropSet-change')},upload);//上传图片
    $('#uploadWaterMark').on('change',{node:$('#uploadWaterMark')},uploadWaterMark);
    $('.cropSet-banner').on('click','.cropSet-btn',function(e){//按钮添加事件
      var type = $(this).attr('data-type');//事件类型
      switch (type) {
        case 'zoomOut':
          changeZoom(0.1);
          break;
        case 'zoomIn':
          changeZoom(-0.1);
          break;
        case 'leftRoate':
          changeRotate(-45);
          break;
        case 'rightRoate':
          changeRotate(45);
          break;
        case 'reset':
          cropperReset();
          break;
        case 'upload':
          chooseImg();
          $('.cropSet-banner').css('display','block')
          break;
        case 'waterMark':
          if(opt.src == '')return;
          if(opt.markSrc == '')return;
          setWaterBtnContent($(this),'addOrRemove');
          break;
        default:
      }
    });
    $('.water-position').on('click','.cropSet-btn',function(e){//水印位置
      if(opt.src == '')return;
      var type = $(this).attr('data-type');//事件类型
      waterMarkPos(type);
      $(this).addClass("active").siblings().removeClass("active");
    });
    $('.cropSet-ratio').on('click','.cropSet-btn',function(e){//裁切比例
      if(opt.src == '')return;
      if(opt.cropRatio.length>0){
        if($(this).hasClass('disabled') || !canBtnClick($(this).find('a').text(),'ratio')){
          return;
        }
      }
      var type,val,ratio1;
      type = $(this).attr('data-type');
      val = ratio[type];//事件类型
      if(val == '无比例'){
        ratio1 = 'NaN';
      }else{
        ratio1 = handleRadio(val);
      }
      $cropperImg.cropper("setAspectRatio", ratio1);
      $(this).addClass("active").siblings().removeClass("active");
    });
    $('.cropSet-dialog-header').mousedown(function (event) { //拖动头部事件
      event.stopPropagation();
      var abs_x = event.pageX - $('.cropSet-modal').offset().left;  
      var abs_y = event.pageY - $('.cropSet-modal').offset().top;  
      $(".cropSet-modal").bind('mousemove',function (e) {  
        e.stopPropagation();
        var top = e.pageY - abs_y,
            left = e.pageX - abs_x,
            maxW = $(window).width() - $(this).width()-10,
            maxH = $(window).height() - $(this).height()-10;
            if (left < 0) {
              left = 0;
            } else if (left > maxW) {
              left = maxW;
            }
            if (top < 0) {
              top = 10;
            } else if (top > maxH) {
              top = maxH;
            }
            $(this).css({
              'left':left, 
              'top':top
            });  
        }).mouseup(function () {  
          $(".cropSet-modal").unbind('mousemove');
        });  
    });
    $('.cropSet-dialog-yes').click(function(e){//确认裁剪
      okCrop(func);
    });
    $('.cropSet-dialog-no').click(function(e){//取消裁剪
      cancelCrop();
    });
    $('.cropSet-dialog-icon-close').click(function(e){//取消裁剪
      cancelCrop();
    });
    $('#uploadOriginal').click(function(e){//切换选中效果
      if($(this).prop('checked')){
        $(this).parents('.checkbox').addClass('on');
      }else{
        $(this).parents('.checkbox').removeClass('on');
      }
    });
  }
  cropSet.setImgInfo = function(){
    var t, n;
    t = opt.src.split('.');
    opt.type = "image/"+t[t.length-1];
    n = opt.src.split('/');
    opt.name = n[n.length-1];
  }
  cropSet.destoryCrop = function(){
    $cropperImg.cropper('destroy');
    $('.cropSet-mask').remove();
    $('.cropSet-modal').remove();
  }
  function upload(e){
    console.log(e.target.files[0]);
    var $inputImage = $('#cropSet-change');
    var URL = window.URL || window.webkitURL,
    blobURL;
    if (URL) {
      /*if (!$cropperImg.data('cropper')) {
        return;
      }*/
      var files = e.target.files;
      if (files && files.length) {
    	 
        if (/^image\/\w+$/.test(files[0].type)) {
          blobURL = URL.createObjectURL(files[0]);
          //console.log(files[0]);
          opt.type = files[0].type;
          opt.name = files[0].name;
          opt.src = blobURL;
          $cropperImg.one('built.cropper',
          function() {
            URL.revokeObjectURL(blobURL); 
          }).cropper('reset').cropper('replace', blobURL);
          control();
        } else {
          alert('请选择图片');
        }
        $inputImage.val("");
        // $inputImage.after($inputImage.clone().val(""));
        // $inputImage.remove();
      }
    }
  }
  //上传水印
  function uploadWaterMark(e){
    console.log(e.target.files[0]);
    var $inputImage = $('#uploadWaterMark');
    var URL = window.URL || window.webkitURL,
    blobURL;

    if (URL) {
      var files = e.target.files;
      if (files && files.length) {

        if (/^image\/\w+$/.test(files[0].type)) {
          blobURL = URL.createObjectURL(files[0]);
          opt.markSrc = blobURL;
          setWaterBtnContent(getWaterBtn('waterMark'),'upload');
        } else {
          alert('请选择图片');
        }
        $inputImage.val("");
        // $inputImage.after($inputImage.clone().val(""));
        // $inputImage.remove();
      }
    }
  }
  function control(){//隐藏添加图片功能
    if(!$('#cropSet-addImg').is('.cropper-hidden')){
      $('#cropSet-addImg').addClass('cropper-hidden');
    }
  }
  function initCropper(){//初始化cropper
	  
    $cropperImg.on({
      'cropstart.cropper': function (e) {
        console.log(e.type, e.action);
      },
      'cropmove.cropper': function (e) {
        console.log(e.type, e.action);
        if($('#cropSetWaterMark').length>0 && $('.water-position .cropSet-btn.active').length>0){
          waterMarkPos($('.water-position .cropSet-btn.active').attr('data-type'));
        }
      },
      'cropend.cropper': function (e) {
        console.log(e.type, e.action);
      }
    }).cropper({
        strict : true, //是否允许裁剪框超出边界
        autoCropArea: 1,
        checkImageOrigin: false,
        aspectRatio:opt.cropRatio.length>0?handleRadio(opt.cropRatio[0]):'',
        crop: function (data) {
        }
    });
    // 线上图片裁剪
    if(opt.src!=''){
      $cropperImg.cropper('replace', opt.src); 
      cropSet.setImgInfo();
      control();
    }
  }
  // 放大缩小
  function changeZoom(ratio) {
    if(opt.src == '')return;
    $cropperImg.cropper("zoom", ratio);
  }
  // 旋转
  function changeRotate(deg) {
    if(opt.src == '')return;
    $cropperImg.cropper("rotate", deg);
  }
  // 重置
  function cropperReset(){
    if(opt.src == '')return;
    $cropperImg.cropper("reset");
  }
  // 选择图片
  function chooseImg(){
    $('#cropSet-change').trigger("click");
  }
  function okCrop(func){//确定选择图片
    if(opt.src == '')return;
    var canvas,scaleCanvas,tmp;
    canvas = $cropperImg.cropper('getCroppedCanvas');
    
    var obj = {
      type:opt.type,
      name:opt.name
    };

    if(opt.picSize != ''){
      tmp = equalProportCompress(canvas);
      if($('#cropSetWaterMark').length>0){//添加水印
        tmp = addWaterMark(tmp);//添加水印
      }
    }else{
      tmp = canvas;
      
      if($('#cropSetWaterMark').length>0){//添加水印
        tmp = addWaterMark(tmp);//添加水印
      }
      
    }
    obj.width = tmp.width;
    obj.height = tmp.height;
    cropSection = convertBinary(opt.type,tmp);//选中部分转换成二进制流
    obj.url = cropSection.url;//裁切后的图片路径
    obj.blob = cropSection.blob;//裁切后图片的二进制流
    if($('#uploadOriginal').prop('checked')){//上传原图，放弃处理后的图片
      obj.url = getOriginalImg().url;
      obj.blob = getOriginalImg().blob;
    }
//    obj.blob = tmp.mozGetAsFile(opt.name);

    if(func){
      func(obj);
    } else {
      /*var formData = new FormData();
      formData.append('file', blob);
      formData.append('upload', 'logo');
      formData.append('siteId', '115A1C46FB41413BBEA17F524F29C4A2');
     
      var xhr = new XMLHttpRequest();
      xhr.open("POST",BASE_URL+'/cmsSite/upload');
      xhr.send(formData);*/
    }
    
  }
  function getOriginalImg(){//上传原始图片
    var canvas = $('<canvas>')[0];
    var context = canvas.getContext('2d');
    var image = $('#cropSet-image')[0];
    var canvasWidth = image.width;
    var canvasHeight = image.height;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    context.drawImage(image, 0, 0, canvasWidth, canvasHeight);
    var obj = convertBinary(opt.type,canvas);
    return obj;
  }
  function convertBinary(_type,_canvas){//将canvas转换成二进制
    var url,data;
    url = _canvas.toDataURL(_type);
    data=url.split(',')[1];
    data=window.atob(data);
    var ia = new Uint8Array(data.length);
    for (var i = 0; i < data.length; i++) {
        ia[i] = data.charCodeAt(i);
    };

    // canvas.toDataURL 返回的默认格式就是 image/png
    var blob=new Blob([ia], {type:_type});
    blob.name=blob.fileName = opt.name;
    blob.fileType = _type;
    return {
      url:url,
      blob:blob
    };
  }
  function cancelCrop(){
    cropSet.destoryCrop();
  }
  
  function handleRadio(_val){//例如4:3转换成4/3
    var tmp;
    tmp = _val.split(':');
    return (tmp[0]/tmp[1]).toFixed(16);
  }
  function getParamRadio(_ratio){//根据传入比例来设置比例按钮是否可以点击
    var cls = 'disabled';
    $.each(opt.cropRatio,function(index,val){
      if(val == _ratio){
        if(index == 0){
          cls = 'active';
        }else{
          cls = '';
        }
        
      }
    });
    return cls;
  }
  /*
  *_val按钮值
  *_type按钮类型
  */
  function canBtnClick(_val,_type){
    var state = false;
    if(_type == 'waterMark') {

    } else if(_type == 'ratio'){
      $.each(opt.cropRatio,function(i,value){
        if(_val == value){
          state = true;
        }
      });
    }
    return state;
  }
  function waterMarkPos(_type){//设置水印位置
    var w = $('#cropSetWaterMark').width();
    var h = $('#cropSetWaterMark').height();
    $('#cropSetWaterMark').removeAttr('style');
    $('#cropSetWaterMark').removeClass('left-top left-bottom right-top right-bottom');
    $('#cropSetWaterMark').css({
      width:w,
      height:h
    });
    switch (_type) {
      case 'free' :
        $('#cropSetWaterMark').addClass('right-bottom');
      break;
      case 'leftTop':
        $('#cropSetWaterMark').addClass('left-top');
        break;
      case 'rightTop':
        $('#cropSetWaterMark').addClass('right-top');
        break;
      case 'leftBottom':
       $('#cropSetWaterMark').addClass('left-bottom');
        break;
      case 'rightBottom':
        $('#cropSetWaterMark').addClass('right-bottom');
        break;
      case 'center':
        $('#cropSetWaterMark').css({
          left:'50%',
          top:'50%'
        });
        $('#cropSetWaterMark').css({
          left:'-='+$('#cropSetWaterMark').width()/2+'px',
          top:'-='+$('#cropSetWaterMark').height()/2+'px'
        });
        break;
      default:
    }

  }
  function getCropWater(can,_type){//获取水印相对于裁剪区域的位置
    console.log(can,'can',_type)
    var x,y;
    x = can.width / $('.cropper-crop-box').width()* $('#cropSetWaterMark').position().left;
    y = can.height / $('.cropper-crop-box').height() * $('#cropSetWaterMark').position().top;
    return {x:x,y:y};
  }
  function getPicSize(){//获取传入参数里的width和height值
    if(opt.picSize == '')return;
    var size = opt.picSize.split('*');
    return {
      w:size[0],
      h:size[1]
    };
  }
  function equalProportCompress(_canvas){//等比例压缩图片
    var d = getPicSize(),scaleCanvas;
      scaleCanvas = $('<canvas>')[0];
      scaleCanvas.width = d.w;
      scaleCanvas.height = d.h;
      scaleCanvas.getContext("2d").drawImage(_canvas,0,0,_canvas.width,_canvas.height,0,0,d.w,d.h);
    return scaleCanvas;
  }
  function addWaterMark (_canvas){//图片上添加水印
    var waterImage =  $('#cropSetWaterMark img')[0],
    tmp,
    w=0,
    h=0;
    if($('.water-position .cropSet-btn.active').length>0){
      tmp = $('.water-position .cropSet-btn.active').attr('data-type');
    }else{
      tmp = opt.waterPosition;
    }
    var pos = getCropWater(_canvas,tmp);
    console.log(pos,'pos')
    w = (_canvas.width/$('.cropper-crop-box').width())*waterImage.width;
    h = (_canvas.height/$('.cropper-crop-box').height())*waterImage.height;
    _canvas.getContext("2d").drawImage(waterImage,pos.x,pos.y,w,h);
    return _canvas;
  }
  //文字转换成canvas
  function textConvertCanvas(){
    var canvas = $('<canvas>')[0];

    return canvas;
  }
  //生成图片水印
  function genWaterMark(_state){
    if(_state){
      $('.cropper-crop-box').append(cropSet.waterImgFade());
      getWaterMarkSize($('#cropSetWaterMark'));

      bindResize($("#resizeWaterMark")[0],$('#cropSetWaterMark')[0]);
      bindMove($('#cropSetWaterMark')[0]);
      if($('.water-position .active').length>0){
        waterMarkPos($('.water-position .active').attr('data-type'));
      }else{
        waterMarkPos(opt.waterPosition);
      }
    }else{
      $('#cropSetWaterMark').remove();
    }
  }
  //获取对应按钮
  function getWaterBtn(_type){
    var tmp = '';
    $('.cropSet-banner .cropSet-btn').each(function(i,value){
      if($(this).attr('data-type') == _type){
        tmp = $(this);
      }
    });
    return tmp;
  }
  //设置水印按钮
  function setWaterBtnContent(_this,_type){
    if(_type == 'upload'){
      $('#cropSetWaterMark').remove();
      if(!_this.hasClass('active')){
        _this.addClass('active');
        _this.html('取消水印');
      } 
      genWaterMark(true);
    }else{
      if(_this.hasClass('active')){
        _this.removeClass('active');
        _this.html('添加水印');
        genWaterMark(false);
      }else{
        _this.addClass('active');
        _this.html('取消水印');
        genWaterMark(true);
      }
    }
  }
  //设置默认水印的大小
  function setWaterMarkStyle(_this,dw,dh){
    _this.css({
      width:100,
      height:(dh/dw)*100
    });
    _this.attr('data-w',_this.width());
    _this.attr('data-h',_this.height());
  }
  function getWaterMarkSize(dom){
	//重载图片获取图片的宽高
	  var img = new Image();
	    img.src = dom.find('img').attr('src');
	    if (img.complete) {
	    	setWaterMarkStyle(dom,img.width, img.height);
	    } else {
	        img.onload = function () {
	        	setWaterMarkStyle(dom,img.width, img.height);
	            img.onload = null;
	        };
	    };
  }
  //处理水印的大小
  function bindResize(el,target) {
    //初始化参数 
    var els = target.style,
    //鼠标的 X 和 Y 轴坐标 
    x = y = 0;
    //邪恶的食指 
    $(el).mousedown(function(e) {
    	console.log('4444')
      e.stopPropagation();
      //按下元素后，计算当前鼠标与对象计算后的坐标 
      x = e.clientX - target.offsetWidth,
      y = e.clientY - target.offsetHeight;
      //在支持 setCapture 做些东东 
      el.setCapture ? (
      //捕捉焦点 
      el.setCapture(),
      //设置事件 
      el.onmousemove = function(ev) {
        mouseMove(ev || event)
      },
      el.onmouseup = mouseUp) : (
      //绑定事件 
      $(document).bind("mousemove", mouseMove).bind("mouseup", mouseUp))
      //防止默认事件发生 
      e.preventDefault()
    });
    //移动事件 
    function mouseMove(e) {
      //宇宙超级无敌运算中... 
      els.width = e.clientX - x + 'px';
      els.height = e.clientY - y + 'px';
      $(target).attr('data-w',e.clientX - x);
      $(target).attr('data-h', e.clientY - y);
    }
    //停止事件 
    function mouseUp() {
      //在支持 releaseCapture 做些东东 
      el.releaseCapture ? (
      //释放焦点 
      el.releaseCapture(),
      //移除事件 
      el.onmousemove = el.onmouseup = null) : (
      //卸载事件 
      $(document).unbind("mousemove", mouseMove).unbind("mouseup", mouseUp))
    }
  }
  //处理水印位置
  function bindMove(el) {
    var x = y = 0,w=h=0;//鼠标的 X 和 Y 轴坐标 
    //邪恶的食指 
    $(el).mousedown(function(e) {
    	w = $(el).attr('data-w');
        h = $(el).attr('data-h');
      if($('.water-position .active').attr('data-type') != 'free')return;
      e.stopPropagation();
      e.preventDefault();
      //按下元素后，计算当前鼠标与对象计算后的坐标 
      x = e.pageX - $('#cropSetWaterMark').offset().left,
      y = e.pageY - $('#cropSetWaterMark').offset().top;
      //在支持 setCapture 做些东东 
      el.setCapture ? (
      //捕捉焦点 
      el.setCapture(),
      //设置事件 
      el.onmousemove = function(ev) {
        mouseMove(ev || event)
      },
      el.onmouseup = mouseUp) : (
      //绑定事件 
      $(document).bind("mousemove", mouseMove).bind("mouseup", mouseUp))
      //防止默认事件发生 
      e.preventDefault()
    });
    //移动事件 
    function mouseMove(e) {
    	e.stopPropagation();
        e.preventDefault();
      var top = e.pageY - $('.cropper-crop-box').offset().top - y,
          left = e.pageX - $('.cropper-crop-box').offset().left - x,
          maxW = $('.cropper-crop-box').width() - w-5,
          maxH = $('.cropper-crop-box').height() - h-5;

          if (left < 0) {
            left = 0;
          } else if (left > maxW) {
            left = maxW;
          }
          if (top < 0) {
            top = 5;
          } else if (top > maxH) {
            top = maxH;
          }
          $(el).removeAttr('style');
          $(el).css({
            'left':left, 
            'top':top,
            'width':w,
            'height':h
          });
    }
    //停止事件 
    function mouseUp() {
      //在支持 releaseCapture 做些东东 
      el.releaseCapture ? (
      //释放焦点 
      el.releaseCapture(),
      //移除事件 
      el.onmousemove = el.onmouseup = null) : (
      //卸载事件 
      $(document).unbind("mousemove", mouseMove).unbind("mouseup", mouseUp))
    }
  }

  window.cropSet = cropSet;
})(jQuery,window,document);