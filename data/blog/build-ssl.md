---
title: nginx配置https
createTime: 2024-05-09
updateTime: 2024-05-09
authors: hush
tag: nginx, https
cover: build-ssl.jpg
---

## 为什么要升级到https

https 会比 http 更加安全

小程序端的请求是必须https格式的

https 需要用到 ssl 证书, 该证书由 CA 认证机构颁发, 简单点就直接在对应域名的运营商那里买证书, 也可以在一些免费的网站上申请证书, 这里推荐个免费申请证书的网站 [freessl](https://freessl.cn/), 也可以通过 [cloudflare](https://dash.cloudflare.com/) 代理域名服务, 可以将域名升级成 https

下边介绍下用 `freessl` 申请证书

## freessl申请证书

### 购买域名

freessl申请的是域名证书, 所以需要先购买域名, 有了域名也方便后续服务器变更

笔者域名是在 [Namesilo](https://www.namesilo.com/) 上购买的

Namesilo 是 ICANN 认证的国际著名域名注册商之一, 价格便宜实惠、性价比高, 注册和转入域名都很方便, 安全保护到位, 是一家非常靠谱的域名注册商. 而且支持支付宝付款

### 申请证书

登录 freessl 官网, 需要注册账号, 按流程注册完毕后

![](/images/build-ssl/login.png)

进入 `证书列表` 点击申请证书, 会跳转到限量发售页面

![](/images/build-ssl/image-01.png)

选择 `单域名` , 点击 `立即申请` .

填入内容如下, CSR 来源选择 `离线生成` , 证书域名填写自己的域名, 验证方式选择 `DNS` , 加密算法选择 `RSA`

![](/images/build-ssl/image-02.png)

填入完毕后点击提交, 会提示启动CMLite, 点击 `CMLite官网` 进行安装

![](/images/build-ssl/image-03.png)

安装完毕后回到freessl中点击继续, 会自动打开 CMLite, 然后自动生成CSR, 会提示请返回浏览器继续

回到浏览器点击继续后, 会跳转到订单详情, 展示一条需要配置的DNS配置, 因为网站需要验证这个域名是否是你的且有效的

此时回到购买域名的运营商控制台中添加该条DNS配置, 配置完成后回来点击配置完成

因为DNS生效需要一点时间, 等待一会后点击状态列后的 `已配置` 按钮进行测试, 若测试成功则会提示如下:

![](/images/build-ssl/image-04.png)

点击保存到 CMLite, 找到刚保存的那条证书, 点击导出证书, 平台选择 nginx, 选择导出

则会生成一个 `.crt` 和 `.key` 文件, 这两个文件就是对应的证书文件和私钥, 接下来只需要去服务器上部署即可

### 部署证书

1. 登录服务器, 找个位置存放上述提供的证书和私钥, 例如 `/home/www/ssl`

2. 找到 `nginx.conf` 配置文件, 在文件内添加如下内容:

```nginx
    server {
        listen 443 ssl;
        server_name localhost;

        ssl_certificate /home/www/ssl/xxx.crt;
        ssl_certificate_key /home/www/ssl/xxx.key;
    }
```

这样就将ssl证书配置好了, 重启nginx即可通过https进行访问了

## 参考资料

[freessl官网](https://freessl.cn/)

[cloudflare](https://dash.cloudflare.com/)

[Namesilo官网](https://www.namesilo.com/)

[Nginx如何配置证书](https://blog.freessl.cn/how-to-install-cert-in-nginx/)
