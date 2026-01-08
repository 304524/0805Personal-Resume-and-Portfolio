// 将代码包裹在立即执行函数中，避免全局变量污染，同时传入jQuery并命名为$
(function ($) {

    // "use strict" 严格模式：避免语法错误（如未声明变量、重复参数名等），提升代码健壮性
    "use strict";

    // 1. 页面预加载动画逻辑
    // 监听window的load事件（页面所有资源：图片、脚本、样式等加载完成后触发）
    $(window).load(function(){
        // 让.preloader元素在1000毫秒（1秒）内渐隐消失
        // fadeOut是jQuery的动画方法，参数为动画时长（毫秒）
        $('.preloader').fadeOut(1000); // set duration in brackets
    });

    // 2. 导航栏交互逻辑（移动端）
    // 为.navbar-collapse下的所有a标签绑定点击事件
    $('.navbar-collapse a').on('click',function(){
        // 点击导航链接后，折叠/隐藏移动端的导航菜单（解决点击后菜单不自动关闭的问题）
        $(".navbar-collapse").collapse('hide');
    });

    // 3. 导航栏滚动样式切换
    // 监听window的scroll事件（页面滚动时持续触发）
    $(window).scroll(function() {
        // 判断.navbar元素距离页面顶部的偏移量是否大于50px
        if ($(".navbar").offset().top > 50) {
            // 滚动超过50px时，给导航栏添加top-nav-collapse类（通常用于修改导航栏样式：如背景色、高度）
            $(".navbar-fixed-top").addClass("top-nav-collapse");
        } else {
            // 滚动回到顶部50px内时，移除该类，恢复原样式
            $(".navbar-fixed-top").removeClass("top-nav-collapse");
        }
    });

    // 4. 平滑滚动逻辑
    $(function() {
        // 为自定义导航栏和首页的a标签绑定点击事件
        $('.custom-navbar a, #home a').bind('click', function(event) {
            // 将当前点击的a标签元素赋值给$anchor变量
            var $anchor = $(this);
            // 停止当前页面的所有动画，避免多次点击导致的动画叠加
            $('html, body').stop().animate({
                // 动画目标：滚动到锚点href指向的元素的顶部位置，偏移-49px（避免导航栏遮挡目标内容）
                scrollTop: $($anchor.attr('href')).offset().top - 49
            }, 1000); // 动画时长：1000毫秒（1秒）
            // 阻止a标签的默认跳转行为（否则会直接跳转到锚点，无平滑效果）
            event.preventDefault();
        });
    });

    // 5. WOW.js 动画初始化
    // 初始化WOW.js插件，配置mobile: false表示在移动端不执行动画（避免移动端性能问题）
    // init()是WOW.js的初始化方法，执行后页面中的wow类元素会触发滚动动画
    new WOW({ mobile: false }).init();

    // 6. 联系方式图标点击交互（新增）
    $(document).ready(function() {
        // 先创建弹窗DOM元素
        const modalHtml = `
            <div class="contact-modal">
                <div class="modal-content">
                    <h4 id="modal-title">联系方式</h4>
                    <p id="modal-text"></p>
                    <button class="modal-close">关闭</button>
                </div>
            </div>
        `;
        // 将弹窗添加到body末尾
        $('body').append(modalHtml);

        // 定义所有类型弹窗内容（新增邮箱、电话的配置）
        const modalConfig = {
            email: {
                title: '邮箱联系',
                text: '邮箱：1310683031@qq.com<br>建议优先通过邮箱沟通，我会尽快回复！'
            },
            phone: {
                title: '电话联系',
                text: '电话：19161259297<br>工作时间：9:00-18:00（周一至周五）'
            },
            github: {
                title: 'GitHub 账号',
                text: 'GitHub账号正在完善中，敬请期待！<br>后续会上传个人项目和代码示例。'
            },
            wechat: {
                title: '微信联系',
                text: '微信：JXY19161259297<br>添加时请备注：姓名-来意（如：XX-求职/合作）'
            }
        };

        // 绑定所有联系方式图标点击事件（所有类型都拦截默认行为）
        $('.contact-item').on('click', function(e) {
            // 阻止所有图标的默认跳转行为
            e.preventDefault();
            const type = $(this).data('type');
            // 设置弹窗标题和内容（支持HTML换行）
            $('#modal-title').text(modalConfig[type].title);
            $('#modal-text').html(modalConfig[type].text);
            // 显示弹窗
            $('.contact-modal').addClass('active');
        });

        // 关闭弹窗事件：点击背景/关闭按钮都关闭
        $('.modal-close, .contact-modal').on('click', function(e) {
            if ($(e.target).hasClass('contact-modal') || $(e.target).hasClass('modal-close')) {
                $('.contact-modal').removeClass('active');
            }
        });

        // 按ESC键关闭弹窗
        $(document).on('keydown', function(e) {
            if (e.key === 'Escape' && $('.contact-modal').hasClass('active')) {
                $('.contact-modal').removeClass('active');
            }
        });

        // 可选：弹窗内容复制功能（优化体验，点击文本可复制）
        $('#modal-text').on('click', function() {
            // 提取纯文本内容（去除HTML标签）
            const text = $(this).text().replace(/：/g, ':').split('\n')[0].split(':')[1];
            if (text && text.trim() !== '') {
                // 创建临时输入框复制内容
                const tempInput = $('<input>').val(text).appendTo('body').select();
                document.execCommand('copy');
                tempInput.remove();
                // 提示复制成功
                alert('已复制：' + text);
            }
        });
    });

    // 7. 作品集图片弹窗和视频播放功能
    $(document).ready(function() {
        // 初始化图片弹窗
        $('.image-popup').magnificPopup({
            type: 'image',
            removalDelay: 300,
            mainClass: 'mfp-fade',
            gallery: {
                enabled: true,
                navigateByImgClick: true
            },
            image: {
                titleSrc: function(item) {
                    return item.el.attr('alt');
                }
            }
        });

        // 视频播放/暂停功能
        $('.video-play-btn').click(function() {
            // 获取视频ID
            const videoId = $(this).data('video-id');
            const video = document.getElementById(videoId);

            // 暂停所有其他视频
            document.querySelectorAll('video').forEach(v => {
                if (v.id !== videoId) {
                    v.pause();
                    v.currentTime = 0;
                }
            });

            // 切换当前视频播放状态
            if (video.paused) {
                video.play();
                $(this).closest('.relative').find('.bg-black').addClass('opacity-0');
            } else {
                video.pause();
                $(this).closest('.relative').find('.bg-black').removeClass('opacity-0');
            }
        });

        // 视频播放结束后恢复封面状态
        document.querySelectorAll('video').forEach(video => {
            video.addEventListener('ended', function() {
                this.currentTime = 0;
                $(this).closest('.relative').find('.bg-black').removeClass('opacity-0');
            });
        });
    });

// 将jQuery对象传入立即执行函数，确保$符号代表jQuery（避免与其他库冲突）
})(jQuery);