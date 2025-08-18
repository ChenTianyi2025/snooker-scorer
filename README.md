# 斯诺克计分器

快速跳转：[快速启动](https://github.com/ChenTianyi2025/snooker-scorer/blob/main/README.md#%E5%BF%AB%E9%80%9F%E5%90%AF%E5%8A%A8)  [使用说明](https://github.com/ChenTianyi2025/snooker-scorer/blob/main/README.md#%E4%BD%BF%E7%94%A8%E8%AF%B4%E6%98%8E)  [计分规则](https://github.com/ChenTianyi2025/snooker-scorer/blob/main/rules.md)

#### 介绍
简易斯诺克比赛计分器。
> 本程序制作过程中运用了AI工具辅助


#### 软件架构
1. 通过简易的**键盘操作**实现计分；
2. 用LocalStorage存储固定信息；
3. 程序通过加减乘除运算自动实现台面剩余分数计算（Remaining）。


#### 快速启动

1. 从[v1.0 **发行版** ](https://github.com/ChenTianyi2025/snooker-scorer/releases/tag/v1.0)下载程序压缩包；
<img width="1839" height="864" alt="1 1(Releases)" src="https://github.com/user-attachments/assets/988e75ae-83b9-4141-a0b4-079524d92561" />
2. 解压后打开文件夹，直接双击运行`start_cx.html`即可进入程序。
<img width="1214" height="721" alt="1 2(start)" src="https://github.com/user-attachments/assets/f201fe63-477e-4cf1-8187-ad777c9fd05c" />


#### 使用说明

- 输入双方选手名字后可进入主计分界面

- 在主界面中：
0. 在`更多设置选项`中，设置台面红球数量（标准球台为15个），以实现自动计分；设置`满分杆提示`，以自动显示满分杆。
1. 直接按键盘上的数字键进行 **计分** ，例：红球入袋，得1分，按“1”；粉球入袋，得6分，按“6”。
2. 按键盘上的`Alt+数字键`实现 **罚分** ，例：目标球为红球，选手击打了蓝球，罚5分，按“Alt+5”。
3. 按回车键（Enter）实现击球方转换。
4. 更多计分规则见[ **计分规则** ](https://github.com/ChenTianyi2025/snooker-scorer/blob/main/rules.md)

#### 参与贡献

1.  Fork 本仓库
2.  新建 Feat_xxx 分支
3.  提交代码
4.  新建 Pull Request
