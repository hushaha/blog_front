---
title: uniapp打包安卓和iOS
createTime: 2022-09-01
updateTime: 2022-09-01
authors: hush
tag: uniapp, android, iOS
cover: uniapp-pak.jpg
---

## 基础配置

1. 一台 mac 电脑
2. 安装 jdk8 环境

## android打包

安卓打包相对简单, 只需要一个keystore证书即可, 该证书可以在uniapp的项目管理中直接线上申请到, 如下介绍本地创建证书

### 生成keystore签名证书

找个位置存放签名证书

```bash
# 命令行执行如下命令
sudo keytool -genkey -alias testalias -keyalg RSA -keysize 2048 -validity 36500 -keystore test.keystore
```

testalias 为自己自定义的别名

test.keystore 为创建的证书文件名称

证书生成后我们会看到："建议使用 `keytool -importkeystore -srckeystore ./test.keystore -destkeystore ./test.keystore -deststoretype JKS` "这一句, 我们就按照它的要求来做

```bash
sudo keytool -importkeystore -srckeystore ./test.keystore -destkeystore ./test.keystore -deststoretype JKS
```

查看证书信息

```bash
keytool -list -v -keystore test.keystore
```

若没有 MD5 信息, 则执行如下命令查看 MD5 信息

```bash
# 首先,使用 `keytool` 获取 SHA1 指纹
keytool -exportcert -alias testalias -keystore test.keystore -file output.crt

# 然后,使用 `openssl` 获取 MD5 指纹
openssl x509 -inform der -in output.crt -noout -fingerprint -md5
```

### Hbuilder打包

点击 `发行/云打包` , 选择 `证书文件(.keystore)` , 输入 `证书别名(alias)` , 创建证书时的密码即可

## iOS打包

### 创建Csr文件

1. 打开 `钥匙串访问`
2. 点击左上角 `钥匙串访问/证书助理/从证书颁发机构请求证书`

![](/images/uniapp-pak/ios01.jpg)

3. 填写自己的邮箱和 `CA邮箱` ,  `CA邮箱` 为开发者账号邮箱, 下方请求需要选择存储到本地, 点击继续则会生成一个`CertificateSigningRequest.certSigningRequest` 文件

![](/images/uniapp-pak/ios02.jpg)

### 创建Cer文件

回到苹果开发者中心, 点击 `certificates` 菜单, 然后点击右边的蓝色小加号, 进入 cer 证书创建页面, 创建的过程中, 要选择 `ios distribution ad hoc an app store` （这种类型可以做真机测试也能做 app store 发布）, 要注意不要选择 dev 类型或 apple 类型。

创建过程中需要上传一个 `Csr` 文件, 将第一步 `Csr` 文件上传, 即可生成一个 `Cer` 文件

### 创建p12文件

我们的每一个证书都可以生成一个.p12 文件, 这个文件是一个加密的文件, 只要知道其密码, 就可以供给所有的 mac 设备使用, 使设备不需要在苹果开发者网站重新申请开发和发布证书, 就能使用.
**注意**：一般.p12 文件是给与别人使用的, 本机必须已经有一个带秘钥的证书才可以生成.p12 文件

打开钥匙串访问, 选择 `登录/证书` , 然后选择上方 `文件/导入项目` , 选择刚才的 `Cer` 文件上传

![](/images/uniapp-pak/ios03.png)

上传成功后选择刚才导入的证书, 右击, 选择“导出“iPhone Distribition:...”, 文件格式选择 `.p12` , 其中需要填写一个密码, 该密码需要保存下来, 以后打包时候会用到该密码

![](/images/uniapp-pak/ios04.png)

### 创建appId

回到苹果开发者中心, 点击 `Identifiers` 菜单, 点击加号. 创建 appId 的时候，填写的名称要跟我们在开发工具打包时填写的包名一致.

包名的格式比如下面的：

```undefined
com.yyyyy.xxxx
```

### 添加测试设备

点击 `devices` 菜单, 输入设备名称和设备 `UDID` , 可以通过第三方软件获取

[蒲公英](https://www.pgyer.com/tools/udid)

### 创建profile配置文件

点击 `profiles` 菜单, 开始创建证书 profile 配置文件，创建 profile 的时候，初学者请先选择 app store 类型先学习如何创建 app store 的 profile. 创建的过程中，它还会要求我们选择刚才创建的 `appId` 和 `cer` 证书，假如你有多个 `appId` 或 ` cer` 证书，可千万别选错，选错了 p12 证书就跟 profile 不匹配了。

继续选择测试设备, 直接全部勾选, 下一步.

点击 download 则会生成最后所需要的 `xxx.mobileprovision` 配置文件

### Hbuilder打包

点击 `发行/云打包` , 选择 `证书profile文件(xxx.mobileprovision)` , `私钥证书(.p12)` , 证书私钥密码(上述创建.p12 时的密码)
