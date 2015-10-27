$(function(){
    
    $('body').removeClass('no-js');
    
// ---------------------------------------------------------
//
//    slideshow
//
//---------------------------------------------------------
    
    $('.slideshow').each(function(){
        
//        変数の準備
//----------------------------------------------------------
        
        var $container = $(this),
            $slideGroup = $container.find('.slideshow-sliders'),
            $slides = $slideGroup.find('li'),
            $nav = $container.find('.slideshow-nav'),
            $indicator = $container.find('.slideshow-indicator'),
                
            slideCount = $slides.length,
            slideWidth = $slides.width(),
            slideMaxWidth = 980,
            slideGroupWidth = slideWidth * slideCount,
            windowWidth,
            indicatorHTML = '',
            currentIndex = 0,
            duration = 500,
            easing = 'easeOutCirc',
            interval = 4000,
            timer;
        
        
//        tab操作
//----------------------------------------------------------
        
        //navにフォーカスが当たらないように
        $nav.children('a').attr('tabindex', -1);
        
        
//        html要素の配置、生成、挿入
//----------------------------------------------------------
        
        //スライドの幅を各スライドに付与
        for( var i = 0; i < slideCount; i++){
            $slides.eq(i).css({'width': slideWidth});
            
            //対応するインジケーターのアンカーを生成
            indicatorHTML += '<li><a href=#><span>' + (i + 1)+ '</span></a></li>'
            //インジケーターにコンテンツを挿入
            $indicator.html(indicatorHTML);
        }
        
        //スライドの総幅をslideGroupに付与
        $slideGroup.css({width: slideGroupWidth});
        
        
//        関数の定義
//----------------------------------------------------------
        
        //任意のスライドを表示する関数
        function goToSlide(index){
            //スライドグループをターゲットの位置に合わせて移動
            $slideGroup.animate({ 'margin-left': -100 * index + '%' },duration, easing);
            
            //現在のスライドのインデックスを上書き
            currentIndex = index;
            
            //タブ操作制御
            $slides.find('a').attr('tabindex', -1);
            $slides.eq(currentIndex).find('a').attr('tabindex', 0);
            
            //ナビゲーションとインジケーターの状態を更新
            updateNav();
        }
        
        //スライドの状態に応じてナビゲーションとインジケーターを更新する関数
        function updateNav(){
            var $navPrev = $nav.find('.prev'),
                $navNext = $nav.find('.next');
            
            //もし最初のスライドなら Prevナビゲーションを無効に
            if(currentIndex === 0){
                $navPrev.addClass('disabled');
            } else {
                $navPrev.removeClass('disabled');
            }
            
            //もし最後のスライドなら Nextナビゲーションを無効に
            if(currentIndex === slideCount -1){
                $navNext.addClass('disabled');
            } else {
                $navNext.removeClass('disabled');
            }
            
            //現在のインジケーターを無効に
            $indicator.find('li').removeClass('active').eq(currentIndex).addClass('active');
        }
        
        
        //タイマーを開始する関数
        function startTimer(){
            //変数 interval で設定した時間が経過するごとに処理を実行
            timer = setInterval(function(){
                
                //現在のスライドのインデックスに応じて次に表示するスライドの決定
                //もし最後のスライドなら最初のスライドへ
                var nextIndex = (currentIndex + 1) % slideCount;
                goToSlide(nextIndex);
            }, interval);
        }
        
        //タイマーを停止する関数
        function stopTimer(){
            clearInterval(timer);
        }
        
        // ウィンドウリサイズ時のカルーセルの幅を制御する関数
        function Riseze(originalWidth){
            slideWidth = originalWidth;
            slideGroupWidth = slideWidth * slideCount;

            for( var i = 0; i < slideCount; i++){
                $slides.eq(i).css({'width': slideWidth});
            }
            $slideGroup.css({width: slideGroupWidth});
        }
        
//        イベントの登録
//----------------------------------------------------------
        
        //ナビゲーションのリンクをクリックされた該当のスライドを表示
        $nav.on('click', 'a', function(e){
            e.preventDefault();
            
            if($(this).hasClass('prev')){
                goToSlide(currentIndex - 1);
            } else {
                goToSlide(currentIndex + 1);
            }
        });
        
        //インジケーターのリンクがクリックされたら該当するスライドを表示
        $indicator.on('click', 'li', function(e){
            e.preventDefault();
            
            if(!$(this).hasClass('active')){
                goToSlide($(this).index());
            }
        });
        
        //イベントでマウスアウトとフォーカスインで被った時は処理を１つ解除
        $container.on('mouseenter mouseleave focusin focusout', function(e) {
            if (e.type === 'mouseenter' || e.type === 'focusin') {
                stopTimer();
            } else if (e.type === 'mouseleave' || e.type === 'focusout') {
                //マウスとフォーカスが同時に外れる時にstartTimerを二重起動させないようにstopTimerを挟む
                stopTimer();
                startTimer();
            }
        });
        
        //ウィンドウリサイズ時のイベント
        var resizeTime = false;
        
        $(window).resize(function(){
            //リサイズ中は動作停止、リサイズ後に開始
            if(resizeTime !== false){
                clearTimeout(resizeTime);
            }
            resizeTime = setTimeout(function(){
                windowWidth = $(window).width();
                
                if(windowWidth < slideMaxWidth){
                    Riseze(windowWidth);
                }　else {
                    Riseze(slideMaxWidth);
                }
            },100);
        });
        
        
//        スライドショーの開始
//----------------------------------------------------------
        
        //最初のスライド表示
        goToSlide(currentIndex);
                
        //タイマーをスタート
        startTimer();
        
    });
});